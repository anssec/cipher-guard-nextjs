"use client";

import { ChevronLast, ChevronFirst } from "lucide-react";
import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { PiSignOut } from "react-icons/pi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSCookies from "js-cookie";
import { toast } from "react-hot-toast";

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true });

// Modal component
const Modal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative bg-white p-8 w-96 rounded-md shadow-lg text-black">
          <div className="flex flex-col items-center">
            <p className="mb-4 text-2xl font-semibold text-black">Logout</p>
            <p className="mb-4 text-gray-700">
              Are you sure you want to log out?
            </p>
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-white bg-gray-800 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="ml-2 px-4 py-2 text-white bg-black rounded-md"
              onClick={onConfirm}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = ({ children }: { children: ReactNode }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebarExpanded");
    if (stored !== null) setExpanded(JSON.parse(stored));
  }, []);

  const Profile = (() => {
    try {
      if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("profile") || "{}");
      }
      return {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return {};
    }
  })();

  const router = useRouter();

  const logoutHandler = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutModalOpen(false);
    JSCookies.remove("token");
    JSCookies.remove("v_pin");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");

    // Also call server logout endpoint to clear HttpOnly cookies
    fetch('/api/auth/logout', { method: 'POST' }).then(() => {
      toast.success("Logout Successful");
      router.push("/");
      router.refresh();
    });
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const sideBarHandler = () => {
    setExpanded((curr) => {
      const newVal = !curr;
      localStorage.setItem("sidebarExpanded", JSON.stringify(newVal));
      return newVal;
    });
  };

  return (
    <aside className="h-screen bg-black">
      <nav className="h-full hidden md:flex flex-col shadow-sm text-white">
        <div
          className={`overflow-hidden transition-all flex flex-col items-center ${
            expanded ? "pl-2 mt-12 mb-1" : "ml-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`${
              expanded ? "w-16 rounded-2xl" : "w-10 rounded-lg mx-auto mt-5"
            }`}
            src={Profile.profileImg || `https://api.dicebear.com/7.x/initials/svg?seed=U`}
            alt=""
          />
          <p
            className={`text-2xl text-white font-semibold ${
              expanded ? "mt-2" : "hidden"
            }`}
          >
            {Profile.firstName}
          </p>
          <p
            className={`text-xs text-neutral-400 ${
              expanded ? "mt-2" : "hidden"
            }`}
          >
            {Profile.email}
          </p>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul
            className={`flex-1 overflow-hidden transition-all ${
              expanded ? "ml-4 mt-14" : "ml-2 mt-10"
            }`}
          >
            {children}
            <div onClick={logoutHandler}>
              <SidebarItem
                icon={<PiSignOut className="w-5 h-5" />}
                text={"Logout"}
                active={false}
              />
            </div>
          </ul>
        </SidebarContext.Provider>
        <div className="p-4 pb-8 flex justify-center items-center">
          <button
            onClick={sideBarHandler}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-600"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
      </nav>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
};

export function SidebarItem({ icon, text, active, count, link }: { icon: ReactNode, text: string, active?: boolean, count?: string | number, link?: string }) {
  const { expanded } = useContext(SidebarContext);
  const content = (
    <li
      className={`
        relative flex items-center py-4 pl-4 my-2
        font-medium rounded-l-full cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-white text-black"
            : "hover:bg-neutral-800 hover:text-white text-neutral-300"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all flex justify-between items-center ${
          expanded ? "w-48 ml-3" : "w-0 opacity-0"
        }`}
      >
        <span>{text}</span>
        {count !== undefined && count !== null && expanded && (
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${active ? 'bg-black text-white' : 'bg-neutral-600 text-white'}`}>
            {count}
          </span>
        )}
      </span>
    </li>
  );
  return link ? <Link href={link}>{content}</Link> : content;
}

// MobileSidebar Component
export const MobileSideBar = ({ items }: { items: Array<{ link: string; icon: ReactNode; active?: boolean }> }) => {
  const router = useRouter();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const Profile = (() => {
    try {
      if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("profile") || "{}");
      }
      return {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return {};
    }
  })();

  const logoutHandler = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutModalOpen(false);
    JSCookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");

    fetch('/api/auth/logout', { method: 'POST' }).then(() => {
      toast.success("Logout");
      router.push("/");
      router.refresh();
    });
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  return (
    <aside className="h-screen bg-black">
      <nav className="h-full flex md:hidden flex-col shadow-sm text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-10 rounded-lg mx-auto mt-5"
          src={Profile.profileImg || `https://api.dicebear.com/7.x/initials/svg?seed=U`}
          alt=""
        />

        <ul className="flex-1 mt-8">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`
                relative flex items-center justify-center py-4 px-2 mx-2 my-2
                font-medium rounded-xl cursor-pointer
                transition-colors group
                ${
                  item.active
                    ? "bg-white text-black"
                    : "hover:bg-neutral-800 hover:text-white text-neutral-300"
                }
              `}
            >
              {item.icon}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={logoutHandler}
            className={`
              w-full
              relative flex items-center justify-center py-4 px-2 mx-1 my-2
              font-medium rounded-xl cursor-pointer
              transition-colors group hover:bg-neutral-800 hover:text-white text-neutral-300`}
          >
            <PiSignOut className="w-6 h-6" />
          </button>
        </ul>
      </nav>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
};
