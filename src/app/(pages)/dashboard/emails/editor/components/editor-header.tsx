"use client";
import { Mail, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useScreenSize, ScreenSizeType } from "@/contexts/ScreenSizeContext";
import { DeviceToggle } from "@/components/shared/DeviceToggle";
import { cn } from "@/lib/utils";

export default function EditorHeader() {
    const { screenSize, setScreenSize } = useScreenSize();

    const handleScreenSizeChange = (newSize: string) => {
        if (newSize === 'desktop' || newSize === 'mobile') {
            setScreenSize(newSize as ScreenSizeType);
        }
    };

    return (
        <div className="px-4 py-3 border-b bg-background shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                        <Mail className="h-3 w-3" />
                    </div>
                    <h1 className="text-xl font-semibold">
                        Éditer un email
                    </h1>
                </div>
                <DeviceToggle value={screenSize} onValueChange={handleScreenSizeChange} />
                <div className="flex items-center gap-2">
                    <Button  variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        Programmer
                    </Button>
                    <Button >
                        <div className="relative h-5 w-5">
                            <Image src="/send.png" alt="Send" fill className="mr-1" />
                        </div>
                        Envoyer
                    </Button>
                </div>
            </div>
        </div>
    );
}