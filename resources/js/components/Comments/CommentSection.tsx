import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    avatar_url: string | null;
}

interface Comment {
    id: number | string;
    user: User;
    content_html: string;
    time_ago: string;
    likes_count: number;
    replies_count: number;
    replies: Comment[];
}

interface CommentSectionProps {
    commentableType: string;
    commentableId: string | number;
}

function getCsrfToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]');

    return meta?.getAttribute('content') ?? '';
}

export function CommentSection({
    commentableType,
    commentableId,
}: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(
            `/comments?commentable_type=${encodeURIComponent(commentableType)}&commentable_id=${encodeURIComponent(commentableId)}`,
        )
            .then((res) => res.json())
            .then((data) => {
                setComments(data.data ?? data);
            })
            .catch(console.error)
            .finally(() => setIsFetching(false));
    }, [commentableType, commentableId]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newComment.trim()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    commentable_type: commentableType,
                    commentable_id: commentableId,
                    content: newComment,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setComments((prev) => [data.comment, ...prev]);
                setNewComment('');
            } else {
                setError(
                    data.error || data.message || "Une erreur s'est produite.",
                );
            }
        } catch (err) {
            console.error('Error posting comment:', err);
            setError('Impossible de se connecter au serveur.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Formulaire principal */}
            <form onSubmit={handleSubmit} className="group flex gap-3">
                <img
                    src="https://ui-avatars.com/api/?name=User&background=random"
                    alt="Vous"
                    className="mt-0.5 h-10 w-10 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-slate-900"
                />
                <div className="flex-1 space-y-2">
                    <div className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height =
                                    e.target.scrollHeight + 'px';
                            }}
                            placeholder="Partagez votre avis..."
                            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 pr-28 text-sm text-slate-800 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
                            rows={1}
                            style={{ minHeight: '48px', overflow: 'hidden' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e as any);
                                }
                            }}
                        />
                        <div className="absolute right-2 bottom-1.5 flex items-center gap-0.5 rounded-lg bg-white/60 p-1 backdrop-blur-sm dark:bg-slate-900/60">
                            <button
                                type="button"
                                onClick={() =>
                                    setNewComment((prev) => prev + '😊')
                                }
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                                title="Ajouter un emoji"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.8}
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !newComment.trim()}
                                className="rounded-lg p-1.5 text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300"
                                title="Publier le commentaire"
                            >
                                {isLoading ? (
                                    <svg
                                        className="h-5 w-5 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            strokeWidth="4"
                                            stroke="currentColor"
                                            strokeOpacity="0.25"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                            <svg
                                className="h-3.5 w-3.5 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </form>

            {/* Liste des commentaires */}
            {isFetching ? (
                <div className="flex justify-center py-8">
                    <div className="flex items-center gap-2 text-slate-500">
                        <svg
                            className="h-5 w-5 animate-spin text-emerald-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-sm font-medium">
                            Chargement des commentaires...
                        </span>
                    </div>
                </div>
            ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <svg
                        className="h-12 w-12 text-slate-300 dark:text-slate-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <p className="mt-4 text-sm font-medium">
                        Soyez le premier à commenter.
                    </p>
                    <p className="mt-1 text-xs">
                        Partagez votre avis ou posez une question.
                    </p>
                </div>
            ) : (
                <div className="relative">
                    <div
                        className={`space-y-4 ${
                            comments.length > 5
                                ? 'max-h-150 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 dark:hover:scrollbar-thumb-slate-500'
                                : ''
                        }`}
                        style={comments.length > 5 ? {
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgb(203 213 225) transparent',
                        } : undefined}
                    >
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                commentableType={commentableType}
                                commentableId={commentableId}
                            />
                        ))}
                    </div>
                    {comments.length > 5 && (
                        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-12 bg-linear-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80" />
                    )}
                </div>
            )}
        </div>
    );
}

