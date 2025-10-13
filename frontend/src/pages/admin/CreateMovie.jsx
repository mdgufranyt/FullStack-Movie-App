import React, { useState } from "react";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { api_base_url } from "../../helper";

const CreateMovie = () => {
  const [imageFile, setImageFile] = useState(null); // Store file object here
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [video, setVideo] = useState("");

  // Function to convert YouTube URL to embed URL (same as in SingleMovie)
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Extract video ID from various YouTube URL formats
    let videoId = "";

    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1];
      if (videoId.includes("&")) {
        videoId = videoId.split("&")[0];
      }
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1];
      if (videoId.includes("?")) {
        videoId = videoId.split("?")[0];
      }
    } else if (url.includes("m.youtube.com/watch?v=")) {
      videoId = url.split("v=")[1];
      if (videoId.includes("&")) {
        videoId = videoId.split("&")[0];
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  function getImage(e) {
    const file = e.target.files[0];
    let temURL = URL.createObjectURL(file);
    setImageFile(file); // Set the file object in state
    document.getElementById("realImg").src = temURL;
    document.querySelector(".uploadImg > h2").style.display = "none";
  }

  const navigate = useNavigate();

  const createMovie = (e) => {
    e.preventDefault();

    // Convert YouTube URL to embed format before saving
    const embedVideo = getYouTubeEmbedUrl(video);

    let formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("video", embedVideo);
    formData.append("movieImg", imageFile); // Append the file object, not the URL

    // Send to backend
    fetch(api_base_url + "/uploadMovie", {
      mode: "cors",
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Movie uploaded successfully!");
          navigate("/singleMovie/" + data.movieId);
        } else {
          alert("Error: " + (data.msg || "Failed to upload movie"));
        }
      })
      .catch((error) => {
        console.error("Upload Error:", error);
        alert("Network error. Please check if the server is running.");
      });
  };

  return (
    <>
      <div className="nav flex items-center justify-between h-[90px] bg-[#18181B] px-[50px]">
        <img className="w-[150px] cursor-pointer" src={logo} alt="" />
      </div>
      <div className="flex">
        <div
          className="sideBar w-[20vw] bg-[#18181B] p-[10px]"
          style={{ height: "calc(100vh - 90px)" }}
        >
          <div className="w-full flex items-center justify-center">
            <Link>Add new movie</Link>
          </div>
        </div>

        <form onSubmit={createMovie} className="p-[15px]">
          <h3 className="text-2xl">Add a new movie</h3>

          <div className="inputBox w-[40vw] mt-3">
            <input
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Movie name"
            />
          </div>

          <div className="inputBox w-[40vw] mt-3">
            <input
              required
              onChange={(e) => setVideo(e.target.value)}
              value={video}
              type="text"
              placeholder="YouTube Video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
            />
          </div>

          <div className="inputBox w-[40vw] mt-3">
            <textarea
              required
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              placeholder="Movie Description"
            ></textarea>
          </div>

          <input type="file" id="file" onChange={getImage} hidden />
          <div
            onClick={() => document.getElementById("file").click()}
            className="uploadImg overflow-hidden bg-[#27272A] mt-3 flex items-center justify-center w-[200px] h-[300px] rounded-lg cursor-pointer"
          >
            <img id="realImg" alt="" />
            <h2>Image</h2>
          </div>

          <button className="btnBlue mt-4 mb-5 w-[140px]">Add Movie</button>
        </form>
      </div>
    </>
  );
};

export default CreateMovie;
