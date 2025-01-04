import { execSync } from "node:child_process";
import NextBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
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
		ppr: true,
		webpackBuildWorker: true,
		reactCompiler: true,
		serverActions: {
			allowedOrigins: ["localhost:3000", "*.use.devtunnels.ms"],
		},
	},
	webpack(config, { webpack }) {
		config.module.rules.push({
			test: /\.node$/,
			loader: "node-loader",
		});
		config.plugins.push(
			new webpack.IgnorePlugin({
				resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
			}),
		);
		return config;
	},
};
export default NextBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig);
