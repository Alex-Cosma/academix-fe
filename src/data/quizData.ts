import { QuizQuestion } from '../types'

export interface LevelQuestions {
  level: number
  summary: string
  questions: QuizQuestion[]
}

export interface NodeQuizData {
  nodeId: string
  levels: LevelQuestions[]
}

// ── FIRE ──────────────────────────────────────────

const fireQuiz: NodeQuizData = {
  nodeId: 'fire',
  levels: [
    {
      level: 1,
      summary: `The control of fire stands as arguably the single most transformative achievement in all of human history. Long before agriculture, writing, or the wheel, our ancestors learned to harness a force of nature that would reshape every dimension of human existence — from diet and shelter to social structure and cognitive development.

The earliest convincing evidence of controlled fire use dates back roughly 1 million years, found at Wonderwerk Cave in South Africa's Northern Cape province. Here, archaeologists discovered microscopic traces of ash and burned bone fragments deep inside the cave — far enough from the entrance to rule out natural wildfires. This suggests that Homo erectus, the dominant hominin species of that era, was deliberately maintaining fires within the cave environment.

Additional early evidence comes from Gesher Benot Ya'aqov in Israel (approximately 790,000 years ago), where clustered burned flint and wood fragments indicate repeated, intentional fire use at the same locations. The Qesem Cave site, also in Israel, shows evidence of habitual fire use dating to around 400,000 years ago, with a central hearth that was used consistently over extended periods.

It is important to distinguish between the opportunistic use of natural fire (lightning strikes, volcanic activity) and the deliberate creation and maintenance of fire. Early hominins likely first learned to keep natural fires burning before eventually mastering ignition techniques such as friction (fire drills and fire plows) and percussion (striking flint against pyrite to produce sparks). The transition from fire-keeping to fire-making represented a profound leap in technological capability and cognitive sophistication.

The geographic spread of fire evidence across Africa, the Middle East, and Europe suggests that fire control was not a single invention but likely emerged independently in multiple populations over hundreds of thousands of years, driven by the enormous survival advantages it conferred.`,
      questions: [
        {
          id: 'fire-1-1',
          questionType: 'multiple-choice',
          questionText: 'Approximately when did early humans first control fire?',
          options: ['1 million years ago', '500,000 years ago', '100,000 years ago', '10,000 years ago'],
          correctAnswer: '1 million years ago',
        },
        {
          id: 'fire-1-2',
          questionType: 'multiple-choice',
          questionText: 'Which site provides the earliest convincing evidence of controlled fire use?',
          options: ['Wonderwerk Cave, South Africa', 'Lascaux Cave, France', 'Altamira Cave, Spain', 'Chauvet Cave, France'],
          correctAnswer: 'Wonderwerk Cave, South Africa',
        },
        {
          id: 'fire-1-3',
          questionType: 'multiple-choice',
          questionText: 'Which hominin species is most associated with the earliest controlled fire use?',
          options: ['Homo erectus', 'Homo sapiens', 'Australopithecus', 'Homo habilis'],
          correctAnswer: 'Homo erectus',
        },
        {
          id: 'fire-1-4',
          questionType: 'multiple-choice',
          questionText: 'What is the key distinction between early fire-keeping and fire-making?',
          options: [
            'Fire-keeping maintained existing flames; fire-making created fire from scratch',
            'Fire-keeping was done indoors; fire-making was done outdoors',
            'Fire-keeping used wood; fire-making used stone',
            'There is no meaningful distinction between the two',
          ],
          correctAnswer: 'Fire-keeping maintained existing flames; fire-making created fire from scratch',
        },
      ],
    },
    {
      level: 2,
      summary: `The mastery of fire did not merely provide warmth and light — it fundamentally reshaped human biology, social organization, and the trajectory of technological civilization. Understanding fire's broader context requires examining its cascading effects across multiple domains of human life.

Perhaps the most profound impact of fire was on human nutrition and, consequently, brain development. The "cooking hypothesis," championed by biological anthropologist Richard Wrangham of Harvard University, proposes that cooking food was a critical driver of human brain evolution. Raw foods require enormous energy to digest — chimpanzees spend roughly 6 hours per day chewing. Cooking breaks down complex proteins and starches through heat, making nutrients far more bioavailable. This caloric surplus freed energy for brain growth: the human brain consumes approximately 20% of our total metabolic energy despite comprising only 2% of body mass. Without the concentrated nutrition provided by cooked food, sustaining such an energy-expensive organ would have been nearly impossible.

Fire also served as a catalyst for social complexity. The campfire became humanity's first gathering place — a space for storytelling, planning, and the transmission of knowledge across generations. Anthropological studies of modern hunter-gatherer societies, such as the !Kung San of the Kalahari, reveal that daytime conversations focus primarily on practical matters (economic complaints, social gossip), while nighttime fireside conversations shift dramatically toward storytelling, cultural transmission, and imaginative speculation. The firelit circle may have been the crucible in which language, mythology, and abstract thought were refined.

Fire's role as a technological enabler cannot be overstated. It was the prerequisite for pottery (firing clay), metallurgy (smelting ores), glass-making (melting silica), and countless other innovations. Every major material transformation in human history — from the Bronze Age to the Industrial Revolution — traces its lineage back to the controlled application of heat. Fire was, in essence, humanity's first tool for transforming matter at the molecular level.

The ecological impact was equally significant. Early humans used fire to reshape entire landscapes through deliberate burning practices. By clearing dense vegetation, they created open grasslands that attracted game animals, making hunting more productive. This "fire-stick farming" (a term coined by Australian archaeologist Rhys Jones) was practiced by Aboriginal Australians for at least 50,000 years and represents one of the earliest examples of humans deliberately engineering their environment.`,
      questions: [
        {
          id: 'fire-2-1',
          questionType: 'multiple-choice',
          questionText: 'According to the "cooking hypothesis," how did fire control contribute to human brain development?',
          options: [
            'Cooking made nutrients more bioavailable, providing energy for larger brains',
            'Fire scared away predators, reducing stress on the brain',
            'Smoke signals improved communication, stimulating brain growth',
            'Heat from fires made winters survivable, preserving brain tissue',
          ],
          correctAnswer: 'Cooking made nutrients more bioavailable, providing energy for larger brains',
        },
        {
          id: 'fire-2-2',
          questionType: 'multiple-choice',
          questionText: 'Which of these technologies directly depended on mastering fire?',
          options: ['Pottery, metallurgy, and glass-making', 'Agriculture and irrigation', 'Writing and mathematics', 'Weaving and textile production'],
          correctAnswer: 'Pottery, metallurgy, and glass-making',
        },
        {
          id: 'fire-2-3',
          questionType: 'multiple-choice',
          questionText: 'What percentage of total metabolic energy does the human brain consume?',
          options: ['About 20%', 'About 5%', 'About 50%', 'About 10%'],
          correctAnswer: 'About 20%',
        },
        {
          id: 'fire-2-4',
          questionType: 'multiple-choice',
          questionText: 'What was "fire-stick farming" as practiced by Aboriginal Australians?',
          options: [
            'Controlled burning to manage landscapes and attract game',
            'Using burning sticks as torches for night-time crop tending',
            'Creating charcoal-enriched soil for planting',
            'Burning crop residue after harvest to fertilize fields',
          ],
          correctAnswer: 'Controlled burning to manage landscapes and attract game',
        },
        {
          id: 'fire-2-5',
          questionType: 'multiple-choice',
          questionText: 'How did fireside gatherings shape human social development?',
          options: [
            'They became spaces for storytelling, cultural transmission, and abstract thought',
            'They were used primarily for cooking competitions',
            'They served only practical purposes like tool-making',
            'They had no significant social function beyond warmth',
          ],
          correctAnswer: 'They became spaces for storytelling, cultural transmission, and abstract thought',
        },
      ],
    },
    {
      level: 3,
      summary: `Understanding the mechanics of fire requires grasping the fundamental chemistry and physics that govern combustion — knowledge that took humanity millennia to formalize, even though we had been exploiting fire's properties intuitively for hundreds of thousands of years.

Fire is a chemical reaction known as combustion: a rapid, self-sustaining oxidation process that produces heat and light. The "fire triangle" (also called the combustion triangle) describes the three essential components: heat (an ignition source to reach activation energy), fuel (a combustible material such as wood, fat, or coal), and oxygen (the oxidizer that sustains the reaction). Remove any one of these three elements and the fire extinguishes. This principle remains the foundation of all modern firefighting techniques.

The temperature at which a material begins to burn is called its ignition point or flash point. Wood, the most common fuel used by early humans, has an ignition point of approximately 300°C (572°F), though this varies by species and moisture content. Once ignited, a wood fire typically burns at 600–1,100°C depending on oxygen supply and fuel density. Early humans discovered that by controlling airflow — using bellows, enclosed structures, or simply blowing — they could dramatically increase fire temperatures. This understanding was crucial: the leap from open campfires (~600°C) to enclosed kilns and furnaces (1,000°C+) unlocked entirely new categories of material transformation.

The physics of heat transfer play a central role in how fire was used. Conduction (direct contact), convection (heat carried by rising air), and radiation (infrared energy emitted by flames) each served different purposes. Cooking relied primarily on conduction and radiation. Pottery kilns exploited convection to distribute heat evenly around clay vessels. Charcoal production — one of humanity's earliest chemical engineering achievements — involved heating wood in a low-oxygen environment (pyrolysis) to drive off water and volatile compounds, leaving behind nearly pure carbon that burned hotter and cleaner than raw wood.

Charcoal was transformative because it could achieve temperatures that raw wood could not. A charcoal fire with forced air (via bellows) can reach 1,100–1,500°C — hot enough to smelt copper (melting point 1,085°C) and eventually iron (melting point 1,538°C). Without charcoal, the entire arc of metallurgical development would have been impossible. The production of charcoal itself required sophisticated understanding of fire management: wood had to be heated slowly in earth-covered mounds (charcoal kilns) for days, with precise control of air intake to prevent the wood from simply burning to ash.

Early humans also exploited fire for tool hardening. By carefully heating wooden spear tips in a fire and allowing them to cool slowly, they could increase the hardness and durability of the wood — one of the earliest examples of heat treatment in materials science. Archaeological evidence from Schöningen, Germany (circa 300,000 years ago) suggests that Homo heidelbergensis used fire to harden the tips of wooden throwing spears.`,
      questions: [
        {
          id: 'fire-3-1',
          questionType: 'multiple-choice',
          questionText: 'What is the chemical process of fire called?',
          options: ['Combustion', 'Sublimation', 'Condensation', 'Fermentation'],
          correctAnswer: 'Combustion',
        },
        {
          id: 'fire-3-2',
          questionType: 'multiple-choice',
          questionText: 'Which three elements make up the "fire triangle"?',
          options: ['Heat, fuel, oxygen', 'Heat, light, carbon', 'Fuel, air, water', 'Carbon, hydrogen, oxygen'],
          correctAnswer: 'Heat, fuel, oxygen',
        },
        {
          id: 'fire-3-3',
          questionType: 'multiple-choice',
          questionText: 'Why was charcoal so important for technological development?',
          options: [
            'It burned hotter than raw wood, enabling metal smelting',
            'It was easier to transport than firewood',
            'It produced more light than other fuels',
            'It was waterproof and could burn in rain',
          ],
          correctAnswer: 'It burned hotter than raw wood, enabling metal smelting',
        },
        {
          id: 'fire-3-4',
          questionType: 'multiple-choice',
          questionText: 'What is the approximate ignition point of wood?',
          options: ['300°C (572°F)', '100°C (212°F)', '600°C (1,112°F)', '50°C (122°F)'],
          correctAnswer: '300°C (572°F)',
        },
        {
          id: 'fire-3-5',
          questionType: 'free-text',
          questionText: 'Describe how early humans used fire beyond cooking and warmth. Include at least two specific applications and explain why each was significant.',
          correctAnswer: '',
          keywords: ['hunting', 'predator', 'light', 'protection', 'land', 'clearing', 'tool', 'harden', 'signal', 'social', 'gathering', 'clay', 'pottery', 'charcoal', 'spear', 'landscape', 'bellows'],
          minKeywords: 3,
        },
      ],
    },
    {
      level: 4,
      summary: `The mastery of fire was not merely a technological milestone — it was the foundational breakthrough upon which virtually all subsequent human innovation was built. Tracing the causal chains that lead from controlled combustion to modern civilization reveals fire as the single most consequential technology in human history.

The metallurgical revolution is perhaps the clearest example of fire's cascading impact. The progression from native copper (found in pure metallic form and cold-hammered into shape) to smelted copper (extracted from ore using heat) to bronze (an alloy of copper and tin requiring precise temperature control) to iron (demanding even higher temperatures and more sophisticated furnace design) represents a continuous escalation of fire management skill. Each step unlocked new materials with superior properties: bronze was harder than copper, iron was harder than bronze, and steel (iron with controlled carbon content, achieved through careful fire management) was harder still. These materials revolutionized agriculture (iron plows), warfare (steel weapons and armor), construction (iron and steel structural elements), and eventually industry.

The relationship between fire mastery and ceramic technology is equally foundational. The earliest ceramics — clay figurines fired in open flames — date to approximately 29,000 years ago (the Venus of Dolní Věstonice in the Czech Republic). Functional pottery vessels appeared around 20,000 years ago in East Asia (Jomon culture, Japan). The development of enclosed kilns around 6,000 BCE allowed potters to achieve higher, more uniform temperatures (900–1,100°C), producing stronger, more waterproof vessels. This technology eventually branched into porcelain (requiring temperatures above 1,300°C, first achieved in China during the Han Dynasty), faience, and architectural ceramics. Every one of these developments required increasingly sophisticated fire management.

Glass-making, which emerged around 3,500 BCE in Mesopotamia, demanded temperatures exceeding 1,700°C to melt silica sand — achievable only with advanced furnace technology and charcoal fuel. Glass would eventually enable lenses (spectacles, telescopes, microscopes), which in turn drove the Scientific Revolution of the 16th–17th centuries. It is no exaggeration to say that without fire, there would be no modern science.

Fire also underpins the energy systems that power modern civilization. The steam engine — the driving force of the Industrial Revolution — is fundamentally a machine for converting the chemical energy of combustion (burning coal) into mechanical work. Internal combustion engines, gas turbines, and even modern coal and natural gas power plants all operate on the same basic principle: controlled combustion producing heat, which is then converted to useful energy. Nuclear power, while not combustion-based, was discovered by scientists using instruments (spectrometers, vacuum tubes) whose manufacture depended on fire-derived technologies like glass-making and metallurgy.

The cultural and cognitive dimensions of fire mastery deserve equal emphasis. The hearth became the architectural and symbolic center of human dwellings from the Paleolithic era through the medieval period and beyond. Fire rituals appear in virtually every known human culture: Zoroastrian fire temples, the Greek myth of Prometheus, the Roman cult of Vesta, Hindu fire ceremonies (Agni worship), and countless others. These traditions reflect fire's central place not just in human technology but in human identity and meaning-making.

Looking at the full sweep of human history, the pattern is unmistakable: fire was the "root technology" — the innovation without which no other innovation was possible. Agriculture required fire for land clearing. Metallurgy required fire for smelting. Chemistry emerged from fire-based experiments (alchemy). The Industrial Revolution was powered by fire. Even the Digital Age depends on fire-derived technologies: the silicon chips in computers are manufactured using extreme heat processes (chemical vapor deposition, ion implantation) that trace their lineage directly back to humanity's first controlled flames.`,
      questions: [
        {
          id: 'fire-4-1',
          questionType: 'multiple-choice',
          questionText: 'What is the oldest known ceramic object, predating functional pottery?',
          options: [
            'Venus of Dolní Věstonice (~29,000 years ago)',
            'Jomon pottery (~20,000 years ago)',
            'Egyptian faience (~5,000 years ago)',
            'Chinese porcelain (~2,000 years ago)',
          ],
          correctAnswer: 'Venus of Dolní Věstonice (~29,000 years ago)',
        },
        {
          id: 'fire-4-2',
          questionType: 'multiple-choice',
          questionText: 'Why was the progression from copper to bronze to iron dependent on fire mastery?',
          options: [
            'Each successive metal required higher smelting temperatures and more advanced furnaces',
            'Each metal was found in deeper mines that required fire for lighting',
            'Bronze and iron could only be shaped while red-hot',
            'The metals were discovered by accidentally dropping them into campfires',
          ],
          correctAnswer: 'Each successive metal required higher smelting temperatures and more advanced furnaces',
        },
        {
          id: 'fire-4-3',
          questionType: 'multiple-choice',
          questionText: 'How did glass-making eventually contribute to the Scientific Revolution?',
          options: [
            'Glass lenses enabled telescopes and microscopes for scientific observation',
            'Glass beakers allowed safe chemical experiments',
            'Stained glass windows in universities inspired scholars',
            'Glass mirrors were used for signaling between research institutions',
          ],
          correctAnswer: 'Glass lenses enabled telescopes and microscopes for scientific observation',
        },
        {
          id: 'fire-4-4',
          questionType: 'multiple-choice',
          questionText: 'Which of the following is NOT a direct application of combustion in modern technology?',
          options: [
            'Solar photovoltaic panels generating electricity',
            'Steam engines converting heat to mechanical work',
            'Internal combustion engines powering vehicles',
            'Gas turbines generating electrical power',
          ],
          correctAnswer: 'Solar photovoltaic panels generating electricity',
        },
        {
          id: 'fire-4-5',
          questionType: 'free-text',
          questionText: 'Explain how the mastery of fire was a prerequisite for the development of metallurgy. Trace the chain from basic fire control through charcoal production to metal smelting, and explain why each step was necessary.',
          correctAnswer: '',
          keywords: ['heat', 'temperature', 'smelt', 'ore', 'metal', 'copper', 'bronze', 'iron', 'furnace', 'charcoal', 'melt', 'forge', 'bellows', 'alloy', 'kiln'],
          minKeywords: 4,
        },
      ],
    },
  ],
}

