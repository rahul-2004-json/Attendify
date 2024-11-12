import React, { createContext, useState } from "react";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imagesArray, setImagesArray] = useState([]);

  return (
    <ImageContext.Provider value={{ imagesArray, setImagesArray }}>
      {children}
    </ImageContext.Provider>
  );
};
