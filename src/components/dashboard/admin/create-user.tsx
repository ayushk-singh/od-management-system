"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "faculty" | "hod";
  departmentId: string;
  registerNo: string;
  className: string;
};

export default function AdminCreateUserForm() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
    departmentId: "",
    registerNo: "",
    className: "",
  });
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/od/admin/department");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDepartments(data);
      } catch {
        toast.error("Failed to load departments");
      }
    })();
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.departmentId) return toast.error("Please select a department");

    setLoading(true);
    try {
      const payload = {
        ...form,
        name: `${form.firstName} ${form.lastName}`, // fallback for database
      };
      const res = await fetch("/api/od/admin/user/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("User created successfully");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "student",
          departmentId: "",
          registerNo: "",
          className: "",
        });
      } else {
        toast.error(data.error || "Failed to create user");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <Label>First Name</Label>
        <Input
          value={form.firstName}
          onChange={e => handleChange("firstName", e.target.value)}
        />
        <Label>Last Name</Label>
        <Input
          value={form.lastName}
          onChange={e => handleChange("lastName", e.target.value)}
        />

        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={e => handleChange("email", e.target.value)}
        />

        <Label>Password</Label>
        <Input
          type="password"
          value={form.password}
          onChange={e => handleChange("password", e.target.value)}
        />

        <Label>Role</Label>
        <Select
          value={form.role}
          onValueChange={value => handleChange("role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
            <SelectItem value="hod">HOD</SelectItem>
          </SelectContent>
        </Select>

        <Label>Department</Label>
        <Select
          value={form.departmentId}
          onValueChange={value => handleChange("departmentId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(dep => (
              <SelectItem key={dep.id} value={dep.id}>
                {dep.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {form.role === "student" && (
          <>
            <Label>Register No</Label>
            <Input
              value={form.registerNo}
              onChange={e => handleChange("registerNo", e.target.value)}
            />
            <Label>Class</Label>
            <Input
              value={form.className}
              onChange={e => handleChange("className", e.target.value)}
            />
          </>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create User"}
      </Button>
    </div>
  );
}
