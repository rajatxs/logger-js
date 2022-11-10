import * as util from 'util'
import chalk from 'chalk'
import { logLevelColors, logLevelColorDefault } from './values'
import type { LogLevel, LogContext } from './interfaces'

/**
 * Assign default value to object if given `prop` is missing
 * @param obj - Object
 * @param prop - Property
 * @param val - Default value
 */
export function useDefault<T>(obj: object, prop: string, val: T) {
   if (!Reflect.has(obj, prop)) {
      Reflect.set(obj, prop, val)
   }
}

/**
 * Returns context obejct of log level
 * @param level - Log level
 */
export function getLevelContext(level: LogLevel): LogContext {
   const color = logLevelColors[level] || logLevelColorDefault
   const text = level
   let format: string

   if (level === 'FATAL') {
      format = chalk.bgHex(color).whiteBright(text)
   } else {
      format = chalk.hex(color)(text)
   }

   return {
      text,
      format,
   }
}

/**
 * Returns context object of given log namespace
 * @param namespace - Log namespace
 */
export function getNamespaceContext(namespace: string): LogContext {
   const text = namespace
   const format = chalk.whiteBright(namespace)

   return {
      text,
      format,
   }
}

/**
 * Returns context object of log message by given arguments
 * @param args - Log arguments
 */
export function getMessageContext(...args: any[]): LogContext {
   const text = util.format(...args)
   const format = chalk.white(text)

   return { text, format }
}

/** Returns context object of log timestamp */
export function getTimestampContext(): LogContext {
   const time = new Date()
   const text = time.toISOString()
   const format = chalk.dim(time.toLocaleString())

   return { text, format }
}
