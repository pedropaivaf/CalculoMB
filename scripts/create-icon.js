/**
 * Gera icon.ico — ICO 256x256 com visual de calculadora
 * Puro Node.js, sem dependências externas.
 */
const fs = require('fs');
const path = require('path');

const W = 256;
const H = 256;

// ── Paleta ──────────────────────────────────────────────────────
const BLUE_DARK  = [0x1E, 0x40, 0xAF]; // #1E40AF
const BLUE_MED   = [0x3B, 0x82, 0xF6]; // #3B82F6
const WHITE      = [0xFF, 0xFF, 0xFF];
const GRAY_LIGHT = [0xE2, 0xE8, 0xF0]; // #E2E8F0
const GRAY_MED   = [0x94, 0xA3, 0xB8]; // #94A3B8
const GREEN      = [0x10, 0xB9, 0x81]; // #10B981

// ── Canvas (array de pixels RGBA, ordem [R,G,B,A]) ──────────────
const canvas = [];
for (let i = 0; i < W * H; i++) canvas.push([...BLUE_DARK, 255]);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  canvas[y * W + x] = [r, g, b, a];
}

function fillRect(x1, y1, x2, y2, color, a = 255) {
  for (let y = y1; y < y2; y++)
    for (let x = x1; x < x2; x++)
      setPixel(x, y, ...color, a);
}

function fillRoundRect(x1, y1, x2, y2, r, color, a = 255) {
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      const inTopLeft     = x < x1+r && y < y1+r && (x-x1-r)**2+(y-y1-r)**2 > r*r;
      const inTopRight    = x > x2-r && y < y1+r && (x-x2+r)**2+(y-y1-r)**2 > r*r;
      const inBottomLeft  = x < x1+r && y > y2-r && (x-x1-r)**2+(y-y2+r)**2 > r*r;
      const inBottomRight = x > x2-r && y > y2-r && (x-x2+r)**2+(y-y2+r)**2 > r*r;
      if (!inTopLeft && !inTopRight && !inBottomLeft && !inBottomRight)
        setPixel(x, y, ...color, a);
    }
  }
}

// ── Desenho ──────────────────────────────────────────────────────

// Fundo gradiente (azul mais claro no topo)
for (let y = 0; y < H; y++) {
  const t = y / H;
  const r = Math.round(0x1E + (0x1E - 0x1E) * t);
  const g = Math.round(0x40 + (0x30 - 0x40) * t);
  const b = Math.round(0xAF + (0x80 - 0xAF) * t);
  for (let x = 0; x < W; x++) setPixel(x, y, r, g, b);
}

// Corpo da calculadora (branco, bordas arredondadas)
fillRoundRect(28, 28, 228, 228, 20, WHITE);

// Tela (azul médio)
fillRoundRect(46, 46, 210, 114, 8, BLUE_MED);

// Texto simulado na tela (branco — linhas horizontais)
fillRect(56, 66, 170, 72, WHITE);
fillRect(56, 78, 200, 84, WHITE);
fillRect(56, 90, 190, 96, WHITE);

// Separador
fillRect(46, 118, 210, 120, GRAY_LIGHT);

// Botões: 4 colunas × 4 linhas
const btnColors = [
  GRAY_LIGHT, GRAY_LIGHT, GRAY_LIGHT, BLUE_MED,  // linha 1 (operadores em azul)
  GRAY_LIGHT, GRAY_LIGHT, GRAY_LIGHT, BLUE_MED,
  GRAY_LIGHT, GRAY_LIGHT, GRAY_LIGHT, BLUE_MED,
  WHITE,      GRAY_LIGHT, GRAY_LIGHT, GREEN,      // último = igual (verde)
];

const COLS = 4;
const ROWS = 4;
const BTN_W = 36;
const BTN_H = 22;
const BTN_GAP = 6;
const BTN_X0 = 46;
const BTN_Y0 = 126;

for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const bx = BTN_X0 + col * (BTN_W + BTN_GAP);
    const by = BTN_Y0 + row * (BTN_H + BTN_GAP);
    const color = btnColors[row * COLS + col];
    fillRoundRect(bx, by, bx + BTN_W, by + BTN_H, 4, color);
  }
}

// ── Monta o ICO ─────────────────────────────────────────────────

// Pixels em BGRA (ICO usa BGRA), bottom-up
const pixelsBGRA = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const [r, g, b, a] = canvas[(H - 1 - y) * W + x]; // flip vertical
    const idx = (y * W + x) * 4;
    pixelsBGRA[idx]     = b;
    pixelsBGRA[idx + 1] = g;
    pixelsBGRA[idx + 2] = r;
    pixelsBGRA[idx + 3] = a;
  }
}

// AND mask (1 bit/pixel, padded to 4-byte rows) — todos zeros = opaco
const rowBytes = Math.ceil(W / 32) * 4;
const andMask = Buffer.alloc(rowBytes * H, 0);

// BITMAPINFOHEADER (40 bytes)
const bih = Buffer.alloc(40);
bih.writeUInt32LE(40, 0);
bih.writeInt32LE(W, 4);
bih.writeInt32LE(H * 2, 8);   // altura × 2 no formato ICO
bih.writeUInt16LE(1, 12);      // planes
bih.writeUInt16LE(32, 14);     // 32-bit BGRA
bih.writeUInt32LE(0, 16);      // compression
bih.writeUInt32LE(W * H * 4, 20);
bih.writeInt32LE(0, 24);
bih.writeInt32LE(0, 28);
bih.writeUInt32LE(0, 32);
bih.writeUInt32LE(0, 36);

const imageData = Buffer.concat([bih, pixelsBGRA, andMask]);
const imgOffset = 6 + 16; // header + 1 dir entry

// ICO Header (6 bytes)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);   // reserved
header.writeUInt16LE(1, 2);   // type = ICO
header.writeUInt16LE(1, 4);   // 1 imagem

// ICONDIRENTRY (16 bytes)
const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(0, 0);    // width  = 0 → 256
dirEntry.writeUInt8(0, 1);    // height = 0 → 256
dirEntry.writeUInt8(0, 2);    // colorCount
dirEntry.writeUInt8(0, 3);    // reserved
dirEntry.writeUInt16LE(1, 4); // planes
dirEntry.writeUInt16LE(32, 6);// bitCount
dirEntry.writeUInt32LE(imageData.length, 8);
dirEntry.writeUInt32LE(imgOffset, 12);

const ico = Buffer.concat([header, dirEntry, imageData]);
const outPath = path.join(__dirname, '..', 'icon.ico');
fs.writeFileSync(outPath, ico);
console.log(`✓ icon.ico criado: ${(ico.length / 1024).toFixed(1)} KB → ${outPath}`);
