'use client'

import {Alert} from "flowbite-react"
import {FormikProps, FormikValues} from "formik";

type Props = {
	errors: FormikProps<FormikValues>['errors']
	touched: FormikProps<FormikValues>['touched']
	field: string

}

export function DisplayError(props: Props) {
	const {errors, touched, field} = props
	if (errors[field] && touched[field]) {
		return (
			<Alert color="failure">
				{errors[field] as string}
			</Alert>
		)
	}
}