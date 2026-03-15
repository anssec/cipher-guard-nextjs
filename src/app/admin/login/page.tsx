"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import JSCookies from "js-cookie";
import { CiMail } from "react-icons/ci";
import { MdPassword } from "react-icons/md";
import { FaEyeSlash, FaEye } from "react-icons/fa";

import spaceArt from "../../../../public/registerArt.png";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `/api/admin/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      
      const res = response.data;
      localStorage.setItem("admin_token", res.data);
      localStorage.setItem("admin_profile", JSON.stringify(res.profile));
      JSCookies.set("admin_token", res.data, {
        expires: 10 / 24, // approx 10 hours
        secure: true,
        sameSite: 'strict',
        path: '/'
      });
      
      toast.success(res.message);
      
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center bg-[#2B2B2B] text-white selection:bg-[#BFAFF2] selection:text-black font-poppins">
      <div className="mx-auto w-11/12 md:w-9/12 h-4/5 md:h-5/6 shadow-2xl rounded-2xl bg-[#1f1f1f]">
        <div className="flex h-full">
          {/* Left side */}
          <div className="hidden rounded-tl-2xl rounded-bl-2xl w-3/5 shadow-r-lg lg:flex flex-col justify-center items-center bg-black/40 p-8 border-r border-[#333]">
            <Image src={spaceArt} alt="Login Art" className="w-[80%] object-contain drop-shadow-2xl grayscale opacity-80" priority />
            <p className="font-semibold text-3xl mt-8 text-neutral-200 tracking-wide text-center uppercase">
              Admin Portal
            </p>
            <p className="text-neutral-400 mt-2 text-lg">
              Authorized personnel only
            </p>
          </div>
          
          {/* Right Side */}
          <div className="w-full mx-auto max-w-md lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-10">
            <h1 className="text-4xl font-bold mb-8 text-[#BFAFF2] uppercase tracking-wider text-center flex flex-col items-center">
              <span>System</span>
              <span className="text-2xl mt-1 text-white">Login</span>
            </h1>
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto flex flex-col gap-6 text-black"
              >
                <div className="flex items-center relative">
                  <span className="absolute left-4 text-neutral-500"><CiMail className="w-6 h-6" /></span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Administrator Email"
                    className="w-full p-4 pl-12 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#BFAFF2] focus:border-[#BFAFF2] transition-all bg-neutral-50"
                    required
                  />
                </div>

                <div className="flex items-center relative">
                  <span className="absolute left-4 text-neutral-500"><MdPassword className="w-6 h-6" /></span>
                  <input
                    type={view ? "password" : "text"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Master Password"
                    className="w-full p-4 pl-12 pr-12 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#BFAFF2] focus:border-[#BFAFF2] transition-all bg-neutral-50"
                    required
                  />
                  <div
                    onClick={() => setView(!view)}
                    className="absolute right-4 text-neutral-500 cursor-pointer p-1 hover:text-black transition-colors"
                  >
                    {view ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5" />}
                  </div>
                </div>
                
                {loading ? (
                  <div className="spinner mx-auto !w-8 !h-8 mt-4 border-t-[#BFAFF2]"></div>
                ) : (
                  <button
                    className="w-full p-4 mt-4 text-lg rounded-xl font-bold tracking-widest uppercase text-black bg-[#BFAFF2] hover:bg-[#a594d9] shadow-lg shadow-[#BFAFF2]/30 transition-all scale-[0.98] hover:scale-100"
                    type="submit"
                  >
                    Authenticate
                  </button>
                )}
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
