import { App } from './App'
import {createClient, RedisClientType} from "redis";

// instantiate new app and pass it a port as an argument to start with (4200)

let redisClient : RedisClientType | undefined

async function main (): Promise<void> {
  if (redisClient === undefined) {
    redisClient = createClient({ socket: { host: process.env.REDIS_HOST } })
    redisClient.connect().catch(console.error)
  }
  try {
    const app = new App(redisClient)
    await app.listen()
  } catch (e) {
    console.log(e)
  }
}

main().catch(error => { console.error(error) })
