import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from '../pokemonCard/pokemonCard';
import { Grid, Box, Typography } from '@mui/material';

const PokeballLoader = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(to bottom, #e63946 50%, #1a1a2e 50%)',
        border: '4px solid rgba(255,255,255,0.85)',
        position: 'relative',
        animation: 'pokeball-spin 0.7s linear infinite',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '3.5px',
          background: 'rgba(255,255,255,0.85)',
          transform: 'translateY(-50%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#fff',
          border: '3px solid rgba(255,255,255,0.5)',
          zIndex: 1,
        },
      }}
    />
    <Typography sx={{ color: '#a0a0b8', fontWeight: 700, fontSize: '0.9rem', animation: 'pulse 1.5s ease infinite' }}>
      Cargando Pokémon...
    </Typography>
  </Box>
);

const Pokedex = ({ generationUrl, accentColor }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPokemons = async () => {
      setLoading(true);
      setError(null);

      // Session cache to avoid refetching on tab switch
      const cacheKey = `pkdx_${generationUrl}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        if (!cancelled) {
          setPokemons(JSON.parse(cached));
          setLoading(false);
        }
        return;
      }

      try {
        const genRes = await axios.get(generationUrl);
        const results = await Promise.allSettled(
          genRes.data.pokemon_species.map(async (species) => {
            const pkId = species.url.split('/').slice(-2, -1)[0];
            const det = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pkId}`);
            return {
              id: parseInt(pkId, 10),
              name: det.data.name,
              image: det.data.sprites.front_default,
              types: det.data.types.map((t) => t.type.name),
            };
          })
        );

        const sorted = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value)
          .sort((a, b) => a.id - b.id);

        sessionStorage.setItem(cacheKey, JSON.stringify(sorted));
        if (!cancelled) {
          setPokemons(sorted);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchPokemons();
    return () => { cancelled = true; };
  }, [generationUrl]);

  if (loading) return <PokeballLoader />;

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6, color: '#e63946' }}>
        <Typography fontWeight={700}>Error al cargar: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        {pokemons.map((pokemon) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={pokemon.id}>
            <PokemonCard
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              types={pokemon.types}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Pokedex;
