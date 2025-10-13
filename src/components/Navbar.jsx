import React, { useEffect, useState } from "react";
import logo from "../images/logo.png";
import Avatar from "react-avatar";
import { api_base_url } from "../helper";

const Navbar = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const getDetails = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setData(data.user);
        } else {
          setError(data.msg);
        }
      })
      .catch((err) => {
        console.error("Get user details error:", err);
        setError("Failed to get user details");
      });
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <nav className="h-[90px] flex items-center justify-between px-[100px]">
        <img className="w-[140px]" src={logo} alt="" />

        <div className="flex items-center gap-2">
          <div className="inputBox w-[22vw] !rounded-[30px]">
            <input
              type="text"
              className="!rounded-[30px] !pl-[20px]"
              placeholder="Search Here... !"
            />
          </div>
          <Avatar
            round="50%"
            className=" cursor-pointer"
            name={data ? data.name : ""}
            size="40"
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
