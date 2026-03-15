"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { MdPassword } from "react-icons/md";
import JSCookies from "js-cookie";
import { toast } from "react-hot-toast";
import axios from "axios";
import spaceArt from "../../../public/registerArt.png";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [view, setView] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(
        `/api/auth/register/send-otp`,
        formData,
        {
          withCredentials: true,
        }
      );
      
      localStorage.setItem("data", response.data.data);
      JSCookies.set("data", response.data.data, {
        expires: 10 / 24, // 10 hours approx
      });
      
      toast.success(response.data.message);
      router.push("/register/verify");
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswdView = () => {
    setView((prev) => !prev);
  };

  return (
    <div className="h-screen flex items-center bg-[#2B2B2B] text-white selection:bg-[#BFAFF2] selection:text-black">
      <div className="mx-auto w-11/12 md:w-9/12 h-4/5 md:h-5/6 shadow-2xl rounded-2xl bg-[#1f1f1f]">
        <div className="flex h-full">
          {/* Left side */}
          <div className="hidden rounded-tl-2xl rounded-bl-2xl w-3/5 shadow-r-lg lg:flex flex-col justify-center items-center bg-black/20 p-8">
            <Image src={spaceArt} alt="Register Art" className="w-[80%] object-contain drop-shadow-2xl" priority />
            <p className="font-semibold text-3xl mt-8 text-neutral-200 tracking-wide text-center">
              Welcome aboard my friend
            </p>
            <p className="text-neutral-400 mt-2 text-lg">
              Just a couple of clicks and we start!
            </p>
          </div>
          
          {/* Right Side */}
          <div className="w-full mx-auto max-w-md lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-10">
            <h1 className="text-4xl font-bold mb-4 text-[#BFAFF2]">Get Started</h1>
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto mt-2 flex flex-col gap-4 text-black"
              >
                <div className="flex items-center relative">
                  <span className="absolute left-3 text-neutral-500"><FaUser /></span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                    className="w-full p-3 pl-10 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#BFAFF2] transition-all"
                  />
                </div>

                <div className="flex items-center relative">
                  <span className="absolute left-3 text-neutral-500"><FaUser /></span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full p-3 pl-10 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#BFAFF2] transition-all"
                    required
                  />
                </div>

                <div className="flex items-center relative">
                  <span className="absolute left-3 text-neutral-500"><CiMail className="w-5 h-5" /></span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-3 pl-10 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#BFAFF2] transition-all"
                    required
                  />
                </div>

                <div className="flex items-center relative">
                  <span className="absolute left-3 text-neutral-500"><MdPassword className="w-5 h-5" /></span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-3 pl-10 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#BFAFF2] transition-all"
                    required
                  />
                </div>

                <div className="flex items-center relative">
                  <span className="absolute left-3 text-neutral-500"><MdPassword className="w-5 h-5" /></span>
                  <input
                    type={view ? "password" : "text"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full p-3 pl-10 pr-10 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#BFAFF2] transition-all"
                    required
                  />
                  <div
                    onClick={handlePasswdView}
                    className="absolute right-3 text-neutral-500 cursor-pointer p-1 hover:text-black transition-colors"
                  >
                    {view ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                
                {loading ? (
                  <div className="spinner mx-auto !w-8 !h-8 mt-2 border-t-[#BFAFF2]"></div>
                ) : (
                  <button
                    className="w-full p-3 mt-4 rounded-xl font-bold tracking-wide text-black bg-[#BFAFF2] hover:bg-[#a594d9] shadow-lg shadow-[#BFAFF2]/30 transition-all scale-[0.98] hover:scale-100"
                    type="submit"
                  >
                    Send OTP
                  </button>
                )}
              </form>
            </div>
            
            <div className="mt-8 text-neutral-400">Already have an account?</div>
            <Link
              href="/login"
              className="mt-3 p-3 w-full text-center text-[#BFAFF2] border-2 font-medium border-[#BFAFF2] rounded-xl hover:bg-[#BFAFF2]/10 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
