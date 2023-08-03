import { defineConfig } from 'vite';
import { resolve, relative, dirname } from 'path'
import handlebars from 'vite-plugin-handlebars';
import vue from '@vitejs/plugin-vue'
import { readFileSync, readdirSync, statSync } from 'fs'

let count = 0;

function getPages(dir) {
  const pages = {}
  const files = readdirSync(dir)

  files.forEach(file => {
    const filePath = resolve(dir, file)
    const isDirectory = statSync(filePath).isDirectory()

		// console.log('ファイルパス', statSync(filePath));
		// console.log(pages);
		// count++;

		// console.log(count)


    if (isDirectory) {
			const nestedPages = getPages(filePath)
			Object.assign(pages, nestedPages)
			// console.log(nestedPages);
    } else if (file.endsWith('.html')) {
      const name = relative(resolve(__dirname, 'src'), filePath).replace('.html', '')
			console.log(name);

			if(name.split('/')[0] !== 'components'){
				pages[name] = filePath
			}
    }
  })

  return pages
}

export default defineConfig({
  server: {
    host: '0.0.0.0', //IPアドレスを有効化
		proxy: {
			'/dist': 'http://192.168.1.8'
		}
  },
  base: './', //相対パスでビルドする
  root: './src', //開発ディレクトリ設定
	publicDir: '../public', //rootから相対で指定
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
            return `assets/styles/main.css`;
          }
          return `assets/${extType}/[name][extname]`;
        },
        // chunkFileNames: `assets/js/[name].js`,
        // entryFileNames: `assets/js/[name].js`
				chunkFileNames: `assets/javascripts/main.js`,
        entryFileNames: `assets/javascripts/main.js`
      },

      //生成オブジェクトを渡す
      // input: inputFiles,
			input: {
        ...getPages(resolve(__dirname, 'src')),
      }
    },
  },
  /*
    プラグインの設定を追加
  */
  plugins: [
		vue(),
    handlebars({
      //コンポーネントの格納ディレクトリを指定
      partialDirectory: resolve(__dirname, './src/components'),

    }),
  ],
});