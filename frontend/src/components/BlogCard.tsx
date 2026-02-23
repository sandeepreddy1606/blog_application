import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Heart } from 'lucide-react';

interface BlogCardProps {
    blog: {
        title: string;
        summary: string | null;
        slug: string;
        createdAt: string;
        author: { email: string };
        _count: { likes: number; comments: number };
        isLikedByViewer?: boolean;
    };
}

export function BlogCard({ blog }: BlogCardProps) {
    const formattedDate = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });
    const authorName = blog.author.email.split('@')[0];

    return (
        <article className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-slate-200">
            <Link href={`/blog/${blog.slug}`} className="block group">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors overflow-hidden text-ellipsis whitespace-nowrap overflow-x-hidden w-full">
                    {blog.title}
                </h2>
                {blog.summary && (
                    <p className="mt-3 text-slate-600 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap overflow-x-hidden w-full">
                        {blog.summary}
                    </p>
                )}
            </Link>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">{authorName}</span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-1.5" title="Likes">
                        <Heart className={`w-4 h-4 ${blog.isLikedByViewer ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className={blog.isLikedByViewer ? 'text-red-600 font-medium' : ''}>{blog._count.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Comments">
                        <MessageCircle className="w-4 h-4" />
                        <span>{blog._count.comments}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
