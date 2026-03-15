"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaEyeSlash, FaTrashAlt, FaEye } from "react-icons/fa";
import { RxOpenInNewWindow } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-hot-toast";
import JSCookies from "js-cookie";

interface PasswdUsernameData {
  _id: string;
  name: string;
  username: string;
  password?: string;
  website: string;
  Created?: string;
  Updated?: string;
  passwordHistory?: number;
}

interface EditPasswdUsernameProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: (data: any, id: string) => void;
  onTrash: () => void;
  onUserData: PasswdUsernameData;
}

const EditPasswdUsername = ({
  isOpen,
  onClose,
  onConfirm,
  onTrash,
  onUserData,
}: EditPasswdUsernameProps) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    website: "",
  });

  const [showPasswd, setShowPasswd] = useState(false);

  useEffect(() => {
    if (onUserData) {
      setFormData({
        name: onUserData.name || "",
        username: onUserData.username || "",
        password: onUserData.password || "",
        website: onUserData.website || "",
      });
    }
  }, [onUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    onConfirm(formData, onUserData._id);
  };

  const showPasswdHandler = async () => {
    setShowPasswd((prev) => !prev);
    const v_Pin = JSCookies.get("v_pin");
    if (!showPasswd && onUserData.password) {
      try {
        const response = await axios.post(
          `/api/password-vault/decode`,
          {
            encodePasswd: onUserData.password,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${v_Pin}`,
            },
          }
        );
        const decodePasswd = response.data.data;
        setFormData((prevData) => ({
          ...prevData,
          password: decodePasswd,
        }));
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        toast.error(err.response?.data?.message || "Failed to decode password");
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        password: onUserData.password || "",
      }));
    }
  };

  const handleCancel = () => {
    setShowPasswd(false);
    onClose();
  };

  const usernameCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.username);
      toast.success("Username copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const passwordCopyToClipboard = async () => {
    if (showPasswd) {
      try {
        await navigator.clipboard.writeText(formData.password);
        toast.success("Password copied");
      } catch {
        toast.error("Failed to copy");
      }
    }
  };

  const urlCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.website);
      toast.success("URL copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-black bg-opacity-50 "></div>

        <div className="relative bg-white p-8 w-96 rounded-xl text-black">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold uppercase text-black">
                Edit item
              </p>
            </div>

            <div className="flex flex-col my-4 gap-2">
              <div className="flex flex-col">
                <label htmlFor="edit-name">Name</label>
                <input
                  id="edit-name"
                  className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md p-2 text-black"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="edit-username">Username</label>
                <div className="flex w-full">
                  <input
                    id="edit-username"
                    className="bg-neutral-50 w-[80%] focus:outline-none border border-neutral-400 rounded-l-md p-2 text-black"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <div
                    className="bg-neutral-50 w-12 h-12 border flex items-center justify-center border-neutral-400 rounded-r-md cursor-pointer"
                    onClick={usernameCopyToClipboard}
                  >
                    <MdOutlineContentCopy className="w-5 h-5 text-black" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="edit-password">Password</label>
                <div className="flex w-full">
                  <input
                    id="edit-password"
                    className={`bg-neutral-50 w-[70%] focus:outline-none border border-neutral-400 rounded-l-md p-2 text-black ${
                      showPasswd ? "" : "cursor-not-allowed"
                    }`}
                    type={showPasswd ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!showPasswd}
                  />
                  <div
                    className="bg-neutral-50 w-10 h-12 border cursor-pointer flex items-center justify-center border-neutral-400"
                    onClick={showPasswdHandler}
                  >
                    {showPasswd ? (
                      <FaEye className="w-5 h-5 text-black" />
                    ) : (
                      <FaEyeSlash className="w-5 h-5 text-black" />
                    )}
                  </div>
                  <div
                    className={`bg-neutral-50 w-10 h-12 border flex items-center justify-center border-neutral-400 rounded-r-md ${
                      showPasswd ? "cursor-pointer" : "cursor-not-allowed text-gray-400"
                    }`}
                    onClick={passwordCopyToClipboard}
                  >
                    <MdOutlineContentCopy className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="edit-website">URL</label>
                <div className="flex w-full">
                  <input
                    id="edit-website"
                    className="bg-neutral-50 w-[70%] focus:outline-none border border-neutral-400 rounded-l-md p-2 text-black"
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                  <div className="bg-neutral-50 w-10 h-12 border flex items-center justify-center border-neutral-400">
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <RxOpenInNewWindow className="w-5 h-5 text-black" />
                    </a>
                  </div>
                  <div
                    className="bg-neutral-50 w-10 h-12 border flex items-center justify-center border-neutral-400 rounded-r-md cursor-pointer"
                    onClick={urlCopyToClipboard}
                  >
                    <MdOutlineContentCopy className="w-5 h-5 text-black" />
                  </div>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <p>Created: {onUserData?.Created}</p>
                <p>Updated: {onUserData?.Updated || "NA"}</p>
                <p>Password History: {onUserData?.passwordHistory || 0}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center transition-all mt-4">
            <div>
              <button
                className="px-4 py-2 text-white hover:text-neutral-100 bg-black rounded-md"
                onClick={handleConfirm}
              >
                Save
              </button>
              <button
                className="ml-2 px-4 py-2 text-black border hover:bg-neutral-100 border-neutral-500 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <button
              className="ml-2 p-3 text-red-600 border border-neutral-500 hover:bg-neutral-100 bg-white rounded-md"
              onClick={onTrash}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPasswdUsername;
