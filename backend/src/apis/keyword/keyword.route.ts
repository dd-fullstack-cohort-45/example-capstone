import {Router} from "express";
import {isLoggedInController} from "../../utils/controllers/isLoggedIn.controller";
import {
    getKeywordByKeywordIdController,
    getKeywordByKeywordNameController, getKeywordsByKeywordNameController,
    postKeywordController
} from "./keyword.controller";

// declare a basePath for this route
const basePath = '/apis/keyword'


// instantiate a new router object
const router = Router()

//define the base route for this router
router.route('/').post(isLoggedInController, postKeywordController)


// define how to get a keyword by keywordName
router.route('/keywordName/:keywordName').get(getKeywordByKeywordNameController)

// define how to get a keyword by keywordId
router.route('/:keywordId').get(getKeywordByKeywordIdController)

// define how to get a keywords by partial search of keywordName
router.route('/keywords/:keywordName').get(getKeywordsByKeywordNameController)

// export the router with the basePath and router object
export const keywordRoute = {basePath, router}