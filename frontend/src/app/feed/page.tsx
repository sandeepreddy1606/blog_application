'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/Button';

interface FeedResponse {
    data: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export default function FeedPage() {
    const [feedParams, setFeedParams] = useState({ page: 1, limit: 10 });
    const [data, setData] = useState<FeedResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/public/feed?page=${feedParams.page}&limit=${feedParams.limit}`);
                setData(response.data);
            } catch (error) {
                console.error('Failed to load feed', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, [feedParams.page, feedParams.limit]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">Discover Stories</h1>
                <p className="text-lg text-slate-600">Insights, technology, and life by our community.</p>
            </div>

            {loading && !data ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 animate-pulse h-40"></div>
                    ))}
                </div>
            ) : data?.data.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-semibold text-slate-900">No stories found</h3>
                    <p className="text-slate-500 mt-2">Check back later when authors publish new content!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {data?.data.map((blog: any) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}

                    {data && data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
                            <Button
                                variant="secondary"
                                disabled={data.pagination.page <= 1}
                                onClick={() => setFeedParams(p => ({ ...p, page: p.page - 1 }))}
                            >
                                Previous
                            </Button>
                            <span className="text-sm font-medium text-slate-600">
                                Page {data.pagination.page} of {data.pagination.totalPages}
                            </span>
                            <Button
                                variant="secondary"
                                disabled={data.pagination.page >= data.pagination.totalPages}
                                onClick={() => setFeedParams(p => ({ ...p, page: p.page + 1 }))}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
