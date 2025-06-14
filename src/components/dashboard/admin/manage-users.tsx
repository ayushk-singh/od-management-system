"use client";

import { useEffect, useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import DataFetchLoader from "@/components/data-fetch-loader";

type User = {
  id: string;
  name: string;
  role: string;
  email: string | null;
  registerNo: string | null;
  class: string | null;
  department: string | null;
};

function ManageUsersComponentSimple() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/od/admin/user/get-all-user');
        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = (await res.json()) as { users: User[] };
        setUsers(data.users);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filter
  const filteredUsers = users.filter((user) =>
    [user.name, user.role, user.email, user.registerNo, user.class, user.department]
      .some((field) => field?.toLowerCase().includes(filter.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + perPage);

  if (loading) return <DataFetchLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      {/* Filter */}
      <Input
        placeholder="Search by Name, Email, Role, RegisterNo, Class, or Department"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
      />

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Register No</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.email ? user.email : '-'}</TableCell>
              <TableCell>{user.registerNo ? user.registerNo : '-'}</TableCell>
              <TableCell>{user.class ? user.class : '-'}</TableCell>
              <TableCell>{user.department ? user.department : '-'}</TableCell>
              <TableCell>
                {/* Actions can be implemented here*/}
                <button
                    onClick={() => console.log("Edit", user.id)}
                    className=" mr-2 px-2 py-1 rounded-md bg-blue-500 text-gray-50">
                    Edit
                </button>
                <button
                    onClick={() => console.log("Delete", user.id)}
                    className="px-2 py-1 rounded-md bg-red-500 text-gray-50">
                    Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex gap-2 mt-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</Button>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
        <span>Page {currentPage} of {totalPages}</span>

        {/* Rows per page picker */}
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="rounded-md border px-2 py-1 ml-2">
          <option value={5}>
            5 per page
          </option>
          <option value={10}>
            10 per page
          </option>
          <option value={20}>
            20 per page
          </option>
          <option value={50}>
            50 per page
          </option>
        </select>
      </div>
    </div>
  );
}

export default ManageUsersComponentSimple;

