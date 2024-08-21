// src/components/Pokedex.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from '../pokemonCard/pokemonCard';
import { Grid, CircularProgress, Box } from '@mui/material';

const Pokedex = ({ generationUrl }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get(generationUrl);
        console.log('API Response:', response.data);
        
        const pokemonDetails = await Promise.all(
          response.data.pokemon_species.map(async (pokemon) => {
            const pokemonId = pokemon.url.split('/').slice(-2, -1)[0];
            const details = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            return {
              id: pokemonId,
              name: details.data.name,
              image: details.data.sprites.front_default,
              types: details.data.types.map((typeInfo) => typeInfo.type.name),
            };
          })
        );
        setPokemons(pokemonDetails);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [generationUrl]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Box textAlign="center" mt={4}>Error: {error.message}</Box>;
  }

  return (
    <Grid container spacing={2}>
      {pokemons.map((pokemon) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
          <PokemonCard
            id={pokemon.id}
            name={pokemon.name}
            image={pokemon.image}
            types={pokemon.types}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Pokedex;
