import { createReadStream } from 'fs'
import * as fs from 'fs-extra'
import * as xmlNodes from 'xml-nodes'
import * as xmlObjects from 'xml-objects'
import * as config from '../../config'
import { logger } from '../functions/logger'
import writerElastic from '../functions/writer-elastic'



const inputFile: string = config['inputFile'] || process.argv[2]
inputFile && runElastic()

async function runElastic() {
  try {
    await fs.access(inputFile, fs.constants.R_OK)
    const { elastic } = config
    const logHandler = logger(elastic.logFile)
    logHandler.log('info', `Reading from file ${inputFile}`)
    createReadStream(inputFile)
      .pipe(xmlNodes(elastic.type))
      .pipe(xmlObjects({
        explicitRoot: false,
        explicitArray: false,
        mergeAttrs: true,
      }))
      .pipe(writerElastic(elastic, { mode: 'bulk', limit: elastic.limit }, logHandler))
  } catch (err) {
    console.error(err)
  }
}
