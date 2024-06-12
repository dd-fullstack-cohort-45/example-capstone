import {getSession} from "@/utils/fetchSession";
import {fetchProfileByProfileName} from "@/utils/models/profile.model";
import {fetchThreadsByProfileId} from "@/utils/models/thread.model";
import {redirect} from "next/navigation";

type Props = {
	params:{
		profileName: string
	}
}
export default async function (props: Props) {

	const {profileName} = props.params
	const session = await getSession()


	return (
		<>
			<main className="container lg:w-2/3 grid mx-auto">
				h1 Welcome to the profile page
			</main>
		</>
	)
}


export async function getProfileAndThreads(profileName: string) {
	const profile = await fetchProfileByProfileName(profileName)
	if(profile === null) {
		return(redirect('/404'))
	}
	const threads = await fetchThreadsByProfileId(profile.profileId)
	return {profile, threads}
}