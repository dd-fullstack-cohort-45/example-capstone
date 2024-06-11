import {Thread} from "@/utils/models/thread.model";
import {fetchProfileByProfileId} from "@/utils/models/profile.model";

type Props = {
	thread: Thread
}

export async function ThreadCard(props: Props) {
	const {thread} = props
	const profile = await fetchProfileByProfileId(thread.threadProfileId)

	return (
		<article className="p-6 border border-gray-200 text-base">
			<footer className="flex justify-between items-center mb-2">
				<div className="flex items-center">
					<p className="inline-flex items-center mr-3 text-sm font-semibold"><img
						className="mr-2 w-6 h-6 rounded-full"
						// src={profile.profileImageUrl ?? '/profile.png'}
						alt="Michael Gough"/>{profile.profileName}</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						<time dateTime="2022-02-08"
						      title="February 8th, 2022">{thread.threadDatetime?.toLocaleString()}
						</time>
					</p>
				</div>
			</footer>
			<p className="text-gray-500 dark:text-gray-400">{thread.threadContent}</p>
			<div className="flex items-center mt-4 space-x-4">
				<button type="button"
				        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
					<svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
					     viewBox="0 0 20 18">
						<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
						      d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
					</svg>
					Reply
				</button>
			</div>
		</article>
	)

}