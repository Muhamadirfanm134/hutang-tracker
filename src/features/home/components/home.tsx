"use client";

import { useAuth } from "@/hooks/useAuth";

export function Home() {
  const { user } = useAuth();
  return (
    <div className="p-4">
      <div className="space-y-3">
        <div>Hello</div>
        <div>{user?.email}</div>
      </div>
    </div>
  );
}
