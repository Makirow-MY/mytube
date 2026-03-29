'use client';
 
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import superjson from "superjson"
import type { AppRouter } from './routers/_app';
 
//export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
 export const trpc = createTRPCReact<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
 // if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}
 
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.DEFAULT_URL) return `https://${process.env.DEFAULT_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}
 
export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
 
  const [trpcClient] = useState(() =>
   trpc.createClient({
      links: [
        httpBatchLink({
        transformer: superjson,
          url: getUrl(),
          async headers() {
            const headers = new Headers()
            headers.set("x-trpc-source", "nextjs-react")
            return  headers;
          }
        }),
      ],  
    }),
  );
 
  return (
     <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    </trpc.Provider>
  );
}