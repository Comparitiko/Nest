// import { templateString } from './bases/01-types'
// import { bulbasaur } from "./bases/02-objects";
// import {charmander} from './bases/04-injection'
// import { charmander } from './bases/05-decorators'
import { charmander } from './bases/06-decorators2'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<div>
	<h1>${charmander}</h1>
		<h1>Hello World!</h1>
	</div>
`
