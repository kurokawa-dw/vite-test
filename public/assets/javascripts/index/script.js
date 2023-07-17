console.log('パブリックですよffff');
console.log('hotリロード効かないからね')
console.log('nodemoduleからインポートできないからね')

import test from './moule.js';

test();

console.log('これはインポートできる、けどホットリロードは動かないよ')