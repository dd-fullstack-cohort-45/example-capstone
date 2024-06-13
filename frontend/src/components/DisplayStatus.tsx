import {Alert} from "flowbite-react";

type Props = {
	status: undefined | {
		type: string,
		message: string
	}
}


export function DisplayStatus(props: Props) {
	const {status} = props
	if(status) {
	return(
		<Alert color={status.type}>
			{status.message}
		</Alert>

	)
	}
}