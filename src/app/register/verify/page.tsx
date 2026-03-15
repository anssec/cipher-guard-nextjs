"use client";

import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import JSCookies from "js-cookie";
import spaceArt from "../../../../public/registerArt.png";

export default function EmailVerify() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(true);
  const [formData, setFormData] = useState({
    otp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getAuthToken = () => {
    return JSCookies.get("data") || (typeof window !== "undefined" ? localStorage.getItem("data") : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const token = getAuthToken();
    
    try {
      const response = await axios.post(
        `/api/auth/register/verify-otp`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(response.data.message);
      JSCookies.remove("data");
      localStorage.removeItem("data");
      router.push("/login");
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

  const resendOtp = async () => {
    setLoading(true);
    const token = getAuthToken();
    
    try {
      const response = await axios.post(
        `/api/auth/register/resend-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center bg-[#2B2B2B] text-white selection:bg-[#BFAFF2] selection:text-black">
      <div className="mx-auto w-11/12 md:w-9/12 h-[75%] md:h-[80%] shadow-2xl rounded-2xl bg-[#1f1f1f]">
        <div className="flex h-full">
          {/* Left side */}
          <div className="hidden rounded-tl-2xl rounded-bl-2xl w-3/5 shadow-r-lg lg:flex flex-col justify-center items-center bg-black/20 p-8">
            <Image src={spaceArt} alt="Register Art" className="w-[80%] object-contain drop-shadow-2xl" priority />
            <p className="font-semibold text-3xl mt-8 text-neutral-200 tracking-wide text-center">
              You&apos;re almost there!
            </p>
            <p className="text-neutral-400 mt-2 text-lg">
              Check your inbox for the secret key
            </p>
          </div>
          
          {/* Right Side */}
          <div className="w-full mx-auto max-w-md lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#BFAFF2]">Email Verification</h1>
            <p className="text-neutral-400 text-center mb-8 px-4">
              We&apos;ve sent an 8-character OTP to your email address.
            </p>
            
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto flex flex-col gap-6 text-black"
              >
                <div className="flex items-center relative">
                  <span className="absolute left-4 text-neutral-500"><RiLockPasswordLine className="w-6 h-6" /></span>
                  <input
                    type={view ? "password" : "text"}
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 8-digit OTP"
                    maxLength={8}
                    minLength={8}
                    className="w-full p-4 pl-12 pr-12 text-center tracking-[0.5em] text-xl font-mono border-2 border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#BFAFF2] focus:border-[#BFAFF2] transition-all bg-neutral-50"
                    required
                  />
                  <div
                    onClick={handlePasswdView}
                    className="absolute right-4 text-neutral-500 cursor-pointer p-1 hover:text-black transition-colors"
                  >
                    {view ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </div>
                </div>

                {loading ? (
                  <div className="spinner mx-auto !w-8 !h-8 border-t-[#BFAFF2]"></div>
                ) : (
                  <button
                    className="w-full p-3 mt-2 rounded-xl font-bold tracking-wide text-black bg-[#BFAFF2] hover:bg-[#a594d9] shadow-lg shadow-[#BFAFF2]/30 transition-all scale-[0.98] hover:scale-100"
                    type="submit"
                  >
                    Verify Email
                  </button>
                )}
                
                <div className="text-center mt-4">
                  <span className="text-neutral-500">Didn&apos;t receive it? </span>
                  <button 
                    type="button" 
                    onClick={resendOtp} 
                    className="text-[#BFAFF2] hover:underline font-medium ml-1"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
