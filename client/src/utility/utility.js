export const setStorageItem = (user, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(user, JSON.stringify(value));
    }
  };
  
  export const getStorageItem = (user) => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(user));
    }
    return null;
  };