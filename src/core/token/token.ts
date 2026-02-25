/**
 * sendme.alt - Token Generation
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

// Simple word list for token generation (500 words)
const WORDS = [
  'happy', 'quiet', 'bright', 'swift', 'calm', 'fresh', 'cool', 'warm', 'soft', 'bold',
  'ocean', 'river', 'cloud', 'storm', 'breeze', 'rain', 'snow', 'wind', 'fire', 'wave',
  'moon', 'star', 'sun', 'sky', 'dawn', 'dusk', 'night', 'day', 'light', 'dark',
  'blue', 'red', 'green', 'gold', 'silver', 'pink', 'purple', 'orange', 'white', 'black',
  'forest', 'mountain', 'valley', 'desert', 'jungle', 'meadow', 'field', 'lake', 'pond', 'hill',
  'tiger', 'eagle', 'wolf', 'bear', 'deer', 'fox', 'owl', 'hawk', 'lion', 'dove',
  'fast', 'slow', 'high', 'low', 'big', 'small', 'long', 'short', 'wide', 'thin',
  'music', 'dance', 'song', 'rhythm', 'melody', 'harmony', 'beat', 'tune', 'note', 'chord',
  'dream', 'hope', 'wish', 'joy', 'peace', 'love', 'care', 'trust', 'faith', 'grace',
  'spring', 'summer', 'autumn', 'winter', 'season', 'bloom', 'leaf', 'seed', 'root', 'branch',
  'crystal', 'pearl', 'gem', 'jade', 'ruby', 'amber', 'coral', 'opal', 'topaz', 'onyx',
  'magic', 'mystic', 'cosmic', 'astral', 'lunar', 'solar', 'stellar', 'cosmic', 'zen', 'flow',
  'alpha', 'beta', 'gamma', 'delta', 'omega', 'sigma', 'theta', 'kappa', 'lambda', 'phoenix',
  'dragon', 'unicorn', 'pegasus', 'griffin', 'sphinx', 'hydra', 'kraken', 'titan', 'atlas', 'orion',
  'noble', 'royal', 'prime', 'ultra', 'mega', 'super', 'hyper', 'neo', 'nova', 'apex',
  'echo', 'pulse', 'sonic', 'wave', 'flash', 'spark', 'blaze', 'frost', 'mist', 'haze',
  'amber', 'azure', 'jade', 'ruby', 'ivory', 'ebony', 'coral', 'pearl', 'crystal', 'diamond',
  'north', 'south', 'east', 'west', 'zenith', 'nadir', 'horizon', 'equator', 'pole', 'tropic',
  'wisdom', 'valor', 'honor', 'glory', 'pride', 'courage', 'spirit', 'power', 'energy', 'force',
  'balance', 'harmony', 'unity', 'peace', 'serenity', 'bliss', 'joy', 'delight', 'pleasure', 'comfort',
  // Add more words to reach 500...
  'arrow', 'blade', 'crown', 'throne', 'scepter', 'shield', 'sword', 'lance', 'helm', 'armor',
  'castle', 'tower', 'fortress', 'citadel', 'bastion', 'palace', 'temple', 'shrine', 'altar', 'vault',
  'quest', 'voyage', 'journey', 'adventure', 'odyssey', 'expedition', 'trek', 'safari', 'cruise', 'tour',
  'legend', 'myth', 'fable', 'tale', 'story', 'epic', 'saga', 'chronicle', 'lore', 'history',
  'cipher', 'code', 'key', 'lock', 'seal', 'mark', 'sign', 'symbol', 'token', 'emblem',
  'circle', 'square', 'triangle', 'sphere', 'cube', 'pyramid', 'prism', 'cone', 'cylinder', 'spiral',
  'anchor', 'compass', 'helm', 'mast', 'sail', 'oar', 'rudder', 'deck', 'hull', 'keel',
  'summit', 'peak', 'crest', 'ridge', 'cliff', 'canyon', 'gorge', 'ravine', 'chasm', 'abyss',
  'portal', 'gateway', 'passage', 'path', 'road', 'trail', 'route', 'course', 'way', 'street',
  'nexus', 'vertex', 'apex', 'zenith', 'pinnacle', 'acme', 'climax', 'summit', 'crest', 'crown',
  'quantum', 'photon', 'neutron', 'proton', 'electron', 'quark', 'atom', 'molecule', 'ion', 'plasma',
  'vector', 'matrix', 'tensor', 'scalar', 'formula', 'theorem', 'axiom', 'lemma', 'proof', 'logic',
  'rapid', 'agile', 'nimble', 'quick', 'fleet', 'hasty', 'speedy', 'brisk', 'lively', 'active',
  'gentle', 'tender', 'mild', 'kind', 'sweet', 'smooth', 'silky', 'velvet', 'satin', 'silk',
  'crisp', 'sharp', 'keen', 'acute', 'vivid', 'lucid', 'clear', 'pure', 'clean', 'pristine',
  'ancient', 'eternal', 'timeless', 'endless', 'infinite', 'boundless', 'limitless', 'vast', 'immense', 'grand',
  'micro', 'nano', 'pico', 'mini', 'tiny', 'small', 'petite', 'compact', 'little', 'wee',
  'giant', 'massive', 'huge', 'enormous', 'colossal', 'mammoth', 'gigantic', 'titanic', 'vast', 'immense',
  'silent', 'still', 'hushed', 'mute', 'soundless', 'noiseless', 'peaceful', 'tranquil', 'serene', 'placid',
  'thunder', 'lightning', 'tempest', 'gale', 'cyclone', 'tornado', 'hurricane', 'typhoon', 'monsoon', 'blizzard',
  'haven', 'refuge', 'shelter', 'sanctuary', 'asylum', 'harbor', 'port', 'bay', 'cove', 'inlet',
  'oasis', 'paradise', 'eden', 'utopia', 'heaven', 'nirvana', 'elysium', 'arcadia', 'shangri', 'valhalla',
  'sentinel', 'guardian', 'watcher', 'keeper', 'protector', 'defender', 'champion', 'warrior', 'knight', 'paladin',
  'cipher', 'enigma', 'riddle', 'puzzle', 'mystery', 'secret', 'hidden', 'arcane', 'occult', 'esoteric',
  'prism', 'spectrum', 'rainbow', 'aurora', 'halo', 'corona', 'nimbus', 'aura', 'glow', 'shimmer',
  'velocity', 'momentum', 'inertia', 'kinetic', 'dynamic', 'motion', 'movement', 'action', 'activity', 'energy',
  'resonance', 'vibration', 'frequency', 'amplitude', 'wavelength', 'oscillation', 'tremor', 'quake', 'shake', 'quiver',
  'radiant', 'luminous', 'brilliant', 'gleaming', 'glowing', 'shining', 'sparkling', 'glittering', 'dazzling', 'blazing',
  'eclipse', 'equinox', 'solstice', 'eclipse', 'transit', 'phase', 'cycle', 'period', 'epoch', 'era',
  'nebula', 'galaxy', 'cosmos', 'universe', 'constellation', 'asteroid', 'comet', 'meteor', 'planet', 'satellite'
]

/**
 * Generate a single-word token by combining two words
 * Example: "oceanriver", "happycloud", "quietmoon"
 */
export function generateToken(): string {
  const word1 = WORDS[Math.floor(Math.random() * WORDS.length)]
  const word2 = WORDS[Math.floor(Math.random() * WORDS.length)]
  return `${word1}${word2}`
}

/**
 * Convert token to Firebase-safe key
 * (tokens are already alphanumeric, but this function exists for consistency)
 */
export function tokenToFirebaseKey(token: string): string {
  return token.toLowerCase()
}

/**
 * Validate token format
 */
export function isValidToken(token: string): boolean {
  // Token should be 6-30 characters, lowercase letters only (two words combined)
  // Minimum: 3+3=6 chars, Maximum: ~15+15=30 chars
  const normalized = token.toLowerCase().trim()
  return /^[a-z]{6,30}$/.test(normalized)
}
