import { gsap } from "gsap";

console.log('js');

gsap.to('.animate', {
	'x': 100,
	duration: 1,
	onComplete(){
		console.log('animation complete, ok')
	}
})