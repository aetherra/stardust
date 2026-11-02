import "@stardust/config/load-config";

import { execSync } from "node:child_process";
import NextBundleAnalyzer from "@next/bundle-analyzer";
import { getConfig } from "@stardust/config";
import type { NextConfig } from "next";

const config = getConfig();
const nextConfig: NextConfig = {
	transpilePackages: ["@stardust/common"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
				port: "",
				pathname: "/**",
			},
		],
	},
	env: {
		GIT_COMMIT: process.env.NODE_ENV === "production" ? execSync("git rev-parse HEAD").toString().trim() : "DEVELOP",
		BUILD_DATE: Date.now().toString(),
	},
	experimental: {
		// typedRoutes: true,
		reactCompiler: true,
		authInterrupts: true,
		serverActions: {
			allowedOrigins: config.auth.trustedOrigins,
			bodySizeLimit: config.session?.uploadLimit || "10mb",
		},
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.node$/,
			loader: "node-loader",
		});
		return config;
	},
	allowedDevOrigins: config.auth.trustedOrigins,
};
export default NextBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig);
