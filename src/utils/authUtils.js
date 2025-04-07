import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = localStorage.getItem('jwtToken');

  if (!token) return { username: null, loggedIn: false };

  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded?.unique_name || decoded?.username || decoded?.name || "",
      loggedIn: true,
      id: decoded?.nameid
    };
  } catch (err) {
    console.error("Invalid token", err);

    return { username: null, loggedIn: false };
  }
}