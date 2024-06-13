'use client'


import {Button, Label, TextInput} from "flowbite-react";
import {SignUpForm} from "@/app/sign-in/SignUpForm";
import React from "react";
import {Formik, FormikHelpers, FormikProps} from "formik";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {FormDebugger} from "@/components/FormDebugger";
import {DisplayError} from "@/components/DisplayError";
import {DisplayStatus} from "@/components/DisplayStatus";

const formSchema =  z.object({
	profilePassword: z.string({
		required_error: "password is required to sign in",
		invalid_type_error:"password must be text"
	}).min(8, { message: 'please provide a valid password (min 8 characters)' })
		.max(32, { message: 'please provide a valid password (max 32 characters)' }),
	profileEmail: z.string({
		required_error: "email is required to sign in",
		invalid_type_error:"email must be text"
	}).email({ message: 'please provide a valid email' })
		.max(128, { message: 'please provide a valid email (max 128 characters)'})
})

type FormSchema = z.infer<typeof formSchema>

export function SignInForm() {

	const router = useRouter()

	const initialValues = {
		profileEmail: '',
		profilePassword: ''
	}



	const handleSubmit =  (values: FormSchema, actions: FormikHelpers<FormSchema>) => {
		const {profileEmail, profilePassword} = values
		const {setStatus, resetForm} = actions

		// Call the Sign in Api
		fetch('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify({profileEmail, profilePassword}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(response => {
			if (response.ok) {
				return response.json()
			}
			throw new Error('Network response was not ok.')
		}).then(json => {
			let type = 'failure'
			if (json.status === 200) {
				resetForm()
				router.refresh()
				type = 'success'
			}
			setStatus({type, message: json.message})
		})
	}


	return (
		<Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={toFormikValidationSchema(formSchema)} >
			{SignInFormContent}
		</Formik>

	)
}


function SignInFormContent(props: FormikProps<FormSchema>) {

	const {
		status,
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		handleSubmit,
		handleReset
	} = props;


	return (
		<>
			<form onSubmit={handleSubmit} className="flex  flex-col mx-auto gap-4">
				<h1 className="text-3xl font-bold">Welcome back.</h1>
				<div>
					<div className="mb-2 block">
						<Label htmlFor="email1" value="Your email"/>
					</div>
					<TextInput
						autoComplete='email'
						value={values.profileEmail}
						onBlur={handleBlur}
						onChange={handleChange}
						id="email1"
						type="email"
						name="profileEmail"
					/>
					<DisplayError errors={errors} touched={touched} field={'profileEmail'}/>
				</div>
				<div>
					<div className="mb-2 block">
						<Label htmlFor="password1" value="Your password"/>
					</div>
					<TextInput
						autoComplete='current-password'
						value={values.profilePassword}
						onBlur={handleBlur}
						onChange={handleChange}
						name="profilePassword"
						id="password1"
						type="password"
					/>
					<DisplayError errors={errors} touched={touched} field={'profilePassword'}/>
				</div>
				<SignUpForm/>
				<div className="flex">
					<Button className='mr-3' color={'failure'} type={'reset'} onClick={handleReset}>Reset</Button>
					<Button className={'ml-3'} color={'success'} type="submit">Submit</Button>
				</div>
				<DisplayStatus status={status} />
			</form>
			<FormDebugger {...props} />
		</>
	)
}