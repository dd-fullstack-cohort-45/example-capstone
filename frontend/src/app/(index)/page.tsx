"use server"
import {fetchAllThreads} from "@/utils/models/thread.model";
import {ThreadCard} from "@/components/ThreadCard";
import {getSession} from "@/utils/fetchSession";
import {redirect} from "next/navigation";
import {ThreadForm} from "@/app/(index)/ThreadForm";
import {Suspense} from "react";

export default async function () {
	const threads = await fetchAllThreads()
	console.log(threads)

	const session = await getSession()
	if(session === undefined) {
		return  redirect('/sign-in')

	}

	const profile = session.profile

	return (
		<>
			<main className="container lg:w-2/3 grid mx-auto">
				<div className="col-span-full p-0 border border-base-content">
					<h1 className="text-3x p-4 font-bold">Welcome  {profile.profileName}</h1>
					<ThreadForm session={session} />
					{threads.map((thread) => <ThreadCard thread={thread} key={thread.threadId} />)}
				</div>
			</main>
		</>
	)
}