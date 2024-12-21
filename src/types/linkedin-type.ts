import { z } from 'zod';
import { schemaLinkedin } from '@/schemas/linkedin-schema';
import { Timestamp } from 'firebase-admin/firestore';

export type LinkedInPostForm = z.infer<typeof schemaLinkedin>;

export type LinkedInPostResponse = LinkedInPostForm & {
  id: string;
  dateCreation: Timestamp;
  post: string;
};

