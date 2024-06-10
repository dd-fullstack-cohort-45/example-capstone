import {NextFunction, Request, Response} from 'express'
import {verify} from 'jsonwebtoken'
import {Status} from '../interfaces/Status'
import {PublicProfile} from "../../apis/profile/profile.model";


export function isLoggedInController(request: Request, response: Response, next: NextFunction): Response | void {
  //set a predefined response if the user is not logged in
  const status: Status = {status: 401, message: 'Please login', data: null}
  try {
    // grab the profile off of the session
    const profile: PublicProfile | undefined = request.session?.profile

    //grab the signature off of the session
    const signature: string | undefined = request.session?.signature

    //grab the unparsed jwt token off of the request header
    const unverifiedJwtToken: string | undefined = request.headers?.authorization

    //if the profile signature or jwt token are undefined return the predefined status
    if (profile === undefined || signature === undefined || unverifiedJwtToken == undefined) {
      return response.json(status)
    }

    //verify the jwt token from the request header matches the JWT token from the session if the tokens do not match return the predefined status
    if (unverifiedJwtToken !== request.session?.jwt) {
      return response.json(status)
    }

    // verify that the jwt token from the request is valid
    verify(unverifiedJwtToken, signature)

    //if the jwt token is verified without throwing an error  call the next controller
    return next()
  } catch (error: unknown) {
    // if an error is thrown return the predefined status
    return response.json(status)

  }

}



