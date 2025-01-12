"use client";
import RFB, { type NoVncCredentials, type NoVncEvents, type NoVncOptions } from "@novnc/novnc/lib/rfb";
import { type ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";

export type rfbOptions = Partial<NoVncOptions>;

export type VncViewerProps = {
	url: string;
	style?: object;
	className?: string;
	viewOnly?: boolean;
	rfbOptions?: rfbOptions;
	focusOnClick?: boolean;
	clipViewport?: boolean;
	dragViewport?: boolean;
	scaleViewport?: boolean;
	resizeSession?: boolean;
	showDotCursor?: boolean;
	background?: string;
	qualityLevel?: number;
	compressionLevel?: number;
	autoConnect?: boolean;
	retryDuration?: number;
	debug?: boolean;
	loader?: ReactNode;
	onConnect?: (rfb?: RFB) => void;
	onDisconnect?: (rfb?: RFB) => void;
	onCredentialsRequired?: (rfb?: RFB) => void;
	onSecurityFailure?: (e?: {
		detail: { status: number; reason: string };
	}) => void;
	onClipboard?: (e?: { detail: { text: string } }) => void;
	onBell?: () => void;
	onDesktopName?: (e?: { detail: { name: string } }) => void;
	onCapabilities?: (e?: {
		detail: { capabilities: RFB["capabilities"] };
	}) => void;
};

export type VncViewerHandle = {
	connect: () => void;
	disconnect: () => void;
	connected: boolean;
	sendCredentials: (credentials: NoVncCredentials) => void;
	sendKey: (keysym: number, code: string, down?: boolean) => void;
	sendCtrlAltDel: () => void;
	focus: () => void;
	blur: () => void;
	machineShutdown: () => void;
	machineReboot: () => void;
	machineReset: () => void;
	clipboardPaste: (text: string) => void;
	rfb: RFB | null;
	eventListeners: EventListeners;
};

export type EventListeners = {
	// biome-ignore lint: lint/suspicious/noExplicitAny
	-readonly [key in keyof typeof Events]?: (e?: any) => void;
};
// biome-ignore lint: whar
export enum Events {
	connect,
	disconnect,
	credentialsrequired,
	securityfailure,
	clipboard,
	bell,
	desktopname,
	capabilities,
}
const VncScreen = ({
	url,
	style,
	className,
	viewOnly,
	rfbOptions,
	focusOnClick,
	clipViewport,
	dragViewport,
	scaleViewport,
	resizeSession,
	showDotCursor,
	background,
	qualityLevel,
	compressionLevel,
	autoConnect = true,
	retryDuration = 3000,
	debug = false,
	loader,
	onConnect,
	onDisconnect,
	onCredentialsRequired,
	onSecurityFailure,
	onClipboard,
	onBell,
	onDesktopName,
	onCapabilities,
	ref,
}: VncViewerProps & { ref: React.Ref<VncViewerHandle> }) => {
	const rfb = useRef<RFB | null>(null);
	const connected = useRef<boolean>(autoConnect);
	const timeouts = useRef<Array<ReturnType<typeof setTimeout>>>([]);
	const eventListeners = useRef<EventListeners>({});
	const screen = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const logger = {
		log: (...args: string[]) => {
			if (debug) console.log(...args);
		},
		info: (...args: string[]) => {
			if (debug) console.info(...args);
		},
		error: (...args: string[]) => {
			if (debug) console.error(...args);
		},
	};
	const getRfb = () => rfb.current;
	// biome-ignore lint: someone was insane, i didn't write most of this
	const setRfb = (_rfb: RFB | null) => (rfb.current = _rfb);

	const getConnected = () => connected.current;

	// biome-ignore lint: someone was insane, i didn't write most of this
	const setConnected = (state: boolean) => (connected.current = state);

	const _onConnect = () => {
		const rfb = getRfb();

		if (onConnect) {
			onConnect(rfb ?? undefined);
			setLoading(false);
		}

		logger.info("Connected to remote VNC.");
		setLoading(false);
	};

	const _onDisconnect = () => {
		const rfb = getRfb();

		if (onDisconnect) {
			onDisconnect(rfb ?? undefined);
			setLoading(true);
		}

		const connected = getConnected();

		if (connected) {
			logger.info(`Unexpectedly disconnected from remote VNC, retrying in ${retryDuration / 1000} seconds.`);

			timeouts.current.push(setTimeout(connect, retryDuration));
		} else {
			logger.info("Disconnected from remote VNC.");
		}

		setLoading(true);
	};

	const _onCredentialsRequired = () => {
		const rfb = getRfb();

		if (onCredentialsRequired) onCredentialsRequired(rfb ?? undefined);

		const password = rfbOptions?.credentials?.password ?? prompt("Password Required:");

		if (password) rfb?.sendCredentials({ password: password } as NoVncCredentials);
	};

	const _onDesktopName = (e: { detail: { name: string } }) => {
		if (onDesktopName) onDesktopName(e);

		logger.info(`Desktop name is ${e.detail.name}`);
	};

	const disconnect = () => {
		let rfb = getRfb();

		try {
			if (rfb) {
				for (const timeout of timeouts.current) {
					clearTimeout(timeout);
				}
				const eventKeys = Object.keys(eventListeners.current) as (keyof typeof Events)[];

				for (let i = 0; i < eventKeys.length; i++) {
					const event = eventKeys[i];
					if (eventListeners.current[event]) {
						// biome-ignore lint: lint/suspicious/noExplicitAny
						rfb?.removeEventListener(event, eventListeners.current[event] as any);
						eventListeners.current[event] = undefined;
					}
				}
				try {
					rfb.disconnect();
				} catch (e) {
					console.info("disconnect error, this is normally not an issue.");
				}
				rfb = null;
				setRfb(null);
				setConnected(false);

				// NOTE: This needs to be called since the event listener is removed.
				// Even if the event listener is removed after rfb.disconnect(), the disconnect
				// event is not fired.
				_onDisconnect();
			}
		} catch (error) {
			logger.error(error as string);
			setRfb(null);
			setConnected(false);
		}
	};

	const connect = () => {
		try {
			if (connected && !!rfb) disconnect();

			if (screen.current) {
				screen.current.innerHTML = "";

				const _rfb = new RFB(
					screen.current,
					`${window.location.protocol.replace("http", "ws")}//${window.location.host}${url}`,
					rfbOptions,
				);

				_rfb.viewOnly = viewOnly ?? false;
				_rfb.focusOnClick = focusOnClick ?? true;
				_rfb.clipViewport = clipViewport ?? false;
				_rfb.dragViewport = dragViewport ?? false;
				_rfb.resizeSession = resizeSession ?? false;
				_rfb.scaleViewport = scaleViewport ?? false;
				_rfb.showDotCursor = showDotCursor ?? false;
				_rfb.background = background ?? "";
				_rfb.qualityLevel = qualityLevel ?? 6;
				_rfb.compressionLevel = compressionLevel ?? 2;
				setRfb(_rfb);

				eventListeners.current.connect = _onConnect;
				eventListeners.current.disconnect = _onDisconnect;
				eventListeners.current.credentialsrequired = _onCredentialsRequired;
				eventListeners.current.securityfailure = onSecurityFailure;
				eventListeners.current.clipboard = onClipboard;
				eventListeners.current.bell = onBell;
				eventListeners.current.desktopname = _onDesktopName;
				eventListeners.current.capabilities = onCapabilities;
				const eventKeys = Object.keys(eventListeners.current) as (keyof typeof Events)[];

				for (let i = 0; i < eventKeys.length; i++) {
					const event = eventKeys[i];
					if (eventListeners.current[event]) {
						// biome-ignore lint: lint/suspicious/noExplicitAny
						_rfb.addEventListener(event as keyof NoVncEvents, eventListeners.current[event] as any);
					}
				}

				setConnected(true);
			}
		} catch (error) {
			logger.error(error as string);
		}
	};

	const sendCredentials = (credentials: NoVncCredentials) => {
		const rfb = getRfb();
		rfb?.sendCredentials(credentials);
	};

	const sendKey = (keysym: number, code: string, down?: boolean) => {
		const rfb = getRfb();
		rfb?.sendKey(keysym, code, down);
	};

	const sendCtrlAltDel = () => {
		const rfb = getRfb();
		rfb?.sendCtrlAltDel();
	};

	const focus = () => {
		const rfb = getRfb();
		rfb?.focus();
	};

	const blur = () => {
		const rfb = getRfb();
		rfb?.blur();
	};

	const machineShutdown = () => {
		const rfb = getRfb();
		rfb?.machineShutdown();
	};

	const machineReboot = () => {
		const rfb = getRfb();
		rfb?.machineReboot();
	};

	const machineReset = () => {
		const rfb = getRfb();
		rfb?.machineReset();
	};

	const clipboardPaste = (text: string) => {
		const rfb = getRfb();
		rfb?.clipboardPasteFrom(text);
	};

	useImperativeHandle(ref, () => ({
		connect,
		disconnect,
		connected: connected.current,
		sendCredentials,
		sendKey,
		sendCtrlAltDel,
		focus,
		blur,
		machineShutdown,
		machineReboot,
		machineReset,
		clipboardPaste,
		rfb: rfb.current,
		eventListeners: eventListeners.current,
	}));
	// biome-ignore lint: correctness/useExhaustiveDependencies
	useEffect(() => {
		if (autoConnect) connect();

		return disconnect;
	}, []);

	const handleClick = () => {
		const rfb = getRfb();

		if (rfb) rfb.focus();
	};

	const handleMouseEnter = () => {
		if (document.activeElement && document.activeElement instanceof HTMLElement) document.activeElement.blur();

		handleClick();
	};

	const handleMouseLeave = () => {
		const rfb = getRfb();

		if (rfb) rfb.blur();
	};
	return (
		<>
			{loading || !url ? (loader ?? <p>Loading...</p>) : null}
			{url ? (
				<div
					style={style}
					className={className}
					ref={screen}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				/>
			) : null}
		</>
	);
};
export default VncScreen;
