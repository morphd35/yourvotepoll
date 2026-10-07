import {readFileSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
rmSync('dist',{recursive:true,force:true});mkdirSync('dist/server',{recursive:true});
const page=readFileSync('worker/page.html','utf8');
writeFileSync('dist/server/index.js',readFileSync('worker/index.js','utf8').replace('/*PAGE*/',JSON.stringify(page)));
