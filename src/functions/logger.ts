import * as fs from 'fs-extra'
import * as path from 'path'
import {
  Logger,
  LoggerInstance,
  LoggerOptions,
  transports
  } from 'winston'

export const logger = (filename: string): LoggerInstance => {
  fs.ensureDirSync(path.parse(filename).dir)
  fs.ensureFileSync(filename)
  const loggerOpts: LoggerOptions = {
    transports: [
      new transports.File({
        colorize: false,
        filename: path.join(process.cwd(), filename),
        handleExceptions: true,
        json: false,
        level: 'info',
        maxsize: 1024 * 1024 * 20,
        humanReadableUnhandledException: true,
      }),
      new transports.Console({
        colorize: true,
        level: 'info',
        json: false,
        handleExceptions: true,
        humanReadableUnhandledException: true,
      })
    ]
  }
  return new Logger(loggerOpts)
}