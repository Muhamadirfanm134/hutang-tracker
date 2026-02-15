"use client";

import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import { FormProvider } from "react-hook-form";

import { FormInput } from "@/components/(design-systems)/input/FormInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useLoginForm from "../hooks/use-login-form";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const { form, onSubmit, onRegister, loading } = useLoginForm();

  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex flex-col items-center"
        >
          <Image src="/hutang-tracker.png" alt="Logo Jual" width={300} height={100} priority />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-2 text-sm text-gray-500"
        >
          {isRegister ? "Buat akun" : "Silahkan masuk dengan akunmu"}
        </motion.h2>

        {/* Form */}
        <FormProvider {...form}>
          <motion.form
            onSubmit={isRegister ? onRegister : onSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-3"
          >
            {isRegister && (
              <FormInput
                name="fullname"
                iconLeft={<User size={18} />}
                required
                placeholder="Nama Lengkap"
              />
            )}
            <FormInput
              name="email"
              type="email"
              iconLeft={<Mail size={18} />}
              required
              placeholder="Email"
            />

            <FormInput
              name="password"
              type="password"
              iconLeft={<Lock size={18} />}
              required
              placeholder="Password"
            />

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full" size="lg">
                {isRegister ? "Daftar" : "Masuk"}
              </Button>
            </motion.div>
          </motion.form>
        </FormProvider>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 cursor-pointer text-center text-sm text-gray-500"
        >
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <a
            onClick={() => setIsRegister((prev) => !prev)}
            className="text-primary-600 font-semibold hover:underline"
          >
            {isRegister ? "Masuk disini" : "Daftar sekarang"}
          </a>
        </motion.p>
      </motion.div>

      <div className="absolute bottom-4 text-center text-xs text-gray-400 md:hidden">
        <p>© 2026 Hutang tracker - member of MN Group</p>
        <p className="mt-1">v1.0.0</p>
      </div>
    </div>
  );
}
