// src/components/RegionalPokedex.js
import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Pokedex from '../pokedex/pokedex';

const regionColors = [
  '#ffcccb', // Kanto
  '#add8e6', // Johto
  '#90ee90', // Hoenn
  '#d3d3d3', // Sinnoh
  '#ffa07a', // Unova
  '#ffb6c1', // Kalos
  '#f0e68c', // Alola
  '#e6e6fa'  // Galar
];

const RegionalPokedex = () => {
  const [region, setRegion] = useState(0);

  const handleTabChange = (event, newValue) => {
    setRegion(newValue);
  };

  const regions = [
    { name: 'Kanto', url: 'https://pokeapi.co/api/v2/generation/1/' },
    { name: 'Johto', url: 'https://pokeapi.co/api/v2/generation/2/' },
    { name: 'Hoenn', url: 'https://pokeapi.co/api/v2/generation/3/' },
    { name: 'Sinnoh', url: 'https://pokeapi.co/api/v2/generation/4/' },
    { name: 'Unova', url: 'https://pokeapi.co/api/v2/generation/5/' },
    { name: 'Kalos', url: 'https://pokeapi.co/api/v2/generation/6/' },
    { name: 'Alola', url: 'https://pokeapi.co/api/v2/generation/7/' },
    { name: 'Galar', url: 'https://pokeapi.co/api/v2/generation/8/' },
  ];

  return (
    <Box>
      <Tabs value={region} onChange={handleTabChange} centered>
        {regions.map((region, index) => (
          <Tab key={index} label={region.name} />
        ))}
      </Tabs>
      <Box mt={2}>
        <Pokedex generationUrl={regions[region].url} containerColor={regionColors[region]} />
      </Box>
    </Box>
  );
};

export default RegionalPokedex;
