import { existsSync as exists, readFileSync as read, writeFileSync as write } from "node:fs";
import { platform, getuid } from "node:process";

export default function doServiceCheck() {
  if (
    (exists("/usr/bin/systemd") || exists("/usr/local/bin/systemd")) &&
    !exists("/etc/systemd/system/stardustd.service") &&
    platform === 'linux' &&
    getuid &&
    getuid() === 0
  ) {
    let payload = read("./stardustd.service").toString();
    write("/etc/systemd/system/stardustd.service", payload, { flag: "wx" });
    const process = Bun.spawnSync(["systemctl", "daemon-reload"]);
    if (process.exitCode === 0) {
      console.log("✨ Stardust: Created systemd service");
    } else {
      console.log(`✨ Stardust: Failed to create systemd service (${process.stderr})`);
    }
  } else if (
    platform === 'darwin' &&
    getuid &&
    getuid() === 0
  ) {
    const process = Bun.spawnSync(["launchctl", "load", "/usr/local/opt/stardust/apps/daemon/src/stardust.plist"]);
    if (process.exitCode === 0) {
      console.log("✨ Stardust: Created launchd service");
    } else {
      console.log(`✨ Stardust: Failed to create launchd service (${process.stderr})`);
    }
  } else {
    console.log("✨ Stardust: Please run as root")
  }
}
