import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      email,
      password = "temp@123",
      firstName,
      lastName,
      name, // optional legacy combined name
      role,
      departmentId,
      registerNo,
      className,
    } = await req.json();

    const client = await clerkClient();

    if (role === "hod") {
      const existing = await prisma.hOD.findUnique({ where: { departmentId } });
      if (existing) {
        return new Response(
          JSON.stringify({ error: "A department already has a HOD." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 1️⃣ Create user in Clerk with full name
    const user = await client.users.createUser({
      emailAddress: [email],
      password,
      skipPasswordChecks: true,
      firstName,
      lastName,
      publicMetadata: { role },
    });

    const clerkId = user.id;

    // 2️⃣ Store in your own DB
    if (role === "student") {
      await prisma.student.create({
        data: {
          clerkId,
          name: name ?? `${firstName} ${lastName}`,
          registerNo: registerNo!,
          class: className!,
          departmentId: departmentId!,
        },
      });
    } else if (role === "faculty") {
      await prisma.faculty.create({
        data: {
          clerkId,
          name: name ?? `${firstName} ${lastName}`,
          email,
          departmentId: departmentId!,
        },
      });
    } else if (role === "hod") {
      await prisma.hOD.create({
        data: {
          clerkId,
          name: name ?? `${firstName} ${lastName}`,
          email,
          departmentId: departmentId!,
        },
      });
    }

    return new Response(JSON.stringify({ message: "User created", user }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Clerk createUser error.", JSON.stringify(err, null, 2));

    let details = "Unknown error";

    if (err instanceof Error) {
      details = err.message;
    } else if (err && typeof err === "object" && "errors" in err) {
      // If you know your error might have an `errors` field
      // (depending on your application’s error structure)
      details = (err as { errors: unknown }).errors as string;
    }

    return new Response(
      JSON.stringify({ error: "Error creating user", details }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
