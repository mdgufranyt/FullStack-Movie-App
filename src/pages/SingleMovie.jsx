import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Avatar from "react-avatar";
import { api_base_url } from "../helper";
import { useParams } from "react-router-dom";

const SingleMovie = () => {
  const [comment, setComment] = useState("");
  const { movieId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // Function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Extract video ID from various YouTube URL formats
    let videoId = "";

    // Regular YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1];
      if (videoId.includes("&")) {
        videoId = videoId.split("&")[0];
      }
    }
    // Short YouTube URL: https://youtu.be/VIDEO_ID
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1];
      if (videoId.includes("?")) {
        videoId = videoId.split("?")[0];
      }
    }
    // YouTube mobile URL: https://m.youtube.com/watch?v=VIDEO_ID
    else if (url.includes("m.youtube.com/watch?v=")) {
      videoId = url.split("v=")[1];
      if (videoId.includes("&")) {
        videoId = videoId.split("&")[0];
      }
    }

    // If we found a video ID, create embed URL
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If not a YouTube URL, return original (might be another video platform)
    return url;
  };

  const getMovie = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    fetch(api_base_url + "/getMovie", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId: movieId,
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Single movie response:", data);
        if (data.success) {
          // Backend returns an array with one movie object, so take the first element
          setData(data.movie[0]);
        } else {
          setError(data.msg || "Failed to fetch movie");
        }
      })
      .catch((err) => {
        console.error("Error fetching movie:", err);
        setError("Failed to fetch movie.");
      });
  };

  const createComment = () => {
    fetch(api_base_url + "/createComment", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId: movieId,
        comment: comment,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Comment created successfully");
          setComment("");
        } else {
          alert(data.msg);
        }
      });
  };

  useEffect(() => {
    console.log("SingleMovie component mounted, movieId:", movieId);
    getMovie();
  }, [movieId]);

  console.log("SingleMovie render - data:", data, "error:", error);

  return (
    <>
      <Navbar />
      <div className="px-[100px]">
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}
        {!data && !error && (
          <div className="text-gray-500 mb-4">Loading movie...</div>
        )}

        <iframe
          width="100%"
          className="rounded-[10px]"
          height="550"
          src={data ? getYouTubeEmbedUrl(data.video) : ""}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <h3 className="text-2xl mt-4 mb-2">
          {data ? data.title : "Movie Title"}
        </h3>
        <p className="text-[gray]">{data ? data.desc : "Movie Description"}</p>

        <h3 className="text-2xl mt-5 mb-3">Comments</h3>

        <input
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              createComment();
            }
          }}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          value={comment}
          type="text"
          className="mb-4 border-0 w-[70%] p-[5px] pl-0 border-b-[1px] border-b-[#fff] bg-transparent outline-0"
          placeholder="Write your comment here"
        />

        <div className="comments w-[70%] mb-7">
          {data &&
            data.comments.map((comment, index) => (
              <div
                key={index}
                className="comment mb-2 w-full flex items-center p-[10px] bg-[#27272A] rounded-lg cursor-pointer"
              >
                <Avatar
                  name={comment.username ? comment.username : "User"}
                  size="50"
                  round="50%"
                  className="cursor-pointer mr-3"
                />
                <div>
                  <p className="text-[gray] text-[14px]">
                    @
                    {comment.username && comment.username.trim() !== ""
                      ? comment.username.trim()
                      : "User"}
                  </p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default SingleMovie;