// ── POTTERY ───────────────────────────────────────

const potteryQuiz: NodeQuizData = {
  nodeId: 'pottery',
  levels: [
    {
      level: 1,
      summary: `Pottery — the art and technology of shaping and firing clay into durable vessels and objects — represents one of humanity's earliest and most consequential material innovations. Unlike stone tools, which are shaped by removing material (subtractive manufacturing), pottery involves building up and transforming material through heat (additive manufacturing followed by thermal processing). This conceptual leap marked a fundamental shift in how humans interacted with the material world.

The primary raw material for pottery is clay, a naturally occurring fine-grained sedimentary material composed primarily of hydrated aluminum silicates. When wet, clay is remarkably plastic — it can be shaped, molded, and sculpted into virtually any form. When dried, it becomes rigid but fragile. The transformative step is firing: heating the dried clay to temperatures between 600°C and 1,100°C triggers irreversible chemical changes (sintering and vitrification) that convert the soft, water-soluble material into a hard, permanent ceramic.

The oldest known pottery vessels were discovered in the Xianrendong and Yuchanyan caves in southern China, dated to approximately 20,000 years ago — deep in the last Ice Age. These earliest pots appear to have been used for cooking, specifically for boiling food, which was a revolutionary dietary innovation. Boiling allowed humans to extract nutrients from foods that were inedible raw (bones, tough roots, shellfish), and to create nutritious broths and stews that could sustain the elderly, the sick, and young children.

The Jomon culture of Japan produced some of the most elaborate early pottery, dating back to around 16,500 years ago. Jomon pottery is characterized by distinctive cord-marked decorative patterns (the word "Jomon" literally means "cord-marked") and represents a flourishing of ceramic artistry alongside practical function. Remarkably, the Jomon people were hunter-gatherers, not farmers — challenging the long-held assumption that pottery was invented by settled agricultural societies.

In the Near East, pottery appeared somewhat later (around 7,000–6,000 BCE) but quickly became central to agricultural life. The ability to store grain, oil, wine, and water in sealed ceramic containers was transformational for settled communities. Pottery enabled surplus food storage, which in turn enabled population growth, economic specialization, and trade — the building blocks of urban civilization.`,
      questions: [
        {
          id: 'pottery-1-1',
          questionType: 'multiple-choice',
          questionText: 'What is the primary material used to make pottery?',
          options: ['Clay', 'Sand', 'Stone', 'Wood'],
          correctAnswer: 'Clay',
        },
        {
          id: 'pottery-1-2',
          questionType: 'multiple-choice',
          questionText: 'When were the earliest known pottery vessels created?',
          options: ['Around 20,000 years ago', 'Around 5,000 years ago', 'Around 50,000 years ago', 'Around 2,000 years ago'],
          correctAnswer: 'Around 20,000 years ago',
        },
        {
          id: 'pottery-1-3',
          questionType: 'multiple-choice',
          questionText: 'What does the word "Jomon" mean, referring to Japan\'s early pottery culture?',
          options: ['Cord-marked', 'Fire-born', 'Earth-shaped', 'Water-carrier'],
          correctAnswer: 'Cord-marked',
        },
        {
          id: 'pottery-1-4',
          questionType: 'multiple-choice',
          questionText: 'What was the primary use of the earliest known pottery vessels?',
          options: ['Cooking (boiling food)', 'Storing grain', 'Religious ceremonies', 'Carrying water during travel'],
          correctAnswer: 'Cooking (boiling food)',
        },
      ],
    },
    {
      level: 2,
      summary: `The development of pottery did not occur in isolation — it was deeply intertwined with some of the most significant transitions in human history, including the shift from nomadic hunter-gathering to settled agricultural life, the emergence of trade networks, and the birth of specialized craft production.

The invention of the potter's wheel, which occurred in Mesopotamia around 3,500 BCE (originally as a slow-turning turntable called a tournette, later evolved into a fast-spinning kick wheel), was a pivotal moment. Before the wheel, pottery was built entirely by hand using techniques such as coiling (building up walls from rolled ropes of clay), slab construction (joining flat pieces), and pinching. These methods were slow and limited the size and uniformity of vessels. The potter's wheel enabled rapid, symmetrical production — a single skilled potter could produce dozens of uniform vessels per day. This marked one of humanity's earliest steps toward mass production.

Pottery's most transformative impact on civilization was arguably its role in food storage and surplus management. In the ancient Near East, the development of large storage jars (pithoi) capable of holding hundreds of liters of grain, olive oil, or wine enabled communities to accumulate surplus food for the first time. This surplus had cascading consequences: it freed individuals from food production, enabling specialization (priests, soldiers, artisans, administrators); it created storable wealth that could be traded, taxed, or redistributed; and it provided insurance against crop failure, making permanent settlement viable.

Pottery also became one of the ancient world's most important trade goods and, crucially, trade containers. Distinctive ceramic styles serve as archaeological fingerprints — the presence of Mycenaean pottery in Egypt, Phoenician amphoras in Spain, or Chinese celadon in Southeast Asia maps ancient trade routes with remarkable precision. Amphoras (two-handled transport jars) became the standardized shipping containers of the ancient Mediterranean: their shapes were so consistent that merchants could estimate volume and contents by silhouette alone.

The social dimension of pottery should not be overlooked. Ceramic production became one of the earliest specialized crafts, with distinct traditions, workshops, and eventually guilds. Potter's marks — stamps or inscriptions identifying the maker — are among the earliest forms of branding and quality control. In many cultures, potters held respected social positions, and pottery workshops became centers of community life and economic activity.

Pottery also served critical roles beyond the utilitarian. Ceramic figurines, ritual vessels, burial urns, and decorative wares reflect the artistic, spiritual, and symbolic dimensions of human culture. The elaborate painted pottery of ancient Greece, the blue-and-white porcelain of Ming Dynasty China, and the intricate geometric patterns of Islamic ceramics represent some of humanity's greatest artistic achievements — all made possible by the fusion of clay and fire.`,
      questions: [
        {
          id: 'pottery-2-1',
          questionType: 'multiple-choice',
          questionText: 'Which civilization is credited with inventing the potter\'s wheel?',
          options: ['Mesopotamia', 'Egypt', 'China', 'Greece'],
          correctAnswer: 'Mesopotamia',
        },
        {
          id: 'pottery-2-2',
          questionType: 'multiple-choice',
          questionText: 'What primary advantage did pottery give early agricultural communities?',
          options: ['Long-term food storage enabling surplus accumulation', 'Better weapons for defense', 'Faster overland travel', 'A medium for written records'],
          correctAnswer: 'Long-term food storage enabling surplus accumulation',
        },
        {
          id: 'pottery-2-3',
          questionType: 'multiple-choice',
          questionText: 'What were amphoras used for in the ancient Mediterranean?',
          options: [
            'Standardized shipping containers for goods like wine and oil',
            'Musical instruments for religious ceremonies',
            'Defensive weapons thrown from city walls',
            'Decorative garden ornaments',
          ],
          correctAnswer: 'Standardized shipping containers for goods like wine and oil',
        },
        {
          id: 'pottery-2-4',
          questionType: 'multiple-choice',
          questionText: 'Why is distinctive pottery style important to archaeologists?',
          options: [
            'It maps ancient trade routes and cultural connections',
            'It indicates the wealth of the civilization',
            'It shows which cultures had the best artists',
            'It proves which civilizations were most advanced',
          ],
          correctAnswer: 'It maps ancient trade routes and cultural connections',
        },
      ],
    },
    {
      level: 3,
      summary: `The transformation of soft, wet clay into hard, durable ceramic is a feat of applied chemistry and thermal engineering that early potters mastered empirically — through millennia of trial and error — long before the underlying science was understood. The mechanics of pottery production involve a sophisticated chain of material preparation, forming, drying, and firing, each step requiring specific knowledge and skill.

Clay preparation is the essential first step. Raw clay dug from river banks or hillsides contains impurities (stones, organic matter, air pockets) that must be removed. Ancient potters developed techniques of levigation (washing clay in water and allowing fine particles to settle), wedging (kneading clay to remove air bubbles and align particles), and tempering (adding materials like sand, crusite shell, or ground pottery shards called "grog" to control shrinkage and prevent cracking during firing). The choice of temper affects the finished pottery's strength, porosity, thermal shock resistance, and even sound when struck.

The firing process is where the fundamental transformation occurs. At temperatures between 100–200°C, remaining water evaporates. Between 350–600°C, organic materials burn away and chemically bound water is driven off — this is the "ceramic change" point, the irreversible transformation after which clay can never be reconstituted by adding water. Between 800–1,000°C, sintering occurs: clay particles begin to fuse together, dramatically increasing strength. Above 1,100°C, vitrification begins — silica in the clay starts to melt and forms a glassy matrix that makes the ceramic waterproof and extremely hard.

The kiln was the critical technology that enabled potters to achieve and sustain these high temperatures with consistent results. The simplest kilns were pit kilns — clay pots stacked in a shallow pit, covered with fuel and earth, and fired for 8–12 hours. Temperatures were uneven and rarely exceeded 800°C. The development of updraft kilns (with a fire chamber below and a ware chamber above, allowing hot gases to rise through the pottery) around 6,000 BCE enabled temperatures of 900–1,100°C. The later innovation of downdraft kilns (where hot gases are drawn up over the ware and then down through flues) provided even more uniform heating and higher temperatures, eventually enabling the production of stoneware (1,200°C) and porcelain (1,300°C+).

Atmosphere control within the kiln was another crucial variable. An oxidizing atmosphere (with ample oxygen) produces pottery with warm red, orange, and brown colors from iron oxide in the clay. A reducing atmosphere (restricted oxygen, often achieved by adding green wood or damp leaves to create smoke) causes chemical changes that produce black, gray, or muted colors. Ancient potters exploited this to achieve striking visual effects — Greek black-figure and red-figure pottery, for instance, involved masterful manipulation of kiln atmosphere during a multi-stage firing process.

Glazing — the application of a thin layer of glass to the pottery surface — added another dimension of both beauty and function. Glazes are essentially powdered glass (silica mixed with fluxes like lead oxide, soda, or potash) that melt during firing and fuse to the clay surface, creating a smooth, waterproof, often colorful coating. The development of glazing techniques was a major milestone, requiring potters to master two different materials (clay body and glaze) with compatible thermal expansion properties to prevent crazing (cracking of the glaze) or peeling.`,
      questions: [
        {
          id: 'pottery-3-1',
          questionType: 'multiple-choice',
          questionText: 'What process transforms soft clay into hard pottery?',
          options: ['Firing at high temperatures', 'Sun drying over several weeks', 'Chemical treatment with acids', 'Freezing and thawing cycles'],
          correctAnswer: 'Firing at high temperatures',
        },
        {
          id: 'pottery-3-2',
          questionType: 'multiple-choice',
          questionText: 'What is a kiln?',
          options: ['An enclosed structure for firing ceramics at controlled temperatures', 'A type of fine-grained clay', 'A pottery decoration tool with a heated tip', 'A wheel for shaping pots on a turntable'],
          correctAnswer: 'An enclosed structure for firing ceramics at controlled temperatures',
        },
        {
          id: 'pottery-3-3',
          questionType: 'multiple-choice',
          questionText: 'What is "temper" in the context of pottery?',
          options: [
            'Material added to clay to control shrinkage and prevent cracking',
            'The temperature at which clay is fired',
            'A technique for polishing finished pottery',
            'The cooling phase after kiln firing',
          ],
          correctAnswer: 'Material added to clay to control shrinkage and prevent cracking',
        },
        {
          id: 'pottery-3-4',
          questionType: 'multiple-choice',
          questionText: 'What happens during vitrification?',
          options: [
            'Silica melts and forms a glassy matrix, making ceramic waterproof',
            'Clay absorbs water and becomes plastic again',
            'Organic matter burns away leaving pure clay',
            'The pottery cools and contracts to its final size',
          ],
          correctAnswer: 'Silica melts and forms a glassy matrix, making ceramic waterproof',
        },
        {
          id: 'pottery-3-5',
          questionType: 'free-text',
          questionText: 'Explain how fire mastery was essential for pottery development. Describe the role of temperature control and kiln technology in enabling different types of ceramics.',
          correctAnswer: '',
          keywords: ['heat', 'temperature', 'fire', 'kiln', 'harden', 'clay', 'chemical', 'transform', 'sinter', 'vitrif', 'oxidiz', 'reduc', 'atmosphere', 'glaze'],
          minKeywords: 3,
        },
      ],
    },
    {
      level: 4,
      summary: `Pottery's impact on human civilization extends far beyond its immediate practical utility as a container technology. A deep examination reveals pottery as a pivotal node in the network of innovations that built the modern world — influencing everything from the Neolithic Revolution to the development of writing, urban planning, and international trade systems.

The oldest known pottery, from the Xianrendong Cave in China (~20,000 BP) and the Jomon culture of Japan (~16,500 BP), was created by hunter-gatherer societies — a fact that overturned decades of archaeological orthodoxy. The prevailing "Neolithic package" theory held that pottery, agriculture, and sedentism were adopted together as an integrated complex. The discovery of pre-agricultural pottery demonstrated that ceramic technology was an independent innovation, likely driven by the specific advantages of boiling food (extracting more nutrition from available resources, detoxifying certain plants, and creating storable preserved foods like fermented fish paste).

In Mesopotamia, pottery and agriculture co-evolved in a feedback loop of mutual reinforcement. The Hassuna, Samarra, and Halaf cultures (7,000–5,000 BCE) developed increasingly sophisticated pottery traditions alongside intensive agriculture. Large storage vessels (pithoi) holding 200–400 liters enabled communities to store enough grain to survive multi-year droughts. This food security was a prerequisite for the population densities that produced the world's first cities (Uruk, Ur, Eridu) in southern Mesopotamia around 4,000–3,500 BCE.

Remarkably, pottery may have played a direct role in the invention of writing. The earliest known writing system — Sumerian cuneiform — evolved from a system of clay tokens used for accounting. Small clay objects of various shapes (spheres, cones, disks) represented specific quantities of goods (measures of grain, head of cattle, jars of oil). Around 3,500 BCE, these tokens began to be sealed inside hollow clay balls (bullae) as tamper-proof receipts. To indicate the contents without breaking the ball, scribes began pressing the tokens into the clay surface to leave impressions. This practice gradually evolved into abstract marks pressed into flat clay tablets — the birth of cuneiform writing. The material of writing was, quite literally, the potter's medium.

Chinese porcelain deserves special attention as a pinnacle of ceramic achievement. True porcelain — made from kaolin clay and petuntse (feldspar stone) fired at temperatures above 1,300°C — was first produced during the Han Dynasty (206 BCE–220 CE) and perfected during the Tang and Song dynasties. Chinese porcelain was so superior to anything produced elsewhere that it drove international trade for over a millennium. The word "china" itself became synonymous with fine ceramics. European attempts to replicate Chinese porcelain led to centuries of experimentation and espionage, finally succeeding at Meissen, Germany in 1708 — an achievement that required advances in mineralogy, chemistry, and kiln technology.

The Industrial Revolution transformed pottery from a craft into an industry. Josiah Wedgwood (1730–1795), the English potter and entrepreneur, pioneered factory production methods, quality control systems, and marketing techniques that made him one of the first industrialists. His innovations included the pyrometer (for measuring kiln temperatures), standardized production processes, and the division of labor in pottery workshops — principles that would later be applied across all manufacturing industries.`,
      questions: [
        {
          id: 'pottery-4-1',
          questionType: 'multiple-choice',
          questionText: 'Which region produced the oldest known pottery (Jomon ware)?',
          options: ['Japan', 'China', 'India', 'Mesopotamia'],
          correctAnswer: 'Japan',
        },
        {
          id: 'pottery-4-2',
          questionType: 'multiple-choice',
          questionText: 'How did pottery contribute to the invention of writing?',
          options: [
            'Clay accounting tokens evolved into cuneiform impressions on clay tablets',
            'Potters inscribed decorative text on vessels as art',
            'Wet clay was used as a surface for finger-drawn pictographs',
            'Writing was invented to label pottery for trade purposes',
          ],
          correctAnswer: 'Clay accounting tokens evolved into cuneiform impressions on clay tablets',
        },
        {
          id: 'pottery-4-3',
          questionType: 'multiple-choice',
          questionText: 'What temperature is required to produce true porcelain?',
          options: ['Above 1,300°C', 'Above 600°C', 'Above 200°C', 'Above 2,000°C'],
          correctAnswer: 'Above 1,300°C',
        },
        {
          id: 'pottery-4-4',
          questionType: 'multiple-choice',
          questionText: 'Who pioneered factory production methods for pottery during the Industrial Revolution?',
          options: ['Josiah Wedgwood', 'James Watt', 'Josiah Spode', 'Thomas Edison'],
          correctAnswer: 'Josiah Wedgwood',
        },
        {
          id: 'pottery-4-5',
          questionType: 'free-text',
          questionText: 'Describe how pottery influenced the transition from nomadic to settled life and the emergence of complex civilizations. Include specific examples of how storage technology enabled social and economic changes.',
          correctAnswer: '',
          keywords: ['storage', 'grain', 'settle', 'agriculture', 'food', 'preserve', 'trade', 'surplus', 'village', 'city', 'special', 'urban', 'pithoi', 'token', 'writing'],
          minKeywords: 4,
        },
      ],
    },
  ],
}

