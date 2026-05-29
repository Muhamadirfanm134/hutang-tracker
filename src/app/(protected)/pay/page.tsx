"use client";

import { PayForm } from "@/features/payment-history/components/pay-form";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PayPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/home");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) return null;

  return <PayForm />;
}
