import * as elasticsearch from 'elasticsearch'
import { LoggerInstance } from 'winston'
import { Writable } from 'stream'

export default async function(elasticHost: string, elasticPort: number, elasticIndex: string, elasticType: string, logger: LoggerInstance, elasticUser?: string, elasticPassword?: string): Promise<Writable> {
  console.log('Writing Elasticsearch documents into index ' + elasticIndex + '...')

  const esClient = new elasticsearch.Client({
    host: `${elasticHost}:${elasticPort}`,
    log: 'error',
    httpAuth: `${elasticUser}:${elasticPassword}`
  })

  let c = 0
  let tranche: Array<object> = []
  let log: Array<string> = []

  const writer: Writable = new Writable({
    objectMode: true,
    async write(chunk: object, enc, cb) {
      try {
        const doc = [
          {
            index:
              {
                _id: chunk['id'],
                _index: elasticIndex,
                _type: elasticType,
              }
          },
          { ...chunk }
        ]

        tranche.push(...doc)
        log.push(chunk['id'])

        if (++c % 200 === 0) {
          await esClient.bulk({ body: [...tranche] })
          log.forEach(logEntry => logger.log('info', `Added pageId: ${logEntry}`))
          process.stdout.write(`...${c}`)
          tranche.length = 0
          log.length = 0
          cb()
        } else {
          cb()
        }
      } catch (err) {
        logger.error('error', { pageId: chunk['id'], elasticMessage: err.message })
        cb()
      }
    }
  })

  writer.on('finish', () => logger.log('info', 'Stream writer ended'))
  writer.on('error', err => logger.error('error', err.message))

  return writer
}