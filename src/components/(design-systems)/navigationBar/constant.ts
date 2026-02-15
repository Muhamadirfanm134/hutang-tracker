import {
  HelpCircle,
  History,
  Home,
  LayoutGrid,
  PlusIcon,
  User,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  isMain?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/home", icon: Home },
  { label: "Riwayat", href: "/history", icon: History },
  { label: "Bayar!", href: "/pay", icon: PlusIcon, isMain: true },
  { label: "Bantuan", href: "/bantuan", icon: HelpCircle },
  { label: "Akun", href: "/profile", icon: User },
];
