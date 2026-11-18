import sharp from 'sharp';import path from 'node:path';
const [src,out,...specs]=process.argv.slice(2);
// spec: file|l,t,w,h fractions
const comps=[];let x=0;const H=700;
for(const s of specs){const [f,r]=s.split('|');const m=await sharp(path.join(src,f)).metadata();const [l,t,w,h]=r.split(',').map(Number);
 const buf=await sharp(path.join(src,f)).extract({left:Math.round(l*m.width),top:Math.round(t*m.height),width:Math.round(w*m.width),height:Math.round(h*m.height)}).resize({height:H}).toBuffer();
 const mm=await sharp(buf).metadata();comps.push({input:buf,left:x,top:0});x+=mm.width+6;}
await sharp({create:{width:x,height:H,channels:3,background:'#fff'}}).composite(comps).jpeg({quality:85}).toFile(out);
