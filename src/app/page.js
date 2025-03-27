"use client";
import { useState, useEffect } from "react";
import "./styles.css"; // Importa o CSS puro

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
            await fetch(`/api/users/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });
            setEditingId(null);
        } else {
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
        <div className="container">
            <div className="card">
                <h1>CRUD de Usuários</h1>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <button className={editingId ? "edit" : "save"}>
                        {editingId ? "Atualizar Usuário" : "Salvar Usuário"}
                    </button>
                </form>

                {/* Tabela de Usuários */}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className="actions">
                                    <button className="edit" onClick={() => handleEdit(user)}>Editar</button>
                                    <button className="delete" onClick={() => handleDelete(user.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
