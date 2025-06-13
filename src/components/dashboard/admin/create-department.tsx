"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateDepartmentPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError('');
    setSuccess('');
    if (name.trim().length < 3) {
      setError("Name must be at least 3 letters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/od/admin/department', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim() }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const department = await res.json();
        setSuccess(`Created department with id ${department.id}..`);
        setName('');
      } else {
        const error = await res.json();
        setError(error.error ?? "Failed to create department.");
      }
    } catch (err) {
      console.error(err);
      setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-md m-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Department</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          disabled={loading}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter department name"
        />

        <Button disabled={loading} type="submit">
          {loading ? "Creating…" : "Create"}
        </Button>
      </form>
    </div>
  );
}

