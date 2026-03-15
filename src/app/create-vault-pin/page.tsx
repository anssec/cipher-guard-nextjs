"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import JSCookies from "js-cookie";
import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

import Link from "next/link";
import { MobileSideBar, Sidebar, SidebarItem } from "@/components/UserSidebar";

const MobileSidebarItems = [
  { icon: <PiVaultLight className="w-5 h-5" />, link: "/vault", active: false },
  { icon: <GrDocumentNotes className="w-5 h-5" />, link: "/notes", active: false },
  { icon: <RiAiGenerate className="w-5 h-5" />, link: "/generator", active: false },
  { icon: <IoSettingsOutline className="w-5 h-5" />, link: "/settings", active: true },
];

export default function CreateNewVaultPin() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [vaultPin, setVaultPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    // Standardize input (only allow numbers if desired, but currently allowing anything)
    const sanitizedValue = value.slice(-1); // Only take last character

    if (sanitizedValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const newVaultPin = Array.from({ length: 6 }, (_, i) => {
      return i === index ? sanitizedValue : vaultPin[i] || "";
    }).join("");
    
    setVaultPin(newVaultPin);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace properly
    if (e.key === "Backspace" && !vaultPin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vaultPin.length !== 6) {
      toast.error("Please enter a 6-digit Vault PIN");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        `/api/auth/create-vault-pin`,
        {
          vaultPin: vaultPin,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      // Wait for toast to display briefly before redirection
      setTimeout(() => {
        window.location.href = "/vault";
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden pr-4 py-4 bg-black font-poppins text-black selection:bg-[#BFAFF2]">
      <Sidebar>
        <Link href="/vault"><SidebarItem icon={<PiVaultLight className="w-5 h-5" />} text={"Vault"} active={false} /></Link>
        <Link href="/notes"><SidebarItem icon={<GrDocumentNotes className="w-5 h-5" />} text={"Notes"} active={false} /></Link>
        <Link href="/generator"><SidebarItem icon={<RiAiGenerate className="w-5 h-5" />} text={"Generator"} active={false} /></Link>
        <Link href="/settings"><SidebarItem icon={<IoSettingsOutline className="w-5 h-5" />} text={"Settings"} active={true} /></Link>
      </Sidebar>

      <MobileSideBar items={MobileSidebarItems} />

      <main className="w-full bg-white rounded-3xl p-4 lg:p-10 shadow-xl overflow-y-auto flex items-center justify-center">
        <div className="h-full flex flex-col justify-center items-center gap-8 max-w-lg w-full">
          
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-3 text-black">Create Vault PIN</h1>
            <p className="text-neutral-500 text-lg">
              Set a secure 6-digit PIN to encrypt your vault. <br/>
              <span className="font-semibold text-red-500">Do not forget it, as it cannot be recovered.</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 w-full">
            <div className="flex flex-row space-x-2 sm:space-x-4 justify-center">
              {Array.from({ length: 6 }, (_, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  className="w-12 h-14 sm:w-16 sm:h-20 rounded-xl bg-neutral-50 text-center outline-none border-2 border-neutral-300 text-2xl font-bold tracking-widest focus:border-black focus:ring-4 focus:ring-black/10 transition-all font-mono"
                  type="password"
                  value={vaultPin[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoComplete="off"
                />
              ))}
            </div>
            
            <button
              className="w-full max-w-sm mt-4 tracking-wider uppercase font-bold text-lg px-8 py-4 rounded-xl bg-black text-white hover:bg-[#BFAFF2] hover:text-black hover:-translate-y-1 transition-all shadow-lg shadow-black/20 focus:ring-4 focus:ring-neutral-200 disabled:opacity-50 disabled:hover:translate-y-0"
              type="submit"
              disabled={loading || vaultPin.length !== 6}
            >
              {loading ? <div className="spinner !w-6 !h-6 mx-auto !border-t-white mix-blend-difference"></div> : "Create Master PIN"}
            </button>
          </form>
          
        </div>
      </main>
    </main>
  );
}
