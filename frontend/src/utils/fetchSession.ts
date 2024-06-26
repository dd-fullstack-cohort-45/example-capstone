"use server"
unstable_noStore()
import {unstable_noStore} from "next/cache";
import {Profile, ProfileSchema} from "@/utils/models/profile.model";
import {cookies} from "next/headers";
import {jwtDecode} from "jwt-decode";




export type Session = {
	profile: Profile,
	authorization: string
	exp: number
}

let session : Session|undefined = undefined

const currentTimeInSeconds = new Date().getTime() / 1000

export async function getSession(): Promise<Session|undefined > {



	const cookieStore = cookies()
	const jwtToken = cookieStore.get("jwt-token")
	console.log(jwtToken)
	if (session === undefined &&  jwtToken) {
		await setJwtToken(jwtToken.value)
		return session
	} else {
		return session
	}

}

export async function clearSession() {
	const cookieStore = cookies()
	cookieStore.delete("jwt-token")
	cookieStore.delete("connect.sid")
	session = undefined
}


export async  function setJwtToken(jwtToken: string) {
	try {
		const  parsedJwtToken = jwtDecode(jwtToken) as any
		console.log(parsedJwtToken)

		if(parsedJwtToken &&  currentTimeInSeconds < parsedJwtToken.exp) {
			session = {
				profile: ProfileSchema.parse(parsedJwtToken.auth),
				authorization: jwtToken,
				exp: parsedJwtToken.exp
			}

		} else {
			session = undefined
		}


	} catch (error) {
		console.error(error)
		throw new Error('Invalid jwt token')
		session = undefined
	}
}