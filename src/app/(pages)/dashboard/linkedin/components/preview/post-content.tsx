"use client";

import { Button } from "@/components/ui/button";
import { usePostContent } from '@dashboard/linkedin/hooks/use-post-content';

export const PostContent = () => {
    const { isExpanded, toggleExpanded, content } = usePostContent();

    const truncateText = (text: string) => {
        const lines = text.split('\n');
        return lines.length <= 3 ? text : lines.slice(0, 3).join('\n');
    };

    const formatText = (text: string) => {
        if (!text) return [];
        const emojiRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}])/u;
        
        return text.split('\n').map((paragraph, index) => {
            const emojiMatch = paragraph.match(emojiRegex);
            if (emojiMatch) {
                return (
                    <p key={index} className="text-[14px]">
                        <span className="text-[16px] mr-1">{emojiMatch[0]}</span>
                        <span className="font-medium">
                            {paragraph.replace(emojiRegex, '').trim()}
                        </span>
                    </p>
                );
            }
            return <p key={index} className="text-[14px]">{paragraph}</p>;
        });
    };

    const shouldShowMore = content.split('\n').length > 3;

    return (
        <div className="mt-3 space-y-1">
            <div className={`relative ${!isExpanded ? 'line-clamp-3' : ''}`}>
                {formatText(isExpanded ? content : truncateText(content))}
            </div>
            {shouldShowMore && (
                <Button
                    variant="link"
                    onClick={toggleExpanded}
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                >
                    {isExpanded ? 'Afficher moins' : '...Afficher plus'}
                </Button>
            )}
        </div>
    );
}; 