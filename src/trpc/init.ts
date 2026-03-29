import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { cache } from 'react';
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { users } from '@/db/schema'
import {auth, currentUser} from "@clerk/nextjs/server"
import { ratelimit } from '@/lib/retelimit';


/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = cache(async () => {
  const {userId} = await auth();

  return { clerkUserId: userId };
});
 

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
  transformer: superjson,
  });
 
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;




export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
    const {ctx, next} = opts;

    if (!ctx.clerkUserId) {
        throw new TRPCError({code: "UNAUTHORIZED"});
    }

    const [user] = await db.select()
    .from(users).where(eq(users.clerkId, ctx.clerkUserId)).limit(1)
   
    
   
    if(!user){
        const clerkUser = await currentUser()
        if (!clerkUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    console.log({clerkUser} )
   

    //user = newUser;
        
    }
   const {success} = await ratelimit.limit(user.id)
   if(!success){
       throw new TRPCError({code: "TOO_MANY_REQUESTS"});
   }
    return next({
        ctx: {
            ...ctx,
          user,
        },
    });
});