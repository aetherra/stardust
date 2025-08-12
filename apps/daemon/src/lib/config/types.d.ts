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
	/**
	 * Token used to authorize stardust servers. Uses an auto-generated token by default.
	 * Do not change unless you know what you're doing.
	 */
	token?: string;
	docker: DockerConfig;
	session: SessionConfig;
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
	 * Enable interconnectivity between containers.
	 * Do not enable unless you know what you're doing.
	 * @default false
	 */
	enableIcc?: boolean;
	// /**
	//  * Enable connectivity between containers and host.
	//  * Should be left off unless you are accessing an API on the host.
	//  * @default false
	//  */
	// enableCTHC?: boolean;
	/**
	 * The host to connect to, if using an HTTP connection.
	 */
	host?: string;
	/**
	 * The port for the docker host, if using an HTTP connection.
	 */
	port?: number;
	/**
	 * Protocol, if using an HTTP connection
	 */
	protocol?: "http" | "https";
	/**
	 * The Docker network used for connecting to containers
	 * @default `stardust`
	 */
	network: string;
}

export interface SessionConfig {
	/**
	 * Max number of sessions allowed on this instance
	 */
	limit?: number;
	/**
	 * Default VNC password to use. Defaults to randomly generated.
	 */
	vncPassword?: string;
	/**
	 * Doesn't unset $VNCPASSWORD in containers
	 */
	showVncPassword?: boolean;
	/**
	 * Maximum memory a container can use, in megabytes
	 * @default undefined
	 */
	memoryLimit?: number;
	/**
	 * Storage limit for containers in GB (in format nG, for example 25G)
	 * Only works if /var/lib/docker is XFS formatted with pquota enabled
	 */
	storageLimit?: string;
	/**
	 * DNS servers for the session to use.
	 */
	dnsServers?: string[];
	/**
	 * List of processes to block on containers.
	 * Useful if you want to stop the use of crypto miners or other resource hungry processes.
	 * Will also kill processes on the host. Will be overhauled later
	 */
	blockedProcessNames?: string[];
}
