import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SingleMovie from "./pages/SingleMovie";
import AdminLogin from "./pages/admin/AdminLogin";
import CreateMovie from "./pages/admin/CreateMovie";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn")
  );
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn"));
      setIsAdmin(localStorage.getItem("isAdmin"));
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically (for same-tab changes)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/singleMovie/:movieId"
            element={isLoggedIn ? <SingleMovie /> : <Navigate to={"/login"} />}
          />

          {/* Admin routes */}
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route
            path="/createMovie"
            element={isAdmin ? <CreateMovie /> : <Navigate to="/adminLogin" />}
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
