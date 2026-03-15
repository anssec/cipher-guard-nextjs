"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import JSCookies from "js-cookie";

import { HiLockOpen, HiUsers } from "react-icons/hi2";
import { MdDashboard, MdAnalytics } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

import { Sidebar, SidebarItem, MobileSideBar } from "@/components/AdminSidebar";

const MobileSidebarItems = [
  { icon: <MdDashboard className="w-5 h-5" />, text: "Dashboard", link: "/admin/dashboard" },
  { icon: <HiUsers className="w-5 h-5" />, text: "Users", link: "/admin/users" },
  { icon: <MdAnalytics className="w-5 h-5" />, text: "Analytics", link: "/admin/analytics" },
  { icon: <HiLockOpen className="w-5 h-5" />, text: "Unlock User", link: "/admin/unlock-user", active: true },
  { icon: <IoSettingsSharp className="w-5 h-5" />, text: "Settings", link: "/admin/setting" },
];

export default function AdminUnlockUsers() {
  const [lockedUsers, setLockedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLockedUsers = async () => {
    setLoading(true);
    const token = JSCookies.get("admin_token") || localStorage.getItem("admin_token");
    
    try {
      const response = await axios.get(
        `/api/admin/get-lock-user`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLockedUsers(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch locked users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockedUsers();
  }, []);

  const handleUnlockUser = async (email: string) => {
    const token = JSCookies.get("admin_token") || localStorage.getItem("admin_token");
    try {
      const response = await axios.post(
        `/api/admin/unblock-user`,
        { email },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success(response.data.message);
      fetchLockedUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unlock user");
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-black font-poppins selection:bg-[#BFAFF2] selection:text-black">
      <Sidebar>
        <SidebarItem icon={<MdDashboard className="w-5 h-5" />} text={"Dashboard"} link="/admin/dashboard" />
        <SidebarItem icon={<HiUsers className="w-5 h-5" />} text={"Users"} link="/admin/users" />
        <SidebarItem icon={<MdAnalytics className="w-5 h-5" />} text={"Analytics"} link="/admin/analytics" />
        <SidebarItem icon={<HiLockOpen className="w-5 h-5" />} text={"Unlock User"} active={true} link="/admin/unlock-user" />
        <SidebarItem icon={<IoSettingsSharp className="w-5 h-5" />} text={"Settings"} link="/admin/setting" />
      </Sidebar>

      <MobileSideBar items={MobileSidebarItems} />

      <main className="sm:ml-0 p-4 lg:p-10 w-full overflow-y-auto no-scrollbar rounded-3xl bg-neutral-900 m-2 sm:m-4 border border-neutral-800 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Locked Accounts</h1>
              <p className="text-neutral-400">Manage accounts locked due to excessive failed login attempts.</p>
            </div>
            <div className="bg-red-900/40 border border-red-800/50 text-red-400 px-4 py-2 rounded-lg font-mono font-bold">
              {lockedUsers.length} Locked
            </div>
          </div>

          {loading ? (
             <div className="flex h-64 items-center justify-center">
                 <div className="spinner !w-12 !h-12 border-t-[#BFAFF2]"></div>
             </div>
          ) : (
            <div className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-0">
                {lockedUsers.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <HiLockOpen className="w-16 h-16 text-emerald-500 mb-4 opacity-70" />
                    <p className="text-neutral-400 text-lg">No locked accounts found. The system is secure.</p>
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-neutral-800">
                    {lockedUsers.map((item: any) => (
                      <li key={item._id} className="p-6 hover:bg-[#222] transition-colors group flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-900/30 text-red-500 flex items-center justify-center font-bold text-xl border border-red-800/50">
                            {item.firstName?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0 ms-5">
                            <p className="text-lg font-bold text-white">
                              {item.firstName} {item.lastName}
                            </p>
                            <p className="text-sm text-neutral-400">
                              {item.email}
                            </p>
                          </div>
                        </div>
                        <button
                           onClick={() => handleUnlockUser(item.email)}
                           className="px-6 py-2 bg-neutral-800 hover:bg-[#BFAFF2] text-white hover:text-black font-bold uppercase tracking-wider text-sm rounded-lg transition-all border border-neutral-700 hover:border-transparent"
                        >
                          Unlock
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </main>
  );
}
