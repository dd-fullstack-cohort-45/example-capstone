"use client"
export const FormDebugger =( props: any) => (
	<div style={{margin: '1rem 0'}}>
		<h3 style={{fontFamily: 'monospace'}}>.</h3>
		<pre
			style={{

				fontSize: '.65rem',
				padding: '.5rem',
			}}
		>
      <strong>props</strong> ={' '}
			{JSON.stringify(props, null, 2)}
    </pre>
	</div>
);