'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function EditBlogPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const router = useRouter();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api.get('/blogs');
                const blog = response.data.find((b: any) => b.id === id);
                if (blog) {
                    setTitle(blog.title);
                    setContent(blog.content);
                    setIsPublished(blog.isPublished);
                } else {
                    router.push('/dashboard');
                }
            } catch (err) {
                console.error('Failed to fetch blog', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/blogs/${id}`, { title, content, isPublished });
            router.push('/dashboard');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update blog');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading blog data...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                <p className="text-slate-500 mt-1">Update your blog details or change visibility.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <Input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg px-4 py-6"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                    <textarea
                        required
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="block w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 resize-y"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="published"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-slate-700">
                        Publish status
                    </label>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={() => router.push('/dashboard')}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={saving}>
                        Update Post
                    </Button>
                </div>
            </form>
        </div>
    );
}
