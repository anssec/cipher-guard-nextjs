import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | CipherGuard",
  description: "Page not found.",
};

export default function NotFound() {
  return (
    <div className="bg-[#2B2B2B] md:px-24 px-8 min-h-screen flex flex-col font-poppins">
      <Navbar />
      <main className="flex-grow w-full flex flex-col justify-center items-center bg-[#2B2B2B]">
        <h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
        <div className="bg-[#FF6A3D] px-2 text-sm rounded mt-2 absolute transform rotate-12 font-semibold">
          Page Not Found
        </div>
        <div className="mt-10">
          <Link
            href="/"
            className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring"
          >
            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>
            <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
              Go Home
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
