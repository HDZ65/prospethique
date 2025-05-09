"use client";

import { useScreenSize } from '@/contexts/ScreenSizeContext';
import React from 'react';

function Canvas() {
    const { screenSize } = useScreenSize();

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        try {
            const layoutTool = JSON.parse(data);
            console.log("Dropped item:", layoutTool);
        } catch (error) {
            console.error("Failed to parse dropped data:", error);
        }
    }

    return (
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`bg-white border border-neutral-200 rounded-md h-auto h-[80%] w-full p-6 transition-all duration-300 ease-in-out ${screenSize === 'desktop' ? 'max-w-2xl' : 'max-w-md'}`}
            >
                <p className="text-center text-neutral-400">Glissez-déposez un élément ici</p>
            </div>
    );
}

export default Canvas;
