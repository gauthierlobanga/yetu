// 'use client';

// import { AnimatePresence, motion } from 'framer-motion';
// import { Search, X } from 'lucide-react';
// import { useState } from 'react';

// type ExpandingSearchDockProps = {
//     onSearch?: (query: string) => void;
//     placeholder?: string;
// };

// export function ExpandingSearchDock({
//     onSearch,
//     placeholder = 'Search...',
// }: ExpandingSearchDockProps) {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [query, setQuery] = useState('');

//     const handleExpand = () => {
//         setIsExpanded(true);
//     };

//     const handleCollapse = () => {
//         setIsExpanded(false);
//         setQuery('');
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (onSearch && query) {
//             onSearch(query);
//         }
//     };

//     return (
//         <div className="relative">
//             <AnimatePresence mode="wait">
//                 {!isExpanded ? (
//                     <motion.button
//                         key="icon"
//                         initial={{ scale: 0, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0, opacity: 0 }}
//                         onClick={handleExpand}
//                         className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
//                     >
//                         <Search className="h-5 w-5" />
//                     </motion.button>
//                 ) : (
//                     <motion.form
//                         key="input"
//                         initial={{ width: 48, opacity: 0 }}
//                         animate={{ width: 320, opacity: 1 }}
//                         exit={{ width: 48, opacity: 0 }}
//                         transition={{
//                             type: 'spring',
//                             stiffness: 300,
//                             damping: 30,
//                         }}
//                         onSubmit={handleSubmit}
//                         className="relative"
//                     >
//                         <motion.div
//                             initial={{ backdropFilter: 'blur(0px)' }}
//                             animate={{ backdropFilter: 'blur(12px)' }}
//                             className="relative flex items-center gap-2 overflow-hidden rounded-full border border-border bg-card/80 backdrop-blur-md"
//                         >
//                             <div className="ml-4">
//                                 <Search className="h-4 w-4 text-muted-foreground" />
//                             </div>
//                             <input
//                                 type="text"
//                                 value={query}
//                                 onChange={(e) => setQuery(e.target.value)}
//                                 placeholder={placeholder}
//                                 autoFocus
//                                 className="h-12 flex-1 bg-transparent pr-4 text-sm outline-none placeholder:text-muted-foreground"
//                             />
//                             <motion.button
//                                 type="button"
//                                 onClick={handleCollapse}
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 className="mr-2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
//                             >
//                                 <X className="h-4 w-4" />
//                             </motion.button>
//                         </motion.div>
//                     </motion.form>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

type ExpandingSearchDockProps = {
    onSearch?: (query: string) => void;
    placeholder?: string;
};

export function ExpandingSearchDock({
    onSearch,
    placeholder = 'Rechercher…',
}: ExpandingSearchDockProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState('');

    const handleExpand = () => setIsExpanded(true);

    const handleCollapse = () => {
        setIsExpanded(false);
        setQuery('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (onSearch && query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.button
                        key="icon"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={handleExpand}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200/60 bg-white text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-400 dark:hover:border-emerald-600 dark:hover:bg-slate-800"
                    >
                        <Search className="h-5 w-5" />
                    </motion.button>
                ) : (
                    <motion.form
                        key="input"
                        initial={{ width: 48, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 48, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                        onSubmit={handleSubmit}
                        className="relative"
                    >
                        <motion.div
                            initial={{ backdropFilter: 'blur(0px)' }}
                            animate={{ backdropFilter: 'blur(16px)' }}
                            className="relative flex items-center gap-2 overflow-hidden rounded border border-emerald-200/70 bg-white/80 backdrop-blur-xl transition-colors focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/80 dark:focus-within:border-emerald-500 dark:focus-within:ring-emerald-800"
                        >
                            <div className="ml-4">
                                <Search className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={placeholder}
                                autoFocus
                                className="h-9 flex-1 bg-transparent pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                            />
                            <motion.button
                                type="button"
                                onClick={handleCollapse}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="mr-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                            >
                                <X className="h-4 w-4" />
                            </motion.button>
                        </motion.div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
