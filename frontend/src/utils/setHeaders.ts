import {headers as incomingHeaders} from "next/dist/client/components/headers";
import {getSession} from "@/utils/fetchSession";
import { cookies } from 'next/headers'

export function setHeaders(authorization?:string) {
	const headers = new Headers()
	headers.append('Content-Type', 'application/json')
	const session =  getSession()

	if(authorization) {
		headers.append("authorization", authorization)
	}

	for (const pair of incomingHeaders().entries()) {
		headers.append(pair[0], pair[1])
	}
	return headers
}