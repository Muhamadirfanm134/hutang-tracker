"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "./useToast";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  fullname: string;
  email: string;
  password: string;
}

interface Profile {
  id: string;
  fullname: string | null;
  email: string | null;
  role: "admin" | "user";
}

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // --- ✅ FETCH SESSION & USER
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 1000 * 60 * 5,
  });

  const user = session?.user ?? null;

  // --- 📋 FETCH PROFILE (role from profiles table)
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Failed to fetch profile:", error.message);
        return null;
      }
      return data as Profile;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingSession || (!!user && isLoadingProfile);
  const role = profile?.role || "user";
  const isAdmin = role === "admin";

  // --- 🔄 LISTEN REALTIME AUTH CHANGES
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      queryClient.setQueryData(["session"], newSession);
      // Refetch profile when auth state changes
      if (newSession?.user) {
        queryClient.invalidateQueries({ queryKey: ["profile", newSession.user.id] });
      }
    });
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [queryClient]);

  // --- 🚦 AUTO REDIRECT LOGIC
  useEffect(() => {
    if (isLoadingSession) return;

    const authPages = ["/login", "/register"];
    const isAuthPage = authPages.includes(pathname);

    if (!user && !isAuthPage) {
      router.replace("/login");
    } else if (user && isAuthPage) {
      router.replace("/home");
    }
  }, [user, isLoadingSession, pathname, router]);

  // --- 🔐 LOGIN MUTATION
  const loginMutation = useMutation<Session | null, Error, LoginParams>({
    mutationFn: async (params: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword(params);
      if (error) throw error;
      return data.session;
    },
    onSuccess: (session) => {
      if (session) {
        queryClient.setQueryData(["session"], session);
        // Fetch profile immediately after login
        queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] });
      }
      toast({
        title: "Login berhasil",
        variant: "success",
        position: "top-center",
      });
      router.replace("/home");
    },
    onError: (err) => {
      console.error("❌ Login failed:", err.message);
      toast({
        title: err.message,
        variant: "error",
        position: "top-center",
      });
    },
  });

  // --- 🧾 REGISTER MUTATION
  const registerMutation = useMutation<void, Error, RegisterParams>({
    mutationFn: async ({ fullname, email, password }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { fullname, role: "user" },
        },
      });
      if (error) throw error;
      // Note: The DB trigger will auto-create a profiles row with role='user'
    },
    onSuccess: () => {
      toast({
        title: "Registrasi berhasil!",
        variant: "success",
        position: "top-center",
      });
      router.replace("/login");
    },
    onError: (err) => {
      toast({
        title: err.message,
        variant: "error",
        position: "top-center",
      });
    },
  });

  // --- 🚪 LOGOUT MUTATION
  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.removeQueries({ queryKey: ["profile"] });
      router.replace("/login");
      toast({
        title: "Logout berhasil",
        variant: "info",
        position: "top-center",
      });
    },
  });

  return {
    user,
    session,
    profile,
    isLoading,
    role,
    isAdmin,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
}
