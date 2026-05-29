"use client";

import { useAuth } from "@/hooks/useAuth";
import MobileHeader from "@/components/(design-systems)/mobileHeader";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { user, profile, isLoading, logout, isAdmin, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <MobileHeader title="Akun" />
        <div className="flex items-center justify-center pt-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </div>
      </div>
    );
  }

  const fullname = profile?.fullname || user?.user_metadata?.fullname || "User";
  const email = profile?.email || user?.email || "-";
  const createdAt = user?.created_at ? dayjs(user.created_at).format("DD MMMM YYYY") : "-";
  const initials = fullname.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-28">
      <MobileHeader title="Akun" />

      <div className="space-y-4 px-4 pt-20">
        {/* Avatar & Name Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-600 text-2xl font-bold text-white shadow-lg">
            {initials}
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">{fullname}</h2>
          <p className="text-sm text-gray-400">{email}</p>
          <span
            className={cn(
              "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold",
              isAdmin
                ? "bg-amber-100 text-amber-700"
                : "bg-sky-100 text-sky-700"
            )}
          >
            <Shield className="h-3 w-3" />
            {isAdmin ? "Admin" : "User"}
          </span>
        </motion.div>

        {/* Info Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white px-5 shadow-sm"
        >
          <InfoRow icon={<User className="h-4 w-4" />} label="Nama" value={fullname} />
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={email} />
          <InfoRow icon={<Shield className="h-4 w-4" />} label="Role" value={role} />
          <InfoRow
            icon={<User className="h-4 w-4" />}
            label="Bergabung"
            value={createdAt}
          />
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <button
            onClick={() => logout()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white py-4 text-sm font-semibold text-red-500 shadow-sm transition-all hover:bg-red-50 hover:shadow-md"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </motion.div>
      </div>
    </div>
  );
}
