"use client";
import { create } from 'zustand';

interface PostContentStore {
    content: string;
    isExpanded: boolean;
    setContent: (content: string) => void;
    setIsExpanded: (isExpanded: boolean) => void;
    toggleExpanded: () => void;
}

export const usePostContent = create<PostContentStore>((set) => ({
    content: '',
    isExpanded: false,
    setContent: (content) => set({ content }),
    setIsExpanded: (isExpanded) => set({ isExpanded }),
    toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
})); 