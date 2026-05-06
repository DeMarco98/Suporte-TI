export const AGENDA_STORAGE_KEY = "cadastros-agenda";

export function buildAgendaItem(payload, createId) {
  return {
    id: createId("AGE"),
    clientId: payload.clientId,
    clientName: payload.clientName || "Cliente sem nome",
    occurrence: payload.occurrence,
    requester: payload.requester,
    date: payload.date,
    status: payload.status,
    openedByName: payload.openedByName || "Nao informado",
    openedByLogin: payload.openedByLogin || "",
    createdAt: new Date().toISOString()
  };
}

export async function createAgendaItem({ state, persistAgendaItems, createId, payload }) {
  const item = buildAgendaItem(payload, createId);
  state.agendaItems = [item, ...state.agendaItems];
  persistAgendaItems();
  return item;
}

export async function listAgendaItems({ state }) {
  return state.agendaItems;
}
