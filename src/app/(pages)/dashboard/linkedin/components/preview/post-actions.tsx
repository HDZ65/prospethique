import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Repeat2, Send } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

export const PostActions = () => (
    <div className="border-t mt-2">
        <div className="flex items-stretch">
            <Button variant="ghost" className="flex-1 gap-2">
                <ThumbsUp className="h-[18px] w-[18px]" />
                <span className="text-[13px] font-medium">J&apos;aime</span>
            </Button>
            <Separator orientation="vertical" />
            <Button variant="ghost" className="flex-1 gap-2">
                <MessageSquare className="h-[18px] w-[18px]" />
                <span className="text-[13px] font-medium">Commenter</span>
            </Button>
            <Separator orientation="vertical" />
            <Button variant="ghost" className="flex-1 gap-2">
                <Repeat2 className="h-[18px] w-[18px]" />
                <span className="text-[13px] font-medium">Republier</span>
            </Button>
            <Separator orientation="vertical" />
            <Button variant="ghost" className="flex-1 gap-2">
                <Send className="h-[18px] w-[18px]" />
                <span className="text-[13px] font-medium">Envoyer</span>
            </Button>
        </div>
    </div>
); 