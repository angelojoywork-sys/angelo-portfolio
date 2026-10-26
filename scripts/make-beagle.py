#!/usr/bin/env python3
"""Generates public/beagle.png (pixel-art sprite sheet) and public/grass.png.
Frames (36x24 each, left to right): see FRAMES below.  Run: python3 scripts/make-beagle.py"""
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

def leg(cv, x, y0, height, col, slant=0, bend=0):
    """A 3px-wide leg with a knee: the thigh swings a little, the shin carries the rest of the slant,
    and `bend` pushes the knee the other way (folded legs while airborne). Slant + is right, - is left."""
    f = 'w' if col == 'w' else 's'
    slant = round(slant * 0.6)  # keep the angle gentle: the legs are only ~6px tall
    height = max(0, height)
    knee = max(1, height // 2)
    for j in range(height):
        if j < knee:
            off = round(slant * 0.35 * j / knee) + (bend if j else 0)
        else:
            off = round(slant * 0.35 + (slant * 0.65 + (-bend)) * (j - knee + 1) / max(1, height - knee))
        last = j == height - 1
        row = ['k', 'k', 'k', 'k', 'k'] if last else ['k', f, f, f, 'k']
        cv.stamp([row], x + off - 1, y0 + j)
        if last and slant > 0:  # paw points the way the foot travels
            cv.stamp([['k']], x + off + 4, y0 + j)
        elif last and slant < 0:
            cv.stamp([['k']], x + off - 2, y0 + j)

def flip_v(part): return part[::-1]

def head_part(closed=False):
    h = parse(HEAD)
    if closed:  # shut eye: a short dash
        h[3][7] = 'k'; h[3][8] = 'k'
    return h

def stand_like(cv, by, legs, head_dy=0, ear_dy=0, tail_dy=0, tail_dx=0, closed=False):
    """Shared side-on pose. legs: [(x, colour, slant, lift)] drawn far-to-near."""
    body, ear, tail = parse(BODY), parse(EAR), parse(TAIL)
    top = by + 8
    for x, col, slant, lift, *bend in legs:
        leg(cv, x, top, H - top - lift, col, slant, bend[0] if bend else 0)
    cv.stamp(body, 3, by)
    cv.stamp(tail, 2 + tail_dx, by - 4 + tail_dy)
    hy = by - 5 + head_dy
    cv.stamp([list('rr')], 22, by + 1)
    cv.stamp([list('rg')], 22, by + 2)
    cv.stamp(head_part(closed), 20, hy)
    cv.stamp(ear, 21, hy + 2 + ear_dy)

# gallop cycle, 8 frames: (body y, tail dy, ear dy, near-front, far-front, near-back, far-back)
# each leg is (slant, lift, knee bend). Beats: reach > land > pull > gather (airborne) > extend > reach
RUN = [
    (10, 0, 0, (5, 0, 0),  (4, 1, 0),  (-3, 1, 0), (-4, 2, -1)),   # 0 front reaches, back pushing off
    (10, 1, 1, (3, 0, 0),  (3, 0, 0),  (-5, 2, -1), (-5, 3, -1)),  # 1 front lands, back trails
    (9, 1, 1,  (0, 1, 0),  (1, 1, 0),  (-3, 3, -1), (-2, 4, -1)),  # 2 pulling over the front legs
    (8, 2, 2,  (-3, 3, -1), (-2, 4, -1), (2, 3, 1),  (3, 4, 1)),   # 3 gather: all four tucked, airborne top
    (8, 2, 3,  (2, 4, 0),  (3, 4, 0),  (4, 2, 1),  (5, 3, 1)),     # 4 extend: legs reach out, still airborne
    (9, 1, 2,  (5, 2, 0),  (6, 1, 0),  (3, 1, 0),  (2, 2, 0)),     # 5 front reaches down, back lands
    (10, 0, 1, (5, 0, 0),  (4, 0, 0),  (1, 0, 0),  (0, 0, 0)),     # 6 back plants
    (10, 0, 0, (2, 0, 0),  (3, 1, 0),  (-1, 0, 0), (-2, 1, 0)),    # 7 push through
]

def frame(kind, f=0):
    cv = Canvas()
    body, ear, tail = parse(BODY), parse(EAR), parse(TAIL)
    if kind == 'stand':
        stand_like(cv, 10, [(10, 's', 0, 0), (23, 's', 0, 0), (5, 'w', 0, 0), (18, 'w', 0, 0)])
    elif kind == 'sit':
        by = 12; top = by + 8
        leg(cv, 23, top, H - top, 'w'); leg(cv, 18, top, H - top, 's')
        cv.stamp(body, 3, by); cv.stamp(tail, 2, by - 2)
        cv.stamp([list('rr')], 22, by + 1); cv.stamp([list('rg')], 22, by + 2)
        cv.stamp(head_part(), 20, by - 7); cv.stamp(ear, 21, by - 5)
    elif kind == 'crouch':
        # anticipation: front low, rump up, ears perked
        stand_like(cv, 11, [(10, 's', 0, 0), (23, 's', 2, 0), (5, 'w', 0, 0), (18, 'w', 2, 0)], head_dy=3, ear_dy=-1)
    elif kind == 'sleep':
        # curled up flat, chin on paws; f=1 is the breath-in frame
        by = 15 - f
        cv.stamp(body, 2, by)
        cv.stamp(tail, 0, by - 2 + f)
        # front paws tucked under the chin
        for x in (21, 25): cv.stamp([['k', 'w', 'w', 'k']], x, 22)
        cv.stamp(head_part(True), 19, 13 + f)
        cv.stamp(ear, 20, 15 + f)
        cv.stamp([list('rr')], 21, by + 1)
    elif kind == 'roll':
        # on its back, legs in the air; f=0/1 kick, f=2 mid-roll on its side
        by = 13
        cv.stamp(flip_v(body), 3, by)
        tilt = [(-1, 1), (1, -1)][f % 2] if f < 2 else (0, 0)
        for x, col, ph in [(10, 's', 0), (23, 's', 1), (5, 'w', 1), (18, 'w', 0)]:
            sl = tilt[ph] * 2
            leg(cv, x, by - 6, 6, col, sl) if f < 2 else None
        if f < 2:
            cv.stamp(flip_v(head_part()), 21, by - 1)
            cv.stamp(flip_v(ear), 22, by + 3)
            cv.stamp(tail, 0, by + 4)
        else:
            # side-on lying flat
            cv.px = [[None]*W for _ in range(H)]
            by = 14
            for x, col in [(8, 's'), (20, 's'), (4, 'w'), (16, 'w')]: leg(cv, x, by - 3, 4, col, 2)
            cv.stamp(body, 3, by)
            cv.stamp(tail, 0, by - 1)
            cv.stamp(head_part(True), 20, by - 3)
            cv.stamp(ear, 21, by - 1)
    elif kind == 'run':
        by, tdy, edy, nf, ff, nb, fb = RUN[f]
        # far/near back legs sit at x=10/5, front at 23/18; far legs are drawn first so the near ones overlap
        legs = [(10, 's', *fb), (23, 's', *ff), (5, 'w', *nb), (18, 'w', *nf)]
        stand_like(cv, by, legs, tail_dy=tdy, ear_dy=edy)
    return cv

# sprite sheet order (keep in sync with Puppy.astro): 0 stand, 1 sit, 2 crouch, 3-4 sleep, 5-7 roll, 8-15 run
FRAMES = [('stand', 0), ('sit', 0), ('crouch', 0), ('sleep', 0), ('sleep', 1), ('roll', 0), ('roll', 1), ('roll', 2)] + [('run', i) for i in range(8)]

def sheet():
    frames = [frame(k, i) for k, i in FRAMES]
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

# flowers: 4 frames (bud, opening, open, wide) x 3 colours, 9x12 each. Sheet is 36 wide, 36 tall.
FW, FH = 9, 12
FLOWER = [
 # bud
 """
.........
.........
.........
....P....
...PPP...
....s....
....s....
....s....
....s....
....s....
....s....
....s....
""",
 # opening
 """
.........
.........
...P.P...
...PPP...
....c....
....s....
....s....
....s....
....s....
....s....
....s....
....s....
""",
 # open
 """
.........
...P.P...
..PPPPP..
...PcP...
..PPPPP..
...P.P...
....s....
....s....
....s....
....s....
....s....
....s....
""",
 # wide
 """
..P...P..
..PP.PP..
.PPPPPPP.
..PPcPP..
.PPPPPPP.
..PP.PP..
..P.s.P..
....s....
....s....
....s....
....s....
....s....
""",
]
COLOURS = {'p': (255, 128, 170), 'y': (255, 214, 77), 'l': (170, 150, 255)}
def flowers():
    PAL.update({'c2': (255, 244, 200), 'st': (96, 128, 84), **COLOURS})
    rows = []
    for key in 'ply':
        for y in range(FH):
            row = []
            for fr in FLOWER:
                for ch in fr.strip('\n').split('\n')[y]:
                    row.append(None if ch == '.' else ('c2' if ch == 'c' else ('st' if ch == 's' else key)))
            rows.append(row)
    return rows

if __name__ == '__main__':
    out = os.path.join(os.path.dirname(__file__), '..', 'public')
    rows, n = sheet()
    png(os.path.join(out, 'beagle.png'), rows)
    png(os.path.join(out, 'grass.png'), grass())
    png(os.path.join(out, 'flowers.png'), flowers())
    print('frames', n)
