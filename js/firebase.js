export const LEGACY_FIREBASE_STATE_COLLECTION = "appState";
export const LEGACY_FIREBASE_STATE_DOCUMENT = "main";

export const collections = {
  users: "users",
  clients: "clients",
  serviceOrders: "serviceOrders",
  agenda: "agenda",
  logs: "logs",
  authorizationRequests: "authorizationRequests",
  equipmentCategories: "equipmentCategories",
  equipmentBrandModels: "equipmentBrandModels",
  counters: "counters",
  serviceOrderEquipmentTypes: "serviceOrderEquipmentTypes",
  externalRepairLocations: "externalRepairLocations"
};

export function getFirebaseConfig() {
  return window.firebaseConfig ?? { enabled: false };
}

export function isFirebaseEnabled() {
  return Boolean(getFirebaseConfig().enabled);
}

export function getFirebaseLoginEmail(login) {
  const config = getFirebaseConfig();
  const mappedEmail = config.authUsers?.[login] || config.authUsers?.[normalizeLogin(login)];

  if (mappedEmail) {
    return mappedEmail;
  }

  if (login.includes("@")) {
    return login;
  }

  return `${normalizeLogin(login).replace(/\s+/g, "")}@${config.authEmailDomain || "sistema.local"}`;
}

export function getFirebaseAuthErrorMessage(error) {
  const code = error?.code || "";

  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Login ou senha do Firebase incorretos.";
  }

  if (code === "auth/unauthorized-domain") {
    return "Dominio nao autorizado no Firebase.";
  }

  if (code === "auth/too-many-requests") {
    return "Muitas tentativas. Aguarde alguns minutos.";
  }

  return "Login nao autorizado no Firebase.";
}

export function getFirebaseCollectionName(localStorageKey) {
  const collectionByKey = {
    "cadastros-usuarios": collections.users,
    "cadastros-clientes": collections.clients,
    "cadastros-ordens-servico": collections.serviceOrders,
    "cadastros-agenda": collections.agenda,
    "cadastros-logs": collections.logs,
    "cadastros-autorizacoes": collections.authorizationRequests,
    "cadastros-categorias-equipamentos": collections.equipmentCategories,
    "cadastros-marcas-modelos-equipamentos": collections.equipmentBrandModels,
    "cadastros-tipos-equipamento-os": collections.serviceOrderEquipmentTypes,
    "cadastros-locais-conserto-externo": collections.externalRepairLocations,
    "cadastros-ordens-servico-contador": collections.counters
  };

  return collectionByKey[localStorageKey] || "";
}

export function getCollectionItemId(collectionName, item, index = 0) {
  if (collectionName === collections.equipmentCategories || collectionName === collections.serviceOrderEquipmentTypes) {
    return slugifyId(String(item));
  }

  if (collectionName === collections.externalRepairLocations) {
    return slugifyId(String(item));
  }

  if (collectionName === collections.equipmentBrandModels) {
    return slugifyId(item.brand || `brand-${index}`);
  }

  return item.id || `item-${index}`;
}

export function serializeCollectionItem(collectionName, item) {
  if (
    collectionName === collections.equipmentCategories ||
    collectionName === collections.serviceOrderEquipmentTypes ||
    collectionName === collections.externalRepairLocations
  ) {
    return { value: item };
  }

  return item;
}

export function deserializeCollectionItem(collectionName, docData) {
  if (
    collectionName === collections.equipmentCategories ||
    collectionName === collections.serviceOrderEquipmentTypes ||
    collectionName === collections.externalRepairLocations
  ) {
    return docData.value;
  }

  return docData;
}

function slugifyId(value) {
  return String(value || "item")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "item";
}

function normalizeLogin(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
