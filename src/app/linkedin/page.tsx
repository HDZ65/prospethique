"use client"
import { useState } from 'react';
import { LinkedInPostPreview } from "@/components/LinkedInPostPreview";
import { PostLinkedinForm } from "@/components/postLinkedinForm";

export default function Page() {
  const [postContent, setPostContent] = useState<string>('');

  const handlePostGenerated = (post: string) => {
    setPostContent(post);
  };


  return (
    <div className="container mx-auto py-24 flex gap-8 px-4 sm:px-6 lg:px-8">
      <PostLinkedinForm onPostGenerated={handlePostGenerated}/>
      <LinkedInPostPreview content={postContent} />
    </div>
  );
}