import * as winston from 'winston'

export default function(filename: string): winston.LoggerInstance {
  winston.remove(winston.transports.Console)
  return winston.add(winston.transports.File, { filename })
}