"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "../button/Button";
import { navItems } from "./constant";

export default function NavigationBar() {
  const pathname = usePathname();

  const shouldShow = navItems.some((item) => pathname.startsWith(item.href));

  if (!shouldShow) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 rounded-t-4xl border-t bg-white shadow-lg">
      <div className="relative flex h-20 items-center justify-between px-4">
        {navItems.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          // 🔥 Floating Main Button
          if (item.isMain) {
            return (
              <div
                key={item.href}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6"
              >
                <Link href={item.href}>
                  <Button
                    variant="text"
                    radius="full"
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-all duration-300",
                      isActive
                        ? "bg-primary scale-105 text-white"
                        : "bg-primary/90 hover:bg-primary text-white"
                    )}
                  >
                    <Icon className="h-8 w-8" strokeWidth={2.5} />
                  </Button>
                  <p className="text-primary mt-1 text-center text-xs font-medium">{item.label}</p>
                </Link>
              </div>
            );
          }

          // 🔹 Normal Items
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300",
                index === 1 && "mr-16",
                index === 3 && "ml-16"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "text-primary scale-110" : "text-gray-400"
                )}
                strokeWidth={isActive ? 2.5 : 1.8}
              />

              <span
                className={cn(
                  "text-[11px] font-medium transition-all duration-300",
                  isActive ? "text-primary" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
