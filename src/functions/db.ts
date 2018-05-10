import * as config from 'config'
import * as mongodb from 'mongodb'
import { Db } from 'mongodb'


export default async function (dbString: string = config.get('dbString')): Promise<Db|undefined> {
  try {
    return await mongodb.connect(dbString)
  } catch (err) {
    console.error(err)
  }
}