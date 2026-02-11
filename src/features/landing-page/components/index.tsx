"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { Rocket, ArrowRight, Code, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-white"
      style={{
        background:
          "radial-gradient(circle at top left, #05165c 0%, #0a2aae 40%, #5c94e1 70%, #93c5fd 100%)",
      }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-center"
      >
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <div className="relative h-48 w-48 sm:h-64 sm:w-64">
            <Image src="/mn-group.png" alt="Logo" fill className="object-contain" priority />
          </div>
        </div>

        {/* Title */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <Rocket className="h-10 w-10 text-white" />
          <h1 className="text-4xl font-bold md:text-5xl">Next.js App Starter 🚀</h1>
        </div>

        {/* Desc */}
        <p className="mb-6 text-lg text-gray-200">
          A modern, minimal, and powerful starter template for your Next.js project. Built with
          TailwindCSS, Lucide Icons, and framer-motion.
        </p>

        {/* CTA */}
        <div className="flex justify-center gap-4">
          <Link
            href="https://github.com/new?template_name=mngroup-nextjs-supabase-starter&template_owner=Muhamadirfanm134"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="rounded-2xl">
              Use This Template
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link
            href="https://github.com/Muhamadirfanm134/mngroup-nextjs-supabase-starter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="rounded-2xl border-white text-white hover:bg-white hover:text-black"
            >
              <Code className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Features */}
      <section className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: <Zap className="h-8 w-8 text-yellow-300" />,
            title: "Fast Development",
            desc: "Built with Next.js App Router, optimized for performance.",
          },
          {
            icon: <Smartphone className="h-8 w-8 text-green-300" />,
            title: "Beautiful UI",
            desc: "TailwindCSS + Lucide + framer-motion = modern and stunning.",
          },
          {
            icon: <Rocket className="h-8 w-8 text-pink-300" />,
            title: "Production Ready",
            desc: "Best practices included: SEO, Metadata, and scalable structure.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-lg backdrop-blur-md transition-transform hover:scale-105">
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-200">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
