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

  return (
    <>
      <Navbar />
      <div className="px-[100px] mt-3">
        <Swiper
          navigation={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              src="https://wallpapers.com/images/hd/spider-man-2-lva058fvoz0dpt37.jpg"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://wallpapercave.com/wp/wp3405080.jpg"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://wallpapers.com/images/featured/avengers-vm16xv4a69smdauy.jpg"
              alt=""
            />
          </SwiperSlide>
        </Swiper>

        <div className="mb-10">
          <h3 className="text-2xl my-5">Adventure</h3>

          <Swiper
            slidesPerView={6}
            spaceBetween={0}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="!h-[40vh]"
          >
            {data
              ? data.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Movie movie={item} />
                    </SwiperSlide>
                  );
                })
              : "No Movies Found"}
          </Swiper>

          <h3 className="text-2xl my-5">Sci-Fi</h3>

          <Swiper
            slidesPerView={6}
            spaceBetween={0}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="!h-[40vh]"
          >
            {data
              ? data.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Movie movie={item} />
                    </SwiperSlide>
                  );
                })
              : "No Movies Found"}
          </Swiper>

          <h3 className="text-2xl my-5">Action</h3>

          <Swiper
            slidesPerView={6}
            spaceBetween={0}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="!h-[40vh]"
          >
            {data
              ? data.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Movie movie={item} />
                    </SwiperSlide>
                  );
                })
              : "No Movies Found"}
          </Swiper>

        </div>
      </div>
    </>
  );
};

export default Home;
