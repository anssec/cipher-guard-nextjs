"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import JSCookies from "js-cookie";
import { FaSearch, FaRegStar, FaStar } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { CiStickyNote } from "react-icons/ci";
import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

import { MobileSideBar, Sidebar, SidebarItem } from "@/components/UserSidebar";
import AddNewNotes from "@/components/AddNewNotes";
import EditNotes from "@/components/EditNotes";
import EnterVaultPin from "@/components/EnterVaultPin";
import NoteSkeletonLoader from "@/components/NoteSkeletonLoader";

interface NoteData {
  _id: string;
  name: string;
  notes: string;
  favorite: boolean;
  encrypt?: boolean;
}

const MobileSidebarItems = [
  { icon: <PiVaultLight className="w-5 h-5" />, link: "/vault" },
  { icon: <GrDocumentNotes className="w-5 h-5" />, link: "/notes", active: true },
  { icon: <RiAiGenerate className="w-5 h-5" />, link: "/generator" },
  { icon: <IoSettingsOutline className="w-5 h-5" />, link: "/settings" },
];

export default function Notes() {
  const Profile = (() => {
    try {
      if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("profile") || "{}");
      }
      return {};
    } catch {
      return {};
    }
  })();

  const v_Pin = JSCookies.get("v_pin");
  const [loader, setLoader] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [addNewNotes, setAddNewNotes] = useState(false);
  const [checkVpin, setCheckVpin] = useState(false);
  const [getNotes, setGetNotes] = useState<NoteData[]>([]);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [isfavorite, setIsFavorite] = useState(false);

  const getAllNote = async () => {
    setLoader(true);
    try {
      const response = await axios.post(  // ✅ FIXED: was axios.get
        `/api/note/get-all`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      setGetNotes(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  };

  const handleEditNotes = (id: string) => {
    setEditNotes((prev) => !prev);
    setCurrentEditId(id);
  };

  const handleSaveNotes = async (data: any) => {
    try {
      setLoader(true);
      const response = await axios.put(
        `/api/note/update/${currentEditId}`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      toast.success(response.data.message);
      getAllNote();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
      setEditNotes(false);
    }
  };

  const handleEditNotesCancel = () => {
    setEditNotes(false);
  };

  const handleEditNotesTrash = async () => {
    try {
      setLoader(true);
      const response = await axios.delete(
        `/api/note/delete/${currentEditId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      toast.success(response.data.message);
      getAllNote();
      localStorage.removeItem("New_Note");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
      localStorage.removeItem("New_Note");
    } finally {
      setLoader(false);
      setEditNotes(false);
    }
  };

  const handleNewNote = () => {
    setAddNewNotes((prev) => !prev);
  };

  const handleSaveNewNote = async () => {
    const formDataRaw = localStorage.getItem("New_Note");
    if (!formDataRaw) return;
    const formData = JSON.parse(formDataRaw);
    
    try {
      setLoader(true);
      const response = await axios.post(
        `/api/note/create`,
        {
          name: formData.name,
          note: formData.note,
          favorite: formData.favorite,
          lockNote: formData.lockNote,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      setAddNewNotes(false);
      toast.success(response.data.message);
      getAllNote();
      localStorage.removeItem("New_Note");
    } catch (error: any) {
      setAddNewNotes(false);
      toast.error(error.response?.data?.message || "An error occurred");
      localStorage.removeItem("New_Note");
    } finally {
      setLoader(false);
    }
  };

  const handleNewNoteCancel = () => {
    setAddNewNotes(false);
  };

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (!v_Pin) {
      if (!hasReloaded) {
        setCheckVpin(false);
        localStorage.setItem("hasReloaded", "true");
        window.location.reload();
      }
    } else {
      setCheckVpin(true);
      localStorage.setItem("hasReloaded", "false");
      getAllNote();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v_Pin]);

  const handleSearch = (value: string) => {
    if (!value) {
      getAllNote();
    } else {
      const searchResult = getNotes.filter((name) =>
        new RegExp(value, "i").test(name.name)
      );
      setGetNotes(searchResult);
    }
  };

  const handleFavorite = async () => {
    const newFavorite = !isfavorite;
    setIsFavorite(newFavorite);
    
    if (newFavorite) {
      setLoader(true);
      try {
        const response = await axios.post(  // ✅ FIXED: was axios.get
          `/api/note/get-favorite`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${v_Pin}`,
            },
          }
        );
        setGetNotes(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setLoader(false);
      }
    } else {
      getAllNote();
    }
  };

  return (
    <main className="flex h-screen overflow-hidden pr-4 py-4 bg-black font-poppins text-black selection:bg-[#BFAFF2]">
      <Sidebar>
        <SidebarItem icon={<PiVaultLight className="w-5 h-5" />} text={"Vault"} link="/vault" />
        <SidebarItem icon={<GrDocumentNotes className="w-5 h-5" />} text={"Notes"} active={true} link="/notes" />
        <SidebarItem icon={<RiAiGenerate className="w-5 h-5" />} text={"Generator"} link="/generator" />
        <SidebarItem icon={<IoSettingsOutline className="w-5 h-5" />} text={"Settings"} link="/settings" />
      </Sidebar>

      <MobileSideBar items={MobileSidebarItems} />

      <main className="w-full bg-white rounded-3xl p-4 shadow-xl overflow-y-auto">
        {checkVpin ? (
          <div className="w-full flex flex-col justify-center lg:items-center gap-y-4 transition-all">
            <div className="w-full h-fit flex flex-col gap-3 lg:max-w-2xl border border-neutral-200 shadow-sm rounded-xl p-6 bg-neutral-50">
              <div className="flex justify-between items-center mb-2">
                <p className="uppercase font-bold text-neutral-700 tracking-wider text-sm">Filters</p>
                <div 
                  onClick={handleFavorite} 
                  className="p-2 rounded-lg hover:bg-neutral-200 cursor-pointer transition-colors"
                  title="Toggle Favorites Only"
                >
                  {isfavorite ? (
                    <FaStar className="text-xl text-[#F8D57E]" />
                  ) : (
                    <FaRegStar className="text-xl text-neutral-500" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 shadow-inner bg-white p-3 rounded-lg border border-neutral-200 focus-within:ring-2 focus-within:ring-[#BFAFF2] focus-within:border-transparent transition-all">
                <FaSearch className="text-neutral-400" />
                <input
                  type="text"
                  className="focus:outline-none w-full bg-transparent text-base text-neutral-700"
                  placeholder="Search Notes"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full h-[70vh] lg:max-w-2xl flex flex-col p-6 border border-neutral-200 shadow-sm rounded-xl bg-white">
              <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-4">
                <p className="uppercase font-bold text-black tracking-wider text-lg">My Notes</p>
                <button 
                  onClick={handleNewNote}
                  className="flex items-center justify-center bg-black text-white p-2 rounded-lg hover:bg-[#BFAFF2] hover:text-black hover:scale-105 transition-all shadow-md group relative"
                >
                  <IoMdAdd className="text-2xl" />
                  <span className="absolute -top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap shadow-lg">
                    New Note
                  </span>
                </button>
              </div>
              
              {loader ? (
                <NoteSkeletonLoader />
              ) : (
                <div className="overflow-y-auto no-scrollbar flex-1 -mx-2 px-2">
                  {getNotes.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                        <GrDocumentNotes className="w-16 h-16 mb-4 opacity-50" />
                        <p>{isfavorite ? "No favorite notes found" : "Your notebook is empty"}</p>
                     </div>
                  ) : (
                    getNotes.map((value) => (
                      <div
                        key={value._id}
                        className="w-full flex items-center justify-between border border-transparent border-b-neutral-100 py-4 px-4 hover:bg-neutral-50 hover:border-neutral-200 rounded-xl transition-all cursor-pointer mb-1 group"
                        onClick={() => handleEditNotes(value._id)}
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-[#FFFBEA] rounded-full flex items-center justify-center text-[#F8D57E] shadow-sm border border-neutral-100">
                          <CiStickyNote className="w-6 h-6 text-black" />
                        </div>
                        <div className="w-full mx-4 flex items-center justify-between">
                          <p className="text-black font-bold break-all text-base group-hover:text-[#BFAFF2] transition-colors">
                            {value.name}
                          </p>
                          {value.favorite && (
                            <FaStar className="text-[#F8D57E] text-sm hidden group-hover:block transition-all" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {editNotes && (
                    <EditNotes
                      isOpen={editNotes}
                      onClose={handleEditNotesCancel}
                      onConfirm={handleSaveNotes}
                      onTrash={handleEditNotesTrash}
                      onUserData={getNotes.find((item) => item._id === currentEditId) as NoteData}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <EnterVaultPin />
        )}
      </main>
      
      {addNewNotes && (
        <AddNewNotes
          isOpen={addNewNotes}
          onConfirm={handleSaveNewNote}
          onClose={handleNewNoteCancel}
        />
      )}
    </main>
  );
}