'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

interface Blog {
    id: string;
    title: string;
    summary: string | null;
    isPublished: boolean;
    slug: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!getToken()) {
            router.push('/login');
            return;
        }

        const fetchBlogs = async () => {
            try {
                const response = await api.get('/blogs');
                setBlogs(response.data);
            } catch (err) {
                console.error('Failed to fetch blogs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [router]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            await api.delete(`/blogs/${id}`);
            setBlogs((prev) => prev.filter((b) => b.id !== id));
        } catch (err) {
            console.error('Failed to delete blog', err);
            alert('Could not delete blog.');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage your blog posts</p>
                </div>
                <Link href="/dashboard/create">
                    <Button>Create Post</Button>
                </Link>
            </div>

            {blogs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-medium text-slate-900">No blog posts yet</h3>
                    <p className="mt-1 text-slate-500 mb-4">Get started by creating your first post.</p>
                    <Link href="/dashboard/create">
                        <Button variant="secondary">Create your first post</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
                            <div className="flex-1 min-w-0 grid">
                                <Link href={blog.isPublished ? `/blog/${blog.slug}` : `/dashboard/edit/${blog.id}`} className="hover:underline overflow-hidden">
                                    <h3 className="text-lg font-semibold text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap w-full">{blog.title}</h3>
                                </Link>
                                {blog.summary && (
                                    <p className="mt-2 text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap w-full">{blog.summary}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                    <span className={blog.isPublished ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                                        {blog.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Link href={`/dashboard/edit/${blog.id}`}>
                                    <Button variant="secondary">Edit</Button>
                                </Link>
                                <Button variant="danger" onClick={() => handleDelete(blog.id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
