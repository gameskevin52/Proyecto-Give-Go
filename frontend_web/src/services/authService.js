// Simulación de login con JWT falso

export const login = (username, password) => {
  if (username === "admin" && password === "1234") {
    const fakeToken = generateFakeJWT(username);
    localStorage.setItem("token", fakeToken);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Generador de JWT falso
const generateFakeJWT = (user) => {
  const payload = {
    user,
    role: "admin",
    exp: Date.now() + 1000 * 60 * 60 // 1 hora
  };

  return btoa(JSON.stringify(payload)); // codificación base64
};