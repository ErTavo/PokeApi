// src/components/Pokedex.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from '../pokemonCard/pokemonCard';
import { Grid, CircularProgress, Box } from '@mui/material';

const Pokedex = ({ generationUrl, containerColor }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get(generationUrl);
        const pokemonDetails = await Promise.all(
          response.data.pokemon_species.map(async (pokemon) => {
            const pokemonId = pokemon.url.split('/').slice(-2, -1)[0];
            const details = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            return {
              id: parseInt(pokemonId, 10), // Asegúrate de que el id sea numérico para ordenarlo
              name: details.data.name,
              image: details.data.sprites.front_default,
              types: details.data.types.map((typeInfo) => typeInfo.type.name),
            };
          })
        );

        // Ordena los Pokémon por su número de Pokédex
        const sortedPokemons = pokemonDetails.sort((a, b) => a.id - b.id);

        setPokemons(sortedPokemons);
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
    <Box sx={{ backgroundColor: '#ccffcc', padding: 2, maxWidth: '95%', margin: 'auto' }}> {/* Fondo verde claro, tamaño ajustado */}
      <Grid container spacing={2} sx={{ backgroundColor: containerColor, borderRadius: '10px', padding: 2 }}>
        {pokemons.map((pokemon) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}> {/* Ajusta la cantidad por fila automáticamente */}
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
