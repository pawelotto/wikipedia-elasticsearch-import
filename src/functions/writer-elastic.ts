import * as elasticsearch from 'elasticsearch'
import { LoggerInstance } from 'winston'
import { Writable } from 'stream'

export default function(elasticHost: string, elasticPort: number, elasticUser: string, elasticPassword: string, elasticIndex: string, elasticType: string, logger: LoggerInstance): Writable {
  console.log('Writing documents to Elasticsearch...')
  const esClient = new elasticsearch.Client({
    host: `${elasticHost}:${elasticPort}`,
    log: false,
    httpAuth: `${elasticUser}:${elasticPassword}`
  })

  let c = 0
  const writer: Writable = new Writable({
    objectMode: true,
    async write(chunk, enc, cb) {
      try {
        await esClient.create(
          {
            id: chunk.id,
            index: elasticIndex,
            type: elasticType,
            body: chunk,
          }
        )
        if (++c % 1000 === 0) process.stdout.write(`...${c}`)
        cb()
      } catch (err) {
        logger.error('error', { pageId: chunk.id, elasticMessage: err.message })
        cb()
      }
    }
  })

  writer.on('finish', () => logger.log('info', 'Stream writer ended'))
  writer.on('error', err => logger.error('error', err.message))

  return writer
}

