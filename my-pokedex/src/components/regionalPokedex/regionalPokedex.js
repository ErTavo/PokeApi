import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Pokedex from '../pokedex/pokedex';

const regions = [
  { name: 'Kanto',  url: 'https://pokeapi.co/api/v2/generation/1/', color: '#FF6B6B', emoji: '🔴', gen: 'Gen I' },
  { name: 'Johto',  url: 'https://pokeapi.co/api/v2/generation/2/', color: '#4ECDC4', emoji: '🌙', gen: 'Gen II' },
  { name: 'Hoenn',  url: 'https://pokeapi.co/api/v2/generation/3/', color: '#45B7D1', emoji: '🌊', gen: 'Gen III' },
  { name: 'Sinnoh', url: 'https://pokeapi.co/api/v2/generation/4/', color: '#96CEB4', emoji: '❄️', gen: 'Gen IV' },
  { name: 'Unova',  url: 'https://pokeapi.co/api/v2/generation/5/', color: '#F7DC6F', emoji: '⚡', gen: 'Gen V' },
  { name: 'Kalos',  url: 'https://pokeapi.co/api/v2/generation/6/', color: '#DDA0DD', emoji: '🌸', gen: 'Gen VI' },
  { name: 'Alola',  url: 'https://pokeapi.co/api/v2/generation/7/', color: '#FFB347', emoji: '🌺', gen: 'Gen VII' },
  { name: 'Galar',  url: 'https://pokeapi.co/api/v2/generation/8/', color: '#9B59B6', emoji: '👑', gen: 'Gen VIII' },
];

const RegionalPokedex = () => {
  const [selected, setSelected] = useState(0);
  const region = regions[selected];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Region tab strip */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1,
          px: 2,
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { background: '#e63946', borderRadius: 2 },
        }}
      >
        {regions.map((r, i) => {
          const active = selected === i;
          return (
            <Box
              key={i}
              onClick={() => setSelected(i)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.4,
                px: 2,
                py: 1.2,
                borderRadius: '12px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.25s ease',
                background: active
                  ? `linear-gradient(135deg, ${r.color}55, ${r.color}22)`
                  : 'rgba(255,255,255,0.04)',
                border: active ? `2px solid ${r.color}` : '2px solid transparent',
                transform: active ? 'scale(1.06)' : 'scale(1)',
                boxShadow: active ? `0 4px 20px ${r.color}44` : 'none',
                '&:hover': {
                  background: `linear-gradient(135deg, ${r.color}33, ${r.color}11)`,
                  border: `2px solid ${r.color}66`,
                },
              }}
            >
              <Typography sx={{ fontSize: '1.3rem', lineHeight: 1 }}>{r.emoji}</Typography>
              <Typography
                sx={{
                  color: active ? '#fff' : '#a0a0b8',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {r.name}
              </Typography>
              <Typography
                sx={{
                  color: active ? r.color : '#555',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  letterSpacing: 0.5,
                }}
              >
                {r.gen}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Region title bar */}
      <Box sx={{ px: 3, pt: 2.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '1.4rem' }}>{region.emoji}</Typography>
        <Typography
          sx={{
            color: region.color,
            fontWeight: 900,
            fontSize: '1.3rem',
            fontFamily: "'Nunito', sans-serif",
            letterSpacing: 1,
          }}
        >
          {region.name}
        </Typography>
        <Typography sx={{ color: '#555', fontWeight: 700, fontSize: '0.75rem', ml: 0.5, alignSelf: 'flex-end', pb: 0.3 }}>
          {region.gen}
        </Typography>
      </Box>

      <Pokedex generationUrl={region.url} accentColor={region.color} />
    </Box>
  );
};

export default RegionalPokedex;
