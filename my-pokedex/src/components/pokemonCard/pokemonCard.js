import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { getTypeColor, getAnimatedSprite } from '../../utils/pokemonUtils';

const PokemonCard = ({ name, image, types, id }) => {
  // Gen 6+ (id > 649) has no animated GIF → start in static mode with float animation
  const [isStatic, setIsStatic] = useState(id > 649);

  const primary = getTypeColor(types[0]);
  const secondary = types[1] ? getTypeColor(types[1]) : primary;

  return (
    <Box
      component={Link}
      to={`/pokemon/${id}`}
      sx={{
        display: 'block',
        textDecoration: 'none',
        borderRadius: '16px',
        background: `linear-gradient(145deg, ${primary}28, ${secondary}10)`,
        border: `1px solid ${primary}30`,
        p: 1.5,
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.35s ease both',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -28,
          right: -28,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: `${primary}18`,
          pointerEvents: 'none',
        },
        '&:hover': {
          transform: 'translateY(-7px)',
          boxShadow: `0 18px 36px ${primary}44`,
          border: `1px solid ${primary}60`,
          background: `linear-gradient(145deg, ${primary}40, ${secondary}20)`,
        },
      }}
    >
      {/* Pokédex number */}
      <Typography
        sx={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: '0.68rem',
          fontWeight: 800,
          textAlign: 'right',
          lineHeight: 1,
          mb: 0.5,
          position: 'relative',
          zIndex: 1,
        }}
      >
        #{String(id).padStart(3, '0')}
      </Typography>

      {/* Sprite — animated GIF for Gen 1-5, float-animated PNG for Gen 6+ */}
      <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <img
          src={isStatic ? image : getAnimatedSprite(id)}
          alt={name}
          style={{
            width: 90,
            height: 90,
            objectFit: 'contain',
            imageRendering: isStatic ? 'auto' : (id <= 649 ? 'pixelated' : 'auto'),
            filter: `drop-shadow(0 4px 10px ${primary}80)`,
            animation: isStatic ? 'pokemon-float 2.4s ease-in-out infinite' : 'none',
          }}
          onError={() => {
            // GIF failed (rare for Gen 1-5, expected for Gen 6+) → fall back to static + float
            if (!isStatic) setIsStatic(true);
          }}
        />
      </Box>

      {/* Name */}
      <Typography
        sx={{
          color: '#fff',
          fontWeight: 800,
          fontSize: '0.88rem',
          textTransform: 'capitalize',
          textAlign: 'center',
          mt: 0.5,
          mb: 1,
          position: 'relative',
          zIndex: 1,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {name}
      </Typography>

      {/* Type badges */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {types.map((type) => (
          <Box
            key={type}
            sx={{
              background: getTypeColor(type),
              color: '#fff',
              px: 1.4,
              py: 0.2,
              borderRadius: '20px',
              fontSize: '0.62rem',
              fontWeight: 800,
              textTransform: 'capitalize',
              boxShadow: `0 2px 6px ${getTypeColor(type)}55`,
            }}
          >
            {type}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PokemonCard;
