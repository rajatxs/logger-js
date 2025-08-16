import { resolve, isAbsolute } from 'path';
import { createWriteStream } from 'fs';
import { format } from 'util';
import chalk from 'chalk';

export class Logger {
    /** Log file path */
    outfile = '';

    /** Log file stream */
    wstream = null;

    /**
     * Contructs new instance of `Logger`
     * @param filepath - Log file path
     */
    constructor(filepath = '') {
        if (filepath.length > 0) {
            this.outfile = isAbsolute(filepath) ? filepath : resolve(filepath);
            this.wstream = createWriteStream(this.outfile, {
                encoding: 'utf8',
                flags: 'a',
            });
        }
    }

    /**
     * Logs message with given `level` and `namespace`
     * @param {'info' | 'error' | 'warn' | 'debug'} level - Log level
     * @param {string} namespace - Log namespace
     * @param {any[]} args - Values
     */
    log(level, namespace, ...args) {
        const timestamp = new Date().toISOString();
        const levelText = level.toUpperCase().padEnd(5);
        const namespaceText = namespace || 'app';
        const argsText = format(...args);
        let levelFormat = '';

        switch (level) {
            case 'info':
                levelFormat = chalk.green(levelText);
                break;
            case 'error':
                levelFormat = chalk.red(levelText);
                break;
            case 'warn':
                levelFormat = chalk.yellow(levelText);
                break;
            case 'debug':
                levelFormat = chalk.blue(levelText);
                break;
            default:
                levelFormat = chalk.white(levelText);
        }

        console.log(format(`${timestamp} ${levelFormat} ${namespaceText} ${argsText}`));

        if (this.wstream) {
            const log = format(`${timestamp} ${levelText} ${namespaceText} ${argsText}`);
            this.wstream.write(log + '\n');
        }
    }

    /**
     * Logs error message with given `namespace`
     * @param {string} namespace - Log namespace
     * @param {any[]} args - Values
     */
    error(namespace, ...args) {
        this.log('error', namespace, ...args);
    }

    /**
     * Logs warn message with given `namespace`
     * @param {string} namespace - Log namespace
     * @param {any[]} args - Values
     */
    warn(namespace, ...args) {
        this.log('warn', namespace, ...args);
    }

    /**
     * Logs info message with given `namespace`
     * @param {string} namespace - Log namespace
     * @param {any[]} args - Values
     */
    info(namespace, ...args) {
        this.log('info', namespace, ...args);
    }

    /**
     * Logs debug message with given `namespace`
     * @param {string} namespace - Log namespace
     * @param {any[]} args - Values
     */
    debug(namespace, ...args) {
        this.log('debug', namespace, ...args);
    }
}

// Default logger instance
export default new Logger();
