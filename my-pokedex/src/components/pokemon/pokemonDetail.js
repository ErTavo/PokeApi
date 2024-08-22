// src/components/pokemon/PokemonDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, Divider, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './pokemonDetail.css'; // Asegúrate de importar el CSS

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validSprites, setValidSprites] = useState({});

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(pokemonResponse.data);

        const speciesResponse = await axios.get(pokemonResponse.data.species.url);
        const evolutionChainId = speciesResponse.data.evolution_chain.url.split('/').slice(-2, -1)[0];

        const evolutionChainResponse = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}/`);
        setEvolutionChain(evolutionChainResponse.data);

        const spritesToCheck = Object.values(pokemonResponse.data.sprites).filter(sprite => sprite);
        const validSpritesPromises = spritesToCheck.map(async (spriteUrl) => {
          const response = await fetch(spriteUrl, { method: 'HEAD' });
          if (response.ok) {
            return spriteUrl;
          }
          return null;
        });

        const validSpritesArray = await Promise.all(validSpritesPromises);
        const validSpritesMap = validSpritesArray.filter(Boolean).reduce((acc, spriteUrl) => {
          acc[spriteUrl] = spriteUrl;
          return acc;
        }, {});

        setValidSprites(validSpritesMap);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

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

  if (!pokemon) {
    return <Box textAlign="center" mt={4}>Pokemon not found</Box>;
  }

  const getTypeColors = (type) => {
    const typeColors = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#F0B6BC'
    };
    return typeColors[type] || '#FFFFFF'; // Default color if type not found
  };

  const renderEvolutionChain = (chain) => {
    if (!chain || !chain.chain) return null;

    const renderEvolution = (evolution) => {
      if (!evolution || !evolution.species) return null;

      return (
        <Box key={evolution.species.name} display="flex" alignItems="center" flexDirection="column">
          <Typography variant="h6">{evolution.species.name}</Typography>
          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.species.url.split('/')[6]}.png`} alt={evolution.species.name} width={100} />
          {evolution.evolves_to.length > 0 && (
            <Box mt={2}>
              {evolution.evolves_to.map(renderEvolution)}
            </Box>
          )}
        </Box>
      );
    };

    return (
      <Box className="evolution-chain">
        <Typography variant="h6" gutterBottom>Evolutions</Typography>
        {renderEvolution(chain.chain)}
      </Box>
    );
  };

  const gameList = pokemon.game_indices.map(game => game.version.name).join(' | ');

  return (
    <Box className="pokemon-detail" padding={4}>
      <Box className="header">
        <IconButton
          color="primary"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '20px', marginRight: 'auto' }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>{pokemon.name.toUpperCase()}</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card className="card">
            <CardMedia
              component="img"
              alt={pokemon.name}
              height="full"
              image={pokemon.sprites.front_default}
              title={pokemon.name}
            />
            <CardContent>
              <Typography variant="h6">Types</Typography>
              <Box display="flex" flexDirection="row" gap={1}>
                {pokemon.types.map((typeInfo) => (
                  <Box 
                    key={typeInfo.type.name}
                    className="type-box"
                    style={{ backgroundColor: getTypeColors(typeInfo.type.name), color: 'white', padding: '5px 10px', borderRadius: '4px' }}
                  >
                    {typeInfo.type.name}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Stats</Typography>
          <Box className="stats">
            {pokemon.stats.map((stat) => (
              <Typography key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</Typography>
            ))}
          </Box>
          <Divider />
          <Typography variant="h6" gutterBottom>Sprites</Typography>
          <Box className="sprites" display="flex" flexWrap="wrap" gap={1}>
            {Object.entries(pokemon.sprites).map(([key, spriteUrl], index) =>
              (spriteUrl && index !== 8 && index !== 9 && validSprites[spriteUrl]) ? (
                <img key={key} src={spriteUrl} alt={`Sprite ${key}`} width={100} style={{ margin: '5px' }} />
              ) : null
            )}
          </Box>
          <Divider />
          <Typography variant="h6" gutterBottom>Games</Typography>
          <Typography>{gameList}</Typography>
          <Divider />
          {evolutionChain && renderEvolutionChain(evolutionChain.chain)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PokemonDetail;
