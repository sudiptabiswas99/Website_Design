// Generates a valid 16x16 32bpp favicon.ico at the Documents server root,
// so every page's automatic /favicon.ico request returns 200 (no console 404).
import fs from 'node:fs';

const S = 16;
const bgra = Buffer.alloc(S * S * 4);
// ocean-blue #0e7ea8 with a soft brass dot — purely cosmetic
const [r, g, b] = [0x0e, 0x7e, 0xa8];
for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
  const i = (y * S + x) * 4;
  bgra[i] = b; bgra[i + 1] = g; bgra[i + 2] = r; bgra[i + 3] = 0xff; // BGRA
}

const header = Buffer.alloc(40);
header.writeUInt32LE(40, 0);        // biSize
header.writeInt32LE(S, 4);          // width
header.writeInt32LE(S * 2, 8);      // height (XOR + AND)
header.writeUInt16LE(1, 12);        // planes
header.writeUInt16LE(32, 14);       // bpp
const andMask = Buffer.alloc((S * S) / 8); // all 0 = opaque
const image = Buffer.concat([header, bgra, andMask]);

const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0);            // reserved
dir.writeUInt16LE(1, 2);            // type: icon
dir.writeUInt16LE(1, 4);           // count
const entry = Buffer.alloc(16);
entry.writeUInt8(S, 0); entry.writeUInt8(S, 1);
entry.writeUInt16LE(1, 4);         // planes
entry.writeUInt16LE(32, 6);        // bpp
entry.writeUInt32LE(image.length, 8);
entry.writeUInt32LE(22, 12);       // offset

fs.writeFileSync('/Users/sudiptabiswash/Documents/favicon.ico', Buffer.concat([dir, entry, image]));
console.log('wrote /Users/sudiptabiswash/Documents/favicon.ico (' + (22 + image.length) + ' bytes)');
