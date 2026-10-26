#!/usr/bin/env python3
"""Generates public/beagle.png (pixel-art sprite sheet) and public/grass.png.
Frames (36x24 each, left to right): 0 stand, 1-4 walk, 5 sit.  Run: python3 scripts/make-beagle.py"""
import struct, zlib, os

W, H = 36, 24
PAL = {
  'k': (43, 29, 20), 't': (201, 138, 70), 'T': (168, 103, 43), 'w': (251, 247, 239),
  's': (221, 213, 198), 'b': (35, 29, 26), 'e': (106, 60, 28), 'E': (74, 40, 16),
  'n': (17, 17, 17), 'r': (217, 74, 86), 'g': (242, 193, 78), 'h': (255, 255, 255),
}

BODY = """
..kkkkkkkkkkkkkkkkk..
.kttbbbbbbbbbbbbtttk.
kttbbbbbbbbbbbbbbttwk
kttttbbbbbbbbbbttttwk
kttttttbbbbbbttttwwwk
kwttttttttttttttwwwwk
.kwwwwwwwwwwwwwwwwwk.
..kwwwwwwwwwwwwwwwk..
...kkkkkkkkkkkkkkk...
"""
HEAD = """
..kkkkkkkk.....
.kttttttttkk...
kttttttttwwwkk.
ktttttttbtwwwwk
kttttttttwwwwwk
kttttttttwwwwnn
.kttttttwwwwwnn
..kttttwwwwwwk.
...kttttwwwwk..
....kkkkkkkk...
"""
EAR = """
.kkkk.
keeeek
keeeEk
keeeEk
.keeEk
.kEEEk
..kEk.
..kk..
"""
TAIL = """
.w.
.wk
.tk
tk.
tk.
"""
COLLAR = ["rrr", "rgr"]

def parse(s): return [list(r) for r in s.strip('\n').split('\n')]

class Canvas:
    def __init__(self): self.px = [[None]*W for _ in range(H)]
    def stamp(self, part, x, y, flip=False):
        for j, row in enumerate(part):
            for i, c in enumerate(row):
                if c != '.' and 0 <= y+j < H and 0 <= x+i < W: self.px[y+j][x+i] = c

def leg(cv, x, y0, height, col):
    f = 'w' if col == 'w' else 's'
    for j in range(height):
        yy = y0 + j
        last = j == height - 1
        row = ['k', f, f, 'k']
        cv.stamp([row], x, yy)

def frame(kind, f=0):
    cv = Canvas()
    body, head, ear, tail = parse(BODY), parse(HEAD), parse(EAR), parse(TAIL)
    by = 10
    if kind == 'walk' and f in (1, 3): by = 9
    if kind == 'sit': by = 12
    bx = 3
    top = by + 8
    if kind == 'sit':
        leg(cv, 23, top, H - top, 'w')
        leg(cv, 18, top, H - top, 's')
    else:
        # far legs first so the near ones overlap: (x, colour, phase)
        for x, col, ph in [(10, 's', 2), (23, 's', 0), (5, 'w', 0), (18, 'w', 2)]:
            dx, lift = 0, 0
            if kind == 'walk':
                dx, lift = [(-2, 0), (0, 2), (2, 0), (0, 2)][(f + ph) % 4]
            leg(cv, x + dx, top, H - top - lift, col)
    cv.stamp(body, bx, by)
    cv.stamp(tail, bx - 1, by - 4 if kind != 'sit' else by - 2)
    hy = by - 5 if kind != 'sit' else by - 7
    hx = 20
    cv.stamp([list('rr')], 22, by + 1)
    cv.stamp([list('rg')], 22, by + 2)
    cv.stamp(head, hx, hy)
    cv.stamp(ear, hx + 1, hy + 2)
    return cv

def sheet():
    frames = [frame('stand')] + [frame('walk', i) for i in range(4)] + [frame('sit')]
    rows = []
    for y in range(H):
        row = []
        for cv in frames: row += cv.px[y]
        rows.append(row)
    return rows, len(frames)

def png(path, rows):
    h, w = len(rows), len(rows[0])
    raw = b''
    for r in rows:
        raw += b'\x00' + b''.join(bytes(PAL[c]) + b'\xff' if c else b'\x00\x00\x00\x00' for c in r)
    def chunk(t, d): c = struct.pack('>I', len(d)) + t + d; return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
    open(path, 'wb').write(data)

GRASS = '''
.......g.......g.....g....
..g....g..g..g.g...g.g..g.
.g.g..g.g.g.g.g.g..g.g.g.g
gggggggggggggggggggggggggg
'''
def grass():
    PAL['g'] = (127, 154, 112)
    return [[None if c == '.' else c for c in r] for r in GRASS.strip().split('\n')]

if __name__ == '__main__':
    out = os.path.join(os.path.dirname(__file__), '..', 'public')
    rows, n = sheet()
    png(os.path.join(out, 'beagle.png'), rows)
    png(os.path.join(out, 'grass.png'), grass())
    print('frames', n)
