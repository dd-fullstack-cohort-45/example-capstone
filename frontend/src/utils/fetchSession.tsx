"use server"
import {Profile, ProfileSchema} from "@/utils/models/profile.model";
import {cookies} from "next/headers";
import {jwtDecode} from "jwt-decode";




export type Session = {
	profile: Profile,
	authorization: string
	exp: number
}

const currentTimeInSeconds = new Date().getTime() / 1000

export async function getSession(): Promise<Session | null> {

	const cookieStore = cookies()
	const jwtToken = cookieStore.get("jwt-token")
	if (jwtToken) {
	return setJwtToken(jwtToken.value)

	} else {
		return null
	}

}

export async function clearSession() {
	const cookieStore = cookies()
	cookieStore.delete("jwt-token")
	cookieStore.delete("connect.sid")

}


function setJwtToken(jwtToken: string) : {profile: Profile, authorization: string, exp: number}| null {
	try {
		const  parsedJwtToken = jwtDecode(jwtToken) as any



		if(parsedJwtToken &&  currentTimeInSeconds < parsedJwtToken.exp) {
			return  {
				profile: ProfileSchema.parse(parsedJwtToken.auth),
				authorization: jwtToken,
				exp: parsedJwtToken.exp
			}

		} else {
			return null
		}


	} catch (error) {
		throw  new Error("Invalid JWT Token")
	}
}

