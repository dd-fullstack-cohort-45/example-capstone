'use client'

import {Session} from "@/utils/fetchSession";
import {useRouter} from "next/navigation";
import {ThreadSchema} from "@/utils/models/thread.model";
import {z} from "zod";
import {Formik, FormikHelpers, FormikProps} from "formik";
import {setHeaders} from "@/utils/setHeaders";
import {DisplayError} from "@/components/DisplayError";
import {DisplayStatus} from "@/components/DisplayStatus";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {FormDebugger} from "@/components/FormDebugger";

type Props = {
	session: Session
}
const FormSchema = ThreadSchema.pick({threadContent: true})

type Values = z.infer<typeof FormSchema>

export function ThreadForm(props: Props ) {

	const session = props.session


	const router = useRouter()

	const initialValues = {
		threadContent: "",
	}



	const handleSubmit = (values: Values, actions: FormikHelpers<Values>) => {
		const thread = {
			threadProfileId: session.profile.profileId,
			threadId: null,
			threadReplyThreadId: null,
			threadContent: values.threadContent,
			threadDatetime: null,
			threadImageUrl: null
		}
		const {setStatus, resetForm} = actions
		fetch(`/apis/thread`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"authorization": `${session.authorization}`
			},
			body: JSON.stringify(thread)
		}).then(response => response.json()).then(json => {
			let type = 'failure'
			if (json.status === 200) {
				type ='success'
				resetForm()
				router.refresh()
			}
			setStatus({type: type, message: json.message})
		})
	}


	return(
		<>
			<Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={toFormikValidationSchema(FormSchema)}>
				{ThreadFormContent}
			</Formik>
		</>
	)
}


export function ThreadFormContent(props: FormikProps<Values>) {
	const {handleSubmit, handleChange, handleBlur, status, resetForm, errors, touched, values} = props

	return(
		<>
		<form onSubmit={handleSubmit}>
		<div className="w-full border border-gray-200">
			<div className="px-4 py-2 bg-white dark:bg-gray-800">
				<label htmlFor="comment" className="sr-only">Your Post</label>
				<textarea
					onChange={handleChange}
					onBlur={handleBlur}
					value={values.threadContent}
					name={"threadContent"}
					id="comment"
					rows={4}
					className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400">
				</textarea>
				<DisplayError errors={errors} touched={touched} field={"threadContent"}/>
			</div>
			<div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
				<button type="submit"
				        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
					Post comment
				</button>
				<div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">


					<button type="button"
					        className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
						<svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
						     viewBox="0 0 20 18">
							<path
								d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
						</svg>
						<span className="sr-only">Upload image</span>

					</button>
				</div>
			</div>
		</div>
		</form>
			<DisplayStatus status={status} />
			<FormDebugger {...props} />
		</>
	)

}