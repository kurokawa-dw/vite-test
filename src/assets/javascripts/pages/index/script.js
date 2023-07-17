import { gsap } from "gsap";


const indexPage = () => {
	console.log('トップページ')

	gsap.to('.animate', {
		'x': 100,
		duration: 1,
		onComplete(){
			console.log('animation complete, ok')
		}
	})
}

export default indexPage;