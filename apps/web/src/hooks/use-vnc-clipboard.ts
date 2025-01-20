import type RFB from "@novnc/novnc/lib/rfb";
import { useEffect, useState } from "react";
export default function useVncClipboard(rfb?: RFB | null) {
	const [workingClipboard, setWorkingClipboard] = useState(true);
	const [clipboard, setClipboard] = useState("");
	useEffect(() => {
		const requestClipboardPermissions = async () => {
			try {
				const result = await navigator.permissions.query({ name: "clipboard-write" as PermissionName });
				if (result.state === "granted") {
					setWorkingClipboard(true);
				} else {
					setWorkingClipboard(false);
				}
			} catch (error) {
				setWorkingClipboard(false);
			}
		};
		requestClipboardPermissions();
	}, []);
	useEffect(() => {
		const interval = setInterval(() => {
			if (workingClipboard && document.hasFocus()) {
				rfb?.focus();
				navigator.clipboard
					.readText()
					.then((text) => {
						if (text !== clipboard) {
							setClipboard(text);
							rfb?.clipboardPasteFrom(text);
						}
					})
					.catch(() => setWorkingClipboard(false));
			}
		}, 2000);
		return () => clearInterval(interval);
	}, [clipboard, workingClipboard, rfb]);
	return {
		workingClipboard,
		setWorkingClipboard,
		clipboard,
		setClipboard,
	};
}
