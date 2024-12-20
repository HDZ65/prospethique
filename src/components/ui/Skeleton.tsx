'use client';

export const Skeleton = () => {
    return (
        <div
            className="bg-gradient-glass backdrop-blur-glass rounded-lg border border-white/10 shadow-glass overflow-hidden w-3/5"
        >
            {/* Header Skeleton */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface/80 animate-pulse" />
                        <div className="h-6 w-40 bg-surface/80 rounded animate-pulse" />
                    </div>
                    <div className="w-32 h-9 bg-surface/80 rounded-lg animate-pulse" />
                </div>
                {/* Search Bar Skeleton */}
                <div className="w-full h-10 bg-surface/80 rounded-lg animate-pulse mt-4" />
            </div>

            {/* List Items Skeleton */}
            <div className="divide-y divide-white/10">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-5 w-48 bg-surface/80 rounded animate-pulse" />
                                    <div className="h-5 w-20 bg-surface/80 rounded-full animate-pulse" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-4 w-32 bg-surface/80 rounded animate-pulse" />
                                    <div className="h-4 w-32 bg-surface/80 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-24 bg-surface/80 rounded animate-pulse" />
                                <div className="h-8 w-24 bg-surface/80 rounded animate-pulse" />
                                <div className="h-8 w-24 bg-surface/80 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 