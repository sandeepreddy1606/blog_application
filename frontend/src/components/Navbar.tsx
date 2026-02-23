'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearToken, getToken } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!getToken());
    }, []);

    const handleLogout = () => {
        clearToken();
        setIsAuthenticated(false);
        router.push('/login');
    };

    return (
        <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/feed" className="text-xl font-bold tracking-tight text-slate-900">
                    SecureBlog Platform
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/feed" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        Feed
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Dashboard
                            </Link>
                            <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button variant="primary">Sign In</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
