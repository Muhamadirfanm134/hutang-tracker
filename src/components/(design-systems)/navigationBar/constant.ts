import {
  HelpCircle,
  History,
  Home,
  PlusIcon,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  isMain?: boolean;
  adminOnly?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/home", icon: Home },
  { label: "Riwayat", href: "/history", icon: History },
  { label: "Bayar!", href: "/pay", icon: PlusIcon, isMain: true, adminOnly: true },
  { label: "Management", href: "/management", icon: Settings, adminOnly: true },
  { label: "Akun", href: "/profile", icon: User },
];
