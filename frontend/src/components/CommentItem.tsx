import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
    comment: {
        id: string;
        content: string;
        createdAt: string;
        user: {
            email: string;
        };
    };
}

export function CommentItem({ comment }: CommentItemProps) {
    const authorName = comment.user?.email ? comment.user.email.split('@')[0] : 'Unknown';
    const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    return (
        <div className="py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-4 rounded-lg -mx-4">
            <div className="flex items-center gap-2 text-sm mb-2">
                <span className="font-semibold text-slate-900">{authorName}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{formattedDate}</span>
            </div>
            <p className="text-slate-700 leading-relaxed break-words">{comment.content}</p>
        </div>
    );
}
