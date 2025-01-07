export interface Config {
	/**
	 * Port to run stardustd on
	 * @default 4000
	 */
	port?: number;
	/**
	 * Host to run stardustd on
	 * @default 0.0.0.0
	 */
	host?: string;
	/**
	 * Run stardustd as a systemd/launchd service.
	 * @default true
	 */
	service?: boolean;
	docker: DockerConfig;
}

export interface DockerConfig {
	/**
	 * The type of connection to use to connect to the Docker daemon.
	 * @default `socket`
	 */
	type?: "http" | "socket";
	/**
	 * The path to the Docker socket to connect to, if using a socket connection.
	 * @default `/var/run/docker.sock`
	 */
	socket?: string;
	/**
	 * The host to connect to, if using an HTTP connection.
	 */
	host?: string;
	/**
	 * The port for the docker host, if using an HTTP connection.
	 */
	port?: number;
	/**
	 * The Docker network used for connecting to containers
	 * @default `stardust`
	 */
	network: string;
}
