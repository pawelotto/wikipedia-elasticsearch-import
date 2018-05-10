import db from './functions/db'
import * as config from 'config'
import * as xmlNodes from 'xml-nodes'
import * as xmlObjects from 'xml-objects'
import { createReadStream, createWriteStream } from 'fs'
import streamWriter from './functions/writer'
import { Db } from 'mongodb'

const inputFile = config.get('inputFile') as string
// const reader = createReadStream(inputFile, { start: 1000, end: 10 * 1000 * 100 })
const reader = createReadStream(inputFile)

main()

async function main(){
  const dbClient: Db | undefined = await db()
  const collection: string = config.get('dbCollection')
  if(dbClient){
    const writer = streamWriter(dbClient, collection)
    const splitter = reader
    .pipe(xmlNodes('page'))
    .pipe(xmlObjects({ explicitRoot: false, explicitArray: false, mergeAttrs: true }))
    .pipe(writer)
  }
}