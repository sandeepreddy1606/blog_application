import { formatDistanceToNow } from 'date-fns';
import { Trash2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CommentItemProps {
    comment: {
        id: string;
        content: string;
        createdAt: string;
        user: {
            email: string;
        };
        replies?: any[];
    };
    canDelete?: boolean;
    onDelete?: (id: string) => void;
    onReply?: (parentId: string, content: string) => Promise<void>;
    isReply?: boolean;
}

export function CommentItem({ comment, canDelete, onDelete, onReply, isReply = false }: CommentItemProps) {
    const authorName = comment.user?.email ? comment.user.email.split('@')[0] : 'Unknown';
    const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (textRef.current) {
            if (textRef.current.scrollHeight > textRef.current.clientHeight) {
                setIsOverflowing(true);
            }
        }
    }, [comment.content]);

    const hasReplies = comment.replies && comment.replies.length > 0;

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setSubmitting(true);
        try {
            await onReply?.(comment.id, replyText);
            setReplyText('');
            setIsReplying(false);
            setShowReplies(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`py-4 ${isReply ? 'ml-8 md:ml-12 border-l-2 pl-4 border-slate-100 mt-2' : 'border-b border-slate-100 last:border-0'}`}>
            <div className="group flex justify-between items-start gap-4 hover:bg-slate-50/50 transition-colors px-4 rounded-lg -mx-4 py-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="font-semibold text-slate-900">{authorName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{formattedDate}</span>
                    </div>
                    <div>
                        <p
                            ref={textRef}
                            className={`text-slate-700 leading-relaxed break-words ${!isExpanded ? 'line-clamp-2' : ''}`}
                        >
                            {comment.content}
                        </p>
                        {isOverflowing && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-1"
                            >
                                {isExpanded ? 'Show less' : '... more'}
                            </button>
                        )}
                    </div>

                    {!isReply && (
                        <div className="flex items-center gap-4 mt-3">
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-amber-600 transition-colors"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Reply
                            </button>

                            {hasReplies && (
                                <button
                                    onClick={() => setShowReplies(!showReplies)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    {showReplies ? 'Hide Replies' : `View Replies (${comment.replies!.length})`}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {canDelete && (
                    <button
                        onClick={() => onDelete?.(comment.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 mt-1"
                        title="Delete Comment"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isReplying && (
                <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2 pl-4">
                    <Input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 text-sm py-4 h-9"
                        required
                        disabled={submitting}
                        autoFocus
                    />
                    <Button type="submit" isLoading={submitting} disabled={!replyText.trim()} className="h-9 px-4">
                        Reply
                    </Button>
                </form>
            )}

            {showReplies && comment.replies && (
                <div className="mt-2 space-y-1">
                    {comment.replies.map((reply: any) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            isReply={true}
                            canDelete={canDelete}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
