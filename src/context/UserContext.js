import React, { createContext, useState, useContext } from "react";

// 1️⃣ Create Context
const UserContext = createContext();

// 2️⃣ Create Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    user_id: null,
    full_name: null,
    email: null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3️⃣ Custom Hook (optional, for easy use)
export const useUser = () => useContext(UserContext);