function CommentItem({
    comment,
    depth = 0,
    commentableType,
    commentableId,
}: {
    comment: Comment;
    depth?: number;
    commentableType: string;
    commentableId: string | number;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [localReplies, setLocalReplies] = useState<Comment[]>(
        comment.replies || [],
    );
    const [localLikesCount, setLocalLikesCount] = useState(comment.likes_count);
    const [isReplying, setIsReplying] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [replyError, setReplyError] = useState<string | null>(null);

    const handleCloseReplyForm = () => {
        setShowReplyForm(false);
        setReplyContent('');
        setReplyError(null);
    };

    const handleToggleReplyForm = () => {
        if (showReplyForm) {
            handleCloseReplyForm();
        } else {
            setShowReplyForm(true);
        }
    };

    const handleReply = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!replyContent.trim()) {
            return;
        }

        setIsReplying(true);
        setReplyError(null);

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    commentable_type: commentableType,
                    commentable_id: commentableId,
                    parent_id: comment.id,
                    content: replyContent,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setLocalReplies((prev) => [...prev, data.comment]);
                setShowReplyForm(false);
                setReplyContent('');
                handleCloseReplyForm(); // ferme et vide le champ
            } else {
                setReplyError(
                    data.error ||
                        data.message ||
                        "Impossible d'ajouter la réponse.",
                );
            }
        } catch (error) {
            console.error('Error posting reply:', error);
            setReplyError('Erreur réseau de connexion au serveur.');
        } finally {
            setIsReplying(false);
        }
    };

    const handleLike = async () => {
        if (isLiking) {
            return;
        }

        setIsLiking(true);

        try {
            const response = await fetch(`/comments/${comment.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            if (response.ok) {
                const data = await response.json();
                setLocalLikesCount(data.likes_count);
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3"
        >
            {/* Avatar */}
            <img
                src={
                    comment.user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}&background=random`
                }
                alt={comment.user.name}
                className="mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-slate-900"
            />

            <div className="min-w-0 flex-1">
                <div className="group relative inline-block max-w-full rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-800 shadow-md shadow-slate-200/40 backdrop-blur-md transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/60 dark:bg-slate-800/80 dark:text-slate-200 dark:shadow-slate-900/40 dark:hover:shadow-slate-900/60">
                    <span className="mb-1.5 block text-xs font-semibold tracking-tight text-emerald-700 dark:text-emerald-400">
                        {comment.user.name}
                    </span>
                    <div
                        className="prose prose-sm max-w-none wrap-break-word text-slate-600 dark:text-slate-300"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(comment.content_html),
                        }}
                    />
                </div>

                {/* Actions sous la bulle */}
                <div className="mt-1.5 ml-1 flex items-center gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className="flex items-center gap-1 transition-colors hover:text-emerald-500 disabled:opacity-50"
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {localLikesCount > 0 && <span>{localLikesCount}</span>}
                    </button>
                    <button
                        onClick={handleToggleReplyForm}
                        className="flex items-center gap-1 transition-colors hover:text-emerald-500"
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            />
                        </svg>
                        Répondre
                    </button>
                    <span className="text-slate-400 tabular-nums">
                        {comment.time_ago}
                    </span>
                </div>

                {/* Formulaire de réponse inline avec animation */}
                <AnimatePresence>
                    {showReplyForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                                marginTop: 12,
                            }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="flex max-w-lg items-start gap-3">
                                <img
                                    src="https://ui-avatars.com/api/?name=User&background=random"
                                    alt="Vous"
                                    className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white dark:ring-slate-900"
                                />
                                <div className="flex-1">
                                    <div className="relative">
                                        <textarea
                                            autoFocus
                                            value={replyContent}
                                            onChange={(e) => {
                                                setReplyContent(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height =
                                                    e.target.scrollHeight +
                                                    'px';
                                            }}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'Enter' &&
                                                    !e.shiftKey
                                                ) {
                                                    e.preventDefault();
                                                    handleReply(e);
                                                }

                                                if (e.key === 'Escape') {
                                                    handleCloseReplyForm(); // ← au lieu de setShowReplyForm(false)
                                                }
                                            }}
                                            placeholder="Écrivez une réponse..."
                                            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2 pr-12 text-sm shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
                                            rows={1}
                                            style={{
                                                minHeight: '40px',
                                                overflow: 'hidden',
                                            }}
                                        />
                                        <button
                                            onClick={handleReply}
                                            disabled={
                                                isReplying ||
                                                !replyContent.trim()
                                            }
                                            className="absolute right-2 bottom-2 rounded-lg p-1 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                                        >
                                            {isReplying ? (
                                                <svg
                                                    className="h-5 w-5 animate-spin"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        opacity="0.25"
                                                    />
                                                    <path
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {replyError && (
                                        <p className="mt-2 ml-1 flex items-center gap-1 text-xs text-red-500">
                                            <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {replyError}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Réponses imbriquées */}
                {localReplies && localReplies.length > 0 && (
                    <div className="mt-3 space-y-3">
                        {localReplies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                depth={depth + 1}
                                commentableType={commentableType}
                                commentableId={commentableId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
