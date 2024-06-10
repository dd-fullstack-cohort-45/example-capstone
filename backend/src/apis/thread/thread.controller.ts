import {Request, Response} from 'express'
import {
    deleteThreadByThreadId,
    insertThread, selectAllReplyThreadsByThreadId,
    selectAllThreads, selectPageOfThreads,
    selectThreadByThreadId, selectThreadsByProfileName,
    selectThreadsByThreadProfileId,
    Thread
} from "./thread.model";
import {Status} from "../../utils/interfaces/Status";
import {PublicProfile} from "../profile/profile.model";
import {ThreadSchema} from "./thread.validator";
import {zodErrorResponse} from "../../utils/response.utils";
import {z} from "zod";
import {PublicProfileSchema} from "../profile/profile.validator";


/**
 * Posts a new thread to the database and returns a status. If successful, the status will contain the message "Thread created successfully." If unsuccessful, the status will contain the message "Error creating thread. Try again.".
 * @param request body must contain a threadContent, threadReplyThreadId, and threadImageUrl
 * @param response will contain a status object with a message and data if successful or a status with an error message and null data if unsuccessful
 */
export async function postThreadController(request: Request, response: Response): Promise<Response | undefined> {
    try {

        // validate the incoming request with the thread schema
        const validationResult = ThreadSchema.safeParse(request.body)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // if the validation succeeds, continue on with postThreadController logic below this line

        // get the thread content, thread reply thread id, and thread image url from the request body
        const {threadContent, threadReplyThreadId, threadImageUrl} = validationResult.data

        // get the profile from the session
        const profile: PublicProfile = request.session.profile as PublicProfile

        // set the thread profile id to the profile id from the session
        const threadProfileId: string = profile.profileId as string

        // create a new thread object with the threadProfileId, threadReplyThreadId, threadContent, and threadImageUrl
        const thread: Thread = {
            threadId: null,
            threadProfileId,
            threadReplyThreadId,
            threadContent,
            threadDatetime: null,
            threadImageUrl
        }

        // insert the thread into the database and store the result in a variable called result
        const result = await insertThread(thread)

        // return the response with the status code 200, a message, and the result as data
        const status: Status = {status: 200, message: result, data: null}
        return response.json(status)

        // if there is an error, return the response with the status code 500, an error message, and null data
    } catch (error) {
        console.log(error)
        return response.json({status: 500, message: 'Error creating thread. Try again.', data: null})
    }
}

/**
 * gets all threads from the database and returns them to the user in the response
 * @param request from the client to the server to get all threads
 * @param response from the server to the client with all threads or an error message
 */
export async function getAllThreads (request: Request, response: Response): Promise<Response<Status>> {
    try {

        // get the threads from the database and store it in a variable called data
        const data = await selectAllThreads()

        // return the response with the status code 200, a message, and the threads as data
        const status: Status = {status: 200, message: null, data}
        return response.json(status)

        // if there is an error, return the response with the status code 500, an error message, and null data
    } catch (error) {
        console.error(error)
        return response.json({
            status: 500,
            message: 'Error getting threads. Try again.',
            data: []
        })
    }
}

/**
 * gets all threads from the database by thread profile id and returns them to the user in the response
 * @param request from the client to the server to get all threads by thread profile id
 * @param response from the server to the client with all threads by thread profile id or an error message
 */
export async function getThreadsByThreadProfileIdController (request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request threadProfileId with the uuid schema
        const validationResult = z.string().uuid({message: 'please provide a valid threadProfileId'}).safeParse(request.params.threadProfileId)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the thread profile id from the request parameters
        const threadProfileId = validationResult.data

        // get the threads from the database by thread profile id and store it in a variable called data
        const data = await selectThreadsByThreadProfileId(threadProfileId)

        // return the response with the status code 200, a message, and the threads as data
        return response.json({status: 200, message: null, data})

        // if there is an error, return the response with the status code 500, an error message, and null data
    } catch (error) {
        return response.json({
            status: 500,
            message: '',
            data: []
        })
    }
}

/**
 * gets all threads from the database by thread profile id and returns them to the user in the response
 * @param request from the client to the server to get all threads by thread profile id
 * @param response from the server to the client with all threads by thread profile id or an error message
 */
