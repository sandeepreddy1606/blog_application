'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken } from '@/lib/auth';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const currentUser = getUserFromToken();
        if (!currentUser) {
            router.push('/login');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    if (!user) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading profile...</div>;

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 py-16 bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-200/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-lg z-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8 text-center drop-shadow-sm">
                    Account Profile
                </h1>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all hover:shadow-2xl">
                    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 h-32 w-full relative">
                        <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full p-1.5 shadow-md">
                            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-4xl font-black uppercase shadow-inner">
                                {(user.name || user.email).charAt(0)}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{user.name || user.email.split('@')[0]}</h2>
                            <p className="text-slate-500 font-medium mt-1">{user.email}</p>
                        </div>

                        <div className="space-y-4 rounded-xl bg-slate-50/50 backdrop-blur-sm border border-slate-100 p-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-slate-200/60 last:border-0 gap-2">
                                <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Account ID</span>
                                <span className="text-slate-800 font-mono text-sm bg-white px-3 py-1 rounded-md shadow-sm border border-slate-100 break-all">{user.sub}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-slate-200/60 last:border-0 gap-2">
                                <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Access Role</span>
                                <div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                        {user.role || 'USER'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
