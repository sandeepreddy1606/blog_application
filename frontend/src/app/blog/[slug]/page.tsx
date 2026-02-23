'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { LikeButton } from '@/components/LikeButton';
import { CommentItem } from '@/components/CommentItem';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getToken } from '@/lib/auth';

export default function SingleBlogPage() {
    const params = useParams();
    const { slug } = params;

    const [blog, setBlog] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchBlogAndComments = async () => {
            setLoading(true);
            try {
                const blogRes = await api.get(`/public/blogs/${slug}`);
                setBlog(blogRes.data);

                const commentsRes = await api.get(`/blogs/${blogRes.data.id}/comments`);
                setComments(commentsRes.data);
            } catch (err) {
                console.error('Failed to load blog', err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchBlogAndComments();
    }, [slug]);

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!getToken()) return alert('Please login to comment');
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            const res = await api.post(`/blogs/${blog.id}/comments`, { content: newComment });
            setComments([res.data, ...comments]); // Optimistically add at top
            setNewComment('');
        } catch (err) {
            console.error('Failed to post comment', err);
            alert('Could not post comment.');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) return <div className="container mx-auto px-4 py-16 max-w-3xl text-center text-slate-500 animate-pulse">Loading story...</div>;
    if (!blog) return <div className="container mx-auto px-4 py-16 max-w-3xl text-center">Blog not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                    {blog.title}
                </h1>
                <div className="flex items-center justify-center gap-3 text-slate-600 mb-8 pb-8 border-b border-slate-200">
                    <span className="font-medium text-slate-800">{blog.author.email.split('@')[0]}</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
            </header>

            <article className="prose prose-slate prose-lg max-w-none text-slate-800 whitespace-pre-wrap leading-relaxed mb-16 px-2">
                {blog.content}
            </article>

            <div className="flex items-center gap-4 py-6 border-y border-slate-100 mb-12">
                <LikeButton blogId={blog.id} initialLikeCount={blog._count.likes} />
            </div>

            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Comments ({comments.length})</h3>

                <form onSubmit={handlePostComment} className="mb-10 flex gap-3">
                    <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add to the discussion..."
                        className="flex-1 text-base py-6"
                        required
                        disabled={submittingComment}
                    />
                    <Button type="submit" isLoading={submittingComment} disabled={!newComment.trim()}>
                        Post
                    </Button>
                </form>

                <div className="space-y-2">
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                    {comments.length === 0 && (
                        <p className="text-center text-slate-500 py-8">No comments yet. Be the first to start the conversation!</p>
                    )}
                </div>
            </section>
        </div>
    );
}
