// Gera assets otimizados a partir dos originais (pasta pai). Uso: node scripts/build-assets.mjs ..
import sharp from 'sharp';import fs from 'node:fs';import path from 'node:path';
const SRC=process.argv[2]; const OUT='public/assets';
const ed={
 'creed-aventus':'Creed Aventus in Silver Mist.png','versace-eros-flame':'eras.jpeg','good-girl':'Good Girl perfume suspended in gold cords.png',
 'le-male-elixir':'male.jpeg','essencial-oud':'natura.jpeg','donna-born-in-roma':'alentino.jpeg','creed-carmina':'Creed Carmina on rugged dark wood.png',
 'green-irish-tweed':'Creed Green Irish Tweed Water Splash.png','silver-mountain-water':'Crystal cloche unveils Silver Mountain Water.png',
 'original-vetiver':'vetiver.jpeg','queen-of-silk':'creed.jpeg','versace-eros':'Versace Eros in a turquoise water splash.png',
 '212-vip-black':'212 VIP Black on Smoky Marble.png','black-opium':'Black Opium in terracotta glow.png','bright-crystal':'Bright Crystal Floating in Crystal Water.png',
 'bad-boy-cobalt':'Cobalt Bolt on Aged Wood.png','y-edp':'YSL fragrance suspended in midnight blue.png','myslf':'YSL Noir on Polished Marble.png',
 'libre':'yls.jpeg','bad-boy':'bad boy.jpeg','homem-coragio':'coragio.jpeg','sauvage-parfum':'dior.jpeg','god-of-fire':'god of fire.jpeg',
 'kaiak':'kaiak.jpeg','le-beau-paradise-garden':'le male.jpeg','divine':'legirl.jpeg','green-stravaganza':'lentino.jpeg','luna':'luna.jpeg',
 'red-tobacco':'mancera.jpeg','1-million':'million.jpeg','una-brilho':'una.jpeg','coral-fantasy':'tino.jpeg','vibrato':'vibrato.jpeg'};
const hero={'creed-aventus':'CREEED.png','versace-eros-flame':'FLAME.png','good-girl':'GOOD GIRL.png','le-male-elixir':'JPG.png','essencial-oud':'Natura Essencial Oud bottle cutout.png','donna-born-in-roma':'VALEN.png'};
// fotos extras para a galeria (mesmo produto, outra cena)
const extra={'versace-eros-flame':['eros-flame-2','FLAME.png',null],'le-male-elixir':['le-male-elixir-2','JPG.png',null]};
const mk=d=>fs.mkdirSync(d,{recursive:true});
mk(`${OUT}/perfumes/editorial`);mk(`${OUT}/perfumes/hero`);mk(`${OUT}/branding`);
const dims={};
for(const [slug,f] of Object.entries(ed)){
  const p=path.join(SRC,f);
  for(const w of [480,960]){await sharp(p).resize({width:w,withoutEnlargement:true}).webp({quality:78}).toFile(`${OUT}/perfumes/editorial/${slug}-${w}.webp`);}
  const m=await sharp(p).resize({width:960,withoutEnlargement:true}).toBuffer({resolveWithObject:true});dims[slug]=[m.info.width,m.info.height];
}
for(const [slug,f] of Object.entries(hero)){
  const p=path.join(SRC,f);
  const t=await sharp(p).ensureAlpha().trim({threshold:4}).toBuffer();
  for(const h of [420,840]){await sharp(t).resize({height:h,withoutEnlargement:true}).webp({quality:85,alphaQuality:90}).toFile(`${OUT}/perfumes/hero/${slug}-${h}.webp`);}
  const m=await sharp(t).metadata();dims['hero:'+slug]=[m.width,m.height];
}
// wordmark: preto sobre marfim -> alpha
{const {data,info}=await sharp(path.join(SRC,'ninbo.jpeg')).greyscale().raw().toBuffer({resolveWithObject:true});
 const rgba=Buffer.alloc(info.width*info.height*4);
 for(let i=0;i<info.width*info.height;i++){const v=data[i];const a=Math.max(0,Math.min(255,Math.round((235-v)*255/195)));rgba[i*4]=0;rgba[i*4+1]=0;rgba[i*4+2]=0;rgba[i*4+3]=a;}
 const t=await sharp(rgba,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer();
 const tr=await sharp(t).trim().toBuffer();
 await sharp(tr).resize({width:900}).png({compressionLevel:9}).toFile(`${OUT}/branding/nimbo-wordmark.png`);
 const m=await sharp(tr).resize({width:900}).metadata();dims.wordmark=[m.width,m.height];}
await sharp(path.join(SRC,'LOGO OR7.png')).resize({width:640}).webp({quality:90}).toFile(`${OUT}/branding/or7-signature.webp`);
dims.or7=[640,Math.round(640*724/2172)];
await sharp(path.join(SRC,'ninbo.jpeg')).resize(64,64,{fit:'cover'}).png().toFile('public/favicon.png');
fs.writeFileSync('scripts/dims.json',JSON.stringify(dims,null,1));console.log(dims);
