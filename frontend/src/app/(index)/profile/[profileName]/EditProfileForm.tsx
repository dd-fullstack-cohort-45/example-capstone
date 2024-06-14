'use client'
import {fetchProfileByProfileName, Profile, ProfileSchema} from "@/utils/models/profile.model";
import {Button, Label, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import React from "react";
import {Formik, FormikHelpers, FormikProps} from "formik";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {z} from "zod";
import {Session} from "@/utils/fetchSession";
import {DisplayUploadErrorProps, ImageUploadDropZone} from "@/components/ImageUploadDropZone";
import {useRouter} from "next/navigation";
import {DisplayError} from "@/components/DisplayError";
import {DisplayStatus} from "@/components/DisplayStatus";
import {FormDebugger} from "@/components/FormDebugger";

type Props = {
	authorization: string|undefined,
	profile: Profile,
}




const FormSchema = ProfileSchema
	.pick({profileName: true, profileAbout: true})
	.extend({
		profileImageUrl: z
			.any()
			.optional()
	})

type FormValues = z.infer<typeof FormSchema>

export function EditProfileForm(props: Props) {
	const {authorization, profile} = props

	const router = useRouter()

	if (authorization === undefined ) {
		return <></>
	}

	function handleSubmit(values: FormValues, actions: FormikHelpers<FormValues>) {
		const {setStatus, resetForm} = actions


		if(profile.profileName === values.profileName) {
			preformUpdate()
		} else {
			fetch(`/apis/profile/profileName/${values.profileName}`).then(response => response.json())
				.then((json) => {
					if(json.data === null) {
						preformUpdate()
					}
					else {
						setStatus({type: 'failure', message: 'Profile name already exists'})
					}
				})
		}

		function preformUpdate() {
			if(values.profileImageUrl) {
				uploadImage(values.profileImageUrl)
			}
			else {
				profile.profileName = values.profileName
				profile.profileAbout = values.profileAbout
				submitUpdatedProfile(profile)
			}

		}
		function submitUpdatedProfile(profile: Profile) {
			// This function should send a request to the backend to update the profile regardless if an image was uploaded or not
			fetch(`/apis/profile/${profile.profileId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': authorization ?? "",
				},
				body: JSON.stringify(profile)
			}).then(
				(response: Response) => {
				if (response.ok) {
					return response.json()
				}
				throw new Error('Network response was not ok.')
			}).then((json) => {
				let type = 'failure'
				if (json.status === 200) {
					resetForm()
					type = 'success'
					if(profile.profileName !== values.profileName) {
						setTimeout(() => {
							router.push(`/profile/${values.profileName}`)
							}
						)
					} else {
						router.refresh()
					}
				}
				setStatus({type, message: json.message})
			})
		}

		function uploadImage(profileImageUrl: any) {
			fetch("/apis/image/",{
				method: "POST",
				headers: {
					'Authorization': authorization ?? ""
				},
				body: profileImageUrl
			})
				.then(response => response.json())
				.then(json => {
					if(json.status !== 200) {
						setStatus({type: 'failure', message: json.message})
					}
					else {
						profile.profileImageUrl = json.message
						profile.profileName = values.profileName
						profile.profileAbout = values.profileAbout
						console.log(profile)
						submitUpdatedProfile(profile)
					}
				})
		}
	}

	return (
		<Formik
			initialValues={
			{
				profileAbout: props.profile.profileAbout, profileName: props.profile.profileName}}
			onSubmit={handleSubmit}
			validationSchema={toFormikValidationSchema(FormSchema)}
		>
			{EditProfileFormContent}
		</Formik>
	)
}


export function EditProfileFormContent(props: FormikProps<FormValues>) {
	const {status, values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue, setFieldError, setFieldTouched} = props

	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
	const [selectedImage, setSelectedImage] = React.useState<string|null>(null)

	return (
		<>
			<Button
				onClick={() => {
					setIsModalOpen(true)
				}}>
				Edit Profile
			</Button>
			<Modal id='sign-up-modal' show={isModalOpen} onClose={() => {
				setIsModalOpen(false)
			}}>
				<ModalHeader/>
				<ModalBody>
					<div className="space-y-2">
						<form onSubmit={handleSubmit} className="flex min-h-auto gap-4 min-w-full flex-col grow">
							<h1 className="text-3xl font-bold">Edit Profile</h1>
							<div>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="profileName" value="name"/>
								</div>
								<TextInput
									autoComplete='username'
									name={'profileName'}
									id="profileName"
									type="text"
									required
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.profileName}
								/>
								<DisplayError errors={errors} touched={touched} field={'profileName'}/>
							</div>

							<div>
								<div className="mb-2 block">
									<Label htmlFor="profileAbout" value={"Profile About"}/>
								</div>
								<TextInput
									id="profileAbout"
									type="text"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.profileAbout ?? ""}
									name={'profileAbout'}
								/>
								<DisplayError errors={errors} touched={touched} field={'profileName'}/>
							</div>

							<ImageUploadDropZone
								formikProps={{ setFieldError, setFieldTouched ,handleBlur, handleChange, setFieldValue, fieldValue: 'profileImageUrl'}}
								setSelectedImage={setSelectedImage}
								/>
							<DisplayUploadErrorProps errors={errors} field={'profileImageUrl'}/>
							<div className={"flex"}>
								<Button className={"mr-1"} type="submit"> Submit</Button>
								<Button  className={'ml-1'} color={"red"} type="reset"> Reset</Button>
							</div>
						</form>
						<DisplayStatus status={status} />
						<FormDebugger {...props} />
					</div>
				</ModalBody>
			</Modal>
		</>
	)
}
