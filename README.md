# Simple NodeJs Logger

### Installation
```bash
$ npm install @rxpm/logger
```

### Usage

Create new logger instance
```javascript
const myLogger = new Logger("MyLogger", { enable: true });
```

Use different loglevel methods
```javascript
myLogger.info("App", "First info log");
```
