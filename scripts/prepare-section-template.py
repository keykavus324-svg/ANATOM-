"""Prepare the pinned Nilearn MNI152 T1 educational volume, using only Python stdlib.
Usage: python scripts/prepare-section-template.py /path/to/mni_icbm152_t1_tal_nlin_sym_09a_converted.nii.gz
See public/sections/SOURCE.md for the exact input and license.
"""
import gzip
import hashlib
from pathlib import Path
import struct
import sys
import zlib

out = Path(__file__).resolve().parents[1] / 'public' / 'sections'
source = Path(sys.argv[1]).read_bytes()
if hashlib.sha256(source).hexdigest() != '421a10e872fd6cadae7f61d358dffbcc1795a497d61ee76c5dda2503e1a1e9e6':
    raise ValueError('Different source volume')
r = gzip.decompress(source)
nx, ny, nz = struct.unpack_from('<3h', r, 42)
assert struct.unpack_from('<2h',r,70) == (2,8)  # UINT8
assert struct.unpack_from('<12f',r,280) == (1,0,0,-98, 0,1,0,-134, 0,0,1,-72)
a = r[int(struct.unpack_from('<f', r, 108)[0]):]
volume = b''.join(a[(z*ny+y)*nx:(z*ny+y+1)*nx:2] for z in range(0,nz,2) for y in range(0,ny,2))
width,height,depth = ((n+1)//2 for n in (nx,ny,nz))
assert (width,height,depth)==(99,117,95)
(out/'mni152-t1-2mm-v1.u8').write_bytes(volume)

def pixel(x,y,z): return volume[(z*height+y)*width+x]
def png(name,w,h,fn):
    def chunk(tag,data):return struct.pack('>I',len(data))+tag+data+struct.pack('>I',zlib.crc32(tag+data))
    rows=b''.join(b'\x00'+bytes(fn(x,y) for x in range(w)) for y in range(h))
    (out/f'{name}.png').write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>2I5B',w,h,8,0,0,0,0))+chunk(b'IDAT',zlib.compress(rows,9))+chunk(b'IEND',b''))
png('axial',width,height,lambda x,y:pixel(x,height-1-y,44))
png('coronal',width,depth,lambda x,y:pixel(x,58,depth-1-y))
png('sagittal',height,depth,lambda x,y:pixel(49,height-1-x,depth-1-y))
