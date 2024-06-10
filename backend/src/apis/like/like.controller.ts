import {Request, Response} from 'express'
import {
    deleteLike,
    insertLike,
    Like,
    selectLikeByLikeId,
    selectLikesByLikeProfileId,
    selectLikesByLikeThreadId
} from "./like.model";
import {PublicProfile} from "../profile/profile.model";
import {Status} from "../../utils/interfaces/Status";
import {LikeSchema} from "./like.validator";
import {zodErrorResponse} from "../../utils/response.utils";
import {z} from "zod";

/**
 * Handles GET request for all likes associated with a thread
 * @param request object containing the like thread id
 * @param response object containing the status of the request and the likes associated with the thread
 */
export async function getLikesByLikeThreadIdController(request: Request, response: Response): Promise<Response> {
    try {

        // validate the likeProfileId coming from the request parameters
        const validationResult = z.string().uuid("Please provide a valid likeThreadId").safeParse(request.params.likeThreadId)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // if the validation succeeds, continue

        // deconstruct the like thread id from the request parameters
        const likeThreadId = validationResult.data

        // select the likes by like thread id
        const data = await selectLikesByLikeThreadId(likeThreadId)

        // return the status and the likes associated with the thread
        return response.json({status: 200, message: null, data})

        // if an error occurs, return the error to the user
    } catch (error) {
        return response.json({
            status: 500,
            message: '',
            data: []
        })
    }
}

/**
 * Handles GET request for all likes associated with a profile
 * @param request object containing the like profile id
 * @param response object containing the status of the request and the likes associated with the profile
 * @returns status object containing the status of the request and the likes associated with the profile
 */
export async function getLikesByLikeProfileIdController(request: Request, response: Response): Promise<Response> {
    try {

        // validate the likeProfileId coming from the request parameters
        const validationResult = z.string().uuid("Please provide a valid likeProfileId").safeParse(request.params.likeProfileId)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // if the validation succeeds, continue

        // deconstruct the like Profile id from the request parameters
        const likeProfileId = validationResult.data

        // select the likes by like profile id
        const data = await selectLikesByLikeProfileId(likeProfileId)

        // return the status and the likes associated with the profile
        return response.json({status: 200, message: null, data})

        // if an error occurs, return the error to the user
    } catch (error) {
        return response.json({
            status: 500,
            message: '',
            data: []
        })
    }
}

/**
 * Handles POST request to toggle a like on a thread by inserting or deleting a like from the like table
 * @param request object containing the like thread id
 * @param response object containing the status of the request
 * @returns status object indicating whether the like was inserted or deleted
 */
export async function toggleLikeController(request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request with the like schema
        const validationResult = LikeSchema.safeParse(request.body)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // if the validation succeeds, continue

        // deconstruct the like thread id from the validation result
        const {likeThreadId} = validationResult.data

        // deconstruct the profile from the session
        const profile = request.session.profile

        // @ts-ignore
        // deconstruct the profile id from the profile
        const likeProfileId = profile.profileId

        // create a like object
        const like: Like = {
            likeProfileId,
            likeThreadId,
            likeDatetime: null
        }

        // create a status object
        const status: Status = {
            status: 200,
            message: '',
            data: null
        }

        // select the like by like id to determine if the like should be inserted or deleted
        const selectedLike: Like | null = await selectLikeByLikeId(like)

        // if the like is null, insert the like into the like table
        if (selectedLike === null) {
            status.message = await insertLike(like)
            // if the like is not null, delete the like from the like table
        } else {
            status.message = await deleteLike(like)
        }

        // return the status to the user
        return response.json(status)

        // if an error occurs, return the error to the user
    } catch (error: any) {
        return (response.json({status: 500, data: null, message: error.message}))
    }
}

/**
 * Handles POST request to insert a like into the like table
 * @param request object containing the like thread id and the profile id
 * @param response object containing the status of the request
 * @returns status object indicating if the like was inserted
 */
export async function postLikeController(request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request with the like schema
        const validationResult = LikeSchema.safeParse(request.body)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // if the validation succeeds, continue

        // deconstruct the like thread id from the validation result
        const {likeThreadId} = validationResult.data

        // deconstruct the profile from the session
        const profile = request.session.profile as PublicProfile

        // deconstruct the profile id from the profile
        const likeProfileId = profile.profileId as string

        // create a like object
        const like: Like = {
            likeProfileId,
            likeThreadId,
            likeDatetime: null
        }

        // create a status object
        const status: Status = {
            status: 200,
            message: '',
            data: null
        }

        // insert the like into the like table
        status.message = await insertLike(like)

        // return the status to the user
        return response.json(status)

        // if an error occurs, return the error to the user
    } catch (error: any) {
        return (response.json({status: 500, data: null, message: error.message}))
    }
}

/**
 * Handles DELETE request to delete a like from the like table
 * @param request object containing the like thread id
 * @param response object containing the status of the request
 * @returns status object indicating if the like was deleted
 */
export async function deleteLikeController(request: Request, response: Response): Promise<Response<Status>> {
    try {

        // validate the incoming request with the like schema
        const validationResult = LikeSchema.safeParse(request.body)

        // if the validation fails, return a response to the client
        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        // if the validation succeeds, continue

        // deconstruct the like thread id from the validation result
        const {likeThreadId} = validationResult.data

        // deconstruct the profile from the session
        const profile = request.session.profile as PublicProfile

        // deconstruct the profile id from the profile
        const likeProfileId = profile.profileId as string

        // create a like object
        const like: Like = {
            likeProfileId,
            likeThreadId,
            likeDatetime: null
        }

        // create a status object
        const status: Status = {
            status: 200,
            message: '',
            data: null
        }

        // delete the like from the like table
        status.message = await deleteLike(like)

        // return the status to the user
        return response.json(status)

        // if an error occurs, return the error to the user
    } catch (error: any) {
        return (response.json({status: 500, data: null, message: error.message}))
    }
}