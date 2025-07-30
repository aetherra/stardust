if (process.argv.includes("--help") || process.argv.includes("-h") || process.argv.includes("help")) {
	console.log(`
✨ Stardust daemon by aetherra
Options
 --config: path to a stardustd config file. Defaults to [executable path]/config.yml or (HOME || XDG_CONFIG_HOME)/.config/stardustd.yml
`);
	process.exit(0);
}
