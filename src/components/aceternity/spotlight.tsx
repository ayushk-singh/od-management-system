"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "../ui/spotlight";
import { WobbleCard } from "../ui/wobble-card";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../ui/button";

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black/[0.96] text-white">
      {/* Grid Background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 select-none [background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* Navbar */}
      <Navbar />

      {/* Spotlight Hero Section */}
      <section className="relative z-10 flex h-screen w-screen flex-col items-center justify-center px-4 text-center">
        <Spotlight
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          fill="white"
        />
        <div className="z-10 max-w-3xl">
          <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent md:text-7xl">
            A Smarter Way to Handle OD Applications.
          </h1>
          <p className="mt-4 text-lg font-normal text-neutral-300">
            Ensure transparency and accountability with a digital solution
            trusted by institutions.
          </p>
          <div className="mt-10">
            <SignInButton mode="modal">
              <Button className="text-lg">Get Started</Button>
            </SignInButton>
            <Button className="text-lg ml-5">Know More</Button>
          </div>
        </div>
      </section>

      {/* Wobble Cards Section */}
      <section className="relative z-10 w-full py-20">
        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 max-w-7xl mx-auto">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Manage OD applications faster
              </h2>
              <p className="mt-4 text-left text-base/6 text-neutral-200">
                A centralized dashboard for students, faculty, and HODs to
                streamline the entire OD approval workflow.
              </p>
            </div>
            <Image
              src="/linear.webp"
              width={500}
              height={500}
              alt="demo image"
              className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>

          <WobbleCard containerClassName="col-span-1 min-h-[300px]">
            <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Transparent for all roles
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Role-based access lets students apply, tutors verify, and HODs
              approve — seamlessly.
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Get Started with OD Management today!
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                Elevate your institution’s OD process with a modern, efficient,
                and paperless system.
              </p>
            </div>
            <img
              src="/linear.webp"
              width={500}
              height={500}
              alt="demo image"
              className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-sm text-neutral-400 border-t border-neutral-800">
        Made by Ayush with ❤️
      </footer>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-20 flex w-full items-center justify-between px-8 py-4 backdrop-blur-md bg-transparent">
      <div className="flex items-center gap-3">
        <Image width={25} height={25} src="/hicas.webp" alt="Hicas logo" />
        <h1 className="text-lg font-bold text-primary dark:text-primary-foreground">
          OD Management System
        </h1>
      </div>

      <SignInButton mode="modal">
        <Button>Sign In</Button>
      </SignInButton>
    </nav>
  );
};
