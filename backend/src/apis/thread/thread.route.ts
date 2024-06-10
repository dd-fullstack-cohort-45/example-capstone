import { Router } from 'express'
import {
    deleteThreadByThreadIdController,
    getAllReplyThreadsByThreadIdController,
    getAllThreads,
    getPageOfThreadsController,
    getThreadByThreadIdController,
    getThreadsByProfileNameController,
    getThreadsByThreadProfileIdController,
    postThreadController
} from "./thread.controller";
import {isLoggedInController} from "../../utils/controllers/isLoggedIn.controller";

// declare a basePath for this router
const basePath = '/apis/thread'

// instantiate a new router object
const router = Router()

// define thread route for this router
router.route('/')
    .post(isLoggedInController, postThreadController)
    .get(getAllThreads)

router.route('/replies/threadId/:threadId').get(getAllReplyThreadsByThreadIdController)

router.route('/page/:page').get(getPageOfThreadsController)

router.route('/profileName/:profileName').get(getThreadsByProfileNameController)

router.route('/threadProfileId/:threadProfileId').get(getThreadsByThreadProfileIdController)

router.route('/:threadId')
    .get(getThreadByThreadIdController)
    .delete(isLoggedInController, deleteThreadByThreadIdController)

// export the router with the basePath and router object
export const threadRoute = { basePath, router }