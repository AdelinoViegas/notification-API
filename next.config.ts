import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /*Estava testando o arquivo pode ser eliminado*/
  experimental:{
    serverActions:{
      bodySizeLimit: "4mb",
    }
  }
};

export default nextConfig;
