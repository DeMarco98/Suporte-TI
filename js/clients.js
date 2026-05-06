export const STORAGE_KEY = "cadastros-clientes";
export const CATEGORY_STORAGE_KEY = "cadastros-categorias-equipamentos";
export const BRAND_MODEL_STORAGE_KEY = "cadastros-marcas-modelos-equipamentos";

export const defaultEquipmentCategories = ["Computadores", "Redes", "Impressoras", "Telefonia", "Perifericos"];

export const emptyEmailSettings = {
  accountType: "IMAP",
  domain: "",
  incomingServer: "",
  incomingPort: "",
  outgoingServer: "",
  outgoingPort: "",
  security: "Automatico",
  smtpAuth: false
};

export const emptyNetworkSettings = {
  serverHostname: "",
  localDomain: "",
  serverIp: "",
  subnetMask: "",
  dns: "",
  wins: ""
};

export const emptyClient = {
  id: "",
  name: "",
  document: "",
  phone: "",
  email: "",
  city: "",
  status: "Ativo",
  address: "",
  notes: "",
  equipment: [],
  emails: [],
  emailSettings: emptyEmailSettings,
  networkSettings: emptyNetworkSettings,
  updatedAt: ""
};

export function normalizeClient(client) {
  return {
    ...emptyClient,
    ...client,
    equipment: Array.isArray(client.equipment) ? client.equipment : [],
    emails: Array.isArray(client.emails) ? client.emails : [],
    emailSettings: {
      ...emptyEmailSettings,
      ...(client.emailSettings ?? {})
    },
    networkSettings: {
      ...emptyNetworkSettings,
      ...(client.networkSettings ?? {})
    }
  };
}

export function uniqueCategories(categories) {
  return [...new Set(categories.filter(Boolean).map((category) => category.trim()))];
}

export async function createClient({ state, persistClients, normalizeClient, createId, data }) {
  const client = normalizeClient({
    id: createId("CLI"),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  state.clients = [client, ...state.clients];
  persistClients();
  return client;
}

export async function updateClient({ state, persistClients, normalizeClient, clientId, data }) {
  let updatedClient = null;
  state.clients = state.clients.map((client) => {
    if (client.id !== clientId) {
      return client;
    }

    updatedClient = normalizeClient({
      ...client,
      ...data,
      updatedAt: new Date().toISOString()
    });
    return updatedClient;
  });
  persistClients();
  return updatedClient;
}

export async function deleteClient({ state, persistClients, clientId }) {
  state.clients = state.clients.filter((client) => client.id !== clientId);
  persistClients();
}

export async function listClients({ state }) {
  return state.clients;
}
