import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
         protocol:"https",
         hostname:"image.mux.com"
      },
       {
         protocol:"https",
         hostname:"utfs.io"
      },
      {
        protocol:"https",
         hostname:"lnhbg16q41.ufs.sh"
      },
    ],
  },
  eslint: {
    // Warning: this allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
