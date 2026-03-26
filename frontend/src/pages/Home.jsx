import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Movie from "../components/movie";
import { api_base_url } from "../helper";

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const getMovies = () => {
    fetch(api_base_url + "/getMovies")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.movies);
        if (data.success) {
          setData(data.movies);
        } else {
          setError(data.msg);
        }
      })
      .catch((err) => {
        console.error("Get movies error:", err);
        setError("Failed to load movies");
      });
  };

  useEffect(() => {
    getMovies();
  }, []);

  // Derive unique genres that have at least one movie
  const genres = data
    ? [...new Set(data.map((m) => m.genre).filter(Boolean))]
    : [];

  // Movies without a genre
  const unclassified = data ? data.filter((m) => !m.genre) : [];

  const renderSwiper = (movies) => (
    <Swiper
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
        1536: { slidesPerView: 6 },
      }}
      spaceBetween={10}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="!h-auto sm:!h-[35vh] md:!h-[40vh]"
    >
      {movies.map((item, index) => (
        <SwiperSlide key={index}>
          <Movie movie={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 lg:px-[100px] mt-3">
        {/* Banner Swiper */}
        <Swiper
          navigation={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          modules={[Autoplay, Navigation]}
          className="mySwiper rounded-lg overflow-hidden"
        >
          <SwiperSlide>
            <a href="https://fullstack-movieapp.vercel.app/singleMovie/69a2b255c3343b30c8b9ef60">
              <img
                src="https://wallpapers.com/images/hd/spider-man-2-lva058fvoz0dpt37.jpg"
                alt="The Amazing Spider-Man 2"
              />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a href="https://fullstack-movieapp.vercel.app/singleMovie/69a2b2efc3343b30c8b9ef66">
              <img
                src="https://wallpapercave.com/wp/wp3405080.jpg"
                alt="Iron Man"
              />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://wallpapers.com/images/featured/avengers-vm16xv4a69smdauy.jpg"
              alt=""
            />
          </SwiperSlide>
        </Swiper>

        <div className="mb-10">
          {/* All Movies section */}
          <h3 className="text-xl sm:text-2xl my-5 font-bold">All Movies</h3>
          {data && data.length > 0 ? (
            renderSwiper(data)
          ) : (
            <p className="text-[#aaaaaa]">No movies found</p>
          )}

          {/* Dynamic genre sections */}
          {genres.map((genre) => {
            const genreMovies = data.filter((m) => m.genre === genre);
            return (
              <div key={genre}>
                <h3 className="text-xl sm:text-2xl my-5 font-bold">{genre}</h3>
                {renderSwiper(genreMovies)}
              </div>
            );
          })}

          {/* Movies without genre (legacy / unclassified) */}
          {unclassified.length > 0 && genres.length > 0 && (
            <div>
              <h3 className="text-xl sm:text-2xl my-5 font-bold">Other</h3>
              {renderSwiper(unclassified)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
