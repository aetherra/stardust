import { useEffect, useState } from "react";

export default function useFullScreen() {
	const [fullScreen, setFullScreen] = useState(false);
	useEffect(() => {
		if (document.fullscreenElement === null && fullScreen) {
			document.documentElement.requestFullscreen();
		} else if (document.fullscreenElement !== null && !fullScreen) {
			document.exitFullscreen();
		}
		const listener = () => setFullScreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", listener);
		return () => document.removeEventListener("fullscreenchange", listener);
	}, [fullScreen]);
	return { fullScreen, setFullScreen };
}
