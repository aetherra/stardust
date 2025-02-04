# Stardust Workspaces

These are the Docker images that are used for Stardust Workspaces. They have a VNC server running, along with a PulseAudio server for audio, and a simple HTTP server for file transfers.

## Building

```bash
pnpm build
```
### Options

`--multi-platform`: Build for both arm64 and amd64. By default, the script builds for your host machine's arch.

`--push`: Push the images to docker registry. This only exists for the GitHub workflow and for devs and serves no purpose to others.

`--quiet`: Suppress logs in the console.
