# Educational section volume · mni152-t1-2mm-v1

Derived from the skull-stripped ICBM152 T1 template distributed with Nilearn, **not an individual clinical study**. Template authors: V. Fonov and colleagues, McConnell Brain Imaging Centre, Montreal Neurological Institute, McGill University. Reference: https://doi.org/10.1016/S1053-8119(09)70884-5 . Distribution terms: see the adjacent `LICENSE.txt` (MNI / Louis Collins notice, also distributed in https://github.com/templateflow/tpl-MNI152NLin2009aSym/blob/master/LICENSE).

Exact source: https://github.com/nilearn/nilearn/blob/dfa32179a7e6d8333c053eaa33498dd385da43e7/nilearn/datasets/data/mni_icbm152_t1_tal_nlin_sym_09a_converted.nii.gz

Input SHA-256: `421a10e872fd6cadae7f61d358dffbcc1795a497d61ee76c5dda2503e1a1e9e6`. The version-pinned script `scripts/prepare-section-template.py` reads its UINT8 voxels, retaining every second voxel starting at index 0 on each axis. Output: 99 × 117 × 95, x-fastest, 2 mm isotropic. Voxel (0,0,0) maps to (-98,-134,-72) mm in template RAS space. The indices and three PNG previews refer to this derivative only. Distances are straight-line distances in this template, not measurements of patients. No tissue segmentation or automatic structure identification is performed.
