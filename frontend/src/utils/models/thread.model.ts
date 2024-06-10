import { z } from 'zod'

export const ThreadSchema = z.object({
	threadId: z.string({required_error: 'please provide a valid threadId or null', invalid_type_error:"threadId must be a uuid or null"}).uuid({message: 'please provide a valid uuid for threadId'}),
	threadProfileId: z.string({required_error: 'please provide a valid threadProfileId', invalid_type_error: "threadProfileId must be a uuid"}).uuid({message: 'please provide a valid uuid for threadProfileId'}),
	threadReplyThreadId: z.string({required_error: 'please provide a valid threadReplyThreadId or null', invalid_type_error: "threadReplyThreadId must be a uuid"}).uuid({message: 'please provide a valid uuid for threadReplyThreadId'}).nullable(),
	threadContent:
		z.string({required_error: "threadContent is a required field"}).max(255, {message: 'please provide a valid threadContent'}),
	threadDatetime:
		z.coerce.date({required_error: 'please provide a valid threadDatetime or null', invalid_type_error: "thread date time is not a valid date"}).nullable(),
	threadImageUrl:z.string({required_error: 'please provide a valid threadImageUrl or null', invalid_type_error: 'threadImageUrl must be a string or null'}).trim().url({message: 'please provide a valid URL for threadImageUrl'}).max(255, {message: 'please provide a valid threadImageUrl (max 255 characters)'}).nullable(),
})
export type Thread = z.infer<typeof ThreadSchema>


export async function fetchAllThreads() : Promise<Thread[]> {
	const {data} = await fetch(`${process.env.PUBLIC_API_URL}/apis/thread`, {
		method: "get",
		headers: {
			'Content-Type': 'application/json',
		},

	}).then((response: Response) => {
		if(!response.ok) {
			throw new Error('Error fetching threads')
		} else {
			return response.json()
		}

	})

	return ThreadSchema.array().parse(data)

}