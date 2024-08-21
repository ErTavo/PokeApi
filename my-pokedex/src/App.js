// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegionalPokedex from './components/regionalPokedex/regionalPokedex';
import PokemonDetail from './components/pokemon/pokemonDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegionalPokedex generationUrl="https://pokeapi.co/api/v2/generation/1/" />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
