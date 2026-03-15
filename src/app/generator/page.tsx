"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";
import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

import { MobileSideBar, Sidebar, SidebarItem } from "@/components/UserSidebar";

const MobileSidebarItems = [
  { icon: <PiVaultLight className="w-5 h-5" />, link: "/vault" },
  { icon: <GrDocumentNotes className="w-5 h-5" />, link: "/notes" },
  { icon: <RiAiGenerate className="w-5 h-5" />, link: "/generator", active: true },
  { icon: <IoSettingsOutline className="w-5 h-5" />, link: "/settings" },
];

export default function Generator() {
  const [passwdLength, setPasswdLength] = useState(14);
  const [formData, setFormData] = useState({
    capital: "capital",
    small: "small",
    special: "special",
    number: "number",
    length: 14,
  });
  const [uniquePassword, setUniquePasswd] = useState("");
  const [loader, setLoader] = useState(false);
  const [usernameloader, setUsernameLoader] = useState(false);
  const [username, setUsername] = useState("");

  const handleCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked ? name : "",
    }));
  };

  const increment = () => {
    if (passwdLength < 64) {
      setPasswdLength(passwdLength + 1);
      setFormData((prevData) => ({
        ...prevData,
        length: passwdLength + 1,
      }));
    }
  };

  const decrement = () => {
    if (passwdLength > 6) {
      setPasswdLength(passwdLength - 1);
      setFormData((prevData) => ({
        ...prevData,
        length: passwdLength - 1,
      }));
    }
  };

  const generatepasswd = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        `/api/password-vault/generate`,
        formData,
        {
          withCredentials: true,
        }
      );
      setUniquePasswd(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  };

  const generateUsername = async () => {
    setUsernameLoader(true);
    try {
      const response = await axios.post(
        `/api/password-vault/generate-username`,
        {},
        {
          withCredentials: true,
        }
      );
      setUsername(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setUsernameLoader(false);
    }
  };

  const passwordCopyToClipboard = async () => {
    if (!uniquePassword) {
      toast.error("Generate a password first");
      return;
    }
    try {
      await navigator.clipboard.writeText(uniquePassword);
      toast.success("Password copied");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const usernameCopyToClipboard = async () => {
    if (!username) {
      toast.error("Generate a username first");
      return;
    }
    try {
      await navigator.clipboard.writeText(username);
      toast.success("Username copied");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <main className="flex h-screen overflow-hidden pr-4 py-4 bg-black font-poppins text-black selection:bg-[#BFAFF2]">
      <Sidebar>
        <SidebarItem icon={<PiVaultLight className="w-5 h-5" />} text={"Vault"} link="/vault" />
        <SidebarItem icon={<GrDocumentNotes className="w-5 h-5" />} text={"Notes"} link="/notes" />
        <SidebarItem icon={<RiAiGenerate className="w-5 h-5" />} text={"Generator"} active={true} link="/generator" />
        <SidebarItem icon={<IoSettingsOutline className="w-5 h-5" />} text={"Settings"} link="/settings" />
      </Sidebar>

      <MobileSideBar items={MobileSidebarItems} />

      <main className="w-full bg-white rounded-3xl p-4 lg:p-8 shadow-xl overflow-y-auto">
        <h1 className="text-3xl font-bold text-black mb-8 px-4">Generate Secure Credentials</h1>
        <div className="flex gap-6 flex-wrap justify-center items-start lg:justify-start">
          
          {/* Password generator */}
          <div className="w-full lg:w-[48%] border border-neutral-200 bg-neutral-50 shadow-sm rounded-xl p-6">
            <p className="text-left font-bold tracking-wider uppercase text-lg mb-4 text-[#BFAFF2]">
              Password Generator
            </p>
            <div>
              <div className="flex justify-between items-center border-2 border-neutral-300 bg-white shadow-inner rounded-xl py-4 px-4 mb-6">
                <p className="w-full truncate overflow-hidden font-mono text-xl tracking-wider text-neutral-800">
                  {uniquePassword || "Click generate"}
                </p>
                <div className="w-fit flex gap-3 items-center ml-2 border-l border-neutral-200 pl-4">
                  <MdOutlineContentCopy
                    onClick={passwordCopyToClipboard}
                    className="w-6 h-6 cursor-pointer text-neutral-400 hover:text-black transition-colors"
                  />
                  {loader ? (
                    <div className="spinner !w-6 !h-6 mx-auto border-t-[#BFAFF2]"></div>
                  ) : (
                    <FaArrowsRotate
                      onClick={generatepasswd}
                      className="w-6 h-6 cursor-pointer text-black hover:text-[#BFAFF2] transition-colors"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="border border-neutral-200 bg-white rounded-xl py-3 px-4 flex justify-between items-center shadow-sm">
                  <span className="font-semibold text-neutral-700">Length</span>
                  <div className="flex gap-3 items-center">
                    <p className="select-none flex font-mono font-bold text-lg bg-neutral-100 px-3 py-1 rounded-lg">{formData.length}</p>
                    <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
                      <button
                        className="text-2xl hover:bg-white rounded hover:shadow-sm transition-all text-neutral-600 p-1"
                        onClick={decrement}
                      >
                        <BiCaretLeft />
                      </button>
                      <button
                        className="text-2xl hover:bg-white rounded hover:shadow-sm transition-all text-neutral-600 p-1"
                        onClick={increment}
                      >
                        <BiCaretRight />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                {[
                  { label: "Uppercase (A-Z)", name: "capital" },
                  { label: "Lowercase (a-z)", name: "small" },
                  { label: "Numbers (0-9)", name: "number" },
                  { label: "Symbols (!@#$%^&*)", name: "special" },
                ].map((item) => (
                  <label key={item.name} className="border border-neutral-200 bg-white rounded-xl py-3 px-4 flex justify-between items-center shadow-sm cursor-pointer hover:bg-neutral-50 transition-colors">
                    <span className="font-semibold text-neutral-700">{item.label}</span>
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={!!formData[item.name as keyof typeof formData]}
                      onChange={handleCheckedChange}
                      className="w-5 h-5 accent-black cursor-pointer bg-neutral-100 border-neutral-300 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Username generator */}
          <div className="w-full lg:w-[48%] border border-neutral-200 bg-neutral-50 shadow-sm rounded-xl p-6">
            <p className="text-left font-bold tracking-wider uppercase text-lg mb-4 text-[#BFAFF2]">
              Username Generator
            </p>
            <div>
              <div className="flex justify-between items-center border-2 border-neutral-300 bg-white shadow-inner rounded-xl py-4 px-4">
                <p className="w-full truncate overflow-hidden font-mono text-xl tracking-wider text-neutral-800">
                  {username || "Click generate"}
                </p>
                <div className="w-fit flex gap-3 items-center ml-2 border-l border-neutral-200 pl-4">
                  <MdOutlineContentCopy
                    onClick={usernameCopyToClipboard}
                    className="w-6 h-6 cursor-pointer text-neutral-400 hover:text-black transition-colors"
                  />
                  {usernameloader ? (
                    <div className="spinner !w-6 !h-6 mx-auto border-t-[#BFAFF2]"></div>
                  ) : (
                    <FaArrowsRotate
                      onClick={generateUsername}
                      className="w-6 h-6 cursor-pointer text-black hover:text-[#BFAFF2] transition-colors"
                    />
                  )}
                </div>
              </div>
              <p className="mt-4 text-neutral-500 text-sm">
                Generates secure, randomized, and dictionary-based unique usernames that are hard to guess.
              </p>
            </div>
          </div>

        </div>
      </main>
    </main>
  );
}
