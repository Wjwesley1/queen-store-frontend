import React, { createContext, useContext, useState } from "react";

const FavoritosContext = createContext();

export const useFavoritos = () => useContext(FavoritosContext);

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (produto) => {
    setFavoritos((prev) =>
      prev.find((p) => p.id === produto.id)
        ? prev.filter((p) => p.id !== produto.id)
        : [...prev, produto],
    );
  };

  const isFavorito = (id) => favoritos.some((p) => p.id === id);

  return (
    <FavoritosContext.Provider
      value={{ favoritos, toggleFavorito, isFavorito }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};
