// English text for the 3D atlas shell and its scenes (src/atlas.js).
// Ids, groups, source types and lesson links come from the Turkish original.
export default {
  source: {
    viewerLabel: 'Embedded 3D atlas',
    credit: '3D anatomical model and data © Zygote 3D.',
    licence: 'The embedded view opens from the rights holder’s own server using their free iframe method; the models are not copied, re-hosted or modified.'
  },
  groups: {
    views: { label: 'Views', hint: 'Jump to a region' },
    systems: { label: 'Systems', hint: 'Views matched to the lectures' },
    focus: { label: 'Single structure', hint: 'Ready-made links that isolate one structure' }
  },
  scenes: {
    'tum-vucut': {
      summary: 'The whole body from head to foot: you see its proportions, the surface landmarks and roughly how the systems are laid out.',
      observe: 'Compare the standing position (the anatomical position) with the model: palms forward, thumbs pointing outwards.',
      steps: [
        'Click and drag to rotate the model in the embedded window, and use the wheel to zoom in.',
        'Pull the opacity slider on the left down and the skin, muscle and organ layers appear in turn.',
        'Use the button below the slider to switch the layers on and off one by one.'
      ]
    },
    'bas-boyun': {
      summary: 'A close look at the skull, the cervical vertebrae and the structures of the neck region.',
      observe: 'Notice the difference in bulk between the brain box of the skull (neurocranium) and the facial skeleton (viscerocranium).',
      steps: [
        'Type `skull` or `vertebra` in the search box to pick the structure.',
        'Use the `Zoom to` tool under the name of the selected structure to centre the view on it.',
        'Hold `Ctrl` (`Cmd` on a Mac) and click to hide the structures you want to take out of the view.'
      ]
    },
    gogus: {
      summary: 'How the heart, lungs, thymus and great vessels relate to one another inside the rib cage.',
      observe: 'Think about why the heart sits slightly to the left and forward in the rib cage, and how the lungs make room for it.',
      steps: [
        'Use the opacity slider to make the ribs transparent and bring the internal organs out.',
        'Type `heart`, `lung` or `aorta` in the search box to select the structures one at a time.',
        'To see several structures together, use the pin icon on the label after selecting.'
      ]
    },
    karin: {
      summary: 'The abdominal placement of the stomach, liver, intestines, kidneys and great vessels.',
      observe: 'Link the large space the liver takes up in the upper right quadrant with the stomach being pushed to the left.',
      steps: [
        'Make the digestive organ layer visible from the layer controls.',
        'Type `liver`, `stomach`, `intestine` or `kidney` in the search box and study the organs in turn.',
        'For ready-made isolated views use the “Single structure” list on the left.'
      ]
    },
    iskelet: {
      summary: 'The bones on their own: the skeleton of the trunk, the support the bones give each other and the spaces between them.',
      observe: 'Watch how the long bones carry the weight of the trunk and how the rib–sternum link closes the rib cage.',
      steps: [
        'The skeleton arrives already isolated; the other layers are faded.',
        'Type a bone name such as `femur`, `humerus` or `costa` in the search box and focus on that bone with `Zoom to`.',
        'Hide a bone you want out of the view with `Ctrl`/`Cmd` + click, so that you can see the structure underneath comfortably.'
      ]
    },
    kaslar: {
      summary: 'How the superficial and deep muscle groups are distributed over the body, and where muscles attach to bone.',
      observe: 'Follow the opposing (antagonist) arrangement of the muscles around the same joint: as one pulls, the other relaxes.',
      steps: [
        'Open the layer list in the left panel and leave only the muscle layer visible.',
        'Type terms such as `biceps`, `deltoid` or `quadriceps` in the search box to select the muscle.',
        'Pin the muscle with the selection tool on the label and see its relationship with the bone at the same time.'
      ]
    },
    sinir: {
      summary: 'The distribution of the central nervous system together with the peripheral nerves and plexuses through the body.',
      observe: 'Notice that the nerves leaving the spinal cord are divided according to their target region, and that the plexuses are the junctions of that network.',
      steps: [
        'Make the nerve layer visible from the layer controls and switch the other layers off to follow the route on its own.',
        'Type `brain`, `spinal cord` or `nerve` in the search box to select the structures.',
        'For the brain and spinal cord switch to the “Brain” focus view on the left.'
      ]
    },
    dolasim: {
      summary: 'The heart, arteries and veins, and the route the great vessels take through the body.',
      observe: 'Compare the paths by which the pulmonary (small) and systemic (large) circulations leave the heart and return to it.',
      steps: [
        'Make the circulatory layer visible from the layer controls.',
        'Type `heart`, `aorta` or `vena cava` in the search box and select the structures in turn.',
        'To study the heart alone, switch the lung layer off, select the heart and use the `Zoom to` tool on the label.'
      ]
    },
    sindirim: {
      summary: 'The order of the organs along the digestive tract from mouth to anus, and the accessory glands.',
      observe: 'Follow how the folds increase along the tract for absorption surface, and the link between liver and pancreas.',
      steps: [
        'Make the digestive layer visible from the layer controls.',
        'Type `stomach`, `duodenum`, `colon` or `pancreas` in the search box to select the organs.',
        'For the stomach and liver use the “Single structure” views.'
      ]
    },
    urogenital: {
      summary: 'How the kidneys, urinary tract and reproductive organs relate to one another inside the pelvis.',
      observe: 'Follow the retroperitoneal placement of the kidneys and the route by which the ureters descend to the bladder.',
      steps: [
        'Make the relevant layer visible from the layer controls.',
        'Type `kidney`, `ureter`, `bladder`, `uterus` or `prostate` in the search box to select the structures.',
        'Use the model icon at the top left to switch between the female and male model and compare.'
      ]
    },
    lenfatik: {
      summary: 'The distribution of the lymphatic vessels, nodes and lymphoid organs through the body.',
      observe: 'Think about why lymph nodes collect at vessel junctions and around joints.',
      steps: [
        'Make the lymphatic layer visible from the layer controls.',
        'Type `lymph`, `node`, `spleen` or `thymus` in the search box to select the structures.',
        'Switch on the circulatory layer as well and compare how the two systems relate.'
      ]
    },
    deri: {
      summary: 'The outermost layer: surface anatomy, landmarks and the visibility of the structures beneath the skin.',
      observe: 'As the skin becomes transparent, note which superficial bony prominences and muscles you can then reach.',
      steps: [
        'Start the opacity slider at the top and bring it down step by step.',
        'Leave only the skin layer visible from the layer controls and study the outer appearance.',
        'Verify the superficial landmarks (clavicle, iliac spine) by finding them in the search box.'
      ]
    },
    kafatasi: {
      summary: 'The skull on its own: the bones, the sutures and the spaces.',
      observe: 'Match the suture names to the neighbouring bones: coronal, sagittal, lambdoid.',
      steps: [
        'The view isolates the skull; the other layers arrive faded.',
        'Hide a bone you do not want to see with `Ctrl`/`Cmd` + click.',
        'Compare the bones around the orbit and the nasal cavity by selecting them one at a time.'
      ]
    },
    beyin: {
      summary: 'The position of the brain inside the skull and the layout of its lobes.',
      observe: 'See how the shape of the cranial cavity matches the layout of the lobes.',
      steps: [
        'The brain arrives isolated; you can switch the skull bones back on from the layer controls.',
        'Type `cerebellum`, `brainstem` or `lobe` in the search box to select the parts one at a time.',
        'Turn the model to a view from above and study the symmetry of the two hemispheres.'
      ]
    },
    akcigerler: {
      summary: 'The two lungs in an isolated view: the lobes, the fissures and the relationship with the heart.',
      observe: 'Link the right lung having three lobes and the left lung two with the position of the heart.',
      steps: [
        'The lungs arrive isolated; make the heart visible as well and compare the relationship.',
        'Type `lobe`, `bronchus` or `fissure` in the search box to select the parts.',
        'Turn the view from the front to the side and follow the course of the fissures.'
      ]
    },
    karaciger: {
      summary: 'The liver in an isolated view: its lobes and its relationship with the neighbouring organs.',
      observe: 'Find the left lobe of the liver reaching over the stomach and the region of the porta hepatis.',
      steps: [
        'The liver arrives isolated; add the stomach and the bile ducts from the layer controls.',
        'Type `hepatic`, `bile` or `gallbladder` in the search box to select the structures.',
        'Turn the organ to a view from below and confirm the position of the porta hepatis.'
      ]
    },
    mide: {
      summary: 'The stomach in an isolated view: the cardia, fundus, body and pyloric parts.',
      observe: 'Find where the pylorus opens into the duodenum and the fundus of the stomach extending to the left.',
      steps: [
        'The stomach arrives isolated; add the liver and pancreas to see the relationships.',
        'Type `stomach`, `duodenum` or `esophagus` in the search box to select the transition zones.',
        'Turn the front and back surfaces of the organ and compare the greater and lesser curvatures.'
      ]
    },
    kalp: {
      summary: 'The position of the heart in the thoracic cavity, its relationship with the lungs and the roots of the great vessels.',
      observe: 'Watch the apex of the heart pointing to the left and downwards while its base stays above.',
      steps: [
        'Type `heart` in the search box, pick the result and focus on the heart with `Zoom to` on the label.',
        'Switch the lung layer off to study the heart alone, then switch it back on and compare the relationship.',
        'Bring out the chambers and valves one at a time with the searches `atrium`, `ventricle` and `valve`.'
      ]
    }
  }
};
