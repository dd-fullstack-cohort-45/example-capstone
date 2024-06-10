import express, { Application } from 'express'
import morgan from 'morgan'
import session from 'express-session'
import { createClient, RedisClientType } from 'redis'
import RedisStore from 'connect-redis'
// Routes
import { indexRoute } from './apis/index.route'
import { signUpRoute } from './apis/sign-up/sign-up.route'
import { signInRoute } from "./apis/sign-in/sign-in.route";
import { signOutRoute } from "./apis/sign-out/sign-out.route";
import {threadRoute} from "./apis/thread/thread.route";
import {likeRoute} from "./apis/like/like.route";
import {followRoute} from "./apis/follow/follow.route";
import {imageRoute} from "./apis/image/image.route";
import {profileRoute} from "./apis/profile/profile.route";
import {keywordRoute} from "./apis/keyword/keyword.route";
import {tagRoute} from "./apis/tag/tag.route";

// The following class creates the app and instantiates the server
export class App {
  app: Application
  redisStore: RedisStore

  constructor ( private readonly redisClient: RedisClientType,
                private readonly port?: number | string,
  ) {



    this.redisStore = new RedisStore({client: this.redisClient})
    this.app = express()
    this.settings()
    this.middlewares()
    this.routes()
  }
  // private method that sets the port for the sever, to one from index.route.ts, and external .env file or defaults to 3000
  public settings (): void {
    this.app.set('port', this.port)
  }

  // private method to setting up the middleware to handle json responses, one for dev and one for prod
  private middlewares (): void {
    this.app.use(morgan('dev'))
    this.app.use(express.json())
    this.app.use(session({
      store: this.redisStore,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false

    }))
  }

  // private method for setting up routes in their basic sense (ie. any route that performs an action on profiles starts with /profiles)
  private routes (): void {
    this.app.use(indexRoute.basePath, indexRoute.router)
    this.app.use(tagRoute.basePath, tagRoute.router)
    this.app.use(signUpRoute.basePath, signUpRoute.router)
    this.app.use(signInRoute.basePath, signInRoute.router)
    this.app.use(signOutRoute.basePath, signOutRoute.router)
    this.app.use(threadRoute.basePath, threadRoute.router)
    this.app.use(profileRoute.basePath, profileRoute.router)
    this.app.use(likeRoute.basePath, likeRoute.router)
    this.app.use(followRoute.basePath, followRoute.router)
    this.app.use(keywordRoute.basePath, keywordRoute.router)
    this.app.use(imageRoute.basePath, imageRoute.router)
  }

  // starts the server and tells the terminal to post a message that the server is running and on what port
  public async listen (): Promise<void> {
    await this.app.listen(4200)
    console.log('Express application built successfully')
  }
}
