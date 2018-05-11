import db from './functions/db'
import * as config from 'config'
import * as xmlNodes from 'xml-nodes'
import * as xmlObjects from 'xml-objects'
import { createReadStream, createWriteStream } from 'fs'
import streamWriterMongo from './functions/writer-mongo'
import streamWriterElastic from './functions/writer-elastic'
import { Db } from 'mongodb'

const inputFile = config.get('inputFile') as string
const mongoCollection = config.get('dbCollection') as string
const elasticIndex = config.get('elasticIndex') as string
const elasticType = config.get('elasticType') as string
// const reader = createReadStream(inputFile, { start: 1000, end: 10 * 1000 * 100 })

// runMongo(inputFile, mongoCollection)
runElastic(inputFile, elasticIndex, elasticType)

async function runMongo(inputFile: string, collection: string){
  const reader = createReadStream(inputFile)
  const dbClient: Db | undefined = await db()
  if(dbClient){
    const writer = streamWriterMongo(dbClient, collection)
    reader
    .pipe(xmlNodes('page'))
    .pipe(xmlObjects({ explicitRoot: false, explicitArray: false, mergeAttrs: true }))
    .pipe(writer)
  }
}

async function runElastic(inputFile: string, elasticIndex: string, elasticType: string){
  const reader = createReadStream(inputFile)
  const writer = streamWriterElastic(elasticIndex, elasticType)
  
  reader
    .pipe(xmlNodes('page'))
    .pipe(xmlObjects({ explicitRoot: false, explicitArray: false, mergeAttrs: true }))
    .pipe(writer)
}