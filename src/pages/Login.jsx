import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api_base_url } from '../helper';

const Login = () => {

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email, password: pwd });
      
      const response = await fetch(api_base_url + "/login", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pwd
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        setData(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("isLoggedIn", "true");
        console.log('Login successful, navigating to home...');
        navigate("/");
      } else {
        console.log('Login failed:', data.msg);
        setError(data.msg || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Network error. Please check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="container w-screen min-h-screen flex flex-col items-center justify-center bg-[#09090B] text-white">
        <div className="w-[23vw] bg-[#18181B] h-[auto] flex flex-col p-[20px] shadow-black/50 rounded-lg">
          <h3 className='text-2xl mb-3'>Login</h3>
          <form onSubmit={handleSubmit}>
           
            <div className='inputBox mt-3'>
              <input onChange={(e)=>{setEmail(e.target.value)}} value={email} required type="email" placeholder='Email' />
            </div>

            <div className='inputBox mt-3'>
              <input onChange={(e)=>{setPwd(e.target.value)}} value={pwd} required type="password" placeholder='Password' />
            </div>

            <p className='mb-1 mt-2 text-[14px]'>Don't have an account <Link className='text-[#1D4ED8]' to="/signUp">Sign Up</Link></p>
            {error && <p className='mb-3 text-red-500'>{error}</p>}
            {data && data.success && <p className='mb-3 text-green-500'>Login successful! Redirecting...</p>}
        
           <button 
             className='btnBlue w-full text-[15px]' 
             disabled={isLoading}
           >
             {isLoading ? 'Logging in...' : 'Login'}
           </button>
          </form>
        </div>

      </div>
    </>
  )
}

export default Login