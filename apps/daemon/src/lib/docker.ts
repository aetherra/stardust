import Dockerode from "dockerode";
import { getConfig } from "~/lib/config/index.js";
const { docker: config } = getConfig();
const socketConfig: Dockerode.DockerOptions = { socketPath: config.socket || "/var/run/docker.sock" };
const httpConfig: Dockerode.DockerOptions = {
	host: config.host,
	port: config.port,
	protocol: config.protocol || "http",
};
const dockerodeConfig =
	config.type === "http" ? httpConfig : !config.type || config.type === "socket" ? socketConfig : {};

export const docker = new Dockerode(dockerodeConfig);
