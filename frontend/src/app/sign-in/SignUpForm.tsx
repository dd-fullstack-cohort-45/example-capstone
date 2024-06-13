'use client'
import {Button, Label, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import React from "react";

export function SignUpForm() {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
	return (
		<>
			<a href='#sign-up-modal' className="block cursor-pointer text-blue-500 active:text-purple-500 " onClick={() => {
				setIsModalOpen(true)
			}}>Dont have an account?</a>
			<Modal id='sign-up-modal' show={isModalOpen} onClose={() => {
				setIsModalOpen(false)
			}}>
				<ModalHeader />
				<ModalBody>

					<div className="space-y-4">
				<form className="flex min-h-auto gap-4 min-w-full flex-col grow">
					<h1 className="text-3xl font-bold">Create an account.</h1>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="email1" value="email"/>
						</div>
						<TextInput autoComplete='email' id="email1" type="email"  required/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="profileName"  value="name"/>
						</div>
						<TextInput autoComplete='username' id="profileName" type="text"  required/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="profilePassword" value="password"/>
						</div>
						<TextInput autoComplete={'new-password'} id="profilePassword" type="password" required/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="profilePasswordConfirm" value="password confirm"/>
						</div>
						<TextInput id="profilePasswordConfirm" autoComplete={'new-password confirm'} type="password" required/>
					</div>
					<Button type="submit">Submit</Button>
				</form>
					</div>
				</ModalBody>
			</Modal>
		</>
	)
}