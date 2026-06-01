#!/usr/bin/env node
// fix-ethers.js — patches bin/jellyos with ALL current fixes:
//   1. Pure-JS keccak256 (removes ethers dependency from setup)
//   2. Locks COLUMNS/LINES before launching agent (stops stacking border lines)
// Run from your jellyos folder:  node fix-ethers.js
// Safe to run multiple times.
'use strict';
const fs   = require('fs');
const path = require('path');

const BIN = path.join(__dirname, 'bin', 'jellyos');
if (!fs.existsSync(BIN)) {
  console.error('Cannot find bin/jellyos — run this from inside your jellyos folder.');
  process.exit(1);
}

let src = fs.readFileSync(BIN, 'utf8');
let changed = false;

// ── Fix 1: pure-JS keccak256 (removes ethers/require dependency) ─────────────
if (src.includes('function _keccak256(data)')) {
  console.log('  → keccak256: already patched');
} else {
  const KECCAK_BLOCK = `  // ── Wallet helpers ────────────────────────────────────────────────────────
  // Pure-JS keccak256 — zero external dependencies.
  // Ethers v6 is ESM-only and cannot be require()'d; we avoid it entirely here.
  const crypto = require('crypto');

  function _keccak256(data) {
    const inp = Buffer.isBuffer(data) ? data
      : Buffer.from(data instanceof Uint8Array ? data : data.replace(/^0x/,''), 'hex');
    const RC=[[0x00000001,0],[0x00008082,0],[0x0000808A,0x80000000],[0x80008000,0x80000000],[0x0000808B,0],[0x80000001,0],[0x80008081,0x80000000],[0x00008009,0x80000000],[0x0000008A,0],[0x00000088,0],[0x80008009,0],[0x8000000A,0],[0x8000808B,0],[0x0000008B,0x80000000],[0x00008089,0x80000000],[0x00008003,0x80000000],[0x00008002,0x80000000],[0x00000080,0x80000000],[0x0000800A,0],[0x8000000A,0x80000000],[0x80008081,0x80000000],[0x00008080,0x80000000],[0x80000001,0],[0x80008008,0x80000000]];
    const ROT=[0,1,62,28,27,36,44,6,55,20,3,10,43,25,39,41,45,15,21,8,18,2,61,56,14];
    const PI=[0,10,20,5,15,16,1,11,21,6,7,17,2,12,22,23,8,18,3,13,14,24,9,19,4];
    function r64(lo,hi,n){n&=63;if(!n)return[lo,hi];if(n===32)return[hi,lo];if(n<32)return[(lo<<n)|(hi>>>(32-n))>>>0,(hi<<n)|(lo>>>(32-n))>>>0];n-=32;return[(hi<<n)|(lo>>>(32-n))>>>0,(lo<<n)|(hi>>>(32-n))>>>0];}
    function kf(s){
      for(let r=0;r<24;r++){
        const C=new Uint32Array(10);
        for(let x=0;x<5;x++){C[x*2]=s[x*2]^s[(x+5)*2]^s[(x+10)*2]^s[(x+15)*2]^s[(x+20)*2];C[x*2+1]=s[x*2+1]^s[(x+5)*2+1]^s[(x+10)*2+1]^s[(x+15)*2+1]^s[(x+20)*2+1];}
        for(let x=0;x<5;x++){const[dl,dh]=r64(C[((x+1)%5)*2],C[((x+1)%5)*2+1],1);const tl=C[((x+4)%5)*2]^dl,th=C[((x+4)%5)*2+1]^dh;for(let y=0;y<5;y++){s[(y*5+x)*2]^=tl;s[(y*5+x)*2+1]^=th;}}
        const B=new Uint32Array(50);
        for(let i=0;i<25;i++){const[rl,rh]=r64(s[i*2],s[i*2+1],ROT[i]);B[PI[i]*2]=rl;B[PI[i]*2+1]=rh;}
        for(let y=0;y<5;y++)for(let x=0;x<5;x++){const i=y*5+x,j=y*5+(x+1)%5,k=y*5+(x+2)%5;s[i*2]=B[i*2]^(~B[j*2]&B[k*2]);s[i*2+1]=B[i*2+1]^(~B[j*2+1]&B[k*2+1]);}
        s[0]^=RC[r][0];s[1]^=RC[r][1];
      }
    }
    const RATE=136,st=new Uint32Array(50);let off=0;
    for(;off+RATE<=inp.length;off+=RATE){
      for(let i=0;i<17;i++){st[i*2]^=inp.readUInt32LE(off+i*8);st[i*2+1]^=inp.readUInt32LE(off+i*8+4);}
      kf(st);
    }
    const last=Buffer.alloc(RATE,0);inp.copy(last,0,off);
    last[inp.length-off]=0x01;last[RATE-1]|=0x80;
    for(let i=0;i<17;i++){st[i*2]^=last.readUInt32LE(i*8);st[i*2+1]^=last.readUInt32LE(i*8+4);}
    kf(st);
    const out=Buffer.alloc(32);
    for(let i=0;i<4;i++){out.writeUInt32LE(st[i*2],i*8);out.writeUInt32LE(st[i*2+1],i*8+4);}
    return '0x'+out.toString('hex');
  }`;

  // Match any flavour of the old ethers-loading block
  const OLD = /\/\/ ── (?:Ensure dependencies[^\n]*|Wallet helpers[^\n]*)\n(?:  \/\/[^\n]*\n)*  const \{ execFileSync[^]*?(?:const _keccak256[^\n]+|function _keccakFallback[^]*?\n  \})\n/;
  const OLD2 = /\/\/ ── Ensure dependencies are installed[^]*?const _keccak256[^\n]+\n/;

  if (OLD.test(src)) {
    src = src.replace(OLD, KECCAK_BLOCK + '\n');
    console.log('  ✓ keccak256: patched (removed ethers dependency)');
    changed = true;
  } else if (OLD2.test(src)) {
    src = src.replace(OLD2, KECCAK_BLOCK + '\n');
    console.log('  ✓ keccak256: patched (removed ethers dependency)');
    changed = true;
  } else {
    console.log('  ✗ keccak256: could not find ethers block — check bin/jellyos manually');
  }
}

