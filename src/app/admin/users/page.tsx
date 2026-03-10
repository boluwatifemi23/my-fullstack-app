"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Shield, ShieldOff, Trash2, Search, Users } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import ConfirmModal from "@/app/admin/components/ConfirmModal";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
};

type ConfirmState = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
  onConfirm: () => void;
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    open: false, title: "", message: "", confirmLabel: "Confirm", danger: false, onConfirm: () => {},
  });

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { credentials: "include" });
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  function toggleRole(user: User) {
    const newRole = user.role === "admin" ? "user" : "admin";
    setConfirmModal({
      open: true,
      title: newRole === "admin" ? "Make Admin" : "Demote User",
      message: newRole === "admin"
        ? `Give ${user.firstName} ${user.lastName} admin access?`
        : `Remove admin access from ${user.firstName} ${user.lastName}?`,
      confirmLabel: newRole === "admin" ? "Make Admin" : "Demote",
      danger: newRole === "user",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        setUpdating(user._id);
        try {
          const res = await fetch(`/api/users/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ role: newRole }),
          });
          const data = await res.json();
          if (!res.ok) { toast.error(data.error || "Failed to update role"); return; }
          setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
          toast.success(newRole === "admin" ? `${user.firstName} is now an Admin!` : `${user.firstName} has been demoted`);
        } catch {
          toast.error("Something went wrong");
        } finally {
          setUpdating(null);
        }
      },
    });
  }

  function deleteUser(user: User) {
    setConfirmModal({
      open: true,
      title: "Delete User",
      message: `Permanently delete ${user.firstName} ${user.lastName}? This cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        setUpdating(user._id);
        try {
          const res = await fetch(`/api/users/${user._id}`, {
            method: "DELETE",
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) { toast.error(data.error || "Failed to delete user"); return; }
          setUsers((prev) => prev.filter((u) => u._id !== user._id));
          toast.success("User deleted");
        } catch {
          toast.error("Something went wrong");
        } finally {
          setUpdating(null);
        }
      },
    });
  }

  const filtered = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-1">
            {users.length} total — {adminCount} admin{adminCount !== 1 ? "s" : ""}, {userCount} customer{userCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-xl text-center">
            <p className="text-orange-400 text-xs font-medium">Admins</p>
            <p className="text-white font-bold text-lg leading-tight">{adminCount}</p>
          </div>
          <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-gray-400 text-xs font-medium">Customers</p>
            <p className="text-white font-bold text-lg leading-tight">{userCount}</p>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or role..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">{search ? "No users match your search." : "No users found."}</p>
        </div>
      ) : (
        <div className="bg-gray-800 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Joined</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((user) => {
                const isCurrentUser = currentUser?.id === user._id;
                const isUpdating = updating === user._id;
                return (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-500/40 to-amber-500/40 flex items-center justify-center text-orange-300 font-bold text-sm shrink-0">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {user.firstName} {user.lastName}
                            {isCurrentUser && <span className="ml-2 text-xs text-orange-400 font-normal">(you)</span>}
                          </p>
                          <p className="text-gray-500 text-xs md:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-400">{user.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold
                        ${user.role === "admin"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-white/5 text-gray-400 border border-white/10"}`}>
                        {user.role === "admin" ? <Shield size={11} /> : <ShieldOff size={11} />}
                        {user.role === "admin" ? "Admin" : "Customer"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleRole(user)}
                          disabled={isUpdating || isCurrentUser}
                          title={isCurrentUser ? "You cannot change your own role" : user.role === "admin" ? "Demote to Customer" : "Make Admin"}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed
                            ${user.role === "admin"
                              ? "bg-gray-700 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
                              : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"}`}>
                          {isUpdating ? <span className="animate-pulse">...</span>
                            : user.role === "admin" ? <><ShieldOff size={12} /> Demote</>
                            : <><Shield size={12} /> Make Admin</>}
                        </button>
                        <button onClick={() => deleteUser(user)}
                          disabled={isUpdating || isCurrentUser}
                          title={isCurrentUser ? "You cannot delete yourself" : "Delete user"}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        danger={confirmModal.danger}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}