# Simple Node.js Logger

A simple, lightweight logging library for Node.js with colorized console output and file logging support.

## Features

- 📝 Multiple log levels (info, error, warn, debug)
- 🎨 Colorized console output
- 💾 Optional file logging
- 📂 Automatic log file rotation
- 📦 Zero-dependencies (except for `chalk` for colors)

## Installation

```sh
npm install @rxpm/logger
```

## Usage

### Basic Usage

```javascript
import logger from '@rxpm/logger';

// Log messages with different levels
logger.info('app', 'Application started');
logger.warn('auth', 'User session about to expire');
logger.error('db', 'Connection failed', { error: err });
logger.debug('cache', 'Cache miss', { key: 'user:123' });
```

### With File Logging

```javascript
import { Logger } from '@rxpm/logger';

// Initialize with log file
const logger = new Logger('./logs/app.log');

logger.info('app', 'This will be logged to both console and file');
```

### Log Format

Logs are formatted as:

```
TIMESTAMP LEVEL NAMESPACE MESSAGE
```

Example:

```log
2023-08-16T16:05:23.123Z INFO  app Server started on port 3000
```

## API

`new Logger([filepath])`

Creates a new Logger instance.

- `filepath` (String): Optional path to the log file. If not provided, logs will only be output to the console.

### Methods

`logger.info(namespace, ...args)`

Logs an info message.

- `namespace` (String): Log category/namespace
- `...args`: Values to log

`logger.error(namespace, ...args)`

Logs an error message.

`logger.warn(namespace, ...args)`

Logs a warning message.

`logger.debug(namespace, ...args)`

Logs a debug message.

## License

ISC © [Rajat Sharma](https://gitlab.com/rajatxs)
