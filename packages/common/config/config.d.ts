export interface Config {
	/**
	 * The URL of the database to connect to.
	 */
	databaseUrl: string;
	/**
	 * The public URL of your Stardust instance. Use this if you want to display site metadata.
	 */
	metadataUrl?: string;
	docker: DockerConfig;
	auth: AuthConfig;
	session?: SessionConfig;
}

export interface DockerConfig {
	/**
	 * The type of connection to use to connect to the Docker daemon.
	 * @default "socket"
	 */
	type?: "http" | "socket";
	/**
	 * The path to the Docker socket to connect to, if using a socket connection.
	 * @default "/var/run/docker.sock"
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
	 */
	network: string;
}

export interface AuthConfig {
	/**
	 * The JWT secret used to sign tokens.
	 **/
	secret: string;
	/**
	 * Cloudflare turnstile configuration. Leave `undefined` to disable turnstile.
	 **/
	turnstile?: TurnstileConfig;
	/**
	 * Credentials configuration. Leave `undefined` to disable user/password signups, or as `{}` to enable.
	 **/
	credentials?: {
		/**
		 * Whether to allow user signups.
		 * @default false
		 **/
		signups?: boolean;
	};
	/**
	 * OAuth configuration. Leave `undefined` to disable OAuth signups.
	 **/
	oauth?: {
		/**
		 * The OAuth providers to enable.
		 **/
		providers: {
			/**
			 * the provider name
			 **/
			[key: string]: {
				/**
				 * The client ID for the OAuth provider.
				 **/
				clientId: string;
				/**
				 * The client secret for the OAuth provider.
				 **/
				clientSecret: string;
				/**
				 * The OAuth provider's issuer, if applicable.
				 **/
				issuer?: string;
			};
		};
	};
}

export interface SessionConfig {
	/**
	 * The amount of time to keep an inactive session alive for, in minutes.
	 * @default 1440
	 */
	keepaliveDuration?: number;
	/**
	 * Dns servers for the container to use
	 * @default system default
	 */
	dnsServers?: string[];
	/**
	 * Session per user usage limit configuration
	 */
	usageLimits?: {
		instance?: number;
		user?: number;
	};
}

export interface TurnstileConfig {
	/**
	 * The Turnstile secret key, used by the backend
	 */
	secret: string;
	/**
	 * The Turnstile site key, used by the frontend
	 */
	siteKey: string;
}
