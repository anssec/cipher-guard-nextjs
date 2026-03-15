"use client";

import { ChevronLast, ChevronFirst } from "lucide-react";
import { createContext, useContext, useState } from "react";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSCookies from "js-cookie";
import { toast } from "react-hot-toast";

import Logo from "../../public/logo.png";

type SidebarContextType = {
  expanded: boolean;
};

const SidebarContext = createContext<SidebarContextType>({ expanded: true });

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();

  const Profile = (() => {
    try {
      if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("admin_profile") || "{}");
      }
      return {};
    } catch {
      return {};
    }
  })();

  const logoutHandler = () => {
    JSCookies.remove("admin_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_profile");
    toast.success("Logout Successful");
    router.push("/");
  };

  return (
    <aside className="h-screen">
      <nav className="h-full hidden sm:flex flex-col border-neutral-700 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Link href="/">
            <Image
              src={Logo}
              className={`overflow-hidden transition-all object-contain ${
                expanded ? "w-32" : "w-0"
              }`}
              alt="CipherGuard Logo"
              width={128}
              height={40}
            />
          </Link>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-neutral-600 hover:bg-neutral-500 text-white transition-colors"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {children}
            <div onClick={logoutHandler} className="mt-8">
              <SidebarItem
                icon={<FaSignOutAlt className="w-5 h-5" />}
                text={"Logout"}
              />
            </div>
          </ul>
        </SidebarContext.Provider>

        <div className="border-neutral-700 border-t flex items-center p-3 m-2 rounded-xl bg-neutral-800/50">
          <div className="w-10 h-10 rounded-lg bg-neutral-700 flex-shrink-0 flex items-center justify-center overflow-hidden border border-neutral-600">
            {Profile?.profileImg ? (
              <Image src={Profile.profileImg} alt="Profile" width={40} height={40} />
            ) : (
              <span className="text-white font-bold">{Profile?.firstName?.[0] || 'A'}</span>
            )}
          </div>
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4 flex flex-col gap-1 w-full">
              <h4 className="font-semibold text-white text-sm truncate w-full pr-2">
                {Profile?.firstName} {Profile?.lastName}
              </h4>
              <span className="text-xs text-neutral-400 truncate w-full pr-2">
                {Profile?.email}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  link?: string;
}

export function SidebarItem({ icon, text, active, link }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);
  
  const content = (
    <li
      className={`
        relative flex items-center py-3 px-3 my-2
        font-medium rounded-xl cursor-pointer
        transition-all group
        ${
          active
            ? "bg-[#BFAFF2] text-black shadow-md shadow-[#BFAFF2]/20"
            : "hover:bg-neutral-700 hover:text-white text-neutral-400"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all whitespace-nowrap ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className={`
          absolute z-50 left-full rounded-md px-2 py-1 ml-6
          bg-neutral-800 text-white text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap border border-neutral-700 shadow-xl
      `}
        >
          {text}
        </div>
      )}
    </li>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

interface MobileSidebarItem {
  icon: React.ReactNode;
  text: string;
  link: string;
  active?: boolean;
}

export function MobileSideBar({ items }: { items: MobileSidebarItem[] }) {
  const router = useRouter();

  const Profile = (() => {
    try {
      if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("admin_profile") || "{}");
      }
      return {};
    } catch {
      return {};
    }
  })();

  const logoutHandler = () => {
    JSCookies.remove("admin_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_profile");
    toast.success("Logout Successful");
    router.push("/");
  };

  return (
    <aside className="h-screen z-40">
      <nav className="h-full flex sm:hidden fixed left-0 top-0 flex-col border-neutral-700 border-r shadow-2xl bg-black">
        <ul className="flex-1 px-3 my-5 flex flex-col gap-2">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`
                relative flex items-center p-3 my-2
                font-medium rounded-xl cursor-pointer
                transition-all group
                ${
                  item.active
                    ? "bg-[#BFAFF2] text-black"
                    : "hover:bg-neutral-700 hover:text-white text-neutral-400"
                }
              `}
            >
              {item.icon}

              <div
                className={`
                  absolute z-50 left-full rounded-md px-2 py-1 ml-6
                  bg-neutral-800 text-white text-sm
                  invisible opacity-20 -translate-x-3 transition-all
                  group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap border border-neutral-700`}
              >
                {item.text}
              </div>
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={logoutHandler}
            className={`
              relative flex items-center p-3 my-2 mt-8
              font-medium rounded-xl cursor-pointer
              transition-colors group hover:bg-neutral-700 hover:text-white text-neutral-400`}
          >
            <FaSignOutAlt className="w-5 h-5" />
            <div
              className={`
                absolute z-50 left-full rounded-md px-2 py-1 ml-6
                bg-neutral-800 text-white text-sm
                invisible opacity-20 -translate-x-3 transition-all
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap`}
            >
              Logout
            </div>
          </button>
        </ul>
        <div className="border-neutral-700 border-t flex items-center justify-center p-3 m-2 rounded-xl bg-neutral-800/50">
          <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center overflow-hidden border border-neutral-600">
             {Profile?.profileImg ? (
               <Image src={Profile.profileImg} alt="Profile" width={40} height={40} />
             ) : (
               <span className="text-white font-bold">{Profile?.firstName?.[0] || 'A'}</span>
             )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
