import { PostLinkedinForm } from "@dashboard/linkedin/components/form/post-linkedin-form";
import { LinkedInPostPreview } from "@dashboard/linkedin/components/preview/linkedin-post-preview";

export default function LinkedInPage() {
    return (
        <div className="container mx-auto py-24 flex gap-8 px-4 sm:px-6 lg:px-8">
            <PostLinkedinForm />
            <LinkedInPostPreview />
        </div>
    );
}