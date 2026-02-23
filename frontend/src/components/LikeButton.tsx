'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
    blogId: string;
    initialLikeCount: number;
    initialLikedStatus?: boolean;
}

export function LikeButton({ blogId, initialLikeCount, initialLikedStatus = false }: LikeButtonProps) {
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [liked, setLiked] = useState(initialLikedStatus);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggleLike = async () => {
        if (!getToken()) {
            router.push('/login');
            return;
        }

        // Optimistic Update
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));
        setLoading(true);

        try {
            if (newLikedState) {
                await api.post(`/blogs/${blogId}/like`);
            } else {
                await api.delete(`/blogs/${blogId}/like`);
            }
        } catch (error: any) {
            if (error?.response?.status === 409 && newLikedState) {
                // User already liked it, local state was out of sync. Revert the +1 count.
                setLikeCount((prev) => prev - 1);
            } else if (error?.response?.status === 404 && !newLikedState) {
                // User already unliked it, local state was out of sync. Revert the -1 count.
                setLikeCount((prev) => prev + 1);
            } else {
                // Revert Optimistic Update completely on other failures
                setLiked(!newLikedState);
                setLikeCount((prev) => (!newLikedState ? prev + 1 : prev - 1));
                console.error('Failed to toggle like', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleLike}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${liked
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
        >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likeCount} Likes</span>
        </button>
    );
}
