import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center item-center h-screen border-dashed">
      <div className="mt-30">
      <SignIn />
      </div>
    </div>
  );
}
