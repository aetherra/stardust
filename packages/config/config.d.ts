export interface Config {
	/**
	 * Hostname to run stardust on
	 * @default 0.0.0.0
	 */
	hostname?: string;
	/**
	 * Port to run stardust on
	 * @default 3000
	 */
	port?: number;
	/**
	 * The URL of the database to connect to.
	 */
	databaseUrl: string;
	/**
	 * The public URL of your Stardust instance. Use this if you want to display site metadata.
	 */
	metadataUrl?: string;
	/**
	 * Configuration for nodes running `stardustd`
	 */
	nodes: NodeConfig[];

	auth: AuthConfig;
	session?: SessionConfig;
}

export interface NodeConfig {
	/**
	 * ID of the node. Make it a unique string that helps identify it. This MUST be under 16 characters or issues can happen.
	 */
	id: string;
	/**
	 * Hostname of the stardust node
	 * @default 0.0.0.0
	 */
	hostname?: string;
	/**
	 * Protocol to use for the node
	 * @default http
	 */
	proto?: "http" | "https";
	/**
	 * Port stardustd is running on.
	 * @default 4000
	 */
	port?: number;
	/**
	 * Authentication token for the node.
	 */
	token: string;
}

export interface AuthConfig {
	/**
	 * Trusted origins for authentication requests. Defaults to the origin header
	 */
	trustedOrigins?: string[];
	/**
	 * The JWT secret used to sign tokens.
	 **/
	secret: string;
	/**
	 * Cloudflare turnstile configuration. Leave `undefined` to disable turnstile.
	 **/
	turnstile?: TurnstileConfig;
	/**
	 * Credentials configuration.
	 **/
	credentials?: {
		/**
		 * To enable or disable email/password authentication.
		 * @default false
		 */
		enabled?: boolean;
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
			 * the provider name.
			 * Compatible providers:
			 * Apple
			 * Discord
			 * Facebook
			 * GitHub
			 * Google
			 * Hugging Face
			 * Kick
			 * Microsoft
			 * Slack
			 * Notion
			 * Tiktok
			 * Twitch
			 * Twitter (X)
			 * Dropbox
			 * Linear
			 * LinkedIn
			 * GitLab
			 * Reddit
			 * Roblox
			 * Spotify
			 * VK
			 * Zoom
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
				 * The OAuth provider's client key, if applicable.
				 */
				clientKey?: string;
				/**
				 * The OAuth provider's issuer, if applicable.
				 **/
				issuer?: string;
			};
		};
		customProviders?: CustomAuthConfig[];
	};
}

export interface SessionConfig {
	/**
	 * The amount of time to keep an inactive session alive for, in minutes.
	 * @default 1440
	 */
	keepaliveDuration?: number;
	/**
	 * Upload limit. Maximum size of a single file upload, in megabytes.
	 * increasing this limit can lead to consumption of excessive server resources in parsing large amounts of data, as well as potential DDoS attacks
	 * @default 10mb
	 * @example 25mb
	 */
	uploadLimit?: `${number}mb`;
	/**
	 * Session usage limit configuration
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

export interface CustomAuthConfig {
	/** Unique identifier for the OAuth provider */
	providerId: string;
	/**
	 * URL to fetch OAuth 2.0 configuration.
	 * If provided, the authorization and token endpoints will be fetched from this URL.
	 */
	discoveryUrl?: string;
	/**
	 * URL for the authorization endpoint.
	 * Optional if using discoveryUrl.
	 */
	authorizationUrl?: string;
	/**
	 * URL for the token endpoint.
	 * Optional if using discoveryUrl.
	 */
	tokenUrl?: string;
	/**
	 * URL for the user info endpoint.
	 * Optional if using discoveryUrl.
	 */
	userInfoUrl?: string;
	/** OAuth client ID */
	clientId: string;
	/** OAuth client secret */
	clientSecret: string;
	/**
	 * Array of OAuth scopes to request.
	 * @default []
	 */
	scopes?: string[];
	/**
	 * Custom redirect URI.
	 * If not provided, a default URI will be constructed.
	 */
	redirectURI?: string;
	/**
	 * OAuth response type.
	 * @default "code"
	 */
	responseType?: string;
	/**
   * The response mode to use for the authorization code request.

   */
	responseMode?: "query" | "form_post";
	/**
	 * Prompt parameter for the authorization request.
	 * Controls the authentication experience for the user.
	 */
	prompt?: "none" | "login" | "consent" | "select_account";
	/**
	 * Whether to use PKCE (Proof Key for Code Exchange)
	 * @default false
	 */
	pkce?: boolean;
	/**
	 * Access type for the authorization request.
	 * Use "offline" to request a refresh token.
	 */
	accessType?: string;
	/**
	 * Additional search-params to add to the authorizationUrl.
	 * Warning: Search-params added here overwrite any default params.
	 */
	authorizationUrlParams?: { [key: string]: string };
	/**
	 * Additional search-params to add to the tokenUrl.
	 * Warning: Search-params added here overwrite any default params.
	 */
	tokenUrlParams?: { [key: string]: string };
	/**
	 * Disable implicit sign up for new users. When set to true for the provider,
	 * sign-in need to be called with with requestSignUp as true to create new users.
	 */
	disableImplicitSignUp?: boolean;
	/**
	 * Disable sign up for new users.
	 */
	disableSignUp?: boolean;
	/**
	 * Authentication method for token requests.
	 * @default "post"
	 */
	authentication?: "basic" | "post";
	/**
	 * Custom headers to include in the discovery request.
	 * Useful for providers like Epic that require specific headers (e.g., Epic-Client-ID).
	 */
	discoveryHeaders?: { [key: string]: string };
	/**
	 * Custom headers to include in the authorization request.
	 * Useful for providers like Qonto that require specific headers (e.g., X-Qonto-Staging-Token for local development).
	 */
	authorizationHeaders?: { [key: string]: string };
	/**
	 * Override user info with the provider info.
	 *
	 * This will update the user info with the provider info,
	 * when the user signs in with the provider.
	 * @default false
	 */
	overrideUserInfo?: boolean;
}
