import { Response } from 'express'
import { ZodError } from 'zod/lib'
import { Status } from './interfaces/Status'

/**
 * factory function that creates a status object to send back to the client
 * @param status an integer representing the status code
 * @param data to send back to the client
 * @param message
 */
export function createStatus (status: number, data: unknown, message: string | null): Status {
    return { status, data, message }
}

/**
 * helper function that sends an error response when a zod validation error occurs
 * @param response an object modeling the response that will be sent to the client.
 * @param error an object containing the errors from zod validation
 */
export function zodErrorResponse (response: Response, error: ZodError): Response<Status> {
    const message = error.issues[0].message
    return errorResponse(response, createStatus(418, null, message))
}

/**
 * helper function that sends an error response when a error occurs
 * @param response
 * @param status
 */
export function errorResponse (response: Response, status: Status): Response<Status> {
    return response.json(status)
}

/**
 * helper function that sends an error response when a server error occurs
 * @param response an object modeling the response that will be sent to the client.
 * @param defaultDataValue default value to send back to the client to help with rendering when an error occurs
 */
export function serverErrorResponse (response: Response, defaultDataValue: unknown = null): Response<Status> {
    return errorResponse(response, createStatus(500, defaultDataValue, 'internal server error occurred try again later'))
}