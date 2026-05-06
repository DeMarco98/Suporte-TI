export const ADMIN_USER = "administrador";
export const SESSION_STORAGE_KEY = "cadastros-admin-logado";

export function createAdminSession() {
  return { login: ADMIN_USER, name: "Administrador", role: "admin" };
}

export function createUserSession(user) {
  return { id: user.id, login: user.login, name: user.name, role: "user" };
}

export function loadSessionUser() {
  const storedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  if (storedSession === "true") {
    return createAdminSession();
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    return null;
  }
}

export function saveSessionUser(user) {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearSessionUser() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
