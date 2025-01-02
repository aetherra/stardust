import { getConfig } from "@stardust/config";
import Dockerode from "dockerode";
const { docker: config } = getConfig();
export const createDocker = () =>
	new Dockerode({
		socketPath: !config.type || config.type === "socket" ? config.socket || "/var/run/docker.sock" : undefined,
		host: config.type === "http" ? config.host : undefined,
		port: config.type === "http" ? config.port : undefined,
		protocol: config.type === "http" ? "http" : undefined,
	});
