'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clearToken, getToken } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        setIsAuthenticated(!!getToken());
    }, []);

    const handleLogout = () => {
        clearToken();
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    return (
        <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/feed" className="text-xl font-bold tracking-tight text-slate-900">
                    BlogX
                </Link>

                <div className="flex items-center gap-2 md:gap-4">
                    <Link
                        href="/feed"
                        className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-full hover:bg-slate-50 ${pathname?.startsWith('/feed') ? 'bg-slate-100 text-slate-900' : 'text-slate-600'}`}
                    >
                        Feed
                    </Link>
                    {isAuthenticated !== null && (
                        isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-full hover:bg-slate-50 ${pathname?.startsWith('/dashboard') ? 'bg-slate-100 text-slate-900' : 'text-slate-600'}`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-full hover:bg-slate-50 ${pathname?.startsWith('/profile') ? 'bg-slate-100 text-slate-900' : 'text-slate-600'}`}
                                >
                                    Profile
                                </Link>
                                <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button variant="primary">Sign In</Button>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
}
