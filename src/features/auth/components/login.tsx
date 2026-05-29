"use client";

import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import { FormProvider } from "react-hook-form";
import { useState } from "react";

import { FormInput } from "@/components/(design-systems)/input/FormInput";
import { Button } from "@/components/ui/button";
import useLoginForm from "../hooks/use-login-form";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  const { form, onSubmit, onRegister, loading, loginWithGoogle } =
    useLoginForm();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md pb-10"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex flex-col items-center"
          >
            <Image
              src="/hutang-tracker.png"
              alt="Logo Jual"
              width={200}
              height={80}
              priority
              className="h-auto w-auto max-w-full"
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-4 text-center text-sm text-gray-500"
          >
            {isRegister
              ? "Buat akun"
              : "Silahkan masuk dengan akunmu"}
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

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {isRegister ? "Daftar" : "Masuk"}
                </Button>
              </motion.div>
            </motion.form>
          </FormProvider>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Atau
              </span>
            </div>
          </div>

          {/* Google Login */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-gray-700 hover:bg-gray-50"
              size="lg"
              onClick={() => loginWithGoogle()}
              disabled={loading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Lanjutkan dengan Google
            </Button>
          </motion.div>

          {/* Footer Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            {isRegister
              ? "Sudah punya akun?"
              : "Belum punya akun?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister((prev) => !prev)}
              className="text-primary-600 font-semibold hover:underline"
            >
              {isRegister
                ? "Masuk disini"
                : "Daftar sekarang"}
            </button>
          </motion.p>
        </motion.div>
      </div>

      {/* Mobile Footer */}
      <footer className="px-4 pb-safe pb-4 text-center text-xs text-gray-400 md:hidden">
        <p>© 2026 Hutang tracker - member of MN Group</p>
        <p className="text-gray-300">PT. MULTI NUSA INOVASI NUSANTARA</p>
      </footer>
    </div>
  );
}