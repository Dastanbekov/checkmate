"use client";
import { API_URL } from '@/lib/api';

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Users, Plus, ShieldCheck, UserPlus, LogOut } from "lucide-react";

interface Club {
  id: number;
  name: string;
  description: string;
  owner_name: string;
  member_count: number;
  is_member: boolean;
  created_at: string;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  // Create Form
  const [newClubName, setNewClubName] = useState("");
  const [newClubDesc, setNewClubDesc] = useState("");

  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/community/clubs/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setClubs(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/community/clubs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newClubName, description: newClubDesc })
      });
      if (res.ok) {
        setShowCreate(false);
        setNewClubName("");
        setNewClubDesc("");
        fetchClubs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinLeave = async (clubId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/community/clubs/${clubId}/join/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchClubs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">Community Clubs</h1>
          <p className="text-zinc-400 mt-2">Join clubs, meet players, and participate in tournaments.</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          {showCreate ? "Cancel" : <><Plus className="w-5 h-5"/> Create Club</>}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Create a New Club</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Club Name</label>
              <input 
                required
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="E.g. Gotham Knights"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Description</label>
              <textarea 
                required
                value={newClubDesc}
                onChange={(e) => setNewClubDesc(e.target.value)}
                className="w-full h-24 bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="What is your club about?"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-zinc-500">Loading clubs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {clubs.map(club => (
            <div key={club.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold truncate">{club.name}</h3>
                  <p className="text-sm text-zinc-500">Created by {club.owner_name}</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-6 flex-1">{club.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{club.member_count} members</span>
                </div>
                
                {club.is_member ? (
                  <button 
                    onClick={() => handleJoinLeave(club.id)}
                    className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut className="w-3 h-3" /> Leave
                  </button>
                ) : (
                  <button 
                    onClick={() => handleJoinLeave(club.id)}
                    className="flex items-center gap-2 text-xs font-bold text-black bg-white px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <UserPlus className="w-3 h-3" /> Join
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {clubs.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500 border border-zinc-800 rounded-xl border-dashed">
              No clubs found. Be the first to create one!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
