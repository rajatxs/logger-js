
declare type LogLevel = 'DEBUG' | 'ERROR' | 'INFO' | 'WARN';

declare interface LogContext {
   text: string,
   format: string
}

declare interface LoggerWriteOptions {
   enable?: boolean,
   dir: string,
   filename: string
}

declare interface LoggerInitOptions {
   namespace?: string,
   enable?: string,
   write?: LoggerWriteOptions
}

declare interface LoggerCreateOptions {
   level?: LogLevel,
   namespace?: string,
   args?: any[],
   timestamp?: boolean
}
