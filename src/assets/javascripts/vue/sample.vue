<script setup>
console.log('vue-------------')

import { ref } from 'vue';
const list = ref([
	'list1',
	'list2',
	'list3',
	'list4',
	'list5',
])

const listSet = () => {
	// console.log(list.value.length);
	const num = list.value.length + 1;
	const value = `list${num}`;
	// console.log(value);
	list.value.push(value);
}

</script>

<template>
	<div>
		<div class="text">vueですよ</div>

		<ul>
			<li v-for="(item, index) in list" :key="index">
				{{ item }}
			</li>
		</ul>

		<button @click="listSet">リストアップ</button>
	</div>
</template>


<style lang="scss">
// この環境ではcss使えないから/assets/scss
</style>