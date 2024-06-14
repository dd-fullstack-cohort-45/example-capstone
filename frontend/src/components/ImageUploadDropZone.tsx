"use client"


import React from "react";
import {useDropzone} from "react-dropzone";
import {FormikProps, FormikValues} from "formik";
import {Alert, TextInput} from "flowbite-react";
import {z} from "zod";

type Props = {
	formikProps: {
		setFieldValue: FormikProps<unknown>[`setFieldValue`],
		fieldValue: string,
		handleChange: FormikProps<unknown>[`handleChange`],
		handleBlur: FormikProps<unknown>[`handleBlur`],
		setFieldError: FormikProps<unknown>[`setFieldError`],
		setFieldTouched: FormikProps<unknown>[`setFieldTouched`],
	},
	setSelectedImage: React.Dispatch<React.SetStateAction<any>>,

}


export function ImageUploadDropZone(props: Props) {
	const {formikProps, setSelectedImage} = props

	const MAX_FILE_SIZE = 2000000
	const ACCEPTED_IMAGE_TYPES = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
		'image/svg+xml',
	]

	const FileSchema = z
		.instanceof(File)
		.refine((file) => {
			return ACCEPTED_IMAGE_TYPES.includes(file.type)
		},"image is the wrong file type")
		.refine((file) => {
			return file.size <= MAX_FILE_SIZE
		}, "image is too large")

	const onDrop = React.useCallback((acceptedFiles: any) => {

		const validationResult = FileSchema.safeParse(acceptedFiles[0])
		if(!validationResult.success) {
			formikProps.setFieldError(formikProps.fieldValue, validationResult.error.errors[0].message)

		} else {
			const formData = new FormData()
			formData.append('image', acceptedFiles[0])

			const fileReader = new FileReader()
			fileReader.readAsDataURL(acceptedFiles[0])
			fileReader.addEventListener("load", () => {
				setSelectedImage(fileReader.result)
			})

			formikProps.setFieldValue(formikProps.fieldValue, formData).catch((error) => {
				console.error(error)
			})

		}


	}, [formikProps, setSelectedImage])
	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

	return (

		<div {...getRootProps()}>
			<div className="mb-2 block">
				<label className="form-label" htmlFor="profileAvatar">Profile Avatar</label>
			</div>
			<TextInput
				aria-label="profile avatar file drag and drop area"
				aria-describedby="image drag drop area"
				className="form-control-file"
				accept="image/*"
				onChange={formikProps.handleChange}
				onBlur={formikProps.handleBlur}
				{...getInputProps()}
			/>
			{
				isDragActive ?
					<span className="align-items-center">Drop image here</span> :
					<span className="align-items-center">Drag and drop image here, or click here to select an image</span>
			}
		</div>


	)
}

type DisplayUploadErrorProps = {
	errors: FormikProps<FormikValues>['errors']
	field: string

}
export function DisplayUploadErrorProps(props: DisplayUploadErrorProps) {
	const {errors, field} = props
	if (errors[field]) {
		return (
			<Alert color="failure">
				{errors[field] as string}
			</Alert>
		)
	}
}
