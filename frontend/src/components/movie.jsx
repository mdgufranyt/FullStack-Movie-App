import React from "react";
import { useNavigate } from "react-router-dom";

const Movie = ({ movie }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => {
          navigate("/singleMovie/" + movie._id);
        }}
        className="card w-full sm:w-[150px] md:w-[180px] lg:w-[200px] h-auto sm:h-[220px] md:h-[270px] lg:h-[300px] rounded-lg cursor-pointer overflow-hidden"
      >
        <img
          className="w-full h-full object-cover rounded-lg cursor-pointer"
          src={movie ? movie.img : ""} // use stored Cloudinary URL
          alt={movie?.title || ""}
        />
      </div>
    </>
  );
};

export default Movie;
