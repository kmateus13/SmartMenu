"use client";

import { AuthService } from "@/services/AuthService";
import { useState } from "react";
import Cookies from "js-cookie";
import Router from "next/router";

export default function LoginPage() {
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            userName,
            password
        }

        try {
            const response = await AuthService.login(data)

            Cookies.set('smartmenu.token', response.token, { expires: 1, path: '/' });

            Router.push('/auth/login')
        } catch (err: any) {
            console.error("Erro na autenticação:", err);
            setError(err.message || "Erro ao conectar com o servidor.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-red-600">SmartMenu</h1>
                    <p className="text-gray-500 mt-2">Acesso restrito para funcionários</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuário (userName)
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                            placeholder="Digite seu usuário"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Entrar no Sistema
                    </button>
                </form>

            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}