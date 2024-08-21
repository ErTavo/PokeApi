// src/components/PokemonCard.js
import React from 'react';
import { Card, CardContent, Typography, CardMedia, CardActionArea, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom'; // Para el enlace de navegación

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
    return typeColors[type] || '#FFFFFF';
  };

const PokemonCard = ({ name, image, types, id }) => {
  return (
    <Card sx={{ maxWidth: 250, minWidth: 200 }}> {/* Ajusta el tamaño de la tarjeta */}
      <CardActionArea component={Link} to={`/pokemon/${id}`}>
        <CardMedia
          component="img"
          alt={name}
          height="full"
          image={image}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Grid container spacing={0}>
        <Grid item xs={12} md={1}></Grid>
          <Typography variant="body1" color="text.secondary"></Typography>
          {types.map((typeInfo) => (
                  <Box key={typeInfo} bgcolor={getTypeColors(typeInfo)} color="white" p={1} borderRadius="5px">
                    {typeInfo}
                  </Box>
                ))}
                </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PokemonCard;
