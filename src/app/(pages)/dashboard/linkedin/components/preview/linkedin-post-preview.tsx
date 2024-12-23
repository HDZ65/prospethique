import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoreHorizontal } from 'lucide-react';
import { PostStats } from './profile-stats';
import { PostActions } from './post-actions';
import { PostHeader } from './post-header';
import { PostContent } from './post-content';
import { Button } from "@/components/ui/button";
import { ProfileImage } from "./profile-image";


export const LinkedInPostPreview = () => {
    return (
        <Card className="w-[555px] max-w-[555px]">
            <CardHeader className="p-4 pb-0 space-y-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ProfileImage src="/jacouille.jpg" size={6} fallbackText="T" />
                    <span className="font-medium">Thibaut Taglialatela</span>
                    <span>a commenté ceci</span>
                    <div className="ml-auto flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <span>✕</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <PostHeader />
                <PostContent />
                <PostStats />
                <PostActions />
            </CardContent>
        </Card>
    );
}; 