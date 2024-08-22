import { gql } from '@apollo/client';

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: String!) {
    pokemon(id: $id) {
      id
      name
      types {
        name
      }
      stats {
        name
        baseStat
      }
      sprites {
        frontDefault
        backDefault
        // Agrega más sprites si es necesario
      }
      // Agrega más campos si es necesario
    }
  }
`;

export const GET_EVOLUTION_CHAIN = gql`
  query GetEvolutionChain($id: String!) {
    evolutionChain(id: $id) {
      chain {
        species {
          name
        }
        evolvesTo {
          species {
            name
          }
        }
      }
    }
  }
`;
