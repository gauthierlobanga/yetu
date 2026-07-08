/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Sparkles,
    Trash2,
    Loader2,
    ArrowUpIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
} from '@/components/ui/input-group';
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerProvider,
    MessageScrollerViewport,
} from '@/components/ui/message-scroller';
import getToastStyle from '@/lib/toast-style';
import { cn } from '@/lib/utils';

const ASSISTANT_NAME = 'Assistant Yetu';
const ASSISTANT_AVATAR_FALLBACK = 'Y';

export function FloatingChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<
        { role: string; content: string }[]
    >([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) {
            return;
        }

        const userMessage = { role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: input.trim(),
                    conversation_id: conversationId,
                }),
            });

            if (!res.ok) {
                throw new Error(`Erreur ${res.status}`);
            }

            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.content },
            ]);
            setConversationId(data.conversation_id);
        } catch (err) {
            toast.error('Impossible de contacter l’assistant.', {
                style: getToastStyle('error'),
            });
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        setConversationId(null);
        toast.success('Conversation effacée.', {
            style: getToastStyle('success'),
        });
    };

    return (
        <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-window"
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.95,
                            transformOrigin: 'bottom right',
                        }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="flex max-h-250 w-96 flex-col overflow-hidden rounded-xl border bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950"
                    >
                        {/* Header épuré */}
                        <div className="flex items-center justify-between border-b px-5 py-3 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border dark:border-slate-700">
                                    <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                        {ASSISTANT_AVATAR_FALLBACK}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {ASSISTANT_NAME}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        En ligne
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={clearChat}
                                    aria-label="Effacer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={toggleOpen}
                                    aria-label="Fermer"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Message scroller */}
                        <div className="min-h-0 flex-1">
                            <MessageScrollerProvider>
                                <MessageScroller>
                                    <MessageScrollerViewport className="px-4 py-2">
                                        <MessageScrollerContent
                                            aria-busy={loading}
                                        >
                                            {messages.length === 0 && (
                                                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                                                    <div className="mb-3 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                                                        <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <p className="text-sm font-medium">
                                                        Assistant Yetu
                                                    </p>
                                                    <p className="mt-1 max-w-50 text-xs text-muted-foreground">
                                                        Posez une question sur
                                                        votre boutique.
                                                    </p>
                                                </div>
                                            )}
                                            <AnimatePresence initial={false}>
                                                {messages.map((msg, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                        className={`mb-4 flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                                    >
                                                        <Avatar className="h-8 w-8 shrink-0">
                                                            <AvatarFallback
                                                                className={
                                                                    msg.role ===
                                                                    'assistant'
                                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                                                        : 'bg-slate-200 dark:bg-slate-700'
                                                                }
                                                            >
                                                                {msg.role ===
                                                                'assistant'
                                                                    ? ASSISTANT_AVATAR_FALLBACK
                                                                    : 'M'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div
                                                            className={cn(
                                                                'max-w-[80%]',
                                                                msg.role ===
                                                                    'user' &&
                                                                    'items-end',
                                                            )}
                                                        >
                                                            <span className="text-xs text-muted-foreground">
                                                                {msg.role ===
                                                                'assistant'
                                                                    ? ASSISTANT_NAME
                                                                    : 'Vous'}
                                                            </span>
                                                            <div
                                                                className={cn(
                                                                    'mt-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                                                                    msg.role ===
                                                                        'user'
                                                                        ? 'rounded-tr-md bg-emerald-600 text-white'
                                                                        : 'rounded-tl-md bg-slate-100 dark:bg-slate-800',
                                                                )}
                                                            >
                                                                {msg.content}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                {loading && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        className="mb-4 flex gap-3"
                                                    >
                                                        <Avatar className="h-8 w-8 shrink-0">
                                                            <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                                                {
                                                                    ASSISTANT_AVATAR_FALLBACK
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 dark:bg-slate-800">
                                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </MessageScrollerContent>
                                    </MessageScrollerViewport>
                                    <MessageScrollerButton />
                                </MessageScroller>
                            </MessageScrollerProvider>
                        </div>

                        {/* Input area avec bouton à droite et hauteur élargie */}
                        <div className="border-t p-3 dark:border-slate-800">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                            >
                                <InputGroup>
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        placeholder="Votre message..."
                                        rows={1}
                                        disabled={loading}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        className="min-h-12 w-full resize-none border-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
                                    />
                                    <InputGroupAddon
                                        align="block-end"
                                        className="pr-2 pb-2"
                                    >
                                        <InputGroupButton
                                            type="submit"
                                            variant="default"
                                            size="icon-sm"
                                            disabled={loading || !input.trim()}
                                            className="rounded-full"
                                        >
                                            {loading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <ArrowUpIcon className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Envoyer
                                                    </span>
                                                </>
                                            )}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bouton flottant minimaliste */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOpen}
                className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors',
                    isOpen
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700',
                )}
                aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <MessageSquare className="h-5 w-5" />
                )}
            </motion.button>
        </div>
    );
}
