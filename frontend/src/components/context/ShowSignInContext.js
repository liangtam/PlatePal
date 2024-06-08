import { createContext, useState } from "react";

export const ShowSignInContext = createContext();

export const ShowSignInContextProvider = ({ children }) => {
  const [showSignIn, setShowSignIn] = useState(false);

  console.log(showSignIn)

  return (
    <ShowSignInContext.Provider value={{ showSignIn, setShowSignIn }}>
      {children}
    </ShowSignInContext.Provider>
  );
};
