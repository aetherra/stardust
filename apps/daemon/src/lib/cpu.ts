import os from "node:os";

let latestCpuPercent = 0;

function cpuAverage() {
	const cpus = os.cpus();
	let totalIdle = 0,
		totalTick = 0;

	for (const cpu of cpus) {
		for (const type in cpu.times) {
			totalTick += cpu.times[type as keyof typeof cpu.times];
		}
		totalIdle += cpu.times.idle;
	}

	return {
		idle: totalIdle / cpus.length,
		total: totalTick / cpus.length,
	};
}

async function updateCpuUsage() {
	const start = cpuAverage();
	await Bun.sleep(100);
	const end = cpuAverage();

	const idleDiff = end.idle - start.idle;
	const totalDiff = end.total - start.total;
	latestCpuPercent = 100 - (100 * idleDiff) / totalDiff;
}

export function startCpuMonitoring(intervalMs = 1000) {
	setInterval(updateCpuUsage, intervalMs);
	updateCpuUsage();
}

export function getCpuUsage() {
	return latestCpuPercent;
}
