"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import JSCookies from "js-cookie";
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MobileSideBar, Sidebar, SidebarItem } from "@/components/UserSidebar";
import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

import EditPasswdUsername from "@/components/EditPasswdUsername";
import AddNewLogins from "@/components/AddNewLogins";
import EnterVaultPin from "@/components/EnterVaultPin";
import SkeletonLoader from "@/components/SkeletonLoader";

interface LoginData {
  _id: string;
  name: string;
  username: string;
  websiteFavicon: string;
  website: string;
  password?: string;
  Created?: string;
  Updated?: string;
  passwordHistory?: number;
}

const MobileSidebarItems = [
  { icon: <PiVaultLight className="w-5 h-5" />, link: "/vault", active: true },
  { icon: <GrDocumentNotes className="w-5 h-5" />, link: "/notes" },
  { icon: <RiAiGenerate className="w-5 h-5" />, link: "/generator" },
  { icon: <IoSettingsOutline className="w-5 h-5" />, link: "/settings" },
];

export default function Vault() {
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

  const v_Pin = JSCookies.get("v_pin");
  const [loader, setLoader] = useState(false);
  const [editPasswdUsername, setEditPasswdUsername] = useState(false);
  const [addNewLogin, setAddNewLogin] = useState(false);
  const [checkVpin, setCheckVpin] = useState(false);
  const [getSavedPasswd, setGetSavedPasswd] = useState<LoginData[]>([]);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  const getAllPassword = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `/api/password-vault/get-all`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      setGetSavedPasswd(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  };

  const handleEditPassUname = (id: string) => {
    setEditPasswdUsername((prev) => !prev);
    setCurrentEditId(id);
  };

  const handleSavePassUname = async (data: any) => {
    try {
      setLoader(true);
      const response = await axios.put(
        `/api/password-vault/update/${currentEditId}`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      toast.success(response.data.message);
      getAllPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
      setEditPasswdUsername(false);
    }
  };

  const handleEditPassUnameCancel = () => {
    setEditPasswdUsername(false);
  };

  const handleEditPassUnameTrash = async () => {
    try {
      setLoader(true);
      const response = await axios.delete(
        `/api/password-vault/delete/${currentEditId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      toast.success(response.data.message);
      getAllPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
      setEditPasswdUsername(false);
    }
  };

  const handleNewLogin = () => {
    setAddNewLogin((prev) => !prev);
  };

  const handleSaveNewLogin = async () => {
    const formDataRaw = localStorage.getItem("New_LoginDetails");
    if (!formDataRaw) return;
    const formData = JSON.parse(formDataRaw);
    
    try {
      setLoader(true);
      const response = await axios.post(
        `/api/password-vault/create`,
        {
          username: formData.username,
          password: formData.password,
          website: formData.website,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      localStorage.removeItem("New_LoginDetails");
      toast.success(response.data.message);
      getAllPassword();
      setAddNewLogin(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
      setAddNewLogin(false);
      localStorage.removeItem("New_LoginDetails");
    } finally {
      setLoader(false);
    }
  };

  const handleNewLoginCancel = () => {
    setAddNewLogin(false);
  };

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (!v_Pin) {
      if (!hasReloaded) {
        setCheckVpin(false);
        localStorage.setItem("hasReloaded", "true");
        window.location.reload();
      }
    } else {
      setCheckVpin(true);
      localStorage.setItem("hasReloaded", "false");
      getAllPassword();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v_Pin]);

  const handleSearch = async (value: string) => {
    if (!value) {
      getAllPassword();
    } else {
      // Basic client side filter or could call an API
      const searchResult = getSavedPasswd.filter((passwd) =>
        new RegExp(value, "i").test(passwd.name)
      );
      setGetSavedPasswd(searchResult);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden pr-4 py-4 bg-black font-poppins text-black selection:bg-[#BFAFF2]">
      <Sidebar>
        <SidebarItem icon={<PiVaultLight className="w-5 h-5" />} text={"Vault"} active={true} link="/vault" />
        <SidebarItem icon={<GrDocumentNotes className="w-5 h-5" />} text={"Notes"} link="/notes" />
        <SidebarItem icon={<RiAiGenerate className="w-5 h-5" />} text={"Generator"} link="/generator" />
        <SidebarItem icon={<IoSettingsOutline className="w-5 h-5" />} text={"Settings"} link="/settings" />
      </Sidebar>

      <MobileSideBar items={MobileSidebarItems} />

      <main className="w-full bg-white rounded-3xl p-4 shadow-xl overflow-y-auto">
        {checkVpin ? (
          <div className="w-full flex flex-col justify-center lg:items-center gap-y-4 transition-all">
            <div className="w-full h-fit flex flex-col gap-3 lg:max-w-2xl border border-neutral-200 shadow-sm rounded-xl p-6 bg-neutral-50">
              <p className="uppercase font-bold text-neutral-700 tracking-wider text-sm">Filters</p>
              <div className="flex items-center gap-3 shadow-inner bg-white p-3 rounded-lg border border-neutral-200 focus-within:ring-2 focus-within:ring-[#BFAFF2] focus-within:border-transparent transition-all">
                <FaSearch className="text-neutral-400" />
                <input
                  type="text"
                  className="focus:outline-none w-full bg-transparent text-base text-neutral-700"
                  placeholder="Search logins"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full h-[70vh] lg:max-w-2xl flex flex-col p-6 border border-neutral-200 shadow-sm rounded-xl bg-white">
              <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-4">
                <p className="uppercase font-bold text-black tracking-wider text-lg">My Vault</p>
                <button 
                  onClick={handleNewLogin}
                  className="flex items-center justify-center bg-black text-white p-2 rounded-lg hover:bg-[#BFAFF2] hover:text-black hover:scale-105 transition-all shadow-md group relative"
                >
                  <IoMdAdd className="text-2xl" />
                  <span className="absolute -top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap shadow-lg">
                    Add new login
                  </span>
                </button>
              </div>
              
              {loader ? (
                <SkeletonLoader />
              ) : (
                <div className="overflow-y-auto no-scrollbar flex-1 -mx-2 px-2">
                  {getSavedPasswd.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                        <PiVaultLight className="w-16 h-16 mb-4 opacity-50" />
                        <p>Your vault is empty</p>
                     </div>
                  ) : (
                    getSavedPasswd.map((value) => (
                      <div
                        key={value._id}
                        className="w-full flex items-center justify-between border border-transparent border-b-neutral-100 py-4 px-4 hover:bg-neutral-50 hover:border-neutral-200 rounded-xl transition-all cursor-pointer mb-1 group"
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-white rounded-full p-2 shadow-sm border border-neutral-100 overflow-hidden flex items-center justify-center">
                          {value.websiteFavicon ? (
                            <Image src={value.websiteFavicon} alt={value.name} width={24} height={24} className="w-full h-full object-contain" />
                          ) : (
                            <PiVaultLight className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>
                        <div className="w-full mx-4 flex flex-col">
                          <p className="text-black font-bold break-all text-base group-hover:text-[#BFAFF2] transition-colors">
                            {value.name}
                          </p>
                          <p className="text-neutral-500 w-full sm:w-64 text-ellipsis overflow-hidden text-sm">
                            {value.username}
                          </p>
                        </div>
                        <div 
                          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#BFAFF2]/20 text-neutral-400 hover:text-[#BFAFF2] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPassUname(value._id);
                          }}
                        >
                          <FaRegEdit className="w-5 h-5 cursor-pointer" />
                        </div>
                      </div>
                    ))
                  )}
                  {editPasswdUsername && (
                    <EditPasswdUsername
                      isOpen={editPasswdUsername}
                      onClose={handleEditPassUnameCancel}
                      onConfirm={handleSavePassUname}
                      onTrash={handleEditPassUnameTrash}
                      onUserData={getSavedPasswd.find((item) => item._id === currentEditId) as typeof getSavedPasswd[0]}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <EnterVaultPin />
        )}
      </main>
      
      {addNewLogin && (
        <AddNewLogins
          isOpen={addNewLogin}
          onConfirm={handleSaveNewLogin}
          onClose={handleNewLoginCancel}
        />
      )}
    </main>
  );
}
