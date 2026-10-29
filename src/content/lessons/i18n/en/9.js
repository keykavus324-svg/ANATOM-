// English translation of lesson 9 — written and reviewed by hand, not machine translated.
export default {
  subtitle: 'Perceive, process, respond.',
  intro: 'The nervous system evaluates the information coming from the environment and from the body; it takes part in generating appropriate responses and in maintaining the internal balance. Considering the structural divisions and the functional divisions separately lays the foundation of the subject.',
  imageAlt: 'Representative atlas drawing of the brain, cerebellum and brainstem in lateral view',
  scope: 'The neuron and glia, sensory-motor pathways, the CNS/PNS and somatic-autonomic distinction; the parts of the brain, the lobes, the spinal cord, the spinal roots, the meninges, the CSF and the twelve pairs of cranial nerves.',
  glossary: [
    ['Encephalon', 'The whole of the brain structures within the skull.'],
    ['Medulla spinalis', 'The spinal cord.'],
    ['Afferent', 'Directed towards the centre.'],
    ['Efferent', 'Directed away from the centre.'],
  ],
  review: [
    { q: 'How does the neuron arrangement of the somatic motor pathway differ from the typical autonomic motor pathway?', a: 'The axon of the somatic motor neuron reaches the skeletal muscle from the central system. In the typical autonomic output two neurons, preganglionic and postganglionic, connect in a peripheral ganglion.' },
    { q: 'In which direction do afferent fibres carry information?', a: 'From the periphery towards the central nervous system.' },
    { q: 'Given that the posterior root is sensory, is the posterior ramus also only sensory?', a: 'No. When the anterior and posterior roots unite a mixed spinal nerve is formed; its anterior and posterior rami also carry mixed fibres.' },
    { q: 'What is the difference between the canalis vertebralis and the canalis centralis?', a: 'The first is the bony canal formed by the vertebrae that houses the spinal cord; the second is the small CSF canal in the centre of the spinal cord.' },
    { q: 'Which are the three parts of the brainstem?', a: 'The mesencephalon, pons and medulla oblongata. The cerebellum is connected to them but is not a part of the brainstem.' },
    { q: 'What are the precentral and postcentral gyri related to?', a: 'The precentral gyrus in front of the central sulcus is related to the primary motor cortex and the postcentral gyrus behind it to the primary somatosensory cortex.' },
  ],
  sections: {
    haberlesme: {
      title: 'From stimulus to response: the basic organisation of the nervous system',
      paragraphs: [
        'The nervous system receives information from the internal and external environment, processes this information and enables appropriate responses to be formed. Together with the endocrine system it takes part in homeostasis, that is the maintenance of the balance of the internal environment. The property of being excitable is called irritability, the neural messages an impulse and the neural connection of a structure its innervation.',
        'Afferent denotes the route coming towards the centre and efferent the route moving away from it. For example, while information coming from a receptor in the skin is carried by afferent fibres, the motor output sent to a muscle is transmitted by efferent fibres. The “input–processing–output” arrangement establishes the logic of the whole system before the individual nerves are learned.',
      ],
      flow: ['Receptor / perception of the stimulus', 'Afferent route', 'Central processing', 'Efferent route', 'Muscle or gland response'],
      subsections: [
        {
          title: 'How a sensation turns into a movement response',
          paragraphs: [
            'When a hot surface is touched the receptors in the skin convert the stimulus into electrical activity. Afferent fibres carry the information to the central nervous system; the circuits established here organise the motor response. When the efferent fibres reach the muscle the withdrawal of the hand can take place. The conscious awareness of the information and the start of the rapid protective response do not have to share the same timing. Although the spinal cord circuits are connected to the brain, the initial organisation of some rapid responses is carried out here.',
            'Whether a route is afferent or efferent describes the direction of the information relative to the chosen centre. The words “sensory” and “motor” classify the function and “central” and “peripheral” the location of the structure. A peripheral nerve may therefore contain both afferent and efferent fibres. Taking these two classifications to be alternatives to each other makes it difficult to understand the mixed structure of the spinal nerves.',
          ],
        },
        {
          title: 'From the receptor to central processing and from there to the effector',
          paragraphs: [
            'Receptors are sensitive to different kinds of energy such as light, mechanical stretch, temperature or chemical change. The conversion of the stimulus into a neural signal is called transduction. The peripheral sensory neurons carry this information to the spinal cord or the brainstem. In the central circuits the information is not merely transmitted; it can be amplified, suppressed and combined with other senses and previous experience. The motor output may be directed to skeletal muscle, smooth muscle, the heart or glands.',
            'The reflex arc is described as the sequence of receptor, afferent route, central connection, efferent route and effector. In some reflexes there is a direct synapse between the sensory and the motor neuron; in others one or many interneurons are interposed. The fact that responses organised in the spinal cord can be modified by the brain shows that reflex and central control are not opposing concepts. A movement being fast does not mean it is necessarily monosynaptic, and being unconscious does not mean it is unaffected by learning.',
          ],
        },
      ],
    },
    hucreler: {
      title: 'The neuron and glia',
      paragraphs: [
        'The neuron has a body (soma/perikaryon), dendrites and an axon. The dendrites mostly carry the inputs coming to the cell and the axon the output directed from the cell to other cells. The target of the axon may be another neuron, a muscle or a gland. Neurons are grouped according to their function as sensory, motor and interneuron.',
        'Glia is not merely a passive filling; it takes part in tasks such as maintaining the cellular environment, support, myelination and defence. The glia–neuron ratio changes with the region; it should not be memorised as a fixed “five to ten times” ratio valid for the whole nervous system. Most mature neurons do not divide; tissue repair therefore does not take place like ordinary cell proliferation either.',
      ],
      subsections: [
        {
          title: 'Myelin, the nodes and the supporting cells',
          paragraphs: [
            'Myelin is the insulating sheath around the axon; it is formed by oligodendrocytes in the central system and by Schwann cells in the periphery. At the nodes of Ranvier, where the sheath is interrupted, the electrical activity is regenerated. The conduction is thus accelerated by the arrangement between the nodes instead of advancing in the same way at every point along the axon. Not all axons are myelinated; the existence of unmyelinated fibres corrects the idea that “a thick sheath is always necessary for neural conduction”.',
            'Astrocytes take part in organising the neighbourhood of the neuron and in support processes related to the vessels, the microglia in the immune-defence response and the ependymal cells in lining the ventricular surfaces. Glia is not a single-function filling tissue. The soma, dendrites and axon of a neuron must be distinguished from these supporting cells: a dendrite or the myelin is not the whole name of a separate nerve cell but a part of the cellular structure or a covering around it.',
          ],
        },
        {
          title: 'Axonal transport, the synapse and the grey-white matter distinction',
          paragraphs: [
            'Many substances produced in the neuronal body are carried along the axon to the terminal regions; transport back from the terminal to the body also exists. The axon being long depends on this arrangement of intracellular traffic. At a chemical synapse the neurotransmitter released from the axon terminal affects the receptors of the opposite cell. Whether the effect is excitatory or inhibitory may depend not only on the name of the transmitter but also on the target receptor and the cell.',
            'Grey matter is rich in neuronal bodies, dendrites, synapses and glia; in white matter myelinated axon bundles are prominent. These are not pure layers consisting entirely of a single cell type. For a collection of neuronal bodies the name nucleus is used in the central system and ganglion in the periphery; for an axon bundle tractus in the centre and nervus in the periphery. This naming also reminds us that nucleus in the sense of a cell nucleus and the anatomical nuclear collection are used at different scales.',
            'The basic structural element of the blood–brain barrier is the tight junctions of the central capillary endothelium; the astrocyte end-feet and other cells contribute to maintaining this arrangement. The barrier is not a “wall through which no substance passes”; there are selective passage and transport mechanisms. Limiting glial support to the task of filling the space between neurons does not explain these functions.',
          ],
        },
      ],
    },
    bolumler: {
      title: 'Structural and functional classification',
      paragraphs: [
        'The central nervous system consists of the brain (encephalon) and the spinal cord (medulla spinalis). The peripheral nervous system contains the cranial and spinal nerves, ganglia and plexuses. This distinction is by location; the somatic–autonomic distinction describes function.',
        'The somatic system is related to the senses of the body and the control of skeletal muscle; some somatic responses may take place involuntarily as reflexes. Visceral senses come from the internal organs. The autonomic motor system goes to smooth muscle, cardiac muscle and glands; its sympathetic and parasympathetic parts regulate organ function according to the conditions. Reducing these two systems to the single sentence “one is voluntary and the other involuntary” remains incomplete.',
        'In grey matter the neuronal bodies, dendrites and synaptic connections are prominent and in white matter mostly myelinated axon bundles. In the spinal cord the grey matter is central and the white matter peripheral. In the brain the cortex forms grey matter on the outside; but there are also grey matter nuclei in the inner regions. The statement “the inside of the brain is entirely white” is therefore not correct.',
      ],
      subsections: [
        {
          title: 'The difference between the somatic and autonomic output routes',
          paragraphs: [
            'In the somatic motor route the axon of the motor neuron leaving the central system reaches the skeletal muscle. In the autonomic motor route, by contrast, there is typically a connection in a peripheral ganglion between two neurons, preganglionic and postganglionic. It is thus understood that the word “ganglion” is not any swollen-looking part of a nerve but a collection of neuronal bodies outside the central system.',
            'The thoracolumbar distribution of the sympathetic output and the craniosacral distribution of the parasympathetic describe the central origin regions of the fibres. Sympathetic routes are mostly related to the T1–L2 levels and parasympathetic routes to certain cranial nerves and the S2–S4 levels. Both systems may form plexuses while reaching the organs. Instead of generalisations such as “the sympathetic speeds everything up”, the organ-specific effects on the heart, pupil and digestive tract should be considered.',
          ],
        },
        {
          title: 'The central-peripheral and somatic-autonomic classifications',
          paragraphs: [
            'A spinal nerve may carry somatic sensory, somatic motor and autonomic fibres. Therefore the peripheral nervous system cannot be said to equal the somatic system. Somatic afferents carry information from the skin, muscles and joints and visceral afferents from the organs. The autonomic motor system is mainly related to the targets of smooth muscle, heart and glands. The sensory and motor classification is an axis separate from the location of the structure.',
            'Sympathetic ganglia may be found in the chains beside the vertebral column or in the prevertebral regions around the aorta. Parasympathetic ganglia are mostly near the target organ or in the organ wall. The relative lengths of the preganglionic and postganglionic fibres are related to this placement. Not all organs receive opposing effects of equal intensity from the two systems; in targets such as the skin vessels and sweat glands the sympathetic arrangement is especially prominent.',
          ],
          table: {
            headers: ['Classification', 'Content'],
            rows: [
              ['Central nervous system', 'Encephalon and medulla spinalis; information-processing nuclei, cortex and connection pathways.'],
              ['Peripheral nervous system', 'Cranial/spinal nerves, their branches and ganglia; the routes connecting the central system to the body.'],
              ['Somatic motor', 'The motor route reaching skeletal muscle; participation in posture and reflexes as well as voluntary movement.'],
              ['Autonomic motor', 'Sympathetic, parasympathetic and enteric relationships; the regulation of organ activity.'],
            ],
          },
        },
      ],
    },
    beyin: {
      title: 'The developmental and adult parts of the brain',
      paragraphs: [
        'Encephalon is the name of all the brain structures within the skull; it does not consist only of the cerebral hemispheres. The forebrain is called prosencephalon, the midbrain mesencephalon and the hindbrain rhombencephalon. Matching the adult structures with these developmental names explains why different schemes use different headings.',
        'The telencephalon includes the cerebral hemispheres; the diencephalon includes the thalamus, hypothalamus, epithalamus and subthalamus. From the metencephalon in the hindbrain develop the pons and the cerebellum and from the myelencephalon the medulla oblongata. The mesencephalon, pons and medulla oblongata together form the brainstem; the cerebellum is not counted within this group.',
      ],
      subsections: [
        {
          title: 'The outer surface and the deep structures of the brain',
          paragraphs: [
            'The folded surface of the cerebral hemispheres increases the area of the cortex. The presence of the longitudinal fissure separating the two hemispheres does not mean that they are unconnected; the corpus callosum is an important connection bundle. Beneath the surface lie the white matter pathways and the deep grey nuclei. The statement “the outside of the brain is grey and the inside white” therefore offers a basic pattern but must not be understood as the whole interior consisting only of white matter.',
            'While encephalon covers all the neural tissue within the skull, the term cerebrum is used in a narrower context for the great brain. The cerebellum, brainstem and diencephalon are different structural parts of this whole. A thalamus or brainstem seen in a midline section may not be picked out with the same clarity in a lateral external view. When studying an atlas image it is necessary first to determine which surface or section is shown.',
          ],
        },
        {
          title: 'Matching the developmental parts with the adult anatomy',
          paragraphs: [
            'The prosencephalon divides into the telencephalon and diencephalon and the rhombencephalon into the metencephalon and myelencephalon; the name mesencephalon continues in the adult too. The telencephalon is related to the cerebral hemispheres and the associated deep structures, the metencephalon to the pons and cerebellum and the myelencephalon to the medulla oblongata. The developmental names are a different classification of the adult form; they are not an independent list of additional organs.',
            'Beneath the outer cortex of the hemispheres association fibres connect areas of the same hemisphere, commissural fibres the two sides and projection fibres the cortex to lower centres. The corpus callosum is the large commissural bundle; the internal capsule is an important region of projection pathways. The deep basal nuclei are part of the circuits taking part in the selection and regulation of movement. These nuclei make it clear that the whole interior of the brain is not only a “connection cable”.',
            'The lateral ventricles lie within the hemispheres, the third ventricle between the parts of the diencephalon, the cerebral aqueduct within the mesencephalon and the fourth ventricle between the pons/medulla and the cerebellum. These spaces are not accidental clefts of the brain tissue but the continuation of the developmental lumen. Learning the neighbourhood of each ventricle turns the names of the parts into a three-dimensional arrangement.',
          ],
        },
      ],
    },
    'sap-beyincik': {
      title: 'The brainstem and the cerebellum',
      paragraphs: [
        'The medulla oblongata (bulbus) is between the spinal cord and the pons. It contains nuclei and networks taking part in the regulation of vital functions such as respiration, circulation and swallowing. The pons is above it and below the mesencephalon; it houses connections with the cerebellum and structures related to sleep–wakefulness, facial sensation/movements and eye movements.',
        'The mesencephalon is the upper part of the brainstem. It contains structures related to visual and auditory orienting responses, eye movements and motor control. The brainstem is not merely a cable bundle connecting the lower and upper centres; it has its own processing centres as well.',
        'The cerebellum is behind the pons and the bulbus. It takes part in the timing and accuracy of movement, balance and motor learning. It helps to adjust the working together of the agonist, antagonist, synergist and fixator muscles. It is not the single source of all the commands initiating movement; it supports the harmony between the planned movement and the movement performed.',
      ],
      subsections: [
        {
          title: 'Passage routes and the adjustment of movement',
          paragraphs: [
            'The brainstem is the passage area of many ascending and descending pathways between the upper centres and the spinal cord. It also houses an important part of the cranial nerve nuclei. The mesencephalon continues above into the diencephalon and the medulla oblongata below into the spinal cord; the pons lies in between. Knowing the anterior-posterior neighbourhoods of these three parts explains why the fourth ventricle is found between the brainstem and the cerebellum.',
            'The cerebellum does not manage movement in the form of initiating a single muscle on its own; it contributes to timing, balance and error correction. The connections called the pedunculus cerebellaris unite it with the other central structures. The comparison between the intended form of a movement and the sensory result that actually occurs is important for fluent and coordinated movement. Loss of strength and loss of coordination are therefore not the same functional disorder.',
          ],
        },
        {
          title: 'The internal texture of the brainstem and the cerebellar connections',
          paragraphs: [
            'The cerebral peduncles lie in front of the mesencephalon and the colliculi behind it. The wide anterior part of the pons is related to the cerebellar connections and the pyramids on the anterior surface of the medulla oblongata to the descending motor pathways. The reticular formation is a network arrangement spread through the brainstem; it takes part in different aspects of alertness, autonomic activity and motor regulation. The brainstem is not a passive cable bundle extending from top to bottom.',
            'The cerebellum consists of two hemispheres and the vermis on the midline. There is a folded cortex on the outside and white matter and deep nuclei inside. The superior, middle and inferior peduncles provide input-output connections with different central areas. Vestibular information carries data on balance, proprioceptive information on the movement performed and cortical connections on the planned movement. The cerebellar arrangement compares this information and contributes to timing and error correction.',
            'Being able to produce muscle force and performing a movement with the right timing and amplitude are different. In a cerebellar disorder coordination, approach to the target and balance may be affected; this is not always a complete paralysis of the muscle. This example shows that the same movement is a task shared between the cortex, brainstem, cerebellum and spinal cord.',
          ],
        },
      ],
    },
    'ara-beyin': {
      title: 'The diencephalon and its endocrine connection',
      paragraphs: [
        'The thalamus is an important station where much sensory information is processed and directed before reaching the cortex. The olfactory route is the exception to the typical thalamic relay arrangement in its first cortical arrival. The thalamus is not only a passive crossing point but a collection of nuclei taking part in the regulation of the flow of information.',
        'The hypothalamus is related to fluid balance, body temperature, hunger–satiety, autonomic responses, reproductive behaviours and biological rhythms. Its connection with the hypophysis enables neural regulation to be converted into a hormonal response. The hypophysis lies in the sella turcica of the sphenoid bone and is connected to the hypothalamus by a stalk.',
        'The pineal gland in the epithalamus takes part in relating the environmental light–dark cycle to biological rhythms through melatonin secretion; its activity increases at night. The subthalamus is related to motor control circuits. These small regions are not insignificant structures left in the shadow of the large cerebral hemispheres.',
      ],
      subsections: [
        {
          title: 'The link from position to function in the thalamus and hypothalamus',
          paragraphs: [
            'The thalamus is a collection of nuclei placed on either side of the third ventricle; it serves as an intermediate station in the transmission and processing of much sensory information to the cortex. It cannot be said that “all senses pass through the same nucleus”; different modalities have different connection arrangements. The olfactory routes are the important exception to the classical first thalamic relay pattern.',
            'The hypothalamus is below the thalamus, around the floor of the third ventricle. It is related to temperature, hunger-thirst, autonomic responses and endocrine regulation. Its connection with the hypophysis is an example of the nervous system and the hormonal system working together. The epithalamus and the pineal structure, by contrast, are in a different position within the same broad diencephalic region. Their being close together does not mean that these regions undertake the same task.',
          ],
        },
        {
          title: 'Nuclei, hypophysis and homeostasis in the diencephalon',
          paragraphs: [
            'The thalamus contains numerous nuclei; there are different relay areas for the somatic sensory, visual and auditory pathways. Sensory information is processed here before reaching the cortex and related to other circuits. The hypothalamus, around the floor and lower side walls of the third ventricle, is related to temperature, fluid balance, nutrition, rhythms and autonomic-endocrine coordination. Its function cannot be limited to being merely “the small centre controlling the hypophysis”.',
            'The posterior part of the hypophysis is directly connected with the axons of hypothalamic neurons; the anterior part receives the effect of the regulatory hormones released through the portal vessel system. The information reaches the two parts of the same gland by different routes. The pineal structure in the epithalamus takes part in the hormonal regulation related to light–dark cycles; the subthalamic structures are related to motor circuits. Under the heading of the diencephalon there are closely placed but differently connected regions.',
          ],
        },
      ],
    },
    korteks: {
      title: 'The lobes, sulci and functions of the brain',
      paragraphs: [
        'The outer surface of the cerebral hemispheres is the cortex cerebri. The elevations on the surface are called gyri and the grooves sulci. The longitudinal fissure separates the two hemispheres. The sulcus centralis lies between the frontal and parietal lobes; the sulcus lateralis between the temporal lobe and the frontal/parietal regions above it; the parietooccipital sulcus is found especially on the medial surface at the parietal–occipital boundary.',
        'In the figures of the source the precentral gyrus in front of the central sulcus and the postcentral gyrus behind it are shown side by side. The precentral region is related to the primary motor cortex and the postcentral region to the primary somatosensory cortex. This distinction on the two sides of the same groove makes concrete the different processing of the movement command and the sensory information coming from the body.',
        'Learning the dominant tasks of the lobes is useful; but speech, memory, decision making or perception do not take place entirely in a single small point. Different lobes and deep structures work together in networks.',
      ],
      table: {
        headers: ['Lobe', 'Main relationships'],
        rows: [
          ['Frontal', 'Areas related to voluntary motor control, planning, decision making, behaviour and language production.'],
          ['Parietal', 'The evaluation of bodily senses and spatial integration.'],
          ['Temporal', 'Areas related to hearing, memory and the comprehension of language.'],
          ['Occipital', 'The processing of visual information.'],
        ],
      },
      subsections: [
        {
          title: 'Using the central sulcus as an orientation line',
          paragraphs: [
            'The sulcus centralis is the basic landmark separating the frontal and parietal lobes. The precentral gyrus in front of it is related to motor function and the postcentral gyrus behind it to somatic sensory functions. The representation areas are not distributed equally according to the real sizes of the body parts; regions with fine control or detailed sensation may be represented by a wider area. The cortical map is therefore not a small human figure with the anatomical proportions preserved.',
            'The relationship of the occipital lobe with vision and the temporal lobe with hearing and memory is a useful starting point; but complex behaviours are not the isolated work of a single lobe. The association areas bring different senses and previous experiences together. The insula is not immediately picked out on the external surface because it remains deep in the lateral sulcus. The lobe classification is used to understand the surface map and the functional networks the interaction between regions.',
          ],
        },
        {
          title: 'The basic functions of the lobes and the association areas',
          paragraphs: [
            'The primary motor cortex lies in the precentral gyrus and the primary somatosensory cortex in the postcentral gyrus. The motor representation should be thought of not as a single point for each particular muscle but as overlapping movement representations of body regions. The wide representation area of the hand and face is related to fine control and sensory detail; the real body proportions are not preserved on the cortex.',
            'The lateral sulcus separates the temporal lobe from the frontal-parietal region; the parietooccipital sulcus is especially prominent on the medial surface. The association areas integrate more than one kind of information. Language production and comprehension are related in most people to networks in the dominant hemisphere; the simple model in which a single small area carries the whole of language function is not sufficient. Memory, attention and behaviour are also regulated through connections between the lobes.',
          ],
          table: {
            headers: ['Lobe/region', 'Main relationships'],
            rows: [
              ['Frontal', 'Motor planning and execution, executive functions, behavioural control; the anterior and posterior parts do not have the same function.'],
              ['Parietal', 'The processing of somatic sensation, the integration of body and space relationships.'],
              ['Temporal', 'Auditory processing, memory and some language networks; the medial temporal structures are important for memory.'],
              ['Occipital', 'Visual information processing; the primary visual area is related to the medial calcarine region.'],
              ['Insula', 'Deep in the lateral sulcus; contribution to visceral senses, taste and other integrative networks.'],
            ],
          },
        },
      ],
    },
    omurilik: {
      title: 'The level, segments and roots of the spinal cord',
      paragraphs: [
        'The spinal cord extends within the vertebral canal as the continuation of the medulla oblongata; in the adult it mostly ends at the conus medullaris at the level of L1–L2. Because the vertebral column is longer than the spinal cord the roots leaving the lower segments advance downwards to reach their own exit foramina and form the cauda equina arrangement.',
        'The standard count is 31 spinal cord segments and 31 pairs of spinal nerves: eight cervical, twelve thoracic, five lumbar, five sacral and one coccygeal. Having eight cervical spinal nerves for seven cervical vertebrae is not an error but a difference between the bony and neural counts. The statement of 33 segments in the source must not be used instead of the standard spinal cord count.',
        'The posterior root carries sensory and the anterior root motor fibres. The ganglion spinale on the posterior root contains the sensory neuronal bodies. When the roots unite a mixed spinal nerve is formed; it then divides into anterior and posterior rami. Both of these rami carry mixed fibres: the information that “the posterior root is sensory” does not mean that the posterior ramus is only sensory.',
      ],
      flow: ['Sensory posterior root + motor anterior root', 'Mixed spinal nerve', 'Mixed anterior and posterior rami'],
      subsections: [
        {
          title: 'Why is the vertebral level not the same as the spinal cord segment?',
          paragraphs: [
            'During development the vertebral column grows more than the spinal cord; in the adult the spinal cord generally ends around the vertebral level of L1–L2. The more inferior spinal nerve roots advance downwards within the canal to reach their own exit foramina and form the cauda equina arrangement. A sacral nerve root is therefore not within the sacrum at every point along its course; it may also pass through the upper parts of the canal.',
            'A segment is the part of the spinal cord related to one pair of spinal nerve roots; a vertebra, by contrast, is a bony structure. Having eight pairs of nerves for seven vertebrae in the cervical region makes the naming and exit relationship especially important. The cervical and lumbosacral enlargements of the spinal cord are related to the limb connections. The filum terminale is a thin anchoring extension; it is not another name for the long nerve roots of the cauda equina.',
          ],
        },
        {
          title: 'The exit order of the spinal nerves and the formation of plexuses',
          paragraphs: [
            'The C1–C7 spinal nerves leave above the corresponding vertebra and C8 between C7 and T1; the nerves below mostly take their name from below the vertebra of the same number. This explains how eight pairs of nerves correspond to seven cervical vertebrae. A total of 31 pairs of nerves: eight cervical, twelve thoracic, five lumbar, five sacral and one coccygeal group. In the adult the long course of the lower roots causes the spinal cord segment and the exit vertebral level to separate.',
            'The anterior rami take part in the formation of the cervical, brachial, lumbar and sacral plexuses. Most of the thoracic anterior rami keep a segmental course as the intercostal nerves. A plexus is the network in which the nerve fibres are redistributed to different peripheral nerves; it is not the same structure as a ganglion, where neuronal bodies are gathered. A peripheral nerve may carry fibres from more than one spinal root. Involvement of a single root and involvement of a single peripheral nerve therefore do not have to produce the same distribution.',
          ],
        },
      ],
    },
    kesit: {
      title: 'The section of the spinal cord and the reflex connection',
      paragraphs: [
        'In transverse section the grey matter lies in the centre in the shape of an H or a butterfly. The anterior horns are related to the somatic motor neurons and the posterior horns to the connections processing sensory information. The prominent lateral horn contains autonomic neurons especially at the thoracolumbar levels. The bodies of the primary sensory neurons are not in the posterior horn but in the spinal ganglion.',
        'In the surrounding white matter the ascending sensory and descending motor pathways run. The canalis centralis in the middle is a small canal; it is not the same as the canalis vertebralis, the large bony canal surrounding the spinal cord. In a reflex circuit the afferent input, the central connections and the efferent output can generate a response without waiting for a conscious decision.',
      ],
      subsections: [
        {
          title: 'Seeing the root and the ramus as connections at different stages',
          paragraphs: [
            'The posterior root brings the sensory fibres to the spinal cord; the bodies of these sensory neurons are found in the dorsal root ganglion. The anterior root carries the motor output. When the two roots unite a short mixed spinal nerve is formed; this nerve then divides into anterior and posterior rami. The information “posterior root sensory, anterior root motor” therefore cannot be copied directly as “posterior ramus sensory, anterior ramus motor”; the rami contain mixed fibres.',
            'The posterior horn is the region of grey matter where sensory input is processed and the anterior horn the region containing the somatic motor cells. The white matter carries the ascending and descending pathways in the surrounding columns. The right and left regions are related through commissural connections; the canalis centralis in the middle is a small CSF space. The prominence of the lateral horn changes with the segment; every section of the spinal cord must not be thought of as an invariable copy of the same butterfly drawing.',
          ],
        },
        {
          title: 'The grey horns, the white columns and the reflex connection',
          paragraphs: [
            'The posterior horn is related to sensory input and interneuronal processing and the anterior horn to the bodies of the somatic motor neurons. The lateral grey projection is prominent especially at the thoracolumbar sympathetic levels. Sacral parasympathetic neurons are also found in intermediate grey regions; a lateral horn of the same size is not drawn at every level. The grey commissure around the central canal connects the right and left regions.',
            'The white matter is divided into the anterior, lateral and posterior funiculi; these are not homogeneous bundles carrying a single kind of information in the same direction. The ascending pathways carry sensory information to the upper centres and the descending pathways carry motor and regulatory information downwards. The posterior column pathways are related to fine touch and conscious proprioception, the anterolateral pathways to information such as pain and temperature and the corticospinal pathways to voluntary motor control. Because the levels at which the pathways cross are different, the generalisation that “all nerves cross over immediately in the spinal cord” is not correct.',
            'The union in the short spinal nerve of the motor fibre leaving by the anterior root with the sensory fibre entering by the posterior root is the basic anatomical distinction. The anterior and posterior rami formed afterwards carry mixed fibres. The posterior ramus reaching the skin of the back and the intrinsic back muscles does not make it only sensory. The order of the concepts of root, nerve and ramus enables the functions in the section to be understood.',
          ],
        },
      ],
    },
    meninks: {
      title: 'The meninges and the cerebrospinal fluid',
      paragraphs: [
        'The central nervous system is surrounded from outside to inside by the dura mater, the arachnoidea mater and the pia mater. The dura is the resistant outer sheath, the arachnoid the membrane within it and the pia the thin covering closely following the surface of the neural tissue. The section figure in the source shows this order around the spinal cord.',
        'The cerebrospinal fluid (CSF) is found in the ventricles and in the subarachnoid space between the arachnoid and the pia; the central canal is also related to this system. The CSF must not be thought of as filling the whole space between the bony wall of the vertebral canal and the spinal cord directly. The fluid contributes to mechanical protection, a buoyancy effect and the maintenance of the chemical environment.',
        'The CSF is largely formed in the choroid plexuses; from the lateral ventricles it reaches the third ventricle, through the aqueduct the fourth ventricle and from there the subarachnoid space, and is reabsorbed. This continuous formation and return prevents the fluid from being a static cushion.',
      ],
      subsections: [
        {
          title: 'The CSF route and the meningeal spaces',
          paragraphs: [
            'The CSF is produced mainly by the plexus choroideus in the ventricles; from the lateral ventricles it reaches the third, through the aqueduct the fourth and through its openings the subarachnoid area. Here it circulates around the brain and spinal cord; reabsorption takes place through venous and other drainage routes. Although the ventricular lumen and the subarachnoid space are connected they are not names for the same anatomical space.',
            'The dura is the firm outer covering, the arachnoid the membrane within it and the pia the thin covering closely following the surface of the neural tissue. The subarachnoid space contains CSF. The spinal epidural area contains fat and a venous network; in the skull the epidural area between the dura and the bone is normally not a similarly wide, open space. The subdural area is not thought of as a normal open CSF reservoir either. The presence of the word “space” in the name does not mean that it is a real space of equal width in every region.',
          ],
        },
        {
          title: 'From ventricular flow to venous reabsorption',
          paragraphs: [
            'The lateral ventricles are connected to the third ventricle by the interventricular foramina and the third ventricle to the fourth by the cerebral aqueduct. The median and lateral openings of the fourth ventricle enable the CSF to reach the subarachnoid area. The fluid circulating around the brain and spinal cord contributes to mechanical support and the regulation of the chemical environment. The balance between production by the choroid plexus and reabsorption affects the volume and pressure conditions.',
            'The cranial dura, with its two-leaf relationship, forms the dural venous sinuses and some partitions. The falx cerebri extends between the hemispheres and the tentorium cerebelli between the cerebellum and the occipital region. These are not neural tissue but dural folds. The arachnoid granulations project towards the venous sinuses and take part in the reabsorption of CSF; lymphatic drainage routes are important too.',
            'The spinal dural sac extends lower than the spinal cord itself; below the conus the roots run in the lumbar cistern within the CSF. The pia follows the surface closely and takes part in the relationships of the denticulate ligaments and the filum. The names epidural, subdural and subarachnoid indicate the position relative to the membranes; their normal fluid contents and their real or potential space properties are not the same. This distinction prevents a covering scheme from being read as only three equal rings.',
          ],
        },
      ],
    },
    kranial: {
      title: 'The twelve pairs of cranial nerves',
      paragraphs: [
        'The cranial nerves are numbered with Roman numerals I–XII. Some are sensory, some motor, some mixed and with parasympathetic components. The table below separates the basic tasks of the nerves; in particular facial sensation and the movement of facial expression, vision and eye movement, and taste and tongue movement must not be attached to the same nerve.',
      ],
      table: {
        headers: ['Nerve', 'Basic task'],
        rows: [
          ['I — N. olfactorius', 'Smell.'],
          ['II — N. opticus', 'Vision.'],
          ['III — N. oculomotorius', 'Most extraocular muscles, upper eyelid; parasympathetic control of the pupil and accommodation.'],
          ['IV — N. trochlearis', 'M. obliquus superior.'],
          ['V — N. trigeminus', 'Facial sensation; with V3 the muscles of mastication, the mylohyoid and the anterior belly of the digastric and similar muscles.'],
          ['VI — N. abducens', 'M. rectus lateralis; outward movement of the eye.'],
          ['VII — N. facialis', 'Muscles of facial expression; taste of the anterior tongue; parasympathetic innervation of the lacrimal, submandibular and sublingual glands.'],
          ['VIII — N. vestibulocochlearis', 'Hearing and balance.'],
          ['IX — N. glossopharyngeus', 'Taste/general sensation of the posterior tongue, stylopharyngeus; parasympathetic innervation of the parotid.'],
          ['X — N. vagus', 'Pharyngeal and laryngeal functions; visceral sensation and parasympathetic control in an important part of the thoracic and abdominal organs.'],
          ['XI — N. accessorius', 'Sternocleidomastoideus and trapezius.'],
          ['XII — N. hypoglossus', 'Motor control of most of the tongue muscles; the palatoglossus is the exception.'],
        ],
      },
      subsections: [
        {
          title: 'Learning the cranial nerves with their modalities and exits',
          paragraphs: [
            'Smell and vision are the first two special sensory nerves; III, IV and VI are related to eye movements, V to the general sensation of the face and mastication, VII to facial expression and some secretory/taste routes. VIII forms the basic map for hearing and balance; IX for the pharynx, posterior tongue and parotid connections; X for the pharynx-larynx and internal organ connections; XI for the sternocleidomastoideus-trapezius; XII for tongue movements. Because more than one modality may be present in one nerve, short function words do not replace the detail.',
            'Matching with the skull foramina is the second step, explaining how the nerve reaches its target region. The optic canal is the passage for II and the superior orbital fissure for III–IV–V1–VI; the rotundum for V2 and the ovale for V3. The jugular foramen is related to IX–X–XI and the hypoglossal canal to XII. The course of the facial nerve within the temporal bone and its stylomastoid exit to the facial muscles are different steps. This detail makes it important to know which part of the route is asked in the question “through which foramen does the nerve pass?”.',
          ],
        },
        {
          title: 'Somatic, special sensory and autonomic components in the cranial nerves',
          paragraphs: [
            'The numbers of the cranial nerves are generally ordered from front to back; but they are not all equivalent peripheral cables leaving only the brainstem. I, smell, and II, the visual route, carry special central connections. III, VII, IX and X are the basic cranial routes with parasympathetic components. V stands out with a wide general sensory area and the motor supply of mastication, VII with the motor supply of facial expression, VIII with hearing and balance, IX–X with pharyngeal and visceral relationships and XI–XII with specific muscle groups.',
            'Classifying a nerve briefly as “sensory” or “motor” does not mean that all its targets have been described. The eye movement nerves contain different muscles, the trigeminal branches different facial areas and the vagus a large number of targets extending from the neck to the abdominal region. The specific distinctions below turn the memorising of numbers into functional connections.',
          ],
          table: {
            headers: ['Nerve', 'Detailed basic distinction'],
            rows: [
              ['III, IV, VI', 'III with most extraocular muscles, the upper lid elevator and the parasympathetic intraocular route; IV with the superior oblique and VI with the lateral rectus.'],
              ['V1, V2, V3', 'V1 ophthalmic and V2 maxillary mostly general sensation; V3 mandibular carries motor fibres of mastication in addition to general sensation.'],
              ['VII', 'Motor supply of facial expression, taste route of the anterior tongue, lacrimal and submandibular/sublingual secretory relationships.'],
              ['IX', 'Taste/general sensation of the posterior tongue, motor supply of the stylopharyngeus, parasympathetic route of the parotid and carotid sensory connections.'],
              ['X', 'Motor/sensory of the pharynx-larynx, thoracic and abdominal visceral connections; the recurrent laryngeal branches belong to it.'],
              ['XI and XII', 'XI sternocleidomastoid-trapezius; XII most of the tongue muscles. The palatoglossus is the exception for XII.'],
            ],
          },
        },
      ],
    },
  },
  guide: {
    goal: 'Connect sensory input, central processing and motor output.',
    explanation: 'The posterior root of the spinal nerve carries sensory and the anterior root motor fibres. The spinal nerve formed by the union of the two roots is mixed; its anterior and posterior rami are not only motor or only sensory either. Distinguishing the root from the ramus is the basis of understanding the regional distribution of the nerves.',
    task: 'In a diagram of the spinal cord find the posterior root ganglion and follow the arrival of a sensory stimulus at the centre. Then follow the motor output in the opposite direction.',
    answer: 'The body of the sensory neuron is in the posterior root ganglion; its central extension enters the spinal cord through the posterior root. The body of the somatic motor neuron is in the anterior horn; its axon leaves through the anterior root.',
    mistake: 'Grey matter is not found only on the surface of the brain; the deep brain nuclei and the central grey matter of the spinal cord exist as well.',
  },
  teaching: {
    'beyin-oluk-lob-tanima': {
      title: 'Reading the region around the central sulcus in a photograph of the brain',
      paragraphs: [
        'In a lateral view of the brain determine the front–back direction first and then find the sulcus lateralis; the temporal lobe lies below this groove. The sulcus centralis separates the frontal and parietal lobes. In front of it the gyrus precentralis is the primary motor cortex and behind it the gyrus postcentralis the primary somatic sensory cortex. An arrow pointing only to the upper surface of the brain is not enough to say “motor area”: whether it is in front of or behind the groove and which gyrus the arrow actually reaches must be assessed. In a partly covered or blurred exam photograph do not invent the position of the arrow and produce a definite answer.',
        'The primary visual cortex is mainly around the sulcus calcarinus on the medial surface of the occipital lobe. The primary auditory cortex is related to the transverse temporal gyri on the superior surface of the temporal lobe. Language functions are not reduced to a single button; in the dominant hemisphere the inferior frontal areas are related to speech production and the posterior temporal–parietal networks to comprehension. “Recognising what is seen”, “giving meaning to sound” and “initiating a muscle movement” ask about different cortical networks; do not attach each of them to the frontal lobe answer.',
      ],
      headers: ['Landmark / area', 'Location', 'Basic relationship'],
      rows: [
        ['Gyrus precentralis', 'In front of the central groove', 'Primary motor'],
        ['Gyrus postcentralis', 'Behind the central groove', 'Primary somatic sensory'],
        ['Below the sulcus lateralis', 'Temporal lobe', 'Relationship with auditory areas'],
        ['Around the sulcus calcarinus', 'Occipital medial surface', 'Primary visual'],
        ['Insula', 'Deep in the lateral groove', 'Does not appear as an independent elevation on the surface.'],
      ],
      checks: [
        {
          q: 'Where is the primary somatic sensory cortex found?',
          options: ['Gyrus postcentralis', 'Gyrus precentralis', 'Medulla oblongata'],
          why: 'The postcentral gyrus behind the central groove is the sensory cortex. The precentral is the primary motor area and the medulla a part of the brainstem.',
        },
      ],
    },
    'meninks-bos-gecisleri': {
      title: 'Placing the order of the meninges and the CSF space in the same picture',
      paragraphs: [
        'From outside to inside the dura mater, arachnoidea and pia mater are ordered. The pia follows the surface of the neural tissue, its gyri and sulci, closely; the arachnoidea bridges over these depressions. The CSF and the large surface vessels are found in the subarachnoid space between the arachnoidea and the pia. The terms subdural and subarachnoid do not describe the same space. In the vertebral column the epidural area is between the dura and the canal wall; it is not the name of the space in which CSF is normally found.',
        'The CSF is produced mainly in the choroid plexuses in the ventricles. From the lateral ventricles it advances through the interventricular foramina to the third ventricle and through the aqueductus cerebri to the fourth ventricle; it emerges into the subarachnoid space through the median and lateral openings. In reabsorption the relationship of the arachnoid granulations with the dural venous sinuses is the basic model; other drainage routes exist as well. When studying the order, answer separately the questions “which passage from the third ventricle to the fourth?” and “to which space from the fourth?”; the foramen magnum is not the name of this interventricular passage.',
      ],
      headers: ['Order / passage', 'Structure', 'Wrong synonym'],
      rows: [
        ['The outermost covering', 'Dura', 'Not the pia.'],
        ['Between arachnoidea and pia', 'Subarachnoid space', 'Not the subdural.'],
        ['III → IV ventricle', 'Aqueductus cerebri', 'Not the foramen interventriculare.'],
        ['IV → outer CSF area', 'Median / lateral openings', 'Exit into the subarachnoid space'],
      ],
      checks: [
        {
          q: 'Which meningeal space normally contains CSF?',
          options: ['Subarachnoid', 'Subdural', 'Between the bone and the periosteum'],
          why: 'The subarachnoid space is between the arachnoidea and the pia. The other areas are not the normal surface circulation area of the CSF.',
        },
      ],
    },
    'kranial-parasempatik-ayrim': {
      title: 'Parasympathetic, sensory and motor components in the cranial nerves',
      paragraphs: [
        'The cranial parasympathetic outflow is carried by III, VII, IX and X. III is related to pupillary constriction and accommodation in the eye; VII to the lacrimal, submandibular and sublingual gland routes; IX to the parotid; X to the parasympathetic routes in an important part of the thoracic and abdominal organs. The preganglionic fibres go to the target after synapsing in the relevant ganglion. The branches of V may carry some postganglionic fibres to the target, but this does not mean that V itself has a cranial parasympathetic outflow from its own nucleus.',
        'The oculomotorius also has somatic motor fibres producing eye movement; saying “it carries parasympathetic” does not mean that the whole nerve is autonomic. The hypoglossus (XII) is mainly the motor nerve of the tongue; the accessorius (XI) is the motor nerve of the sternocleidomastoideus and trapezius. The vestibulocochlearis (VIII) is related to the sense of hearing and balance. The olfactorius (I) passes its smell fibres through the cribrosa foramina of the ethmoid and the opticus (II) through the canalis opticus. Because they are related to the eye, do not confuse all the functions of I, II and III with each other.',
      ],
      headers: ['Nerve', 'Main matching', 'Control'],
      rows: [
        ['III', 'Pupil / accommodation parasympathetic + eye motor', 'Ganglion ciliare'],
        ['VII', 'Motor supply of facial expression; taste and gland routes', 'Submandibular / pterygopalatine ganglia'],
        ['IX', 'Posterior tongue, pharynx and parotid route', 'Ganglion oticum'],
        ['X', 'Visceral motor / sensory; parasympathetic', 'Thoracoabdominal routes'],
        ['XI / XII', 'SCM–trapezius / tongue motor', 'They are not on the parasympathetic outflow list.'],
      ],
      checks: [
        {
          q: 'Which of these carries a cranial parasympathetic outflow?',
          options: ['N. oculomotorius III', 'N. hypoglossus XII', 'N. accessorius XI'],
          why: 'The preganglionic fibres of III of Edinger–Westphal origin go to the ciliary ganglion. XII stands out with the motor functions of the tongue and XI with those of the SCM and trapezius.',
        },
      ],
    },
    'medulla-pons-cerebellum': {
      title: 'Recognising the brainstem in a sagittal view',
      paragraphs: [
        'The brainstem consists from above to below of the mesencephalon, the pons and the medulla oblongata. The pons has the appearance of a convex bridge on the anterior surface; the medulla is the part below it narrowing towards the spinal cord. The cerebellum lies behind the brainstem and is connected to its parts by the peduncles. In a sagittal drawing, so as not to mistake an arrow pointing below the pons for a cerebellar structure, first distinguish the convexity in front from the leafy cerebellar contour behind. The medulla oblongata and the medulla spinalis are structures with similar names but at different levels.',
        'The medulla contains nuclei taking part in reflex networks such as respiration, cardiovascular regulation, swallowing and coughing. These functions cannot be reduced to a single small button; they work in connection with the other brainstem and upper centres. On the anterior surface the pyramids are related to the descending motor pathways and the olivary eminence to the inferior olivary nucleus. Many corticospinal fibres cross in the lower medulla; this relationship helps in understanding the connection of the motor pathways with the opposite half of the body. The cerebellum, by contrast, is related to the timing, balance and error correction of movement; it is not the same structure producing a muscle command directly in place of the primary motor cortex.',
      ],
      headers: ['Structure', 'Sagittal position', 'Distinguishing feature'],
      rows: [
        ['Mesencephalon', 'Above the pons', 'Midbrain'],
        ['Pons', 'The anterior convexity of the brainstem', 'In front of the cerebellum'],
        ['Medulla oblongata', 'Below the pons, above the spinalis', 'Also appears under the name bulbus.'],
        ['Cerebellum', 'Behind the brainstem', 'Not one of the three parts of the brainstem.'],
      ],
      checks: [
        {
          q: 'Which is the order of the brainstem from above to below?',
          options: ['Mesencephalon – pons – medulla oblongata', 'Pons – cerebellum – thalamus', 'Medulla spinalis – frontal lobe – pons'],
          why: 'The three basic parts of the brainstem are the mesencephalon, pons and medulla. The cerebellum is a separate structure attached behind it; the thalamus is part of the diencephalon.',
        },
      ],
    },
    'ara-beyin-hipofiz': {
      title: 'The thalamus, hypothalamus and hypophysis do not perform the same task',
      paragraphs: [
        'The thalamus is the whole of the nuclei in which many sensory pathways are processed and relayed before reaching the cortex; the olfactory route is the classical exception in terms of its first cortical arrival. The hypothalamus lies below it around the third ventricle; it is related to body temperature, hunger, thirst, autonomic regulation and endocrine control. The two structures do not become synonymous because they are in the same diencephalic group. The pineal gland of the epithalamus is related to melatonin and daily rhythms; it is a gland separate from the hypophysis.',
        'The hypophysis lies in the hypophysial fossa of the sella turcica of the sphenoid bone and is connected to the hypothalamus by the infundibulum. The anterior hypophysis mainly receives control through the portal vessel system of the hypothalamic secretions. The posterior hypophysis is the neuroendocrine part in which oxytocin and vasopressin produced in the hypothalamus are carried by axons and stored and released into the blood; these two hormones are not described as being synthesised from scratch in the posterior hypophysis. The questions of position, production and release must be answered separately. The same word “portal” appearing here does not mean that the hypophysial vessels unite directly with the hepatic portal vein.',
      ],
      headers: ['Structure', 'Position / relationship', 'Important distinction'],
      rows: [
        ['Thalamus', 'Diencephalon', 'Relay of many sensory pathways'],
        ['Hypothalamus', 'Below the thalamus', 'Homeostasis, autonomic and endocrine control'],
        ['Hypophysis', 'Sella turcica', 'The connections of the anterior and posterior parts differ.'],
        ['Pineal gland', 'Epithalamus', 'Melatonin / rhythms'],
      ],
      checks: [
        {
          q: 'What is the main site where vasopressin released from the posterior hypophysis is synthesised?',
          options: ['Hypothalamic neurons', 'Hepatic sinusoids', 'Pineal gland'],
          why: 'The hormone is synthesised in the hypothalamic neurons and carried by axons to the posterior hypophysis. The place of storage and release and the place of synthesis do not have to be the same.',
        },
      ],
    },
  },
};
