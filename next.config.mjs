/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "cloud.appwrite.io",
  //       port: "",
  //       pathname: "/my-bucket/**",
  //     },
  //   ],
  // },
  images: {
    domains: ["cloud.appwrite.io"],
  },
};

export default nextConfig;
