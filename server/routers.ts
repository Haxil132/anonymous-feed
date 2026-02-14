import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { getClientIP, logIP } from "./ipLogger";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  posts: router({
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        description: z.string().min(1),
        mediaFile: z.object({
          data: z.string(), // base64 encoded
          type: z.string(),
          extension: z.string(),
        }).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = getClientIP(ctx.req);
        
        let mediaUrl: string | undefined;
        let mediaType: string | undefined;
        
        // Upload media to S3 if provided
        if (input.mediaFile) {
          const buffer = Buffer.from(input.mediaFile.data, 'base64');
          const randomSuffix = Math.random().toString(36).substring(7);
          const fileKey = `posts/${Date.now()}-${randomSuffix}.${input.mediaFile.extension}`;
          
          const result = await storagePut(fileKey, buffer, input.mediaFile.type);
          mediaUrl = result.url;
          mediaType = input.mediaFile.type.startsWith('image/') ? 'image' :
                      input.mediaFile.type.startsWith('video/') ? 'video' :
                      input.mediaFile.type.startsWith('audio/') ? 'audio' : 'file';
        }
        
        // Create post in database
        await db.createPost({
          title: input.title,
          description: input.description,
          mediaUrl,
          mediaType,
          ipAddress,
        });
        
        // Log IP address
        logIP(ipAddress, 'CREATE_POST', `Title: ${input.title}`);
        
        // Notify owner
        await notifyOwner({
          title: 'Новый пост создан',
          content: `Заголовок: ${input.title}\n\nОписание: ${input.description.substring(0, 100)}${input.description.length > 100 ? '...' : ''}\n\nIP: ${ipAddress}`,
        });
        
        return { success: true };
      }),
    
    list: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input, ctx }) => {
        const ipAddress = getClientIP(ctx.req);
        const postsList = await db.getPosts(input.limit, input.offset);
        
        // Enrich posts with like count, comment count, and user's like status
        const enrichedPosts = await Promise.all(
          postsList.map(async (post) => {
            const [likeCount, commentCount, hasLiked] = await Promise.all([
              db.getLikeCount(post.id),
              db.getCommentCount(post.id),
              db.hasUserLikedPost(post.id, ipAddress),
            ]);
            
            return {
              ...post,
              likeCount,
              commentCount,
              hasLiked,
            };
          })
        );
        
        return enrichedPosts;
      }),
  }),

  likes: router({
    toggle: publicProcedure
      .input(z.object({
        postId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = getClientIP(ctx.req);
        
        const result = await db.addLike({
          postId: input.postId,
          ipAddress,
        });
        
        const likeCount = await db.getLikeCount(input.postId);
        
        return {
          success: true,
          alreadyLiked: result.alreadyLiked,
          likeCount,
        };
      }),
  }),

  comments: router({
    create: publicProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1).max(1000),
      }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = getClientIP(ctx.req);
        
        await db.addComment({
          postId: input.postId,
          content: input.content,
          ipAddress,
        });
        
        return { success: true };
      }),
    
    list: publicProcedure
      .input(z.object({
        postId: z.number(),
      }))
      .query(async ({ input }) => {
        const commentsList = await db.getCommentsByPostId(input.postId);
        return commentsList;
      }),
  }),
});

export type AppRouter = typeof appRouter;
