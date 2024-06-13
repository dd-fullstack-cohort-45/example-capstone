"use client"


import React from "react";
import {useDropzone} from "react-dropzone";
import {FormikProps} from "formik";
import {TextInput} from "flowbite-react";

type Props = {
	formikProps: {
		setFieldValue: FormikProps<unknown>[`setFieldValue`],
		fieldValue: string,
		handleChange: FormikProps<unknown>[`handleChange`],
		handleBlur: FormikProps<unknown>[`handleBlur`],
	},
	setSelectedImage: React.Dispatch<React.SetStateAction<any>>,

}


export function ImageUploadDropZone(props: Props) {
	const {formikProps, setSelectedImage} = props

	const onDrop = React.useCallback((acceptedFiles: any) => {

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

	}, [formikProps])
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