// ── Fix 2: lock COLUMNS/LINES when spawning agent (stops stacking borders) ───
if (src.includes('COLUMNS:') && src.includes('FORCE_COLOR')) {
  console.log('  → border fix: already patched');
} else {
  // Old spawn block — just passes JELLYOS_HOME, nothing else
  const OLD_SPAWN = /const child = spawn\(agent\.bin, agentArgs, \{\s*stdio: 'inherit',\s*env: \{ \.\.\.process\.env, JELLYOS_HOME: JELLY_HOME \},\s*\}\);/;

  const NEW_SPAWN = `// Lock terminal width so Ink never miscounts lines during streaming.
  // Without this, process.stdout.columns can vary mid-render and the border
  // gets drawn below the previous frame instead of over it — stacking borders.
  const cols = process.stdout.columns || 120;
  const rows = process.stdout.rows    || 40;

  const child = spawn(agent.bin, agentArgs, {
    stdio: 'inherit',
    env: {
      ...process.env,
      JELLYOS_HOME: JELLY_HOME,
      COLUMNS:     String(cols),
      LINES:       String(rows),
      TERM:        process.env.TERM || 'xterm-256color',
      FORCE_COLOR: '3',
    },
  });`;

  if (OLD_SPAWN.test(src)) {
    src = src.replace(OLD_SPAWN, NEW_SPAWN);
    console.log('  ✓ border fix: patched (COLUMNS/LINES locked)');
    changed = true;
  } else {
    console.log('  → border fix: spawn block not in expected form — skipping');
  }
}

if (changed) {
  fs.writeFileSync(BIN, src, 'utf8');
  console.log('\n  All fixes applied to bin/jellyos.');
} else {
  console.log('\n  Nothing to patch — bin/jellyos is already up to date.');
}
console.log('  Run: jellyos setup   (if you haven\'t yet)');
console.log('  Run: jellyos         (to start the agent)\n');
