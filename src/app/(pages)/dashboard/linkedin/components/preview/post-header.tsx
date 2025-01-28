import { ProfileImage } from '@dashboard/linkedin/components/preview/profile-image';
import { Button } from "@/components/ui/button";
import { auth } from '@/lib/auth/next-auth';
import { Separator } from "@/components/ui/separator";

export const PostHeader = async () => {
    const session = await auth();
    const user = session?.user;

    return (
        <div className="flex items-start justify-between">
            <div className="flex gap-2">
                {user?.image && (
                    <ProfileImage src={user.image} size={12} fallbackText="C" />
                )}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Devethique</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-muted-foreground">2e</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-tight">
                        Créateur de sites web sur-mesure et éco-responsable
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>1 j</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>🌐</span>
                    </div>
                </div>
            </div>
            <Button variant="outline" className="text-primary">
                Se connecter
            </Button>
        </div>
    );
}; 