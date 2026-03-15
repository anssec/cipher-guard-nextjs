"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.png";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { MdClose } from "react-icons/md";

const Navbar = () => {
  const [close, setClose] = useState(false);

  const closeHandler = () => {
    setClose((prev) => !prev);
  };

  return (
    <div className="flex justify-between bg-[#2B2B2B] h-[70px] items-center relative text-white">
      <Link href="/">
        <Image
          className="cursor-pointer"
          src={Logo}
          alt="cipherguard logo"
          width={144}
          height={40}
        />
      </Link>
      <div className="hidden md:block">
        <Link href="/register" className="text-white mr-8">
          Sign up
        </Link>
        <Link
          href="/login"
          className="bg-[#BFAFF2] px-6 py-2 rounded-[15px] text-[#333333] font-medium"
        >
          Log in
        </Link>
      </div>
      {/* Mobile navigation */}
      <div className="text-4xl md:hidden text-white cursor-pointer" onClick={closeHandler}>
        <HiMenu />
      </div>
      {/* Sidebar menu */}
      {close && (
        <div className="md:hidden fixed z-50 top-0 left-0 h-screen w-screen bg-[#2B2B2B] flex flex-col items-center justify-center">
          <button
            className="absolute top-4 right-3 px-6 text-white text-4xl"
            onClick={closeHandler}
          >
            <MdClose />
          </button>
          <Link
            onClick={closeHandler}
            href="/register"
            className="text-white font-medium my-5 text-xl"
          >
            Sign up
          </Link>
          <Link
            onClick={closeHandler}
            href="/login"
            className="bg-[#BFAFF2] px-7 py-3 rounded-3xl font-medium text-[#333333] my-5 text-xl"
          >
            Log in
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
