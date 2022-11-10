import { LogLevel } from './interfaces'

export const logLevelColorDefault = "#FFFFFF"
export const logLevelColors: Record<LogLevel, string> = {
   DEBUG: "#FFB86C",
   INFO: "#50FA7B",
   WARN: "#F1FA8C",
   ERROR: "#FF5555",
   FATAL: "#DC0000",
}
