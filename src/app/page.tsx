"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/aceternity/spotlight";
import AppLoader from "@/components/app-loader";


export default function Home() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const role = user.publicMetadata?.role;

    if (role === "student") {
      router.push("/dashboard/student");
    } else if (role === "faculty") {
      router.push("/dashboard/faculty");
    } else if (role === "hod") {
      router.push("/dashboard/hod");
    }
  }, [isSignedIn, user, router]);

  if (isSignedIn && user) {
    const role = user.publicMetadata?.role;
    if (role === "student" || role === "faculty" || role === "hod") {
      return <AppLoader/>;
    }
  }

  return <LandingPage />;
}
