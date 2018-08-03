import { logger } from './logger'
import { BulkIndexDocumentsParams, Client, IndexDocumentParams } from 'elasticsearch'
import { Writable } from 'stream'
import { LoggerInstance } from 'winston'

export default function({ httpAuth, host, index, port, type }, { mode = 'bulk', limit = 50 }, logHandler: LoggerInstance): Writable {
  logHandler.log('info', `Writing into Elasticsearch index ${index}...`)

  let c = 0
  let bulkTranche: BulkIndexDocumentsParams = { body: [] }

  const client = new Client({
    host: `${host}:${port}`,
    log: 'error',
    ...httpAuth,
  })

  const writerSingle: Writable = new Writable({
    objectMode: true,
    write(chunk: object, enc, cb) {
      const doc: IndexDocumentParams<any> = {
        id: chunk['id'],
        index,
        type,
        body: { ...chunk },
      }
      client
        .index(doc)
        .then(() => cb(undefined))
        .catch(err => {
          logHandler.log('error', err)
          cb(err)
        })
    }
  })

  const writerBulk: Writable = new Writable({
    objectMode: true,
    write(chunk: object, enc, cb) {
      if ((bulkTranche.body.length > 0) && ((bulkTranche.body.length / 2) % limit === 0)) {
        client
          .bulk(bulkTranche)
          .then(() => {
            c = 0
            bulkTranche.body.length = 0
            cb(undefined)
          })
          .catch(err => {
            c = 0
            bulkTranche.body.length = 0
            logHandler.log('error', err)
            cb(err)
          })
      } else {
        bulkTranche.body.push({
          index: {
            _id: chunk['id'],
            _index: index,
            _type: type,
          }
        }, chunk)
        cb(undefined)
      }
    }
  })
  const writer = mode === 'bulk' ? writerBulk : writerSingle
  writer.on('finish', () => {
    if (mode === 'bulk') {
      client.bulk(bulkTranche)
        .then(() => logHandler.log('info', `Finalising writing stream ${index}...`))
        .catch(err => logHandler.log('error', err))
    }
    logHandler.log('info', `Ended writing documents into Elasticsearch index ${index}...`)
  })
  writer.on('error', err => logHandler.error('error', err.message))
  return writer
}