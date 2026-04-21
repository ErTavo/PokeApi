import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import RegionalPokedex from './components/regionalPokedex/regionalPokedex';
import PokemonDetail from './components/pokemon/pokemonDetail';

const PokeballSvg = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="19" cy="19" r="18" fill="#CC0000" stroke="white" strokeWidth="2"/>
    <path d="M1 19 A18 18 0 0 0 37 19 Z" fill="white"/>
    <rect x="1" y="18" width="36" height="3" fill="white"/>
    <circle cx="19" cy="19" r="6.5" fill="white"/>
    <circle cx="19" cy="19" r="4.5" fill="#CC0000"/>
    <circle cx="19" cy="19" r="2.5" fill="white"/>
  </svg>
);

const Header = () => (
  <Box
    sx={{
      background: 'linear-gradient(135deg, #b80000 0%, #e63946 50%, #b80000 100%)',
      px: { xs: 2, md: 4 },
      py: 1.5,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      boxShadow: '0 4px 24px rgba(230, 57, 70, 0.4)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}
  >
    <PokeballSvg />
    <Box>
      <Typography
        sx={{
          color: '#fff',
          fontWeight: 900,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          letterSpacing: 3,
          lineHeight: 1,
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        POKÉDEX
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 2 }}>
        NATIONAL DEX
      </Typography>
    </Box>
  </Box>
);

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<RegionalPokedex />} />
      <Route path="/pokemon/:id" element={<PokemonDetail />} />
    </Routes>
  </Router>
);

export default App;
