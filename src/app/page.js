"use client";
import { useState, useEffect } from "react";

export default function Home() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            // Editar usuário
            await fetch(`/api/users/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });
            setEditingId(null);
        } else {
            // Criar novo usuário
            await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });
        }

        setName("");
        setEmail("");
        fetchUsers();
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setName(user.name);
        setEmail(user.email);
    };

    const handleDelete = async (id) => {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        fetchUsers();
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">CRUD de Usuários</h1>

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    className="border p-2 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome"
                    required
                />
                <input
                    className="border p-2 w-full mt-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <button className="bg-blue-500 text-white px-4 py-2 mt-2 w-full">
                    {editingId ? "Atualizar" : "Salvar"}
                </button>
            </form>

            <ul>
                {users.map((user) => (
                    <li key={user.id} className="border p-2 my-2 flex justify-between items-center">
                        <span>{user.name} - {user.email}</span>
                        <div>
                            <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-2 mx-1">Editar</button>
                            <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2">X</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
