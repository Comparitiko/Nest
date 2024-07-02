// Diferentes tipos de variables
const name = 'comparitiko'
const age = 23
const isStudent = true


export const templateString = `
	<div>
		<h1>Hello ${name}!</h1>
		<h2>You are ${age} years old.</h2>
		${isStudent ? '<h3>You are a student.</h3>' : 'You are not a student.'}
		<h3>Suma de 2 y 2 es igual a ${2 + 2}.</h3>
		<h4>
			${
				isStudent
					? 'You are a student.'
					: 'You are not a student'
			}
		</h4>
	</div>
`