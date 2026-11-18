import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const src = process.argv[2], out = process.argv[3];
const files = fs.readdirSync(src).filter(f=>/\.(png|jpe?g)$/i.test(f)).sort();
const W=300,H=300,cols=5, lab=30;
const chunks=[];for(let i=0;i<files.length;i+=15)chunks.push(files.slice(i,i+15));
let n=0;
for(const chunk of chunks){
  const rows=Math.ceil(chunk.length/cols);
  const comps=[];
  for(let i=0;i<chunk.length;i++){
    const f=chunk[i];const meta=await sharp(path.join(src,f)).metadata();
    const buf=await sharp(path.join(src,f)).flatten({background:'#888'}).resize(W,H,{fit:'contain',background:'#888'}).toBuffer();
    const x=(i%cols)*W,y=Math.floor(i/cols)*(H+lab);
    comps.push({input:buf,left:x,top:y});
    const svg=`<svg width="${W}" height="${lab}"><rect width="100%" height="100%" fill="#fff"/><text x="4" y="20" font-size="14" font-family="Arial">${f.replace(/&/g,'&amp;')} ${meta.width}x${meta.height}${meta.hasAlpha?' A':''}</text></svg>`;
    comps.push({input:Buffer.from(svg),left:x,top:y+H});
  }
  await sharp({create:{width:cols*W,height:rows*(H+lab),channels:3,background:'#fff'}}).composite(comps).jpeg({quality:80}).toFile(path.join(out,`sheet${n++}.jpg`));
}
console.log(files.length);
