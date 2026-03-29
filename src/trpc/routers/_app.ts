//import { CategoriesRouter } from '@/modules/categories/server/procedures';
import { CategoriesRouter } from '@/modules/categories/server/procedures';
import { protectedProcedure, createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videosViewsRouter } from '@/modules/video-views/server/procedures';
import { videosReactionsRouter } from '@/modules/video-reactions/server/procedures';
 
export const appRouter = createTRPCRouter({
  categories: CategoriesRouter,
  studio: studioRouter,
  videos: videosRouter,
  videoReactions: videosReactionsRouter,
  videoViews: videosViewsRouter,
});
 
// export type definition of API
export type AppRouter = typeof appRouter;