// @ts-check
import fs from "node:fs";
import http from "node:http";
import { homedir } from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
const {
	values: { pass },
} = parseArgs({
	args: process.argv,
	options: {
		pass: {
			type: "string",
		},
	},
	strict: true,
	allowPositionals: true,
});
/** @param {import("http").ServerResponse} res */
const badRequest = (res) => {
	res.writeHead(400);
	return res.end();
};
http
	.createServer(async (req, res) => {
		console.log(`Received request: ${req.method} ${req.url}`);
		const url = new URL(req.url || "/", `http://${req.headers.host}`);
		const fileName = url.searchParams.get("name");
		if (req.headers.authorization !== pass) {
			res.writeHead(401);
			return res.end();
		}
		switch (url.pathname) {
			case "/list": {
				fs.mkdirSync(`${homedir()}/Downloads`, { recursive: true });
				const files = fs.readdirSync(`${homedir()}/Downloads`);
				res.writeHead(200, { "Content-Type": "application/json" });
				return res.end(JSON.stringify(files));
			}
			case "/download": {
				if (!fileName) return badRequest(res);
				try {
					const file = fs.readFileSync(path.join(homedir(), "Downloads", fileName));
					res.writeHead(200, { "Content-Type": "application/octet-stream" });
					return res.end(file);
				} catch (e) {
					console.log(e);
					res.writeHead(404);
					return res.end();
				}
			}
			case "/upload": {
				if (!fileName || req.method !== "PUT") return badRequest(res);
				try {
					fs.mkdirSync(`${homedir()}/Uploads`, { recursive: true });
					const fileStream = fs.createWriteStream(path.join(homedir(), "Uploads", fileName));
					await new Promise((resolve, reject) => {
						req
							.on("data", (chunk) => {
								fileStream.write(chunk);
							})
							.on("end", () => {
								fileStream.end();
								resolve(true);
							})
							.on("error", (err) => {
								console.log(err);
								fileStream.end();
								fs.unlinkSync(`${homedir()}/Uploads/${fileName}`);
								reject(err);
							});
					});
					console.log(`File ${fileName} uploaded`);
					res.writeHead(200);
					return res.end();
				} catch (e) {
					console.log(e);
					res.writeHead(500);
					return res.end();
				}
			}
			default:
				res.writeHead(404);
				return res.end();
		}
	})
	.listen(6080);
console.log("listening on 6080");