// ── COPPER SMELTING ───────────────────────────────

const copperSmeltingQuiz: NodeQuizData = {
  nodeId: 'copper-smelting',
  levels: [
    {
      level: 1,
      summary: `Copper smelting — the extraction of metallic copper from mineral ores using heat — marks one of the most significant technological thresholds in human history. It represents the moment when humans moved beyond simply using materials found in nature (stone, bone, wood, native metals) and began transforming raw earth into entirely new substances through controlled chemical reactions. This transition from the Stone Age to the Metal Age fundamentally altered the trajectory of human civilization.

Copper was among the first metals encountered by humans, primarily because it occasionally occurs in its native (pure metallic) form — as nuggets, sheets, or dendrites in certain geological formations. Native copper can be cold-hammered into simple shapes without any knowledge of metallurgy, and evidence of cold-worked native copper dates back to around 9,000 BCE in the Near East (at sites like Çayönü Tepesi in southeastern Turkey and Ali Kosh in Iran). However, native copper is rare and the resulting objects are small and limited in form.

True smelting — the chemical reduction of copper ore (such as malachite, azurite, or chalcopyrite) using heat and a reducing agent (typically charcoal) — first emerged around 5,000 BCE, with early evidence from sites in Serbia (Belovode), Iran (Tal-i Iblis), and the Sinai Peninsula. Smelting requires temperatures of approximately 1,085°C (copper's melting point) sustained in a reducing atmosphere, which was only achievable with charcoal fuel and some form of forced-air supply (early bellows or blowpipes).

The discovery of smelting may have been serendipitous. One plausible scenario: copper-bearing minerals like malachite (vivid green copper carbonate) were used as pigments and cosmetics. If malachite fragments fell into a charcoal fire in an enclosed space (perhaps a pottery kiln), the combination of high temperature and carbon monoxide from the charcoal would reduce the ore to metallic copper — a shiny, malleable blob that would have been unmistakably different from anything produced before. Whether accidental or deliberate, this discovery opened an entirely new chapter in human technology.

The period between approximately 5,000 and 3,300 BCE is called the Chalcolithic (from Greek "chalkos" for copper and "lithos" for stone) or Copper Age. During this transitional period, communities used both traditional stone tools and new copper implements. Copper was initially valued primarily for ornamental and prestige purposes (beads, pins, small blades) rather than for practical tools, because pure copper is relatively soft and cannot hold a sharp edge as well as flint or obsidian.`,
      questions: [
        {
          id: 'copper-1-1',
          questionType: 'multiple-choice',
          questionText: 'Approximately when did copper smelting begin?',
          options: ['Around 5,000 BCE', 'Around 10,000 BCE', 'Around 1,000 BCE', 'Around 500 CE'],
          correctAnswer: 'Around 5,000 BCE',
        },
        {
          id: 'copper-1-2',
          questionType: 'multiple-choice',
          questionText: 'What does "smelting" mean?',
          options: [
            'Extracting metal from ore using heat and a reducing agent',
            'Hammering metal into a desired shape',
            'Mixing two metals together to form an alloy',
            'Polishing metal surfaces to a mirror finish',
          ],
          correctAnswer: 'Extracting metal from ore using heat and a reducing agent',
        },
        {
          id: 'copper-1-3',
          questionType: 'multiple-choice',
          questionText: 'What is the Chalcolithic period?',
          options: [
            'The Copper Age — a transitional period using both stone and copper tools',
            'The Bronze Age — when bronze replaced all stone tools',
            'The Iron Age — when iron became the dominant metal',
            'The Neolithic — when agriculture was first developed',
          ],
          correctAnswer: 'The Copper Age — a transitional period using both stone and copper tools',
        },
        {
          id: 'copper-1-4',
          questionType: 'multiple-choice',
          questionText: 'How might copper smelting have been discovered accidentally?',
          options: [
            'Copper-bearing minerals used as pigments fell into hot charcoal fires',
            'Lightning struck copper ore deposits and melted them',
            'Copper nuggets were found in volcanic lava flows',
            'Ancient potters deliberately experimented with metal ores',
          ],
          correctAnswer: 'Copper-bearing minerals used as pigments fell into hot charcoal fires',
        },
      ],
    },
    {
      level: 2,
      summary: `The emergence of copper smelting did not occur in a technological vacuum — it was deeply embedded in a web of prior innovations, social structures, and environmental conditions that made the discovery possible and its adoption transformative. Understanding copper smelting in its full historical context reveals how interconnected technological progress truly is.

The most critical prerequisite for copper smelting was mastery of high-temperature fire. Open campfires typically reach only 600–800°C — well below copper's melting point of 1,085°C. The development of pottery kilns during the preceding millennia had already pushed fire technology to 900–1,100°C, and the knowledge of how to build enclosed structures, manage airflow, and sustain high temperatures for extended periods transferred directly to early smelting furnaces. In fact, the earliest known smelting sites often occur in regions with established pottery traditions, suggesting a direct technological lineage from kiln to furnace.

Charcoal production was equally essential. Raw wood cannot produce the sustained high temperatures needed for smelting. Charcoal — produced by slow pyrolysis of wood in oxygen-restricted conditions — burns at 1,100–1,500°C with forced air, making it the indispensable fuel for all early metallurgy. The knowledge of how to produce charcoal in quantity was a prerequisite technology that had to be mastered before smelting was feasible.

The social and economic impact of copper smelting was far-reaching. Copper ore deposits are geographically concentrated — not every community had access to the raw materials needed for metal production. This created powerful incentives for long-distance trade: communities with ore deposits (such as those in the Sinai Peninsula, Cyprus, the Balkans, and later Cornwall and the Erzgebirge mountains) became nodes in emerging trade networks that connected previously isolated populations. The word "copper" itself derives from the Latin "cuprum," meaning "from Cyprus" — the island that was one of the ancient world's most important copper sources.

The Chalcolithic period saw the emergence of craft specialization in metallurgy. Smelting and metalworking required specialized knowledge (identifying and processing ores, managing furnace temperatures, casting and shaping metal) that took years to acquire. Metalworkers became one of the earliest professional specialist classes, and their skills gave them significant social status and mobility. Itinerant metalworkers traveled between communities, spreading techniques and cultural practices — some of the earliest known "knowledge workers."

Copper also introduced new concepts of value and wealth. Unlike stone tools (which anyone could make from locally available material), copper objects represented concentrated labor, specialized skill, and access to rare resources. Copper axes, daggers, and ornaments became prestige goods — symbols of social status, power, and wealth. This transformation in how value was created and represented foreshadowed the development of money economies.

The limitations of pure copper, however, were significant. Copper is relatively soft — it cannot hold a sharp edge as well as high-quality flint, and it deforms under heavy use. This fundamental limitation drove the next great metallurgical innovation: the discovery that adding approximately 10% tin to molten copper produced bronze — an alloy dramatically harder, more durable, and more castable than either metal alone. The Bronze Age (beginning around 3,300 BCE) saw bronze tools and weapons replace both stone and copper implements across much of Eurasia, ushering in a new era of military, agricultural, and economic capability.`,
      questions: [
        {
          id: 'copper-2-1',
          questionType: 'multiple-choice',
          questionText: 'What was the most critical technological prerequisite for copper smelting?',
          options: [
            'Mastery of high-temperature fire and kiln technology',
            'Invention of the wheel for transporting ore',
            'Development of writing for recording recipes',
            'Domestication of animals for carrying fuel',
          ],
          correctAnswer: 'Mastery of high-temperature fire and kiln technology',
        },
        {
          id: 'copper-2-2',
          questionType: 'multiple-choice',
          questionText: 'What transitional age followed the Stone Age due to copper working?',
          options: ['The Chalcolithic (Copper Age)', 'The Iron Age', 'The Bronze Age', 'The Classical Age'],
          correctAnswer: 'The Chalcolithic (Copper Age)',
        },
        {
          id: 'copper-2-3',
          questionType: 'multiple-choice',
          questionText: 'Why did copper smelting drive the development of long-distance trade networks?',
          options: [
            'Copper ore deposits are geographically concentrated, forcing trade between regions',
            'Copper tools were too heavy to carry, requiring wheeled transport',
            'Copper production required ingredients from multiple continents',
            'Ancient laws required copper to be traded rather than gifted',
          ],
          correctAnswer: 'Copper ore deposits are geographically concentrated, forcing trade between regions',
        },
        {
          id: 'copper-2-4',
          questionType: 'multiple-choice',
          questionText: 'Where does the word "copper" derive from?',
          options: [
            'Latin "cuprum," meaning "from Cyprus"',
            'Greek "kopperos," meaning "red metal"',
            'Arabic "qutr," meaning "ore"',
            'Sanskrit "kupara," meaning "bright"',
          ],
          correctAnswer: 'Latin "cuprum," meaning "from Cyprus"',
        },
      ],
    },
    {
      level: 3,
      summary: `The process of extracting copper from ore is a remarkable feat of applied chemistry that ancient metallurgists mastered through empirical observation and experimentation, centuries before the underlying chemical principles were understood. Understanding these mechanics reveals the sophistication of early technological achievement.

Copper ores come in two broad categories: oxide ores and sulfide ores. The earliest and simplest to smelt were oxide and carbonate ores — particularly malachite (Cu₂CO₃(OH)₂, bright green) and azurite (Cu₃(CO₃)₂(OH)₂, deep blue). These minerals are visually distinctive, which likely contributed to their early identification. When heated with charcoal in a reducing atmosphere, the chemical reaction is relatively straightforward: the carbon monoxide produced by burning charcoal strips oxygen from the copper compound, leaving metallic copper behind.

The smelting of sulfide ores (such as chalcopyrite, CuFeS₂, the most abundant copper ore) is considerably more complex, requiring a multi-stage process. First, the ore must be roasted in an oxidizing atmosphere to drive off sulfur as sulfur dioxide gas. The resulting oxide is then smelted with charcoal in a reducing atmosphere to produce crude copper. This two-stage process (roasting followed by smelting) was a significant metallurgical advance that expanded the range of usable ore deposits enormously.

Copper's melting point of 1,085°C defined the minimum temperature requirement for smelting furnaces. Early furnaces were simple bowl-shaped pits lined with clay, with one or more tuyères (ceramic tubes) through which air was forced using bellows or blowpipes. The bellows — likely made from animal skins — were one of the most critical ancillary inventions, as they could increase furnace temperatures by 200–400°C above what natural draft alone could achieve.

Furnace design evolved significantly over the millennia. Shaft furnaces (tall, cylindrical structures with a charging hole at the top and tapping holes at the base) enabled larger batches and more efficient use of fuel. Slag (the waste product of smelting, composed of silicates and iron oxides) was tapped from the bottom while molten copper accumulated above it — a separation possible because of the density difference between slag and metal.

Casting technology developed in parallel with smelting. The simplest method was open-mold casting — pouring molten copper into a single-piece stone or clay mold to produce flat objects like axe blades. More complex shapes required two-piece molds (bivalve molds) that could be opened after cooling. The lost-wax (cire perdue) casting method, developed by the 4th millennium BCE, enabled the production of intricate three-dimensional objects: a wax model was coated in clay, the wax was melted out (lost), and molten metal was poured into the resulting cavity. This technique is still used today for precision casting.

Annealing — heating worked copper to 200–400°C and allowing it to cool slowly — was another critical technique. Cold-working (hammering) copper makes it harder but also more brittle. Annealing softens the metal by allowing its crystal structure to reorganize, enabling further working without cracking. The cycle of working and annealing allowed coppersmiths to produce thin sheets, complex shapes, and riveted assemblies that would be impossible with casting alone.`,
      questions: [
        {
          id: 'copper-3-1',
          questionType: 'multiple-choice',
          questionText: 'At what approximate temperature does copper melt?',
          options: ['1,085°C', '500°C', '2,500°C', '100°C'],
          correctAnswer: '1,085°C',
        },
        {
          id: 'copper-3-2',
          questionType: 'multiple-choice',
          questionText: 'What are the two most common copper carbonate ores that were first smelted?',
          options: ['Malachite and azurite', 'Chalcopyrite and pyrite', 'Hematite and magnetite', 'Galena and sphalerite'],
          correctAnswer: 'Malachite and azurite',
        },
        {
          id: 'copper-3-3',
          questionType: 'multiple-choice',
          questionText: 'What is the purpose of bellows in copper smelting?',
          options: [
            'To force air into the furnace, raising temperatures 200–400°C above natural draft',
            'To cool the molten copper after pouring',
            'To filter smoke and toxic fumes from the smelting process',
            'To shape the copper while it is still hot',
          ],
          correctAnswer: 'To force air into the furnace, raising temperatures 200–400°C above natural draft',
        },
        {
          id: 'copper-3-4',
          questionType: 'multiple-choice',
          questionText: 'What is the lost-wax (cire perdue) casting method?',
          options: [
            'A wax model is coated in clay, the wax melted out, then metal poured into the cavity',
            'Wax is mixed with molten copper to improve flow during casting',
            'Copper is heated until it becomes as soft as wax for shaping',
            'A technique for removing wax residue from finished copper objects',
          ],
          correctAnswer: 'A wax model is coated in clay, the wax melted out, then metal poured into the cavity',
        },
        {
          id: 'copper-3-5',
          questionType: 'free-text',
          questionText: 'Explain why pure copper had limitations that drove the development of bronze. What properties of copper made it inferior to both good stone tools and later bronze tools?',
          correctAnswer: '',
          keywords: ['soft', 'weak', 'alloy', 'tin', 'harder', 'bronze', 'strong', 'tool', 'weapon', 'edge', 'deform', 'flint', 'brittle', 'anneal'],
          minKeywords: 3,
        },
      ],
    },
    {
      level: 4,
      summary: `Copper smelting's significance extends far beyond the production of a useful metal. It was the technological gateway that opened the entire domain of metallurgy — the science and art of extracting, refining, alloying, and shaping metals — which has been one of the primary drivers of human civilization for the past seven millennia.

The most immediate and consequential innovation following copper smelting was the development of bronze. Around 3,300 BCE, metallurgists in the Near East (and independently in Southeast Asia and China) discovered that adding approximately 8–12% tin to molten copper produced an alloy — bronze — with dramatically superior properties. Bronze is significantly harder than pure copper, holds a sharper edge, and is more resistant to corrosion. Crucially, bronze has a lower melting point than copper (around 950°C versus 1,085°C), making it easier to cast, and it flows more readily into complex molds, enabling the production of intricate shapes.

The Bronze Age (roughly 3,300–1,200 BCE in the Near East) saw bronze transform virtually every aspect of human life. Agricultural productivity increased with bronze plows, sickles, and axes. Military capability was revolutionized by bronze swords, spearheads, shields, and armor. Construction was aided by bronze chisels, saws, and nails. Naval technology advanced with bronze fittings and fastenings. Bronze also enabled new artistic expressions: monumental bronze sculptures (like the Riace Warriors from ancient Greece), elaborate bronze vessels (Chinese ritual bronzes of the Shang and Zhou dynasties), and intricate jewelry and decorative objects.

However, bronze had a critical vulnerability: it required tin, which is one of the rarest metals in the Earth's crust. Major tin sources were limited to a handful of locations: Cornwall in Britain, the Erzgebirge (Ore Mountains) on the Czech-German border, Iberia, and parts of Central and Southeast Asia. The need to secure reliable tin supplies drove the creation of vast, complex trade networks spanning thousands of miles — connecting Mesopotamian, Egyptian, Mycenaean, Phoenician, and other civilizations in webs of economic interdependence. The collapse of these Bronze Age trade networks around 1,200 BCE (during the Late Bronze Age Collapse) contributed to one of the most dramatic civilizational crises in human history, involving the simultaneous decline of the Hittite Empire, Mycenaean Greece, the Egyptian New Kingdom, and numerous other Bronze Age states.

The transition to iron (beginning around 1,200 BCE in the Near East and Anatolia) represented the next major metallurgical revolution, one that was again rooted in fire mastery. Iron ore is abundant and widely distributed, but iron smelting requires temperatures above 1,538°C (iron's melting point) — or, more practically, the use of bloomery furnaces that produce a solid mass of impure iron (a "bloom") at temperatures around 1,200°C, below the melting point. This bloom must then be extensively hammered (wrought) to expel slag inclusions, producing wrought iron. The entire iron production process demanded more sophisticated furnace design, higher temperatures, and more fuel (charcoal) than bronze production — each advance building on the cumulative fire management knowledge of previous millennia.

The ultimate expression of ancient metallurgy was steel — iron with a controlled carbon content (typically 0.2–2.0%). Carbon from charcoal diffused into iron during smelting and forging, and ancient smiths learned to control this process empirically (through carburization and quenching techniques) to produce blades and tools of remarkable hardness and flexibility. Wootz steel from India (produced from around 300 BCE) and Damascus steel were legendary for their quality, and the techniques for producing them remained closely guarded trade secrets for centuries.

Every step in this metallurgical progression — from native copper to smelted copper to bronze to iron to steel — depended on increasingly sophisticated fire management. The history of metallurgy is, fundamentally, the history of learning to produce and control ever-higher temperatures for ever-longer durations with ever-greater precision. And it all began with the first person who noticed a shiny blob of metal in the ashes of a fire built too close to a chunk of green rock.`,
      questions: [
        {
          id: 'copper-4-1',
          questionType: 'multiple-choice',
          questionText: 'Which of these is NOT a historical use of copper or bronze in ancient civilizations?',
          options: ['Gunpowder production', 'Tools and weapons', 'Jewelry and ornaments', 'Architectural fittings and fastenings'],
          correctAnswer: 'Gunpowder production',
        },
        {
          id: 'copper-4-2',
          questionType: 'multiple-choice',
          questionText: 'What critical vulnerability did the Bronze Age have?',
          options: [
            'Tin, required for bronze, is rare and concentrated in few locations',
            'Bronze was too heavy for practical tools',
            'Bronze melted in hot climates',
            'Only royal families were allowed to produce bronze',
          ],
          correctAnswer: 'Tin, required for bronze, is rare and concentrated in few locations',
        },
        {
          id: 'copper-4-3',
          questionType: 'multiple-choice',
          questionText: 'What is steel, and how does it relate to iron smelting?',
          options: [
            'Iron with controlled carbon content, achieved through carburization during forging',
            'A completely different metal unrelated to iron',
            'Pure iron that has been polished to a mirror finish',
            'An alloy of iron and copper produced in bronze-age furnaces',
          ],
          correctAnswer: 'Iron with controlled carbon content, achieved through carburization during forging',
        },
        {
          id: 'copper-4-4',
          questionType: 'multiple-choice',
          questionText: 'What contributed to the Late Bronze Age Collapse around 1,200 BCE?',
          options: [
            'Disruption of long-distance tin trade networks that Bronze Age civilizations depended on',
            'Discovery of iron made bronze immediately worthless',
            'A single volcanic eruption destroyed all bronze production centers',
            'Bronze tools were banned by a universal treaty among ancient nations',
          ],
          correctAnswer: 'Disruption of long-distance tin trade networks that Bronze Age civilizations depended on',
        },
        {
          id: 'copper-4-5',
          questionType: 'free-text',
          questionText: 'Describe the connection between fire mastery, copper smelting, and the rise of trade networks. Explain how the geographic concentration of copper and tin ores shaped ancient economic and political relationships.',
          correctAnswer: '',
          keywords: ['fire', 'heat', 'ore', 'smelt', 'trade', 'resource', 'value', 'specialize', 'surplus', 'exchange', 'tin', 'bronze', 'network', 'cyprus', 'cornwall'],
          minKeywords: 4,
        },
      ],
    },
  ],
}

