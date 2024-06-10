import {Request, Response} from "express";
import {TagSchema} from "./tag.validator";
import {zodErrorResponse} from "../../utils/response.utils";
import {
    deleteTagByTagKeywordIdAndTagThreadId,
    insertTag,
    selectTagByTagKeywordIdAndTagThreadId,
    selectTagsByTagKeywordId,
    selectTagsByTagThreadId
} from "./tag.model";
import {Status} from "../../utils/interfaces/Status";


/**
 * Express controller for posting a new tag
 * @param request from the client to the server containing the data needed to create a tag
 * @param response from the server to the client indicating whether the tag was created or not
 * @return {Promise<Response<Status>>}  A promise containing the response for the client with the requested information,
 */
export async function postTagController(request: Request, response: Response) {
    try {
        // validate the incoming request with the schema
        const validationResult = TagSchema.safeParse(request.body)

        // if the validation is unsuccessful, return a preformatted response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the tag data from the validated request body
        const {tagKeywordId, tagThreadId} = validationResult.data

        // create a new tag object
        const tag = {tagKeywordId, tagThreadId}

        // insert the tag into the database
        const result = await insertTag(tag)

        //create a preformatted response to send to the client
        const status: Status = {status: 200, data: null, message: result}

        // return the result to the client
        return response.json(status)




    } catch (error) {
        return response.json({status: 500, data: null, message: "Internal error try again later"})
    }
}

/**
 * express controller for getting a tag by tagThreadId
 * @param request from the client to the server containing the tagThreadId in the request parameters
 * @param response from the server to the client containing the tag or an error message
 * @return {Promise<Response<Status>>}  A promise containing the response for the client with the requested information,
 *
 */

export async function getTagByTagThreadIdController(request: Request, response: Response): Promise<Response<Status>> {
    try {

        //validate the incoming request parameters with the tag schema
        const validationResult = TagSchema.pick({tagThreadId: true}).safeParse(request.params)

        // if the validation is unsuccessful, return a preformatted response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the tagThreadId from the validated request parameters
        const {tagThreadId} = validationResult.data

        // get the tag by tagThreadId
        const data = await selectTagsByTagThreadId(tagThreadId)

        // create a preformatted response to send to the client
        const status: Status = {status: 200, data, message: null}

        // return the result to the client
        return response.json(status)


    } catch (error) {
     return response.json({status: 500, data: null, message: "Internal error try again later"})
    }
}

/**
 * express controller for getting a tag by tagKeywordId
 *
 * @param request from the client to the server containing the tagKeywordId in the request parameters
 * @param response from the server to the client containing the tag or an error message
 * @return {Promise<Response<Status>>}  A promise containing the response for the client with the requested information,
 *
 */
export async function getTagByTagKeywordIdController(request: Request, response: Response): Promise<Response<Status>> {
    try {
        //validate the incoming request parameters with the tag schema
        const validationResult = TagSchema.pick({tagKeywordId: true}).safeParse(request.params)

        // if the validation is unsuccessful, return a preformatted response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the tagKeywordId from the validated request parameters
        const {tagKeywordId} = validationResult.data

        // get the tag by tagKeywordId
        const data = await selectTagsByTagKeywordId(tagKeywordId)

        // create a preformatted response to send to the client
        const status: Status = {status: 200, data, message: null}

        // return the result to the client
        return response.json(status)

    } catch (error) {
      return response.json({status: 500, data: null, message: "Internal error try again later"})
    }
}

/**
 * express controller for getting a tag by tagKeywordId and tagThreadId
 * @param request from the client to the server containing the tagKeywordId and tagThreadId in the request parameters
 * @param response from the server to the client containing the tag or an error message
 * @return {Promise<Response<Status>>}  A promise containing the response for the client with the requested information,
 **/

export async function getTagByPrimaryKeyController(request: Request, response: Response): Promise<Response<Status>> {
    try {
        //validate the incoming request parameters with the tag schema
        const validationResult = TagSchema.safeParse(request.params)

        // if the validation is unsuccessful, return a preformatted response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the tagKeywordId and tagThreadId from the validated request parameters
        const {tagKeywordId, tagThreadId} = validationResult.data

        // get the tag by tagKeywordId and tagThreadId
        const data = await selectTagByTagKeywordIdAndTagThreadId(tagKeywordId, tagThreadId)


        // create a preformatted response to send to the client
        const status: Status = {status: 200, data, message: null}

        // return the result to the client
        return response.json(status)


    } catch (error) {
        return response.json({status: 500, data: null, message: "Internal error try again later"})

    }
}

/**
 * express controller for deleting a tag by tagKeywordId and tagThreadId
 * @param request from the client to the server containing the tagKeywordId and tagThreadId in the request parameters
 * @param response from the server to the client containing the tag or an error message
 * @return {Promise<Response<Status>>}  A promise containing the response for the client with the requested information,
 */

export async function deleteTagController(request: Request, response: Response): Promise<Response<Status>> {

    try {
        //validate the incoming request parameters with the tag schema
        const validationResult = TagSchema.safeParse(request.params)

        // if the validation is unsuccessful, return a preformatted response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the tagKeywordId and tagThreadId from the validated request parameters
        const {tagKeywordId, tagThreadId} = validationResult.data

        // get the tag by tagKeywordId and tagThreadId
        const data = await selectTagByTagKeywordIdAndTagThreadId(tagKeywordId, tagThreadId)

        // if the tag is null, return a preformatted response to the client
        if (data === null) {
            return response.json({status: 400, data: null, message: "Tag does not exist"})
        }

        // delete the tag by tagKeywordId and tagThreadId
        await deleteTagByTagKeywordIdAndTagThreadId(tagKeywordId, tagThreadId)

        // create a preformatted response to send to the client
        const status: Status = {status: 200, data: null, message: "Tag successfully deleted"}

        // return the result to the client
        return response.json(status)

    } catch (error) {
        return response.json({status: 500, data: null, message: "Internal error try again later"})
    }
}
