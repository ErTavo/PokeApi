export const TYPE_COLORS = {
  fire: '#FF6B35',
  water: '#4FC3F7',
  grass: '#66BB6A',
  electric: '#FFD54F',
  ice: '#80DEEA',
  fighting: '#EF5350',
  poison: '#AB47BC',
  ground: '#FFCA28',
  flying: '#7986CB',
  psychic: '#EC407A',
  bug: '#9CCC65',
  rock: '#8D6E63',
  ghost: '#7E57C2',
  dragon: '#5C6BC0',
  dark: '#5D4037',
  steel: '#78909C',
  fairy: '#F48FB1',
  normal: '#BDBDBD',
};

export const getTypeColor = (type) => TYPE_COLORS[type] || '#BDBDBD';

// Animated GIF sprites: Gen I-V (1-649) from Black/White games
export const getAnimatedSprite = (id) => {
  if (id <= 649) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

// Animated shiny GIF sprites: Gen I-V only
export const getShinyAnimatedSprite = (id) => {
  if (id <= 649) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`;
  }
  return null; // Gen 6+ has no animated shiny; caller must fall back to front_shiny PNG
};
