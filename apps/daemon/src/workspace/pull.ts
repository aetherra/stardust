import { docker } from "~/lib/docker";

export function pullImage(image: string) {
	return new Promise<{
		success: boolean;
		data?: unknown;
		error?: Error;
	}>((resolve, reject) => {
		docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
			if (err)
				reject({
					success: false,
					error: err.message,
				});
			docker.modem.followProgress(stream, (err, data) => {
				if (err) {
					reject({
						success: false,
						error: err.message,
					});
				} else {
					resolve({
						data,
						success: true,
					});
				}
			});
		});
	});
}
