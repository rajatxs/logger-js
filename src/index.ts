import path from 'path'
import util from 'util'
import {
   useDefault,
   getLevelContext,
   getNamespaceContext,
   getMessageContext,
   getTimestampContext,
} from './utils'
import { createWriteStream, WriteStream } from 'fs'
import type {
   LoggerInitOptions,
   LoggerCreateOptions,
   LogMetadata,
} from './interfaces'

export class Logger {
   protected wstream: WriteStream
   protected logFile: string

   /**
    * Contructs new instance of `Logger`
    * @param name - Logger name
    * @param options - Logger init options
    */
   constructor(public name: string, public options: LoggerInitOptions = {}) {
      useDefault<boolean>(options, 'enable', true)
      useDefault<boolean>(options, 'timestamp', true)

      if (options.write && options.write.enable) {
         this.logFile = path.resolve(options.write.dir, options.write.filename)
         this.wstream = createWriteStream(this.logFile, {
            encoding: 'utf8',
            flags: 'a',
         })
      }
   }

   /**
    * Creates new log based on given `options`
    * @param options - Log create options
    * @returns Log metadata
    */
   public createLog(options: LoggerCreateOptions): LogMetadata {
      const levelCtx = getLevelContext(options.level)
      const nsCtx = getNamespaceContext(
         options.namespace || this.options.namespace || 'app'
      )
      const msgCtx = getMessageContext(...(options.args || []))
      const tsCtx = getTimestampContext()

      let fmtList = []
      let fmtLog, meta: LogMetadata

      fmtList.push(levelCtx.format)
      fmtList.push(nsCtx.format)

      if (this.options.timestamp) {
         fmtList.push(tsCtx.format)
      }

      fmtList.push(msgCtx.format)

      // create formatted log string
      fmtLog = util.format(...fmtList)

      meta = {
         label: options.level.toUpperCase(),
         namespace: nsCtx.text,
         msg: msgCtx.text,
         timestamp: tsCtx.text,
         args: options.args || [],
         fmt: fmtLog,
      }

      return meta
   }

   /**
    * Writes log string to stdout
    * @param meta - Log metadata
    */
   protected writeLogToStdOutput(meta: LogMetadata) {
      process.stdout.write(meta.fmt + '\n')
   }

   /**
    * Writes log to output file
    * @param meta - Log metadata
    */
   protected writeLogToFile(meta: LogMetadata) {
      const logStr = util.format(
         '%s %s %s %s\n',
         meta.label,
         meta.namespace,
         meta.timestamp,
         meta.msg
      )

      if (this.wstream) {
         this.wstream.write(logStr)
      }
   }

   /**
    * Writes log string to std output and file by given format
    * @param meta - Log metadata
    */
   protected writeLog(meta: LogMetadata) {
      if (this.options.enable) {
         this.writeLogToStdOutput(meta)
      }

      if (this.options.write?.enable) {
         this.writeLogToFile(meta)
      }
   }

   /**
    * Writes debug log with given `namespace`
    * @param namespace - Log namespace
    * @param args - Values
    */
   public debug(namespace: string, ...args: any[]) {
      this.writeLog(this.createLog({ level: 'DEBUG', args, namespace }))
   }

   /**
    * Writes error log with given `namespace`
    * @param namespace - Log namespace
    * @param args - Values
    */
   public error(namespace: string, ...args: any[]) {
      this.writeLog(this.createLog({ level: 'ERROR', args, namespace }))
   }

   /**
    * Writes info log with given `namespace`
    * @param namespace - Log namespace
    * @param args - Values
    */
   public info(namespace: string, ...args: any[]) {
      this.writeLog(this.createLog({ level: 'INFO', args, namespace }))
   }

   /**
    * Writes fatal log with given `namespace`
    * @param namespace - Log namespace
    * @param args - Values
    */
   public fatal(namespace: string, ...args: any[]) {
      this.writeLog(this.createLog({ level: 'FATAL', args, namespace }))
   }

   /**
    * Writes warn log with given `namespace`
    * @param namespace - Log namespace
    * @param args - Values
    */
   public warn(namespace: string, ...args: any[]) {
      this.writeLog(this.createLog({ level: 'WARN', args, namespace }))
   }
}
