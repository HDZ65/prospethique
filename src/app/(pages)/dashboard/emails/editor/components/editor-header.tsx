import { Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function EditorHeader() {
    return (
        <div className="px-4 py-3 border-b bg-background shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                        <Mail className="h-4 w-4" />
                    </div>
                    <h1 className="text-xl font-semibold">
                        Éditer un email
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="lg" variant="outline">
                        <Image src="/clock.png" alt="Clock" width={24} height={24} />
                        Programmer
                    </Button>
                    <Button size="lg">
                        <Image src="/send.png" alt="Send" width={24} height={24} />
                        Envoyer
                    </Button>
                </div>
            </div>
        </div>
    );
}