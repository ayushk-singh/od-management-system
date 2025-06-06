"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { WobbleCard } from "../ui/wobble-card";

export function WobbleCardDemo() {
    
  return (
    <div className="relative z-10 w-full bg-black/[0.96] py-16">
      {/* Grid background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 select-none [background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* Cards */}
      <div className="relative z-10 grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 max-w-7xl mx-auto">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Gippity AI powers the entire universe
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              With over 100,000 monthly active bot users, Gippity AI is the most
              popular AI platform for developers.
            </p>
          </div>
          <img
            src="/linear.webp"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>

        <WobbleCard containerClassName="col-span-1 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            No shirt, no shoes, no weapons.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            If someone yells “stop!”, goes limp, or taps out, the fight is over.
          </p>
        </WobbleCard>

        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Signup for blazing-fast cutting-edge state of the art Gippity AI
              wrapper today!
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              With over 100,000 monthly active bot users, Gippity AI is the most
              popular AI platform for developers.
            </p>
          </div>
          <img
            src="/linear.webp"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>
      </div>
    </div>
  );
}
