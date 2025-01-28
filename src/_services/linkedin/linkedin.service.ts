import { z } from "zod";
import { axiosInstance } from "@/config/axios.config";
import { PostLinkedInSchema } from "@/lib/schemas/linkedin.schema";

export const linkedInService = {
    publishPost: async (params: z.infer<typeof PostLinkedInSchema>) => {
        return axiosInstance.post('https://api.linkedin.com/v2/ugcPosts', {
            author: `urn:li:person:${params.userId}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: params.content
                    },
                    shareMediaCategory: 'NONE'
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        }, {
            headers: {
                'Authorization': `Bearer ${params.accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
            }
        });
    }
}; 