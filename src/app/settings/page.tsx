"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import JSCookies from "js-cookie";
import { FaArrowsRotate } from "react-icons/fa6";
import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

import { MobileSideBar, Sidebar, SidebarItem } from "@/components/UserSidebar";

const MobileSidebarItems = [
  { icon: <PiVaultLight className="w-5 h-5" />, link: "/vault" },
  { icon: <GrDocumentNotes className="w-5 h-5" />, link: "/notes" },
  { icon: <RiAiGenerate className="w-5 h-5" />, link: "/generator" },
  { icon: <IoSettingsOutline className="w-5 h-5" />, link: "/settings", active: true },
];

export default function Settings() {
  const Profile = (() => {
    try {
      if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("profile") || "{}");
      }
      return {};
    } catch {
      return {};
    }
  })();

  const [isUserProfile, setIsUserProfile] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [genPassloader, setGenPassLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSaveloader, setDataSaveloader] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    confirmPassword: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchProfile = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`/api/auth/profile`, {
        withCredentials: true,
      });
      setIsUserProfile(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred fetching profile");
    } finally {
      setLoader(false);
    }
  };

  const generatepasswd = async () => {
    setGenPassLoader(true);
    try {
      const response = await axios.post(
        `/api/password-vault/generate`,
        {
          capital: "capital",
          length: 16,
          small: "small",
          special: "special",
          number: "number",
        },
        {
          withCredentials: true,
        }
      );
      setFormData((prevData) => ({
        ...prevData,
        password: response.data.data,
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred generating password");
    } finally {
      setGenPassLoader(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    setDataSaveloader(true);
    
    try {
      const response = await axios.post(
        `/api/features/emergency-access/add`,
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsModalOpen(false);
      
      setFormData({
        email: "",
        confirmPassword: "",
        password: "",
      });
      fetchProfile(); // refresh data
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred saving emergency access");
    } finally {
      setDataSaveloader(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      confirmPassword: "",
      password: "",
    });
    setIsModalOpen(false);
  };

  return (
    <main className="flex h-screen overflow-hidden pr-4 py-4 bg-black font-poppins text-black selection:bg-[#BFAFF2]">
      <Sidebar>
        <SidebarItem icon={<PiVaultLight className="w-5 h-5" />} text={"Vault"} link="/vault" />
        <SidebarItem icon={<GrDocumentNotes className="w-5 h-5" />} text={"Notes"} link="/notes" />
        <SidebarItem icon={<RiAiGenerate className="w-5 h-5" />} text={"Generator"} link="/generator" />
        <SidebarItem icon={<IoSettingsOutline className="w-5 h-5" />} text={"Settings"} active={true} link="/settings" />
      </Sidebar>

      <MobileSideBar items={MobileSidebarItems} />

      <main className="w-full bg-white rounded-3xl p-4 lg:p-10 shadow-xl overflow-y-auto">
        <h1 className="text-3xl font-bold text-black mb-8 px-4">Account Settings</h1>
        
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:px-4">
          
          {/* Profile Card */}
          <div className="w-full lg:w-[48%] border border-neutral-200 shadow-sm rounded-xl p-6 bg-neutral-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>
            <p className="uppercase font-bold tracking-wider text-black text-lg mb-6 border-b border-neutral-200 pb-2">Profile Information</p>
            
            {loader ? (
              <div className="spinner !w-8 !h-8 mx-auto mt-8 border-t-[#BFAFF2]"></div>
            ) : (
              <div className="space-y-5 text-neutral-700">
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold text-neutral-500 mb-1 tracking-wider">Full Name</span>
                  <span className="text-lg font-medium text-black bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                    {isUserProfile?.firstName} {isUserProfile?.lastName}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold text-neutral-500 mb-1 tracking-wider">Email Address</span>
                  <span className="text-lg font-medium text-black break-all bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                    {isUserProfile?.email}
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col items-center bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                    <span className="text-xs uppercase font-bold text-neutral-500 mb-2 text-center">Email Verified</span>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                      isUserProfile?.isEmailVerify ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {isUserProfile?.isEmailVerify ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                    <span className="text-xs uppercase font-bold text-neutral-500 mb-2 text-center">Failed Logins</span>
                    <span className="text-xl font-bold text-red-600 font-mono">
                      {isUserProfile?.wrongPasswdAttempt?.attempts ?? "0"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Access Card */}
          <div className="w-full lg:w-[48%] border border-neutral-200 shadow-sm rounded-xl p-6 bg-[#FFF2F2] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
            <p className="uppercase font-bold tracking-wider text-red-700 text-lg mb-6 border-b border-red-200 pb-2">
              Emergency Access
            </p>
            
            {loader ? (
              <div className="spinner !w-8 !h-8 mx-auto mt-8 border-t-red-500"></div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <IoSettingsOutline className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-neutral-600 mb-6 px-4">
                  Designate a trusted contact who can request access to your vault in case of an emergency.
                </p>
                
                <div className="w-full bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col items-center">
                  <span className="text-xs uppercase font-bold text-neutral-500 mb-2 tracking-wider">Emergency Contact Email</span>
                  {isUserProfile?.emergencyMail ? (
                    <span className="text-lg font-medium text-black">
                      {isUserProfile.emergencyMail}
                    </span>
                  ) : (
                    <button
                      className="mt-2 bg-red-600 text-white px-6 py-2 rounded-lg font-bold tracking-wider hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                      onClick={handleModalOpen}
                    >
                      Assign Contact
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Emergency access Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancel}></div>

          <div className="relative bg-white p-8 w-[28rem] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <p className="text-2xl font-bold uppercase tracking-wider text-black border-l-4 border-red-500 pl-3">
                  Set Emergency Access
                </p>
              </div>
              
              <p className="text-neutral-500 text-sm mb-6 pb-4 border-b border-neutral-100">
                Grant access to a trusted email. Generate a strong password that they will need, to be provided out-of-band.
              </p>
              
              <form className="flex flex-col gap-5 text-black" onSubmit={handleSaveData}>
                <div className="flex flex-col gap-1.5 shadow-sm">
                  <label htmlFor="email" className="font-semibold text-sm uppercase tracking-wider text-neutral-600">Contact Email</label>
                  <input
                    className="bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#BFAFF2] focus:bg-white transition-all border border-neutral-300 rounded-xl p-3"
                    type="email"
                    name="email"
                    placeholder="trusted@contact.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1.5 shadow-sm">
                  <label htmlFor="password" className="font-semibold text-sm uppercase tracking-wider text-neutral-600">Access Password</label>
                  <div className="flex w-full group">
                    <input
                      className="bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#BFAFF2] focus:bg-white transition-all border border-neutral-300 border-r-0 rounded-l-xl p-3 w-full font-mono text-lg tracking-wider"
                      type="text"
                      name="password"
                      placeholder="Generate password..."
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loader || dataSaveloader}
                    />
                    <div
                      className="bg-neutral-100 group-focus-within:bg-[#BFAFF2]/10 group-focus-within:border-[#BFAFF2] w-16 cursor-pointer rounded-r-xl border border-neutral-300 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                      onClick={generatepasswd}
                      title="Generate Secure Password"
                    >
                      {genPassloader ? (
                        <div className="spinner !w-5 !h-5 border-t-[#BFAFF2]"></div>
                      ) : (
                        <FaArrowsRotate className="w-5 h-5 text-neutral-600 group-focus-within:text-[#BFAFF2]" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5 shadow-sm mb-4">
                  <label htmlFor="confirmPassword" className="font-semibold text-sm uppercase tracking-wider text-neutral-600">Confirm Password</label>
                  <input
                    className="bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#BFAFF2] focus:bg-white transition-all border border-neutral-300 rounded-xl p-3 font-mono"
                    type="text"
                    name="confirmPassword"
                    placeholder="Verify password..."
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                  <button
                    className="flex-1 py-3 font-bold tracking-wider text-white bg-black hover:bg-[#BFAFF2] hover:text-black rounded-xl transition-colors shadow-md disabled:opacity-50 flex justify-center items-center"
                    type="submit"
                    disabled={dataSaveloader}
                  >
                    {dataSaveloader ? <div className="spinner !w-5 !h-5 !border-t-white mix-blend-difference"></div> : "Save Access"}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 font-bold tracking-wider text-black border-2 hover:bg-neutral-100 border-neutral-300 rounded-xl transition-colors"
                    onClick={handleCancel}
                    disabled={dataSaveloader}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
