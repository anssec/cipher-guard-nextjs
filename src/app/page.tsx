import Hero from "@/components/home/Hero";
import Company from "@/components/home/Company";
import Features from "@/components/home/Features";
import Quote from "@/components/home/Quote";
import Contact from "@/components/home/Contact";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="bg-[#2B2B2B] md:px-24 px-8 min-h-screen font-poppins selection:bg-[#BFAFF2] selection:text-black">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Hero />
        <Company />
        <Features />
        <Quote />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
