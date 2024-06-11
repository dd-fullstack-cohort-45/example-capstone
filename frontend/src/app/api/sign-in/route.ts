import {NextResponse} from "next/server";
import {cookies} from "next/headers";
export async function POST(request: Request){


	const data = await request.json()


	const responseFromServer =  await fetch(`${process.env.PUBLIC_API_URL}/apis/sign-in`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		}
	)

	const authorization  =  responseFromServer.headers.get("authorization")

	if (authorization) {
		const cookieStore = cookies()
		cookieStore.set("jwt-token",
			authorization,
			{path: "/", maxAge:10_800_000, sameSite: "strict", httpOnly: true, secure: true, domain: "localhost"}
		)
	}


	return responseFromServer
}
