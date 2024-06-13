import {getSession} from "@/utils/fetchSession";
import {fetchProfileByProfileName, Profile} from "@/utils/models/profile.model";
import {fetchThreadsByProfileId, Thread} from "@/utils/models/thread.model";
import {redirect} from "next/navigation";
import {ThreadCard} from "@/components/ThreadCard";

type Props = {
	params:{
		profileName: string
	}
}
export default async function (props: Props) {

	const {profileName} = props.params
	const session = await getSession()
const signedInUser = session?.profile


	const {profile, threads} = await getProfileAndThreads(profileName)


	const isSignedInUser = signedInUser?.profileId === profile.profileId

	return (
		<>
			<main className="container lg:w-2/3 grid mx-auto">
				<h1> Welcome to the profile page of {profile.profileName}</h1>

				{threads.map((thread) => <ThreadCard thread={thread} key={thread.threadId} />)}
			</main>
		</>
	)
}


export async function getProfileAndThreads(profileName: string) : Promise<{profile: Profile, threads: Thread[]}> {
	const profile = await fetchProfileByProfileName(profileName)
	if(profile === null) {
		return(redirect('/404'))
	}
	const threads = await fetchThreadsByProfileId(profile.profileId)
	return {profile, threads}
}