import type { Config } from './config/config.d.ts'
export function getConfig(): Config {
  return JSON.parse(process.env.CONFIG as string)
}
