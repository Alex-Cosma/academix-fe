// Minimalist SVG icons for each tech-tree node.
// Each icon is a 24×24 SVG, white strokes on transparent bg, encoded as a data URI.
// Zero network requests — instant rendering.

function svg(body: string): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  )}`
}

// ─── Per-node icons ────────────────────────────────────────────────────────────

export const NODE_ICONS: Record<string, string> = {
  // FUNDAMENTAL
  'fire': svg('<path d="M12 2c1 4-2 6-2 10a4 4 0 0 0 8 0c0-4-3-6-2-10"/><path d="M12 22a4 4 0 0 1-4-4c0-2 1-3 2-5"/>'),
  'stone-tools': svg('<path d="M15 12L9 18"/><path d="M9 6l6 6"/><rect x="3" y="18" width="4" height="4" rx="1"/><path d="M14 3l4 4-2 2-4-4z"/>'),
  'language': svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  'clothing': svg('<path d="M6 2l3 5h6l3-5"/><path d="M6 2L2 6l4 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8l4-2-4-4"/>'),
  'bow-and-arrow': svg('<path d="M4 20L20 4"/><path d="M20 4h-5v5"/><path d="M4 20c-1-5 1-10 5-14"/>'),
  'democracy': svg('<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>'),
  'aqueducts': svg('<path d="M2 18h20"/><path d="M4 18V8a4 4 0 0 1 8 0"/><path d="M12 18V8a4 4 0 0 1 8 0"/>'),
  'mechanical-clock': svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  'firearms': svg('<path d="M4 14h10l4-4h4"/><path d="M4 14l2 4h3l1-4"/><path d="M18 10v4"/>'),
  'gears': svg('<circle cx="9" cy="9" r="5"/><circle cx="17" cy="15" r="4"/><path d="M9 4v-2"/><path d="M9 16v2"/><path d="M4 9H2"/><path d="M14.5 6.5l1.4-1.4"/><path d="M17 11v-1"/><path d="M17 21v-2"/><path d="M22 15h-1"/><path d="M13 15h-1"/>'),

  // AGRICULTURE
  'agriculture': svg('<path d="M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12z"/>'),
  'irrigation': svg('<path d="M4 4v16h16"/><path d="M4 14c3-3 6 0 8-3s5 0 8-3"/>'),
  'plow': svg('<path d="M4 20l8-8"/><path d="M12 12l8 2"/><path d="M4 20h4v-4"/>'),
  'domestication-dog': svg('<circle cx="11" cy="10" r="4"/><path d="M7 7L4 3"/><path d="M15 7l3-4"/><path d="M8 14l-2 6"/><path d="M14 14l2 6"/>'),
  'green-revolution': svg('<path d="M12 22V12"/><path d="M12 12C12 7 7 4 7 4"/><path d="M12 12c0-5 5-8 5-8"/><path d="M7 22h10"/>'),

  // MATERIALS
  'pottery': svg('<path d="M8 2h8"/><path d="M9 2c-1 3-2 5-2 8 0 5 2 8 5 12h0c3-4 5-7 5-12 0-3-1-5-2-8"/>'),
  'copper-smelting': svg('<path d="M12 2v4"/><path d="M8 8h8l-1 10H9z"/><path d="M6 22h12"/><path d="M10 8V6"/><path d="M14 8V6"/>'),
  'bronze-smelting': svg('<path d="M8 6h8l2 12H6z"/><path d="M6 22h12"/><path d="M9 2l3 4 3-4"/>'),
  'iron-smelting': svg('<path d="M12 2l-4 8h8z"/><path d="M8 14h8"/><path d="M10 14v8"/><path d="M14 14v8"/>'),
  'glass': svg('<ellipse cx="12" cy="8" rx="6" ry="4"/><path d="M6 8v8a6 4 0 0 0 12 0V8"/><path d="M9 20h6"/>'),
  'arch': svg('<path d="M2 22h20"/><path d="M4 22V12a8 8 0 0 1 16 0v10"/>'),
  'concrete': svg('<rect x="3" y="8" width="18" height="12" rx="1"/><path d="M7 8V4"/><path d="M17 8V4"/><path d="M12 8V6"/>'),
  'gunpowder': svg('<circle cx="12" cy="14" r="6"/><path d="M12 8V3"/><path d="M10 3h4"/><path d="M8 10l-2-2"/><path d="M16 10l2-2"/>'),
  'blast-furnace': svg('<path d="M8 22V6l4-4 4 4v16"/><path d="M8 14h8"/><path d="M4 22h16"/>'),
  'dynamite': svg('<rect x="8" y="6" width="3" height="14" rx="1"/><rect x="13" y="6" width="3" height="14" rx="1"/><path d="M9 6V3"/><path d="M14 6V3"/><path d="M12 2l-1 1h2z"/>'),
  'spinning-jenny': svg('<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4"/><path d="M7 9V5"/><path d="M17 9V5"/>'),
  'plastics': svg('<path d="M4 6h16"/><path d="M6 6l2 14h8l2-14"/><path d="M9 11h6"/>'),
  '3d-printing': svg('<rect x="4" y="2" width="16" height="6" rx="1"/><path d="M12 8v6"/><path d="M8 18h8"/><rect x="6" y="18" width="12" height="4" rx="1"/>'),
  'steel': svg('<path d="M4 4l16 16"/><path d="M20 4L4 20"/><circle cx="12" cy="12" r="3"/>'),

  // ENERGY
  'waterwheel': svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 4v-2"/><path d="M12 22v-2"/><path d="M4 12H2"/><path d="M22 12h-2"/><path d="M6.3 6.3L5 5"/><path d="M19 19l-1.3-1.3"/>'),
  'windmill': svg('<path d="M12 12V2l-5 10z"/><path d="M12 12h10l-10 5z"/><path d="M12 12v10l5-10z"/><path d="M12 12H2l10-5z"/>'),
  'steam-engine-precursor': svg('<rect x="4" y="10" width="10" height="10" rx="1"/><circle cx="18" cy="8" r="4"/><path d="M14 15h4"/><path d="M7 6v4"/><path d="M5 4l2 2 2-2"/>'),
  'steam-engine': svg('<rect x="2" y="12" width="12" height="8" rx="1"/><circle cx="19" cy="9" r="4"/><path d="M14 16h5"/><path d="M8 12V8"/><path d="M6 6l2 2 2-2"/>'),
  'battery': svg('<rect x="7" y="4" width="10" height="16" rx="2"/><path d="M10 1v3"/><path d="M14 1v3"/><path d="M10 10h4"/><path d="M12 8v4"/>'),
  'light-bulb': svg('<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z"/>'),
  'power-grid': svg('<path d="M4 6h16"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M12 6v16"/><path d="M8 14l4-4 4 4"/>'),
  'electric-motor': svg('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M19 12h3"/><path d="M2 12h3"/><path d="M12 5V2"/>'),
  'nuclear-fission': svg('<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>'),
  'nuclear-power': svg('<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><path d="M12 2v3"/><path d="M12 19v3"/>'),
  'solar-cell': svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>'),
  'lightning-rod': svg('<path d="M13 2L7 14h5l-1 8 6-12h-5z"/>'),
  'internal-combustion': svg('<rect x="5" y="8" width="14" height="10" rx="1"/><path d="M8 8V4"/><path d="M12 8V4"/><path d="M16 8V4"/><circle cx="12" cy="22" r="2"/><path d="M12 18v2"/>'),

  // TRANSPORT
  'wheel': svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/>'),
  'sailing': svg('<path d="M2 20l10-16v16z"/><path d="M12 4l8 16H12"/>'),
  'domestication-horse': svg('<path d="M4 16l3-8 4 2 5-6 4 2"/><path d="M20 6l1 3"/><path d="M4 16v5"/><path d="M10 10v11"/><path d="M16 4v17"/>'),
  'compass': svg('<circle cx="12" cy="12" r="10"/><polygon points="12 2 15 12 12 22 9 12"/>'),
  'silk-road': svg('<path d="M2 12c4-4 6 4 10 0s6-4 10 0"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/>'),
  'magnetic-navigation': svg('<circle cx="12" cy="12" r="10"/><polygon points="12 5 14 12 12 19 10 12"/><path d="M12 2v2"/><path d="M12 20v2"/>'),
  'railways': svg('<path d="M4 15h16"/><path d="M4 19h16"/><circle cx="8" cy="19" r="2"/><circle cx="16" cy="19" r="2"/><path d="M6 15l2-8h8l2 8"/>'),
  'automobile': svg('<path d="M5 17h14"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17l1-5 3-3h6l3 3 1 5"/>'),
  'jet-engine': svg('<ellipse cx="12" cy="12" rx="10" ry="5"/><ellipse cx="6" cy="12" rx="3" ry="5"/><path d="M16 12h6"/>'),
  'gps': svg('<circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/>'),
  'electric-vehicle': svg('<path d="M5 17h14"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17l1-5 3-3h6l3 3 1 5"/><path d="M10 6l1 3h2l1-3"/><path d="M11 3v3"/>'),
  'airplane': svg('<path d="M2 14l9-12 2 5 9-2-5 6 5 6-9-2-2 5z"/>'),

  // COMMUNICATION
  'writing': svg('<path d="M17 3l4 4-12 12H5v-4z"/><path d="M13 7l4 4"/>'),
  'alphabet': svg('<path d="M3 20L12 4l9 16"/><path d="M7 14h10"/>'),
  'paper': svg('<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6h6"/><path d="M9 10h6"/><path d="M9 14h4"/>'),
  'printing-press': svg('<rect x="4" y="14" width="16" height="6" rx="1"/><path d="M8 14V8h8v6"/><path d="M12 4v4"/><path d="M6 4h12"/>'),
  'telegraph': svg('<path d="M2 20h20"/><path d="M12 4v16"/><path d="M8 8h8"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>'),
  'photography': svg('<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6l1-3h6l1 3"/>'),
  'telephone': svg('<path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  'radio': svg('<path d="M12 14v-4"/><path d="M8 18a4 4 0 0 1 0-8"/><path d="M16 18a4 4 0 0 0 0-8"/><path d="M5 21a8 8 0 0 1 0-16"/><path d="M19 21a8 8 0 0 0 0-16"/><circle cx="12" cy="14" r="2"/>'),
  'television': svg('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>'),
  'radar': svg('<path d="M12 12l6-6"/><circle cx="12" cy="12" r="2"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 6a6 6 0 0 1 6 6"/><path d="M2 22h20"/>'),
  'internet': svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><ellipse cx="12" cy="12" rx="4" ry="10"/>'),
  'fiber-optics': svg('<path d="M4 4c4 4 4 12 8 12s4-8 8-12"/><path d="M4 8c4 4 4 8 8 8s4-4 8-8"/><circle cx="2" cy="4" r="1" fill="white"/><circle cx="2" cy="8" r="1" fill="white"/>'),
  'world-wide-web': svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10"/><path d="M12 2a15 15 0 0 0-4 10 15 15 0 0 0 4 10"/>'),
  'mobile-phone': svg('<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'),
  'smartphone': svg('<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/><path d="M6 6h12"/>'),

  // SCIENCE
  'mathematics': svg('<path d="M4 8h6"/><path d="M7 5v6"/><path d="M14 6l6 6"/><path d="M20 6l-6 6"/><path d="M4 18h6"/><path d="M14 16h6"/><path d="M14 20h6"/>'),
  'astronomy': svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="M4.9 4.9l2.1 2.1"/><path d="M17 17l2.1 2.1"/>'),
  'geometry': svg('<polygon points="12 2 22 20 2 20"/><circle cx="12" cy="14" r="4"/>'),
  'calendar': svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h2"/><path d="M14 14h2"/>'),
  'medicine-hippocratic': svg('<path d="M12 2v8"/><path d="M8 6h8"/><path d="M8 14a4 4 0 0 0 8 0"/><path d="M12 14v8"/>'),
  'universities': svg('<path d="M2 10l10-6 10 6"/><path d="M6 12v6l6 3 6-3v-6"/>'),
  'algebra': svg('<path d="M5 4l4 16"/><path d="M15 4l4 16"/><path d="M4 10h7"/><path d="M13 14h7"/>'),
  'telescope': svg('<path d="M2 18L18 6"/><circle cx="20" cy="4" r="2"/><path d="M8 12l-4 8"/><path d="M10 14l2 6"/>'),
  'microscope': svg('<path d="M14 4l-4 12"/><circle cx="10" cy="18" r="3"/><path d="M6 22h12"/><path d="M14 4l2 1"/><path d="M12 2l2 1"/>'),
  'scientific-method': svg('<path d="M9 3h6"/><path d="M10 3v7l-4 8h12l-4-8V3"/><circle cx="10" cy="15" r="1" fill="white"/><circle cx="13" cy="17" r="1" fill="white"/>'),
  'calculus': svg('<path d="M4 18c2-6 5-14 8-14s6 8 8 14"/><path d="M3 12h18"/>'),
  'barometer': svg('<rect x="9" y="2" width="6" height="20" rx="3"/><path d="M12 18v-8"/><circle cx="12" cy="18" r="2" fill="white"/>'),
  'thermometer': svg('<path d="M12 2a2 2 0 0 0-2 2v12a4 4 0 1 0 4 0V4a2 2 0 0 0-2-2z"/><path d="M12 12v4"/>'),
  'heliocentric-model': svg('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" fill="none"/><circle cx="12" cy="12" r="10" fill="none"/><circle cx="19" cy="12" r="1.5" fill="white"/>'),
  'gravity': svg('<circle cx="12" cy="6" r="3"/><path d="M12 9v10"/><path d="M8 15l4 4 4-4"/>'),
  'relativity': svg('<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>'),
  'quantum-mechanics': svg('<circle cx="12" cy="12" r="2"/><path d="M12 2a14 7 30 0 1 0 20"/><path d="M12 2a14 7 150 0 1 0 20"/><path d="M12 2a14 7 -90 0 1 0 20"/>'),
  'electromagnetism': svg('<path d="M4 8c4-4 12-4 16 0"/><path d="M4 16c4 4 12 4 16 0"/><path d="M12 4v16"/><path d="M10 6l2-2 2 2"/><path d="M10 18l2 2 2-2"/>'),
  'laser': svg('<path d="M2 12h8"/><path d="M14 12h8"/><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M22 8l-4 4 4 4"/>'),
  'machine-learning': svg('<circle cx="4" cy="8" r="2"/><circle cx="4" cy="16" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="20" cy="12" r="2"/><path d="M6 8h4"/><path d="M6 16h4"/><path d="M14 6l4 5"/><path d="M14 12h4"/><path d="M14 18l4-5"/>'),

  // MEDICINE
  'eyeglasses': svg('<circle cx="7" cy="12" r="4"/><circle cx="17" cy="12" r="4"/><path d="M11 12h2"/><path d="M3 12H2"/><path d="M22 12h-1"/>'),
  'vaccination': svg('<path d="M10 4l4 16"/><path d="M8 4h4"/><path d="M7 10h4"/><path d="M14 20h-4"/>'),
  'anesthesia': svg('<path d="M12 2v6l-4 12h8L12 8z"/><circle cx="12" cy="4" r="2"/>'),
  'pasteurization': svg('<rect x="7" y="4" width="10" height="16" rx="2"/><path d="M7 10h10"/><path d="M12 10v10"/><path d="M10 2h4"/>'),
  'germ-theory': svg('<circle cx="12" cy="12" r="5"/><circle cx="10" cy="10" r="1" fill="white"/><circle cx="14" cy="11" r="1" fill="white"/><path d="M12 7v-5"/><path d="M17 12h5"/><path d="M7 12H2"/><path d="M12 17v5"/>'),
  'antibiotics': svg('<path d="M8 2c-3 3-4 8-2 12s6 7 10 6"/><path d="M16 22c3-3 4-8 2-12s-6-7-10-6"/><circle cx="12" cy="12" r="3"/>'),
  'dna-structure': svg('<path d="M4 4c2 4 6 4 8 0s6-4 8 0"/><path d="M4 12c2 4 6 4 8 0s6-4 8 0"/><path d="M4 20c2 4 6 4 8 0s6-4 8 0"/><path d="M6 6h4"/><path d="M14 6h4"/><path d="M6 14h4"/><path d="M14 14h4"/>'),
  'mri': svg('<ellipse cx="12" cy="12" rx="10" ry="6"/><ellipse cx="12" cy="12" rx="6" ry="10"/><circle cx="12" cy="12" r="2"/>'),
  'genetic-engineering': svg('<path d="M4 4c2 4 6 4 8 0s6-4 8 0"/><path d="M4 12c2 4 6 4 8 0s6-4 8 0"/><path d="M4 20c2 4 6 4 8 0s6-4 8 0"/><path d="M11 8l2-2 2 2"/>'),
  'crispr': svg('<path d="M4 4c2 4 6 4 8 0s6-4 8 0"/><path d="M4 12c2 4 6 4 8 0s6-4 8 0"/><path d="M4 20c2 4 6 4 8 0s6-4 8 0"/><rect x="9" y="9" width="6" height="6" rx="1"/>'),

  // COMPUTING
  'semiconductor': svg('<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M6 10H2"/><path d="M6 14H2"/><path d="M18 10h4"/><path d="M18 14h4"/><path d="M10 6V2"/><path d="M14 6V2"/><path d="M10 18v4"/><path d="M14 18v4"/>'),
  'transistor': svg('<circle cx="12" cy="12" r="8"/><path d="M12 4v6"/><path d="M6 16h12"/><path d="M12 10l-4 6"/><path d="M12 10l4 6"/>'),
  'integrated-circuit': svg('<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M5 9H2"/><path d="M5 15H2"/><path d="M19 9h3"/><path d="M19 15h3"/><path d="M9 5V2"/><path d="M15 5V2"/><path d="M9 19v3"/><path d="M15 19v3"/>'),
  'personal-computer': svg('<rect x="3" y="3" width="18" height="12" rx="2"/><path d="M8 19h8"/><path d="M10 15v4"/><path d="M14 15v4"/>'),
  'microprocessor': svg('<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M4 10H2"/><path d="M4 14H2"/><path d="M20 10h2"/><path d="M20 14h2"/><path d="M10 4V2"/><path d="M14 4V2"/><path d="M10 20v2"/><path d="M14 20v2"/>'),
  'cloud-computing': svg('<path d="M18 10a6 6 0 0 0-12 0 4 4 0 0 0-1 8h14a3 3 0 0 0 0-6z"/>'),
  'blockchain': svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 6.5h4"/><path d="M10 17.5h4"/><path d="M6.5 10v4"/><path d="M17.5 10v4"/>'),
  'large-language-models': svg('<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="12" cy="12" r="3"/><path d="M8 7l2 3"/><path d="M14 7l-2 3"/><path d="M8 17l2-3"/><path d="M14 17l-2-3"/>'),

  // SPACE
  'rocketry': svg('<path d="M12 2c-2 4-3 8-3 12h6c0-4-1-8-3-12z"/><path d="M9 14l-3 4h3"/><path d="M15 14l3 4h-3"/><path d="M12 22v-3"/>'),
  'satellite': svg('<rect x="8" y="8" width="8" height="8" rx="1" transform="rotate(45 12 12)"/><path d="M2 12h4"/><path d="M18 12h4"/>'),
  'moon-landing': svg('<circle cx="12" cy="8" r="4"/><path d="M8 14h8"/><path d="M6 22l3-8"/><path d="M18 22l-3-8"/><path d="M9 22h6"/>'),
  'space-station': svg('<rect x="6" y="9" width="12" height="6" rx="1"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M10 9V5"/><path d="M14 9V5"/><path d="M10 15v4"/><path d="M14 15v4"/>'),
  'reusable-rockets': svg('<path d="M12 2c-2 4-3 8-3 12h6c0-4-1-8-3-12z"/><path d="M9 14l-3 4h3"/><path d="M15 14l3 4h-3"/><path d="M8 20l4-2 4 2"/><path d="M12 22v-4"/>'),
}

// ─── Category fallback icons ───────────────────────────────────────────────────

const CATEGORY_FALLBACKS: Record<string, string> = {
  fundamental: svg('<path d="M12 2c1 4-2 6-2 10a4 4 0 0 0 8 0c0-4-3-6-2-10"/>'),
  agriculture: svg('<path d="M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12z"/>'),
  materials: svg('<path d="M8 6h8l2 12H6z"/><path d="M6 22h12"/>'),
  energy: svg('<path d="M13 2L7 14h5l-1 8 6-12h-5z"/>'),
  transport: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/>'),
  communication: svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  science: svg('<path d="M9 3h6"/><path d="M10 3v7l-4 8h12l-4-8V3"/>'),
  medicine: svg('<path d="M12 2v8"/><path d="M8 6h8"/><path d="M8 14a4 4 0 0 0 8 0"/><path d="M12 14v8"/>'),
  computing: svg('<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M5 9H2"/><path d="M5 15H2"/><path d="M19 9h3"/><path d="M19 15h3"/>'),
  space: svg('<path d="M12 2c-2 4-3 8-3 12h6c0-4-1-8-3-12z"/><path d="M9 14l-3 4h3"/><path d="M15 14l3 4h-3"/>'),
}

export function getCategoryFallbackIcon(category: string): string {
  return CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS.fundamental
}
