"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function ReportIssuePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setName("");
    setEmail("");
    setDescription("");
    setAttachment(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    alert(`Report submitted:
Name: ${name}
Email: ${email}
Description: ${description}
Attachment: ${attachment ? attachment.name : "No attachment"}
`);

    setSubmitting(false);
    resetForm();
  };

  return (
    <main className="max-w-3xl mx-auto p-10 mt-10">
      <h1 className="text-3xl font-bold mb-6">Report an Issue</h1>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Issue Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the issue you're experiencing"
            className="min-h-[150px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachment">Attachment</Label>
          <Input
            id="attachment"
            type="file"
            onChange={(e) =>
              setAttachment(e.target.files ? e.target.files[0] : null)
            }
            accept="image/*,application/pdf"
          />
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </Button>
      </form>

      <div className="mt-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
