import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";




export default async function Home() {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (role === "student") {
    redirect("/dashboard/student");
  } else if (role === "faculty") {
    redirect("/dashboard/faculty");
  } else if (role === "hod") {
    redirect("/dashboard/hod");
  }

  return (
    <>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
            </SignedIn>
          </header>
      <h1>Landing Page</h1>
    </>
  );
}
