"use client";

import React, { useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-hot-toast";

interface AddNewLoginsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AddNewLogins = ({ isOpen, onClose, onConfirm }: AddNewLoginsProps) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    website: "",
  });

  const [loader, setLoader] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generatepasswd = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        `/api/password-vault/generate`,
        {
          capital: "capital",
          length: 14,
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
      setLoader(false);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error(err.response?.data?.message || "An error occurred");
      setLoader(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      password: "",
      website: "",
    });
    onClose();
  };

  const handleSaveData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.setItem("New_LoginDetails", JSON.stringify(formData));
    onConfirm();
    if (isOpen) {
      setFormData({
        username: "",
        password: "",
        website: "",
      });
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="relative bg-white p-8 w-96 rounded-md shadow-lg">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold uppercase text-black">
                Add New Logins
              </p>
            </div>
            <form className="flex flex-col my-4 gap-2 text-black">
              <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <input
                  className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md p-2 text-black"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <div className="flex w-full">
                  <input
                    className="bg-neutral-50 w-[90%] focus:outline-none border border-neutral-400 rounded-l-md p-2 text-black"
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loader}
                  />
                  <div
                    className="bg-neutral-50 w-12 h-12 cursor-pointer rounded-r-md border flex items-center justify-center border-neutral-400"
                    onClick={generatepasswd}
                  >
                    {loader ? (
                      <div className="spinner bg-black mx-auto"></div>
                    ) : (
                      <FaArrowsRotate className="w-7 h-7 text-black" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="website">Url</label>
                <input
                  className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md p-2 text-black"
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-4">
                <button
                  className="px-4 py-2 text-white hover:text-neutral-100 bg-black rounded-md"
                  onClick={handleSaveData}
                  type="submit"
                >
                  Save
                </button>
                <button
                  className="ml-2 px-4 py-2 text-black border hover:bg-neutral-100 border-neutral-500 rounded-md"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewLogins;
