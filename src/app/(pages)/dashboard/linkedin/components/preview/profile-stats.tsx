import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PostStatsProps {
    reactions?: number;
    comments?: number;
    shares?: number;
}

export const PostStats = ({ 
    reactions = 37, 
    comments = 14, 
    shares = 1 
}: PostStatsProps) => (
    <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
                <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-blue-500">
                    👍
                </span>
                <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500">
                    ❤️
                </span>
                <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-yellow-500">
                    🎯
                </span>
            </div>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">
                {reactions}
            </Button>
        </div>
        <div className="flex items-center gap-2 text-[13px]">
            <Button variant="link" className="h-auto p-0 text-muted-foreground">
                {comments} commentaires
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="link" className="h-auto p-0 text-muted-foreground">
                {shares} republication
            </Button>
        </div>
    </div>
); 