'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function CreateBlogPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/blogs', { title, content, isPublished });
            router.push('/dashboard');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
                <p className="text-slate-500 mt-1">Draft a new blog or publish it directly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <Input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="A catchy title..."
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
                        placeholder="Write your blog content here. Markdown is not fully enabled locally but text forms the basis."
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
                        Publish immediately
                    </label>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={() => router.push('/dashboard')}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        Save Post
                    </Button>
                </div>
            </form>
        </div>
    );
}
