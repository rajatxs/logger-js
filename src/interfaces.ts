export type LogLevel = 'DEBUG' | 'ERROR' | 'INFO' | 'WARN' | 'FATAL'

export interface LogContext {
   text: string
   format: string
}

export interface LogMetadata {
   label: string
   namespace: string
   msg: string
   timestamp: string
   args: any[]
   fmt: string
}

export interface LoggerWriteOptions {
   enable?: boolean
   dir: string
   filename: string
}

export interface LoggerInitOptions {
   namespace?: string
   enable?: boolean
   timestamp?: boolean
   write?: LoggerWriteOptions
}

export interface LoggerCreateOptions {
   level: LogLevel
   namespace?: string
   args?: any[]
}
