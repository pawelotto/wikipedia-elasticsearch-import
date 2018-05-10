import { Db } from 'mongodb'
import { Writable } from 'stream'
import db from './db'

export default function(db: Db, collection: string): Writable {
  console.log('Writing documents')
  db.collection(collection).createIndex({ title: 1 })
  let c=0
  const writer: Writable = new Writable({ 
    objectMode: true, 
    async write(chunk, enc, cb){
      await db.collection(collection).insert(chunk)
      if(++c%1000 === 0) process.stdout.write(`...${c}`)
      cb()
    } 
  })
  writer.on('finish', () => {
    console.log('Stream writer ended')
    db.close()
  })
  writer.on('error', console.error)
  return writer
}

