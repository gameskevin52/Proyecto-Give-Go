import * as authService from "../services/authService";

export const handleLogin = (username, password) => {
  return authService.login(username, password);
};

export const handleLogout = () => {
  authService.logout();
};