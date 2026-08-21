'use client'
import { useEffect, useState } from "react";
import { getAllUsers } from "@/database";
import { User } from "@/types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1>All Users</h1>
      {users.map(u => (
        <div key={u.id}>{u.email} - {u.role}</div>
      ))}
    </div>
  )
}