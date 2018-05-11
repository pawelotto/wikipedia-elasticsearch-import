import * as elasticsearch from 'elasticsearch'
import { Writable } from 'stream'

export default function(elasticIndex: string, elasticType: string): Writable {
  console.log('Writing documents to Elasticsearch...')
  const esClient = new elasticsearch.Client({
    host: 'tensor:9200',
    log: false,
  })

  let c=0
  const writer: Writable = new Writable({ 
    objectMode: true, 
    async write(chunk, enc, cb){
      await esClient.create(
        {
          id: chunk.id,
          index: elasticIndex, 
          type: elasticType, 
          body: chunk,
        }
      )
      if(++c%1000 === 0) process.stdout.write(`...${c}`)
      cb()
    } 
  })
  
  writer.on('finish', () => {
    console.log('Stream writer ended')
  })

  writer.on('error', console.error)

  return writer
}

