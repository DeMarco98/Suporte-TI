export const LOG_STORAGE_KEY = "cadastros-logs";

export async function createLog({ state, persistLogs, createId, currentUser, action, details = "" }) {
  const actor = currentUser?.name || "Sistema";
  const login = currentUser?.login || "sistema";
  const log = {
    id: createId("LOG"),
    action,
    details,
    actor,
    login,
    createdAt: new Date().toISOString()
  };

  state.logs = [log, ...state.logs].slice(0, 250);
  persistLogs();
  return log;
}

export async function listLogs({ state }) {
  return state.logs;
}
