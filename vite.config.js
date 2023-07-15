import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { findAllFiles } from "./CustomBuildFunctions";

// HTMLの複数出力を自動化する
//./src配下のファイル一式を取得
import fs from 'fs';
const fileNameList = fs.readdirSync(resolve(__dirname, './src/'));

//htmlファイルのみ抽出
// const htmlFileList = fileNameList.filter(file => /.html$/.test(file));

// //build.rollupOptions.inputに渡すオブジェクトを生成
// const inputFiles = {};
// for (let i = 0; i < htmlFileList.length; i++) {
//   const file = htmlFileList[i];
//   inputFiles[file.slice(0,-5)] = resolve(__dirname, './src/' + file );
//   /*
//     この形を自動的に作る
//     input:{
//       index: resolve(__dirname, './src/index.html'),
//       list: resolve(__dirname, './src/list.html')
//     }
//   */
// }

// //HTML上で出し分けたい各ページごとの情報
// const pageData = {
//   '/index.html': {
//     isHome: true,
//     title: 'Main Page',
//   },
//   '/test/index.html': {
//     isHome: false,
//     title: 'List Page',
//   },
// };

// //CSSとJSファイルに更新パラメータを追加
// const htmlPlugin = () => {
//   return {
//     name: 'html-transform',
//     transformIndexHtml(html) {
//       //更新パラメータ作成
//       const date = new Date();
//       const param = date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();

// 			let setParamHtml = html.replace(/(?=.*\b\.css\b)/g, (match) => {
// 				return match.replace(/\.css/, '.css?' + param);
// 			});

// 			return setParamHtml.replace(/(?=.*\b\.js\b)/g, (match) => {
// 				return match.replace(/\.js/, '.js?' + param);
// 			});
//     }
//   }
// }


const root = resolve(__dirname, "./src");
// const rollupOptionsInput = findAllFiles('./src', '.html');

export default defineConfig(() => {

	const pageExtensions = ['.html'];
  const pageDir = resolve(root, './');

  // ページファイルの一覧を取得
  const pages = fs.readdirSync(pageDir)
    .filter((file) => pageExtensions.includes(file.split('.').pop()));

  // rollupOptions.inputを動的に生成
  const rollupOptionsInput = {};
  pages.forEach((page) => {
    const pageName = page.split('.')[0];
    rollupOptionsInput[pageName] = resolve(pageDir, page);
  });

	return{
		server: {
			host: true //IPアドレスを有効化
		},
		base: './', //相対パスでビルドする
		root: root, //開発ディレクトリ設定
		build: {
			outDir: '../dist', //出力場所の指定
			rollupOptions: { //ファイル出力設定
				output: {
					assetFileNames: (assetInfo) => {
						let extType = assetInfo.name.split('.')[1];
						//Webフォントファイルの振り分け
						if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
							extType = 'fonts';
						}
						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							extType = 'images';
						}
						//ビルド時のCSS名を明記してコントロールする
						if(extType === 'css') {
							return `assets/css/main.css`;
						}
						return `assets/${extType}/[name][extname]`;
					},
					chunkFileNames: 'assets/js/[name].js',
					entryFileNames: 'assets/js/[name].js',
				},
				// input:
				//生成オブジェクトを渡す
				input: rollupOptionsInput,
			},
		},
		/*
			プラグインの設定を追加
		*/
		plugins: [
			handlebars({
				//コンポーネントの格納ディレクトリを指定
				partialDirectory: resolve(__dirname, './src/components'),
				//各ページ情報の読み込み
				context(pagePath) {
					return pageData[pagePath];
				},
			}),
			// htmlPlugin()
		],

	}
});