"use client";

import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      // Ambil session aktif
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login"); // Redirect ke login jika tidak ada session
      } else {
        setSession(data.session);
      }

      setLoading(false);
    };

    checkSession();

    // Listener untuk perubahan login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      } else {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  // Render konten jika sudah login
  return <>{session ? children : null}</>;
}
