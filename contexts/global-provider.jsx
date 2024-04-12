import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

export const GlobalContext = createContext();
export const useGlobalContext = () => {
  const val = useContext(GlobalContext);
  if (!val) {
    throw new Error("Please use useGlobalContext inside GlobalProvider");
  }
  return val;
};

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoadding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log("[USEEFFECT_CUR_USER_FETCH_ERROR]", error);
      })
      .finally(() => {
        setLoadding(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        setIsLoggedIn,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
