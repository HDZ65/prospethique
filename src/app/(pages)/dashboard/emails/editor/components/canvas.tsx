"use client";

import { useState } from "react";

export default function Canvas() {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {    

    }
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {

    }
    return (
        <div className="mt-20 flex justify-center">
            <div onDragOver={handleDragOver} onDrop={handleDrop} className="bg-white border border-neutral-200 rounded-md h-96 w-full p-6 max-w-2xl cursor-grab "> </div>
        </div>
    )
}
