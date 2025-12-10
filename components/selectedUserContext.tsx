import React, { createContext, useContext, useState } from "react";

type SelectedUserContextType = {
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;
  clearUser: () => void;
};

const SelectedUserContext = createContext<SelectedUserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  clearUser: () => {},
});

export const SelectedUserProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const clearUser = () => setCurrentUser(null);

  return (
    <SelectedUserContext.Provider
      value={{ currentUser, setCurrentUser, clearUser }}
    >
      {children}
    </SelectedUserContext.Provider>
  );
};

export const useSelectedUser = () => useContext(SelectedUserContext);
