import * as winston from 'winston'

export default function(filename: string): winston.LoggerInstance {
  return winston.add(winston.transports.File, { filename })
}