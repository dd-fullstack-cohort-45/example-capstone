

// declare a basePath for this router
import {isLoggedInController} from "../../utils/controllers/isLoggedIn.controller";
import {
    deleteTagController,
    getTagByPrimaryKeyController,
    getTagByTagKeywordIdController,
    getTagByTagThreadIdController, postTagController
} from "./tag.controller";
import {Router} from "express";

const basePath = '/apis/tag'


// instantiate a new router object
const router = Router()

// define the endpoint for posting a tag
router.route('/')
    .post(isLoggedInController, postTagController)

// define the endpoint for getting a tag by tagThreadId
router.route('/tagThreadId/:tagThreadId')
    .get(getTagByTagThreadIdController)

// define the endpoint for getting a tag by tagKeywordId
router.route('/tagKeywordId/:tagKeywordId')
    .get(getTagByTagKeywordIdController)

// define the endpoints for getting a tag by tagKeywordId and tagThreadId, and deleting a tag
router.route('/tagKeywordId/:tagKeywordId/tagThreadId/:tagThreadId')
    .get(getTagByPrimaryKeyController)
    .delete(isLoggedInController, deleteTagController)


// export the router with the basePath and router object
export const tagRoute = {basePath, router}
