'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            setToken(response.data.accessToken);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm border border-slate-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h2>
                    <p className="mt-2 text-sm text-slate-600">Access your dashboard</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="sr-only" htmlFor="email-address">Email address</label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="sr-only" htmlFor="password">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                    <div>
                        <Button type="submit" className="w-full" isLoading={loading}>
                            Sign in
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-slate-500">Don't have an account? </span>
                        <Link href="/register" className="font-semibold text-slate-900 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
