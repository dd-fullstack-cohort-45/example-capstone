import {Request, Response} from "express";
import {KeywordSchema} from "./keyword.validator";
import {zodErrorResponse} from "../../utils/response.utils";
import {
    insertKeyword,
    selectKeywordByKeywordId,
    selectKeywordByKeywordName,
    selectKeywordsByKeywordName
} from "./keyword.model";
import {z} from "zod";
import {Status} from "../../utils/interfaces/Status";


/**
 * Express controller for posting a new keyword
 * @param request the express request object containing the new keyword data
 * @param response
 */
export async function postKeywordController(request: Request, response: Response) {
    try {

        // validate the new keyword data coming from the request body
        const validationResult = KeywordSchema.safeParse(request.body)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // deconstruct the keywordName from the validated request body
        const {keywordName} = validationResult.data

        //create a new keyword object
        const keyword = {keywordId: null, keywordName}


        // insert the keyword into the keyword table
        await insertKeyword(keyword)

        // return a response to the client indicating success
        return response.json({status: 200, message: 'Keyword successfully posted', data: null})
    } catch (error) {
        return response.json({status: 500, message: 'Posting a keyword failed try again later', data: null})
    }
}

export async function getKeywordByKeywordNameController(request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the keywordName coming from the request parameters

        const validationResult = KeywordSchema.pick({keywordName: true}).safeParse(request.params)


        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // deconstruct the keywordName from the validated request parameters
        const {keywordName} = validationResult.data

        // grab the keyword by keywordName
        const data = await selectKeywordByKeywordName(keywordName)

        console.log(data)

        // return a response to the client with the requested information
        return response.json({status: 200, message: null, data})


    } catch (error) {
        return response.json({status: 500, message: 'Getting a keyword failed try again later', data: null})
    }
}

export async function getKeywordByKeywordIdController(request: Request, response: Response) {
    try {
        // validate the keywordId coming from the request parameters
        const validationResult = z.string().uuid("Please provide a valid keywordId").safeParse(request.params.keywordId)


        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

       // reassign the validated data to a new variable`
        const keywordId = validationResult.data

        const data = await selectKeywordByKeywordId(keywordId)

        return response.json({status: 200, message: null, data})


    } catch (error) {
        return response.json({status: 500, message: 'Getting a keyword failed try again later', data: null})
    }
}

export async function getKeywordsByKeywordNameController(request: Request, response: Response) {
    try {
        // validate the keywordName coming from the request parameters
        const validationResult = KeywordSchema.pick({keywordName: true}).safeParse(request.params)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // deconstruct the keywordName from the validated request parameters
        const {keywordName} = validationResult.data

        // grab the keywords by keywordName
        const data  = await selectKeywordsByKeywordName(keywordName)

        // return a response to the client with the requested information
        return response.json({status: 200, message: null, data})
    } catch (error) {
        return response.json({status: 500, message: 'Getting a keyword failed try again later', data: null})
    }
}