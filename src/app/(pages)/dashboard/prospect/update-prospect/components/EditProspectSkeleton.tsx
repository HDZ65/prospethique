'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export const EditProspectSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-glass backdrop-blur-glass rounded-lg p-6 border border-white/10 shadow-glass max-w-2xl mx-auto"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-surface/80 border border-white/5">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="h-6 w-40 bg-surface/80 rounded-lg animate-pulse" />
                </div>

                <div className="space-y-5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-24 bg-surface/80 rounded animate-pulse" />
                            <div className="h-10 w-full bg-surface/80 rounded-lg animate-pulse" />
                        </div>
                    ))}

                    <div className="flex justify-end gap-4">
                        <div className="h-10 w-24 bg-surface/80 rounded-lg animate-pulse" />
                        <div className="h-10 w-32 bg-primary/30 rounded-lg animate-pulse" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}; 