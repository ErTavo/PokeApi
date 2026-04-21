import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';
import { getTypeColor, getAnimatedSprite, getShinyAnimatedSprite } from '../../utils/pokemonUtils';

// Stats in Pokémon-GO hexagon order: HP→top, ATK→top-right, DEF→bottom-right,
// SPD→bottom, SP.DEF→bottom-left, SP.ATK→top-left
const STAT_CHART_ORDER = ['hp', 'attack', 'defense', 'speed', 'special-defense', 'special-attack'];
const STAT_LABELS = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'SP.ATK', 'special-defense': 'SP.DEF', speed: 'SPD',
};

// ─── Reusable card-style section ────────────────────────────────────────────
const Section = ({ title, children }) => (
  <Box
    sx={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '18px',
      p: { xs: 2, md: 2.5 },
      mb: 2,
    }}
  >
    {title && (
      <Typography sx={{ color: '#a0a0b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, mb: 1.5 }}>
        {title}
      </Typography>
    )}
    {children}
  </Box>
);

// ─── Main component ──────────────────────────────────────────────────────────
const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pokemon,       setPokemon]       = useState(null);
  const [evolutionChain,setEvolutionChain] = useState(null);
  const [species,       setSpecies]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [showShiny,     setShowShiny]     = useState(false);
  const [spriteError,   setSpriteError]   = useState(false); // main sprite fallback

  useEffect(() => {
    let cancelled = false;
    setSpriteError(false);
    setShowShiny(false);

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const pkRes  = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!cancelled) setPokemon(pkRes.data);

        const spRes  = await axios.get(pkRes.data.species.url);
        if (!cancelled) setSpecies(spRes.data);

        const evoId  = spRes.data.evolution_chain.url.split('/').slice(-2, -1)[0];
        const evoRes = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${evoId}/`);
        if (!cancelled) { setEvolutionChain(evoRes.data); setLoading(false); }
      } catch (err) {
        if (!cancelled) { setError(err); setLoading(false); }
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, [id]);

  // ── Sprite logic ────────────────────────────────────────────────────────────
  const numId = parseInt(id, 10);
  const hasAnimated = numId <= 649;

  const getMainSpriteSrc = () => {
    if (!pokemon) return '';
    if (showShiny) {
      return hasAnimated
        ? getShinyAnimatedSprite(numId)
        : (pokemon.sprites.front_shiny || pokemon.sprites.front_default);
    }
    return getAnimatedSprite(numId);
  };

  const mainFallback = pokemon
    ? (showShiny ? pokemon.sprites.front_shiny || pokemon.sprites.front_default : pokemon.sprites.front_default)
    : '';

  // ── Radar chart tick (label + value) ────────────────────────────────────────
  const renderStatTick = ({ x, y, payload }) => {
    if (!pokemon) return null;
    const val = pokemon.stats.find(s => s.stat.name ===
      Object.keys(STAT_LABELS).find(k => STAT_LABELS[k] === payload.value)
    )?.base_stat ?? '';

    return (
      <g>
        <text x={x} y={y - 9}  textAnchor="middle" fill="#9090b0" fontSize={10} fontWeight="700" fontFamily="Nunito, sans-serif">
          {payload.value}
        </text>
        <text x={x} y={y + 9}  textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight="800" fontFamily="Nunito, sans-serif">
          {val}
        </text>
      </g>
    );
  };

  // ── Evolution chain renderer ─────────────────────────────────────────────────
  const renderEvolutionNode = (node) => {
    if (!node?.species) return null;
    const speciesId = node.species.url.split('/').slice(-2, -1)[0];
    const isCurrent = speciesId === id;

    return (
      <Box key={node.species.name} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box
          onClick={() => navigate(`/pokemon/${speciesId}`)}
          sx={{
            textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: '12px',
            border: isCurrent ? '2px solid #e63946' : '2px solid transparent',
            background: isCurrent ? 'rgba(230,57,70,0.12)' : 'rgba(255,255,255,0.03)',
            transition: 'all 0.2s ease',
            '&:hover': { background: 'rgba(255,255,255,0.09)' },
          }}
        >
          <img
            src={getAnimatedSprite(parseInt(speciesId))}
            alt={node.species.name}
            style={{ width: 64, height: 64, objectFit: 'contain', imageRendering: parseInt(speciesId) <= 649 ? 'pixelated' : 'auto', display: 'block', animation: parseInt(speciesId) > 649 ? 'pokemon-float 2.4s ease-in-out infinite' : 'none' }}
            onError={(e) => {
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`;
              e.target.style.animation = 'pokemon-float 2.4s ease-in-out infinite';
            }}
          />
          <Typography sx={{ color: isCurrent ? '#e63946' : '#fff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize', mt: 0.5 }}>
            {node.species.name}
          </Typography>
        </Box>
        {node.evolves_to.length > 0 && (
          <>
            <Typography sx={{ color: '#444', fontSize: '1.5rem', mx: 0.5 }}>›</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {node.evolves_to.map(renderEvolutionNode)}
            </Box>
          </>
        )}
      </Box>
    );
  };

  // ── Early returns ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress sx={{ color: '#e63946' }} size={56} />
      </Box>
    );
  }
  if (error) {
    return <Box sx={{ textAlign: 'center', mt: 6, color: '#e63946' }}><Typography fontWeight={700}>Error: {error.message}</Typography></Box>;
  }
  if (!pokemon) return null;

  // ── Derived values ───────────────────────────────────────────────────────────
  const primaryType    = pokemon.types[0].type.name;
  const primaryColor   = getTypeColor(primaryType);

  const radarData = STAT_CHART_ORDER.map(key => ({
    stat:     STAT_LABELS[key],
    value:    pokemon.stats.find(s => s.stat.name === key)?.base_stat || 0,
    fullMark: 255,
  }));

  const description = species?.flavor_text_entries
    ?.find(e => e.language.name === 'en')
    ?.flavor_text.replace(/\f|\n/g, ' ') || '';

  const eggGroups = species?.egg_groups?.map(g => g.name) || [];
  const growthRate = species?.growth_rate?.name || '';
  const captureRate = species?.capture_rate ?? '';
  const baseHappiness = species?.base_happiness ?? '';
  const baseExp = pokemon.base_experience ?? '—';

  // Labeled sprite pairs for gallery
  const spriteGallery = [
    { label: 'Normal',       src: pokemon.sprites.front_default },
    { label: 'Normal (back)',src: pokemon.sprites.back_default },
    { label: 'Shiny',        src: pokemon.sprites.front_shiny },
    { label: 'Shiny (back)', src: pokemon.sprites.back_shiny },
    { label: 'Female',       src: pokemon.sprites.front_female },
    { label: 'Shiny ♀',     src: pokemon.sprites.front_shiny_female },
  ].filter(s => s.src);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 }, pb: 8 }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3.5 }}>
        <Box
          onClick={() => navigate(-1)}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', px: 1.8, py: 1, flexShrink: 0,
            transition: 'all 0.2s ease',
            '&:hover': { background: 'rgba(255,255,255,0.14)' },
          }}
        >
          <ArrowBackIosIcon sx={{ color: '#fff', fontSize: '0.85rem' }} />
          <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>Volver</Typography>
        </Box>
        <Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 800 }}>
            #{String(id).padStart(3, '0')}
          </Typography>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, textTransform: 'capitalize', lineHeight: 1.1, fontFamily: "'Nunito', sans-serif" }}>
            {pokemon.name}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>

        {/* ════════════ LEFT COLUMN ════════════ */}
        <Grid item xs={12} md={4}>

          {/* Sprite card */}
          <Box
            sx={{
              background: `linear-gradient(145deg, ${primaryColor}28, ${primaryColor}08)`,
              border: `1px solid ${primaryColor}30`, borderRadius: '20px',
              p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden', mb: 2,
            }}
          >
            {/* Decorative circle */}
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: `${primaryColor}12`, pointerEvents: 'none' }} />

            {/* Main sprite */}
            <img
              key={`${id}-${showShiny}`}
              src={spriteError ? mainFallback : getMainSpriteSrc()}
              alt={pokemon.name}
              style={{
                width: 180, height: 180, objectFit: 'contain', position: 'relative', zIndex: 1,
                imageRendering: hasAnimated ? 'pixelated' : 'auto',
                filter: `drop-shadow(0 10px 28px ${showShiny ? '#ffd700' : primaryColor}99)`,
                animation: !hasAnimated ? 'pokemon-float 2.4s ease-in-out infinite' : 'none',
              }}
              onError={(e) => {
                if (!spriteError) {
                  setSpriteError(true);
                  e.target.src = mainFallback;
                }
              }}
            />

            {/* Normal / Shiny toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2, mt: 1, position: 'relative', zIndex: 1 }}>
              {[false, true].map((shiny) => (
                <Box
                  key={String(shiny)}
                  onClick={() => { setShowShiny(shiny); setSpriteError(false); }}
                  sx={{
                    px: 2, py: 0.6, borderRadius: '20px', cursor: 'pointer', fontWeight: 800, fontSize: '0.78rem',
                    fontFamily: "'Nunito', sans-serif",
                    transition: 'all 0.2s ease',
                    background: showShiny === shiny
                      ? (shiny ? 'linear-gradient(90deg, #ffd700, #fff8a0, #ffd700)' : primaryColor)
                      : 'rgba(255,255,255,0.07)',
                    backgroundSize: showShiny === shiny && shiny ? '200% auto' : undefined,
                    animation: showShiny === shiny && shiny ? 'shimmer 2s linear infinite' : 'none',
                    color: showShiny === shiny ? (shiny ? '#333' : '#fff') : '#a0a0b8',
                    border: showShiny === shiny ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    boxShadow: showShiny === shiny ? (shiny ? '0 0 16px #ffd70088' : `0 0 12px ${primaryColor}66`) : 'none',
                  }}
                >
                  {shiny ? '✨ Shiny' : '● Normal'}
                </Box>
              ))}
            </Box>

            {/* Types */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              {pokemon.types.map(t => (
                <Box key={t.type.name} sx={{ background: getTypeColor(t.type.name), color: '#fff', px: 2.5, py: 0.7, borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'capitalize', boxShadow: `0 4px 14px ${getTypeColor(t.type.name)}66` }}>
                  {t.type.name}
                </Box>
              ))}
            </Box>

            {/* Height / Weight / BaseExp */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', py: 1.5, position: 'relative', zIndex: 1 }}>
              {[
                { label: 'Altura',   value: `${(pokemon.height / 10).toFixed(1)} m` },
                { label: 'Peso',     value: `${(pokemon.weight / 10).toFixed(1)} kg` },
                { label: 'Base Exp', value: baseExp },
              ].map(({ label, value }, i, arr) => (
                <React.Fragment key={label}>
                  <Box>
                    <Typography sx={{ color: '#a0a0b8', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>{value}</Typography>
                  </Box>
                  {i < arr.length - 1 && <Box sx={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />}
                </React.Fragment>
              ))}
            </Box>
          </Box>

          {/* Abilities */}
          <Section title="Habilidades">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {pokemon.abilities.map(a => (
                <Box key={a.ability.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#fff', textTransform: 'capitalize', fontWeight: 700, fontSize: '0.9rem' }}>
                    {a.ability.name.replace('-', ' ')}
                  </Typography>
                  {a.is_hidden && (
                    <Box sx={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700', px: 1, py: 0.2, borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800 }}>
                      OCULTA
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Section>

          {/* Species info */}
          {species && (
            <Section title="Datos de Especie">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: 'Tasa captura', value: captureRate },
                  { label: 'Felicidad base', value: baseHappiness },
                  { label: 'Crecimiento', value: growthRate },
                  { label: 'Grupos huevo', value: eggGroups.join(', ') || '—' },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#a0a0b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' }}>{label}</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, textTransform: 'capitalize' }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Section>
          )}
        </Grid>

        {/* ════════════ RIGHT COLUMN ════════════ */}
        <Grid item xs={12} md={8}>

          {/* Description */}
          {description && (
            <Section title="Descripción">
              <Typography sx={{ color: '#c8c8e0', fontSize: '0.92rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                "{description}"
              </Typography>
            </Section>
          )}

          {/* Hexagonal stat radar */}
          <Section title="Estadísticas Base">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} outerRadius="62%" margin={{ top: 28, right: 38, bottom: 28, left: 38 }}>
                <PolarGrid stroke="rgba(255,255,255,0.12)" gridType="polygon" />
                <PolarAngleAxis
                  dataKey="stat"
                  tick={renderStatTick}
                  axisLine={false}
                  tickLine={false}
                />
                <Radar
                  dataKey="value"
                  stroke={primaryColor}
                  fill={primaryColor}
                  fillOpacity={0.38}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: primaryColor, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: primaryColor, strokeWidth: 2 }}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Compact numeric row below radar */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 1 }}>
              {pokemon.stats.map(stat => (
                <Box key={stat.stat.name} sx={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', px: 1.5, py: 0.8, minWidth: 58 }}>
                  <Typography sx={{ color: '#a0a0b8', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {STAT_LABELS[stat.stat.name] || stat.stat.name}
                  </Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1rem' }}>
                    {stat.base_stat}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Section>

          {/* Evolution chain */}
          {evolutionChain?.chain && (
            <Section title="Cadena de Evolución">
              <Box sx={{ overflowX: 'auto' }}>
                {renderEvolutionNode(evolutionChain.chain)}
              </Box>
            </Section>
          )}

          {/* Sprites gallery */}
          <Section title="Sprites">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {spriteGallery.map(({ label, src }) => (
                <Box key={label} sx={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', p: 1 }}>
                  <img
                    src={src}
                    alt={label}
                    style={{ width: 72, height: 72, objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }}
                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                  />
                  <Typography sx={{ color: '#a0a0b8', fontSize: '0.6rem', fontWeight: 700, mt: 0.5 }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Section>

          {/* Games */}
          {pokemon.game_indices.length > 0 && (
            <Section title="Juegos">
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {pokemon.game_indices.map(g => (
                  <Box key={g.version.name} sx={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#c0c0d0', px: 1.4, py: 0.5, borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                    {g.version.name}
                  </Box>
                ))}
              </Box>
            </Section>
          )}

        </Grid>
      </Grid>
    </Box>
  );
};

export default PokemonDetail;