// ── GLASS ─────────────────────────────────────────

const glassQuiz: NodeQuizData = {
  nodeId: 'glass',
  levels: [
    {
      level: 1,
      summary: `Glass is one of humanity's most remarkable and versatile materials — a substance that is simultaneously ancient and modern, practical and beautiful, simple in concept yet extraordinarily difficult to master. Unlike pottery or metallurgy, which involve transforming one type of solid into another, glass-making involves creating an entirely new state of matter: an amorphous solid (a material with the rigidity of a solid but the disordered molecular structure of a liquid), sometimes poetically described as a "frozen liquid."

The primary ingredient in most glass is silica (silicon dioxide, SiO₂), which makes up the bulk of ordinary sand. In its crystalline form, silica is quartz — one of the hardest common minerals. To transform silica into glass, it must be heated to approximately 1,700°C (over 3,000°F), at which point it melts into a viscous liquid. When this liquid cools without crystallizing (which requires relatively rapid cooling), it solidifies into glass — a transparent, hard, chemically inert material with properties unlike any other substance in nature.

The earliest glass objects were not vessels but beads and small decorative items, produced in Mesopotamia and Egypt around 3,500 BCE. The first glass was likely discovered accidentally — perhaps when sand came into contact with a very hot furnace used for pottery or metallurgy. Ancient Roman historian Pliny the Elder recorded a legend (likely apocryphal) that Phoenician merchants discovered glass when they rested cooking pots on blocks of natron (a natural soda mineral) on a sandy beach, and the heat fused the materials into glass. While the story is almost certainly mythical, it captures the essential chemistry: sand (silica) + alkali flux (soda or potash) + heat = glass.

Early glass production centered in two regions: Mesopotamia (modern Iraq and Syria) and Egypt. The earliest known glass workshop was discovered at Tell al-Rimah in Iraq, dating to approximately 1,550 BCE. Egyptian glass production flourished under the New Kingdom pharaohs (1,550–1,070 BCE), with workshops at Amarna, Malkata, and Qantir producing brilliantly colored glass vessels, beads, and inlays. These early glasses were colored by metallic oxide additions — cobalt for deep blue, copper for turquoise, manganese for purple, and iron for green or amber.

Glass in the ancient world was a luxury material — labor-intensive to produce, requiring specialized knowledge and equipment, and valued alongside precious stones and metals. Glass beads were used as currency in long-distance trade, and glass vessels were prized possessions of royalty and the wealthy elite. The transformation of humble sand into a brilliant, translucent material must have seemed genuinely magical to ancient peoples.`,
      questions: [
        {
          id: 'glass-1-1',
          questionType: 'multiple-choice',
          questionText: 'What is the primary ingredient in glass-making?',
          options: ['Sand (silica)', 'Clay', 'Copper ore', 'Limestone'],
          correctAnswer: 'Sand (silica)',
        },
        {
          id: 'glass-1-2',
          questionType: 'multiple-choice',
          questionText: 'Where was glass-making first developed?',
          options: ['Mesopotamia and Egypt', 'China', 'Rome', 'India'],
          correctAnswer: 'Mesopotamia and Egypt',
        },
        {
          id: 'glass-1-3',
          questionType: 'multiple-choice',
          questionText: 'What type of material is glass at the molecular level?',
          options: [
            'An amorphous solid with the disordered structure of a liquid',
            'A crystalline solid with a perfectly ordered lattice',
            'A supercooled gas trapped in solid form',
            'A metal alloy with transparent properties',
          ],
          correctAnswer: 'An amorphous solid with the disordered structure of a liquid',
        },
        {
          id: 'glass-1-4',
          questionType: 'multiple-choice',
          questionText: 'What were the earliest glass objects?',
          options: [
            'Beads and small decorative items',
            'Window panes for temples',
            'Drinking vessels for royalty',
            'Lenses for magnification',
          ],
          correctAnswer: 'Beads and small decorative items',
        },
      ],
    },
    {
      level: 2,
      summary: `The history of glass-making is a story of cumulative innovation spanning nearly four millennia, with each major advance in technique opening new applications and new possibilities. Understanding glass in its historical context reveals how a luxury curiosity evolved into one of the most transformative materials in human history.

The earliest glass vessels (as opposed to beads and small objects) were produced using the core-forming technique, which dominated glass production from approximately 1,500 BCE to the 1st century BCE. A core of clay and dung was shaped on a metal rod, then dipped into molten glass or wound with trails of hot glass. After cooling, the core was scraped out, leaving a hollow vessel. Core-formed vessels were small (rarely more than 15 cm tall), labor-intensive, and expensive — luxury items for the elite.

The single most revolutionary advance in glass history was the invention of glassblowing, which occurred in the Syro-Palestinian region (likely in the area around Sidon) in the mid-1st century BCE. Glassblowing exploited a unique property of molten glass: its remarkable plasticity at working temperature, which allows it to be inflated like a balloon using a hollow iron pipe (blowpipe). This technique was dramatically faster and more versatile than core-forming — a skilled glassblower could produce a vessel in minutes rather than hours, and could create forms that were impossible with any previous technique.

The Roman Empire embraced glassblowing with characteristic enthusiasm and organizational capability. Roman glass factories mass-produced vessels of unprecedented variety and affordability: cups, bowls, plates, bottles, jugs, storage jars, unguentaria (perfume bottles), and architectural elements. For the first time in history, glass became a material accessible to ordinary people rather than exclusively the wealthy. Roman glass was traded across the entire Mediterranean, into northern Europe, along the Silk Road, and as far as China and India.

The development of colorless glass by Roman craftsmen (achieved by adding manganese dioxide to counteract the green tint caused by iron impurities) was another milestone, prized for its resemblance to the far more expensive rock crystal. Meanwhile, specialized techniques like cameo glass (layering different-colored glasses and carving through them, exemplified by the famous Portland Vase), mosaic glass (fusing multicolored glass canes), and gold-sandwich glass (trapping gold leaf between glass layers) demonstrated extraordinary artistic sophistication.

Following the fall of the Western Roman Empire, glass-making traditions were preserved and advanced in the Islamic world and the Byzantine Empire. Islamic glassmakers perfected techniques of enamel decoration, gilding, and the production of high-quality colorless glass. The Mosque lamps of the Mamluk period (13th–14th centuries) — large, bell-shaped glass vessels decorated with enamel calligraphy and intricate patterns — represent one of the highest achievements of Islamic decorative arts.

In medieval Europe, the most significant glass tradition was stained glass — colored glass pieces assembled with lead strips (cames) to create large pictorial windows for churches and cathedrals. The great Gothic cathedrals of the 12th–14th centuries (Chartres, Notre-Dame de Paris, Sainte-Chapelle, Canterbury) featured increasingly ambitious stained glass programs that flooded sacred spaces with colored light. These windows served as visual scripture for largely illiterate populations and represented enormous investments of artistic skill, material resources, and theological planning.

The Venetian glass industry, centered on the island of Murano (where glassmakers were relocated in 1291, ostensibly to prevent fire risk but also to protect trade secrets), became the dominant European glass-making center from the 13th through the 17th centuries. Venetian innovations included cristallo (exceptionally clear soda-lime glass), lattimo (opaque white glass imitating porcelain), and filigrana (glass with embedded white or colored glass threads). Murano glass was among the most valued luxury goods in Renaissance Europe.`,
      questions: [
        {
          id: 'glass-2-1',
          questionType: 'multiple-choice',
          questionText: 'What was glass primarily used for in its earliest period?',
          options: ['Beads, decorative items, and small core-formed vessels', 'Window panes for buildings', 'Scientific lenses and instruments', 'Mirrors and reflective surfaces'],
          correctAnswer: 'Beads, decorative items, and small core-formed vessels',
        },
        {
          id: 'glass-2-2',
          questionType: 'multiple-choice',
          questionText: 'Which technique revolutionized glass production in the 1st century BCE?',
          options: ['Glassblowing', 'Core-forming', 'Pressing', 'Rolling on flat surfaces'],
          correctAnswer: 'Glassblowing',
        },
        {
          id: 'glass-2-3',
          questionType: 'multiple-choice',
          questionText: 'Why was the Roman adoption of glassblowing so significant?',
          options: [
            'It made glass affordable for ordinary people for the first time',
            'It was only used for military applications',
            'It eliminated the need for fire in glass production',
            'It made glass stronger than metal',
          ],
          correctAnswer: 'It made glass affordable for ordinary people for the first time',
        },
        {
          id: 'glass-2-4',
          questionType: 'multiple-choice',
          questionText: 'Why were Venetian glassmakers relocated to the island of Murano in 1291?',
          options: [
            'To prevent fire risk and protect trade secrets',
            'Because Murano had better sand deposits',
            'To be closer to shipping routes',
            'Because the Venetian government banned glass-making on the mainland',
          ],
          correctAnswer: 'To prevent fire risk and protect trade secrets',
        },
      ],
    },
    {
      level: 3,
      summary: `The chemistry and physics of glass-making are both elegant and demanding. Understanding the mechanics of glass production reveals why it required such advanced fire technology and why each improvement in furnace design opened new possibilities.

The fundamental glass-making reaction involves melting silica (SiO₂) — the same compound that makes up quartz and ordinary sand. Pure silica has an extremely high melting point of approximately 1,713°C, which made it essentially impossible to work with using ancient fuel technology alone. The breakthrough that made practical glass-making possible was the use of flux materials — substances that lower the melting point of silica to a more manageable range.

The two most common historical fluxes are soda (sodium oxide, Na₂O, typically derived from natron or plant ashes) and potash (potassium oxide, K₂O, derived from wood or fern ashes). Adding approximately 15–25% soda to a silica batch reduces the melting point to roughly 1,000–1,100°C — within reach of well-built charcoal furnaces with forced-air supply. However, soda-silica glass is water-soluble and chemically unstable. The addition of a stabilizer — typically lime (calcium oxide, CaO, from limestone or crusite shells) at about 10% — produces soda-lime glass, the most common type of glass throughout history and still the basis for most window glass and bottles today.

The three-component system of silica + flux + stabilizer defines the basic chemistry, but the practical art of glass-making involves mastering an enormous range of variables. Batch preparation (measuring and mixing raw materials), melting (sustaining temperatures of 1,100–1,500°C for hours or days to produce a homogeneous melt), working (shaping the hot glass at 700–1,000°C during its brief plastic phase), and annealing (slowly cooling the finished object over hours or days to relieve internal stresses that would otherwise cause spontaneous fracture) each require specific temperature control and timing.

Glass furnaces evolved through several distinct designs. The earliest were simple pot furnaces — clay crucibles (pots) containing the glass batch, heated in a single-chamber furnace. Roman-era furnaces introduced the tank furnace concept, where glass was melted in a large built-in tank (rather than removable pots), enabling continuous production. Medieval and Renaissance furnaces typically had three tiers: a lower firebox (where wood or charcoal was burned), a middle melting chamber (containing the glass pots), and an upper annealing chamber (where finished objects cooled slowly). This stacked design made efficient use of heat rising from the fire.

Coloring glass involves adding specific metallic oxide compounds to the batch. These oxides absorb certain wavelengths of light and transmit others, producing vivid colors. The palette available to ancient and medieval glassmakers was remarkably broad: cobalt oxide produces deep blue (even tiny amounts, 0.1%, create intense color), copper oxide produces turquoise (in oxidizing conditions) or ruby red (in reducing conditions), iron oxide produces green (ferrous iron) or amber/brown (ferric iron), manganese oxide produces purple, tin oxide produces opaque white, and gold chloride produces a delicate rose-pink (Gold Ruby glass, discovered in the 17th century). Understanding and controlling these color chemistry reactions required empirical knowledge accumulated over centuries.

The development of clear, colorless glass was a particular challenge. Natural sand contains iron impurities that give glass a greenish tint. Roman glassmakers discovered that adding manganese dioxide (a decolorizer) could neutralize this green color, producing glass that approached the clarity of natural rock crystal. The pursuit of ever-clearer glass drove advances in raw material selection, purification, and furnace atmosphere control. Venetian cristallo, developed in the 15th century, represented the pinnacle of pre-industrial clear glass technology.`,
      questions: [
        {
          id: 'glass-3-1',
          questionType: 'multiple-choice',
          questionText: 'At what approximate temperature does pure silica melt?',
          options: ['Around 1,713°C', 'Around 500°C', 'Around 100°C', 'Around 3,000°C'],
          correctAnswer: 'Around 1,713°C',
        },
        {
          id: 'glass-3-2',
          questionType: 'multiple-choice',
          questionText: 'What is the purpose of a "flux" in glass-making?',
          options: [
            'To lower the melting point of silica to a workable range',
            'To increase the strength of the finished glass',
            'To add color to the glass',
            'To speed up the cooling process',
          ],
          correctAnswer: 'To lower the melting point of silica to a workable range',
        },
        {
          id: 'glass-3-3',
          questionType: 'multiple-choice',
          questionText: 'What is the most common type of glass throughout history?',
          options: [
            'Soda-lime glass (silica + soda flux + lime stabilizer)',
            'Pure silica glass',
            'Lead crystal glass',
            'Borosilicate glass',
          ],
          correctAnswer: 'Soda-lime glass (silica + soda flux + lime stabilizer)',
        },
        {
          id: 'glass-3-4',
          questionType: 'multiple-choice',
          questionText: 'What is "annealing" in glass production?',
          options: [
            'Slowly cooling finished glass to relieve internal stresses',
            'Rapidly heating glass to make it flexible',
            'Adding color to molten glass',
            'Blowing air through molten glass to form bubbles',
          ],
          correctAnswer: 'Slowly cooling finished glass to relieve internal stresses',
        },
        {
          id: 'glass-3-5',
          questionType: 'free-text',
          questionText: 'Explain why glass-making required mastery of fire. Describe the specific temperature challenges and how furnace technology evolved to meet them.',
          correctAnswer: '',
          keywords: ['temperature', 'heat', 'melt', 'sand', 'silica', 'furnace', 'fire', 'high', 'sustain', 'flux', 'soda', 'charcoal', 'bellows', 'kiln', 'anneal'],
          minKeywords: 4,
        },
      ],
    },
    {
      level: 4,
      summary: `The full historical arc of glass-making reveals it as one of the most consequential technologies in human history — a material whose applications expanded from decorative luxury to the very foundation of modern science, medicine, communications, and architecture.

Glass's contribution to the Scientific Revolution of the 16th–17th centuries cannot be overstated. The development of optical glass — glass with controlled refractive properties and minimal distortion — enabled the creation of lenses that literally expanded the horizons of human knowledge. Spectacles (invented in northern Italy around 1286) corrected vision deficiencies, extending the productive working lives of scholars, scribes, and craftsmen. More dramatically, lenses enabled the telescope (developed in the Netherlands around 1608, famously improved by Galileo Galilei in 1609) and the microscope (compound microscope developed by Zacharias Janssen around 1590, refined by Anton van Leeuwenhoek in the 1670s).

The telescope transformed astronomy from a discipline limited to naked-eye observations (which had not fundamentally changed since Babylonian times) into an empirical science capable of testing theoretical predictions. Galileo's observations of Jupiter's moons, Venus's phases, and the Milky Way's stellar composition provided decisive evidence for the Copernican heliocentric model and demolished the Aristotelian cosmology that had dominated Western thought for two millennia. The microscope opened an equally revolutionary domain: the world of the very small. Leeuwenhoek's observations of bacteria, protozoa, blood cells, and sperm cells revealed an entire universe of life invisible to the naked eye, laying the groundwork for microbiology, cell biology, and modern medicine.

Glass laboratory equipment — beakers, flasks, retorts, distillation apparatus, thermometers, barometers — was essential for the development of chemistry as an experimental science. Robert Boyle's gas law experiments (1660s), Antoine Lavoisier's combustion studies (1770s–1780s), and countless other foundational chemistry experiments relied on glass apparatus that could withstand heat, resist chemical corrosion, and allow visual observation of reactions. Without glass, the transition from alchemy to chemistry would have been severely delayed if not impossible.

The 19th century brought glass into new technological domains. Optical fibers (first demonstrated by Daniel Colladon in 1841) showed that light could be guided through curved glass or water streams — a principle that would eventually culminate in fiber-optic communications in the 20th century. Glass bulbs were essential for Thomas Edison's incandescent light bulb (1879) and for vacuum tubes (thermionic valves) that enabled radio, television, radar, and early computers.

The 20th and 21st centuries have seen glass's role expand into domains that would astonish its ancient inventors. Fiber-optic cables now carry over 95% of the world's intercontinental data traffic — every internet search, video call, and financial transaction depends on light pulses traveling through hair-thin glass fibers. The glass screens on smartphones, tablets, and computers (using ultra-tough chemically strengthened glasses like Corning's Gorilla Glass) are the primary interface through which billions of people interact with digital technology. Optical fibers are also essential for medical endoscopy, laser surgery, and sensing applications.

Architectural glass transformed the built environment. The Crystal Palace (London, 1851), constructed almost entirely of glass and iron, demonstrated that glass could define an entire building rather than merely fill openings in walls. Modern curtain-wall architecture — glass towers reflecting and transmitting light — has become the defining aesthetic of contemporary cities worldwide. Energy-efficient glazing (low-emissivity coatings, insulated glass units, smart glass that changes transparency) addresses the energy challenges of glass-heavy buildings.

In science, glass continues to enable discoveries at the frontier of knowledge. The mirrors of the world's largest telescopes (like the James Webb Space Telescope's beryllium mirrors with gold coating, or ground-based telescopes with 8–10 meter glass mirrors) probe the origins of the universe. Glass lenses and prisms in particle physics experiments help detect fundamental forces and particles. Medical imaging technologies (MRI, CT scanners, X-ray systems) rely on glass components. Even semiconductor manufacturing — the foundation of the digital age — uses specialized glass (photomasks) to pattern the nanoscale circuits on silicon chips.

From a bead of colored glass strung on a leather cord 3,500 years ago to the fiber-optic cables carrying this text to your screen — glass has been an unbroken thread connecting human curiosity about fire to the most sophisticated technologies of the modern world.`,
      questions: [
        {
          id: 'glass-4-1',
          questionType: 'multiple-choice',
          questionText: 'How did glass contribute to the Scientific Revolution?',
          options: [
            'Glass lenses enabled telescopes and microscopes for scientific observation',
            'Glass beakers allowed safe chemical storage',
            'Stained glass windows inspired abstract mathematical thinking',
            'Glass mirrors were used for secret communication between scientists',
          ],
          correctAnswer: 'Glass lenses enabled telescopes and microscopes for scientific observation',
        },
        {
          id: 'glass-4-2',
          questionType: 'multiple-choice',
          questionText: 'Who used the telescope to provide evidence for the Copernican heliocentric model?',
          options: ['Galileo Galilei', 'Isaac Newton', 'Nicolaus Copernicus', 'Johannes Kepler'],
          correctAnswer: 'Galileo Galilei',
        },
        {
          id: 'glass-4-3',
          questionType: 'multiple-choice',
          questionText: 'What carries over 95% of the world\'s intercontinental data traffic today?',
          options: ['Fiber-optic glass cables', 'Copper telephone wires', 'Satellite radio waves', 'Undersea steel cables'],
          correctAnswer: 'Fiber-optic glass cables',
        },
        {
          id: 'glass-4-4',
          questionType: 'multiple-choice',
          questionText: 'When were spectacles first invented?',
          options: ['Around 1286 in northern Italy', 'Around 500 BCE in Greece', 'Around 1600 in England', 'Around 1900 in Germany'],
          correctAnswer: 'Around 1286 in northern Italy',
        },
        {
          id: 'glass-4-5',
          questionType: 'free-text',
          questionText: 'Trace the chain from fire mastery to glass-making to modern science and technology. Explain at least three specific ways glass-based technologies have advanced human knowledge or capability.',
          correctAnswer: '',
          keywords: ['fire', 'heat', 'sand', 'glass', 'lens', 'telescope', 'microscope', 'science', 'optic', 'discover', 'fiber', 'spectacle', 'chemistry', 'beaker', 'digital'],
          minKeywords: 4,
        },
      ],
    },
  ],
}

export const QUIZ_DATA: Record<string, NodeQuizData> = {
  fire: fireQuiz,
  pottery: potteryQuiz,
  'copper-smelting': copperSmeltingQuiz,
  glass: glassQuiz,
}

export function getQuizForNode(nodeId: string): NodeQuizData | null {
  return QUIZ_DATA[nodeId] ?? null
}

export function getLevelQuestions(nodeId: string, level: number): QuizQuestion[] | null {
  const quiz = QUIZ_DATA[nodeId]
  if (!quiz) return null
  const levelData = quiz.levels.find(l => l.level === level)
  return levelData?.questions ?? null
}

export function getLevelSummary(nodeId: string, level: number): string | null {
  const quiz = QUIZ_DATA[nodeId]
  if (!quiz) return null
  const levelData = quiz.levels.find(l => l.level === level)
  return levelData?.summary ?? null
}
