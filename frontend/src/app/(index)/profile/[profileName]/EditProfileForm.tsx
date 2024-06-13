import {Profile, ProfileSchema} from "@/utils/models/profile.model";
import {Button, Label, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import React from "react";
import {Formik, FormikHelpers, FormikProps} from "formik";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {z} from "zod";
import {Session} from "@/utils/fetchSession";
import {ImageUploadDropZone} from "@/components/ImageUploadDropZone";
import {useRouter} from "next/navigation";

type Props = {
	authorization: string|undefined,
	profile: Profile,
}


const MAX_FILE_SIZE = 2000000
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/svg+xml',
]

const FormSchema = ProfileSchema
	.pick({profileName: true, profileAbout: true})
	.extend({
		profileImageUrl: z
			.any()

			// To not allow files other than images
			.refine((files: any) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
				message: '.jpg, .jpeg, .png and .webp files are accepted.',
			})
			// To not allow files larger than 2MB
			.refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
				message: `Max file size is 2MB.`,
			})
			.nullable(),
	})

type FormValues = z.infer<typeof FormSchema>

export function EditProfileForm(props: Props) {
	const {authorization, profile} = props

	if (authorization === undefined ) {
		return <></>
	}

	const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
		const {setStatus, resetForm} = actions
		const router = useRouter()






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
					router.refresh()
					type = 'success'
				}
				setStatus({type, message: json.message})
			})
		}

		function uploadImage(profileImageUrl: any) {
			fetch("/apis/image/upload/single",{
				method: "POST",
				headers: {
					'Authorization': authorization ?? ""
				},
				body: profileImageUrl
			})
				.then(response => response.json())
				.then(data => {
					if(data.status !== 200) {
						setStatus({type: 'failure', message: data.message})
					}
					else {
						profile.profileImageUrl = data.imageUrl
						profile.profileName = values.profileName
						profile.profileAbout = values.profileAbout
						submitUpdatedProfile(profile)
					}
				})


		}
	}


	return (
		<Formik
			initialValues={{profileAbout: props.profile.profileAbout, profileName: props.profile.profileName}}
			onSubmit={handleSubmit}
			validationSchema={toFormikValidationSchema(FormSchema)}
		>
			{EditProfileFormContent}
		</Formik>
	)
}


export function EditProfileFormContent(props: FormikProps<FormValues>) {
	const {status, values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue} = props

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
						<form className="flex min-h-auto gap-4 min-w-full flex-col grow">
							<h1 className="text-3xl font-bold">Edit Profile</h1>
							<div>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="profileName" value="name"/>
								</div>
								<TextInput autoComplete='username' id="profileName" type="text" required/>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="profileAbout" value={"Profile About"}/>
								</div>
								<TextInput id="profileAbout" type="text"/>
							</div>
							<ImageUploadDropZone
								formikProps={{ handleBlur, handleChange, setFieldValue, fieldValue: 'profileImageUrl'}}
								setSelectedImage={setSelectedImage}
								/>
							<Button type="submit"> Submit</Button>
						</form>
					</div>
				</ModalBody>
			</Modal>
		</>
	)
}
