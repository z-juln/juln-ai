import log4js from 'log4js';

log4js.configure({
  appenders: {
    console: { type: 'console' },
    info: { type: "file", filename: "logs/info.log" },
    error: { type: "file", filename: "logs/error.log" },
  },
  categories: {
    default: { appenders: ["console", "info"], level: "info" },
    info: { appenders: ["console", "info"], level: "info" },
    error: { appenders: ["console", "error"], level: "error" },
  },
});

const log = log4js.getLogger();

export default log;
