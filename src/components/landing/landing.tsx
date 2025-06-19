import React from "react";
import { HeroHeader } from "../header";
import HeroSection from "../hero-section";
import FeaturesSection from "../features-8";

export function Landing() {
  return (
    <div>
      <HeroHeader />
      <HeroSection />
      <FeaturesSection />
      <footer className="py-8 border-t bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} OD Management System. All rights
              reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made by{" "}
              <a
                href="https://softwareguy.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Ayush (softwareguy.xyz)
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
