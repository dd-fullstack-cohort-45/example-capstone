"use client";
import React from "react";
import {PageProps} from "@/utils/interfaces/NextComponent";
import Image from "next/image";
import {Button, Label, TextInput} from "flowbite-react";
import {SignUpForm} from "@/app/sign-in/SignUpForm";
import {SignInForm} from "@/app/sign-in/SignInForm";


export default function Home(props: PageProps) {
	return (
		<>
			<section className="flex flex-auto gap-5 h-dvh items-center grow">

				<div className=" min-w-80 border border-black dark:border-amber-50 md:grid grid-rows-1 place-items-stretch self-center sm:place-items-stretch px-2 mx-auto  xl:gap-0 py-16  grid-cols-1 md:grid-cols-10">

					<div className=" h-fit hidden md:block mx-6  md:col-span-4">
						<Image src="/login-hero.png" width={259} height={387} priority={true} alt="person holding phone staring at twitter login page Photo by Akshar Dave🌻 on Unsplash"/>
					</div>

					<div className=" md:h-fit p-5  md:p-2 md:ms-4  md:w-2/3  mr-auto md:col-span-6">
						<SignInForm />
					</div>


				</div>
			</section>

		</>

	)
}