export async function getThreadsByProfileNameController (request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request threadProfileId with the uuid schema
        const validationResult = PublicProfileSchema.pick({profileName: true}).safeParse(request.params.profileName)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the thread profile id from the request parameters
        const {profileName} = validationResult.data

        // get the threads from the database by thread profile id and store it in a variable called data
        const data = await selectThreadsByProfileName(profileName)

        // return the response with the status code 200, a message, and the threads as data
        return response.json({status: 200, message: null, data})

        // if there is an error, return the response with the status code 500, an error message, and null data
    } catch (error) {
        return response.json({
            status: 500,
            message: '',
            data: []
        })
    }
}

/**
 * gets a thread from the database by thread id and returns it to the user in the response
 * @param request from the client to the server to get a thread by thread id from
 * @param response from the server to the client with a thread by thread id or an error message
 */
export async function getThreadByThreadIdController (request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request threadId with the uuid schema
        const validationResult = z.string().uuid({message: 'please provide a valid threadId'}).safeParse(request.params.threadId)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the thread id from the request parameters
        const threadId = validationResult.data

        // get the thread from the database by thread id and store it in a variable called data
        const data = await selectThreadByThreadId(threadId)

        // return the response with the status code 200, a message, and the thread as data
        return response.json({status: 200, message: null, data})

        // if there is an error, return the response with the status code 500, an error message, and null data
    } catch (error) {
        return response.json({
            status: 500,
            message: '',
            data: []
        })
    }
}

/**
 * get all replies to a thread by the original thread id and return them to the user in the response
 * @param request from the client to the server to get all replies to a thread by the original thread id
 * @param response from the server to the client with all replies to a thread by the original thread id or an error message
 */
export async function getAllReplyThreadsByThreadIdController (request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request threadId with the uuid schema
        const validationResult = z.string().uuid({message: 'please provide a valid threadId'}).safeParse(request.params.threadId)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the thread id from the request parameters
        const threadId = validationResult.data


        const data = await selectAllReplyThreadsByThreadId(threadId)

        // return the response with the status code 200, a message, and the thread as data
        return response.json({status: 200, message: null, data})

        // if there is an error, return the response with the status code 500, an error message, and null data
    } catch (error) {
        return response.json({
            status: 500,
            message: '',
            data: []
        })
    }
}


/**
 * get page and request number of most recent threads from the database and return them to the user in the response
 * @param request includes next page number
 * @param response from the server to the client with page of threads or an error message
 */
export async function getPageOfThreadsController(request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request page with the number schema
        const validationResult = z.number().int({message: 'please provide a valid page number'}).safeParse(request.params.page)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the page number from the request parameters
        const page = validationResult.data

        // get the threads from the database by page number and store it in a variable called data
        const data = await selectPageOfThreads(Number(page))

        // return the response with the status code 200, a message, and the threads as data
        return response.json({status: 200, message: null, data})

        // if there is an error, return the response with the status code 500, an error message, and null data
    } catch (error) {
        return response.json({
            status: 500,
            message: '',
            data: []
        })
    }
}

/**
 * deletes a thread from the database by thread id and returns a status to the user in the response
 * @param request from the client to the server to delete a thread by thread id from the database
 * @param response from the server to the client with a status of 200 or an error message
 */
export async function deleteThreadByThreadIdController (request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request threadId with the uuid schema
        const validationResult = z.string().uuid({message: 'please provide a valid threadId'}).safeParse(request.params.threadId)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // get the profile from the session
        const profile: PublicProfile = request.session.profile as PublicProfile

        // set the thread profile id to the profile id from the session
        const threadProfileId: string = profile.profileId as string

        // get the thread id from the request parameters
        const threadId = validationResult.data

        // get the thread from the database by thread id
        const thread = await selectThreadByThreadId(threadId)

        // if the thread profile id does not match the thread profile id from the session, return a response to the client
        if(thread?.threadProfileId !== threadProfileId) {
            return response.json({
                status: 403,
                message: 'you are not allowed to delete this thread',
                data: null
            })
        }

        // delete the thread from the database by thread id
        const result = await deleteThreadByThreadId(threadId)

        // return the response with the status code 200, a message, and the thread as data
        return response.json({status: 200, message: result, data: null})

        // if there is an error, return the response with the status code 500, an error message, and null data
    } catch (error) {
        return response.json({
            status: 500,
            message: '',
            data: []
        })
    }
}