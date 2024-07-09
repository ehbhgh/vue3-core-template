const { build } = require('esbuild')
const { resolve } = require('path')

const target = 'reactivity';

const outfile = resolve( // 输出的文件
    __dirname,
    `../packages/${target}/dist/${target}.js`
)

build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    sourcemap: true,
    format: 'esm',
    platform: 'browser',
 
}).then(() => {
    console.log('watching~~~')
})



  