import path from 'path';
import chalk from 'chalk';
import util from 'util';
import { EventEmitter } from 'events';
import { createWriteStream } from 'fs';

export class Logger extends EventEmitter {
   /** @type {import('fs').WriteStream} */
   #writeStream = null;

   /** @type {string} */
   #outFile = null;

   /**
    * @param {string} loggerName
    * @param {LoggerInitOptions} initOptions
    */
   constructor(loggerName, initOptions = {}) {
      super();
      this.name = loggerName;
      this.enable = initOptions.enable || false;
      this.namespace = initOptions.namespace;

      if ('write' in initOptions && initOptions.write.enable) {
         this.#outFile = path.resolve(
            initOptions.write.dir,
            initOptions.write.filename
         );

         this.#writeStream = createWriteStream(this.#outFile, {
            encoding: 'utf8',
            flags: 'a',
         });

         this.on('created', this.#writeLog);
      }
   }

   /**
    * Returns log timestamp context
    * @returns {LogContext}
    */
   #getTimestampContext() {
      const time = new Date();
      const text = time.toISOString();
      const format = chalk.italic(chalk.dim('(' + time.toLocaleString() + ')'));

      return { text, format };
   }

   /**
    * Returns log namespace context
    * @param {LogLevel} level
    * @param {string} val
    * @returns {LogContext}
    */
   #getNamespaceContext(level, val) {
      const namespace = val || this.namespace;
      let format;

      switch (level) {
         default:
         case 'DEBUG':
            format = chalk.whiteBright(namespace);
            break;

         case 'ERROR':
            format = chalk.redBright(namespace);
            break;

         case 'INFO':
            format = chalk.blueBright(namespace);
            break;

         case 'WARN':
            format = chalk.yellowBright(namespace);
            break;
      }

      return { text: namespace, format };
   }

   /**
    * Returns log message context
    * @param {...any} args
    * @returns {LogContext}
    */
   #getMessageContext(...args) {
      const msg = util.format(...args);
      const format = chalk.white(msg);

      return { text: msg, format };
   }

   /**
    * Created formatted log string
    * @param {LoggerCreateOptions} options
    */
   #createLog(options = {}) {
      const {
         level = 'DEBUG',
         namespace = this.namespace,
         args = [],
         timestamp = true,
      } = options;

      const nsFmt = this.#getNamespaceContext(level, namespace);
      const msgFmt = this.#getMessageContext(...args);
      const tsFmt = this.#getTimestampContext();
      let fmtList = [];
      let fmtLog, meta;

      // 1. assign namespace
      fmtList.push(nsFmt.format);

      // 2. assign log messafe
      fmtList.push(msgFmt.format);

      // 3. assign timestamp
      if (timestamp) {
         fmtList.push(tsFmt.format);
      }

      // create formatted log string
      fmtLog = util.format(...fmtList);

      meta = {
         lebel: level.toUpperCase(),
         namespace: nsFmt.text,
         msg: msgFmt.text,
         timestamp: tsFmt.text,
         args,
         fmt: fmtLog,
      };

      this.emit('created', meta);

      return fmtLog;
   }

   /**
    * Write log to specified file
    * @param {object} logInfo - Log info
    */
   #writeLog(logInfo) {
      const type = logInfo.lebel;
      let logStr,
         parts = [
            type,
            '[' + logInfo.namespace + ']',
            '(' + logInfo.timestamp + ')',
            logInfo.msg,
         ];

      logStr = parts.join(' ') + '\n';

      if (this.#writeStream) {
         this.#writeStream.write(logStr);
      }
   }

   /**
    * Print log string
    * @param {string} str
    */
   #printLog(str) {
      if (!this.enable) {
         return;
      }

      process.stdout.write(str + '\n');
   }

   /**
    * Write log with default namespace format
    * @param {string} namespace
    * @param  {...any} args
    */
   debug(namespace, ...args) {
      this.#printLog(this.#createLog({ level: 'DEBUG', args, namespace }));
   }

   /**
    * Write log with error namespace format
    * @param {string} namespace
    * @param  {...any} args
    */
   error(namespace, ...args) {
      this.#printLog(this.#createLog({ level: 'ERROR', args, namespace }));
   }

   /**
    * Write log with info namespace format
    * @param {string} namespace
    * @param  {...any} args
    */
   info(namespace, ...args) {
      this.#printLog(this.#createLog({ level: 'INFO', args, namespace }));
   }

   /**
    * Write log with warning namespace format
    * @param {string} namespace
    * @param  {...any} args
    */
   warn(namespace, ...args) {
      this.#printLog(this.#createLog({ level: 'WARN', args, namespace }));
   }
}
