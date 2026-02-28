import React, { useEffect, useRef, useState } from "react";
import logo from "../images/logo.png";
import Avatar from "react-avatar";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Animation",
  "Documentary",
];

const Navbar = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

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
        if (data.success) setData(data.user);
        else setError(data.msg);
      })
      .catch((err) => {
        console.error("Get user details error:", err);
        setError("Failed to get user details");
      });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search — triggers on query OR genre change
  useEffect(() => {
    if (!searchQuery.trim() && !selectedGenre) {
      setSearchResults([]);
      setShowDropdown(false);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      setSearchLoading(true);
      setSearched(false);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      if (selectedGenre) params.append("genre", selectedGenre);

      fetch(`${api_base_url}/searchMovies?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.success ? data.movies : []);
          setShowDropdown(true);
          setSearched(true);
          setSearchLoading(false);
        })
        .catch(() => {
          setSearchLoading(false);
          setSearched(true);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre]);

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <nav className="h-[90px] flex items-center justify-between px-[100px] relative z-50">
        <img className="w-[140px]" src={logo} alt="" />

        <div className="flex items-center gap-2">
          {/* Search container */}
          <div ref={searchRef} className="relative flex items-center gap-2">
            {/* Genre filter dropdown */}
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setShowDropdown(true);
              }}
              className="bg-[#27272A] text-white text-sm px-3 py-2 rounded-full outline-none border border-[#ffffff20] cursor-pointer"
            >
              <option value="">All Genres</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Search input */}
            <div className="inputBox w-[22vw] !rounded-[30px] relative">
              <input
                type="text"
                className="!rounded-[30px] !pl-[20px]"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0 || searched)
                    setShowDropdown(true);
                }}
              />
            </div>

            {/* Results dropdown */}
            {showDropdown && (
              <div className="absolute top-[110%] right-0 w-[420px] bg-[#18181B] border border-[#ffffff15] rounded-xl shadow-2xl overflow-hidden z-50">
                {/* Active filters display */}
                {(searchQuery || selectedGenre) && (
                  <div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap">
                    {searchQuery && (
                      <span className="text-xs bg-[#27272A] text-[#aaa] px-2 py-1 rounded-full">
                        Title: "{searchQuery}"
                      </span>
                    )}
                    {selectedGenre && (
                      <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full">
                        Genre: {selectedGenre}
                      </span>
                    )}
                  </div>
                )}

                {searchLoading ? (
                  <div className="py-8 text-center text-[#aaaaaa] text-sm">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul className="max-h-[360px] overflow-y-auto">
                    {searchResults.map((movie) => (
                      <li
                        key={movie._id}
                        onClick={() => {
                          navigate("/singleMovie/" + movie._id);
                          setShowDropdown(false);
                          setSearchQuery("");
                          setSelectedGenre("");
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#27272A] cursor-pointer transition-colors duration-150 border-b border-[#ffffff08] last:border-0"
                      >
                        <img
                          src={movie.img}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-white text-sm font-medium truncate">
                            {movie.title}
                          </span>
                          {movie.genre && (
                            <span className="text-xs text-blue-400 mt-0.5">
                              {movie.genre}
                            </span>
                          )}
                          {movie.desc && (
                            <span className="text-xs text-[#aaaaaa] mt-0.5 truncate">
                              {movie.desc}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  searched && (
                    <div className="py-8 text-center">
                      <p className="text-[#aaaaaa] text-sm">No movies found</p>
                      <p className="text-[#666] text-xs mt-1">
                        Try a different title or genre
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <Avatar
            round="50%"
            className="cursor-pointer"
            name={data ? data.name : ""}
            size="40"
          />
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
