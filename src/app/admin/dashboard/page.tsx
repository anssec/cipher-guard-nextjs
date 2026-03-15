"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import JSCookies from "js-cookie";

import { HiLockOpen, HiUsers } from "react-icons/hi2";
import { MdDashboard, MdAnalytics } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

import { Sidebar, SidebarItem, MobileSideBar } from "@/components/AdminSidebar";

const MobileSidebarItems = [
  { icon: <MdDashboard className="w-5 h-5" />, text: "Dashboard", link: "/admin/dashboard", active: true },
  { icon: <HiUsers className="w-5 h-5" />, text: "Users", link: "/admin/users" },
  { icon: <MdAnalytics className="w-5 h-5" />, text: "Analytics", link: "/admin/analytics" },
  { icon: <HiLockOpen className="w-5 h-5" />, text: "Unlock User", link: "/admin/unlock-user" },
  { icon: <IoSettingsSharp className="w-5 h-5" />, text: "Settings", link: "/admin/setting" },
];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) return "Good morning";
    if (currentTime < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = JSCookies.get("admin_token") || localStorage.getItem("admin_token");
      
      try {
        const response = await axios.get(
          `/api/admin/statistics`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch admin statistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex h-screen overflow-hidden bg-black font-poppins selection:bg-[#BFAFF2] selection:text-black items-stretch">
      <Sidebar>
        <SidebarItem icon={<MdDashboard className="w-5 h-5" />} text={"Dashboard"} active={true} link="/admin/dashboard" />
        <SidebarItem icon={<HiUsers className="w-5 h-5" />} text={"Users"} link="/admin/users" />
        <SidebarItem icon={<MdAnalytics className="w-5 h-5" />} text={"Analytics"} link="/admin/analytics" />
        <SidebarItem icon={<HiLockOpen className="w-5 h-5" />} text={"Unlock User"} link="/admin/unlock-user" />
        <SidebarItem icon={<IoSettingsSharp className="w-5 h-5" />} text={"Settings"} link="/admin/setting" />
      </Sidebar>

      <MobileSideBar items={MobileSidebarItems} />

      <main className="sm:ml-0 p-4 w-full overflow-y-auto no-scrollbar rounded-3xl bg-neutral-900 m-2 sm:m-4 border border-neutral-800 shadow-2xl">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* WelcomeBanner */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 sm:p-8 rounded-2xl overflow-hidden shadow-lg border border-indigo-800 relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl text-white font-bold mb-2 tracking-tight">
                {getGreeting()}, Admin. 👋
              </h1>
              <p className="text-indigo-200 text-lg">
                Here is what’s happening with your CipherGuard Services today.
              </p>
            </div>
          </div>

          {loading ? (
             <div className="flex h-64 items-center justify-center">
                 <div className="spinner !w-12 !h-12 border-t-[#BFAFF2]"></div>
             </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Users", value: data?.totalUser, color: "from-blue-600 to-blue-800", borderColor: "border-blue-500" },
                  { label: "Total Passwords", value: data?.totalPassword, color: "from-emerald-600 to-emerald-800", borderColor: "border-emerald-500" },
                  { label: "Total Notes", value: data?.totalNotes, color: "from-amber-500 to-amber-700", borderColor: "border-amber-400" },
                  { label: "Locked Accounts", value: data?.totalLockedUser, color: "from-red-600 to-red-800", borderColor: "border-red-500" },
                ].map((stat, i) => (
                  <div key={i} className={`text-center px-6 py-8 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg border-t border-l ${stat.borderColor} transform transition-transform hover:-translate-y-1`}>
                    <h5 className="mb-2 text-lg font-bold tracking-wider uppercase text-white/80">
                      {stat.label}
                    </h5>
                    <p className="font-bold text-5xl text-white drop-shadow-md">
                      {stat.value || 0}
                    </p>
                  </div>
                ))}
              </div>

              {/* Latest Users Table */}
              <div className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-[#222]">
                  <h5 className="text-xl font-bold text-white tracking-wider uppercase">
                    Latest Registered Users
                  </h5>
                  <Link
                    href={"/admin/users"}
                    className="text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-[#333] hover:bg-indigo-600 text-white transition-colors"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="p-0">
                  {data?.allUser?.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500">No users registered yet.</div>
                  ) : (
                    <ul role="list" className="divide-y divide-neutral-800">
                      {data?.allUser?.map((item: any, index: number) => (
                        <li key={index} className="p-6 hover:bg-[#222] transition-colors group">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {item.profileImg ? (
                                <Image
                                  className="w-12 h-12 rounded-full border border-neutral-700"
                                  src={item.profileImg}
                                  alt={`${item.firstName} avatar`}
                                  width={48}
                                  height={48}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-xl border border-neutral-700 group-hover:border-indigo-500 transition-colors">
                                  {item.firstName?.[0]?.toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 ms-5">
                              <p className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {item.firstName} {item.lastName}
                              </p>
                              <p className="text-sm text-neutral-400">
                                {item.email}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </main>
  );
}
