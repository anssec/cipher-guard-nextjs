"use client";

import { HiLockOpen, HiUsers } from "react-icons/hi2";
import { MdDashboard, MdAnalytics } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

import { Sidebar, SidebarItem, MobileSideBar } from "@/components/AdminSidebar";

const MobileSidebarItems = [
  { icon: <MdDashboard className="w-5 h-5" />, text: "Dashboard", link: "/admin/dashboard" },
  { icon: <HiUsers className="w-5 h-5" />, text: "Users", link: "/admin/users" },
  { icon: <MdAnalytics className="w-5 h-5" />, text: "Analytics", link: "/admin/analytics" },
  { icon: <HiLockOpen className="w-5 h-5" />, text: "Unlock User", link: "/admin/unlock-user" },
  { icon: <IoSettingsSharp className="w-5 h-5" />, text: "Settings", link: "/admin/setting", active: true },
];

export default function AdminSettings() {
  return (
    <main className="flex h-screen overflow-hidden bg-black font-poppins selection:bg-[#BFAFF2] selection:text-black">
      <Sidebar>
        <SidebarItem icon={<MdDashboard className="w-5 h-5" />} text={"Dashboard"} link="/admin/dashboard" />
        <SidebarItem icon={<HiUsers className="w-5 h-5" />} text={"Users"} link="/admin/users" />
        <SidebarItem icon={<MdAnalytics className="w-5 h-5" />} text={"Analytics"} link="/admin/analytics" />
        <SidebarItem icon={<HiLockOpen className="w-5 h-5" />} text={"Unlock User"} link="/admin/unlock-user" />
        <SidebarItem icon={<IoSettingsSharp className="w-5 h-5" />} text={"Settings"} active={true} link="/admin/setting" />
      </Sidebar>

      <MobileSideBar items={MobileSidebarItems} />

      <main className="sm:ml-0 p-4 w-full overflow-y-auto no-scrollbar rounded-3xl bg-neutral-900 m-2 sm:m-4 border border-neutral-800 shadow-2xl flex items-center justify-center">
        <div className="text-white text-2xl opacity-50 font-bold uppercase tracking-widest">
          Coming Soon
        </div>
      </main>
    </main>
  );
}
