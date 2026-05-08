const STORAGE_KEY = "cadastros-clientes";
const CATEGORY_STORAGE_KEY = "cadastros-categorias-equipamentos";
const BRAND_MODEL_STORAGE_KEY = "cadastros-marcas-modelos-equipamentos";
const USER_STORAGE_KEY = "cadastros-usuarios";
const LOG_STORAGE_KEY = "cadastros-logs";
const AGENDA_STORAGE_KEY = "cadastros-agenda";
const AGENDA_COUNTER_STORAGE_KEY = "cadastros-agenda-contador";
const SERVICE_ORDER_STORAGE_KEY = "cadastros-ordens-servico";
const SERVICE_ORDER_COUNTER_STORAGE_KEY = "cadastros-ordens-servico-contador";
const SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY = "cadastros-tipos-equipamento-os";
const EXTERNAL_REPAIR_LOCATION_STORAGE_KEY = "cadastros-locais-conserto-externo";
const EMAIL_TYPE_STORAGE_KEY = "cadastros-tipos-email";
const AUTHORIZATION_STORAGE_KEY = "cadastros-autorizacoes";
const SESSION_STORAGE_KEY = "cadastros-admin-logado";
const ADMIN_USER = "administrador";
const NEW_CATEGORY_VALUE = "__new_category__";
const NEW_BRAND_MODEL_VALUE = "__new_brand_model__";
const NEW_SERVICE_ORDER_EQUIPMENT_TYPE_VALUE = "__new_service_order_equipment_type__";
const NEW_EMAIL_TYPE_VALUE = "__new_email_type__";
const serviceOrderStatuses = ["Aberta", "Em analise", "Aguardando orcamento", "Em conserto", "Fechada", "Concluida", "Cancelada"];
const agendaStatuses = ["Aberto", "Em analise", "Concluido", "Cancelado"];
const defaultServiceOrderEquipmentTypes = ["Notebook", "Computador", "All-In-One", "Impressora"];
const defaultEmailTypes = ["Comercial", "Financeiro", "Suporte", "Pessoal"];

async function createAgendaItem({ state, persistAgendaItems, createId, payload }) {
  const item = {
    id: createId("AGE"),
    number: payload.number,
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

  state.agendaItems = [item, ...state.agendaItems];
  persistAgendaItems();
  return item;
}

async function createServiceOrderRecord({ state, persistServiceOrders, getNextServiceOrderNumber, createId, order }) {
  const serviceOrder = {
    id: createId("OS"),
    number: getNextServiceOrderNumber(),
    ...order,
    createdAt: new Date().toISOString(),
    updatedAt: ""
  };

  state.serviceOrders = [serviceOrder, ...state.serviceOrders];
  persistServiceOrders();
  return serviceOrder;
}

async function updateServiceOrderRecord({ state, persistServiceOrders, orderId, data }) {
  let updatedOrder = null;
  state.serviceOrders = state.serviceOrders.map((order) => {
    if (order.id !== orderId) {
      return order;
    }

    updatedOrder = {
      ...order,
      ...data,
      updatedAt: new Date().toISOString()
    };
    return updatedOrder;
  });

  persistServiceOrders();
  return updatedOrder;
}

function getNextServiceOrderStatusValue(status) {
  const currentIndex = serviceOrderStatuses.indexOf(status);

  if (currentIndex === -1 || currentIndex === serviceOrderStatuses.length - 1) {
    return serviceOrderStatuses[0];
  }

  return serviceOrderStatuses[currentIndex + 1];
}

async function createLogRecord({ state, persistLogs, createId, currentUser, action, details = "" }) {
  const log = {
    id: createId("LOG"),
    action,
    details,
    actor: currentUser?.name || "Sistema",
    login: currentUser?.login || "sistema",
    createdAt: new Date().toISOString()
  };

  state.logs = [log, ...state.logs].slice(0, 250);
  persistLogs();
  return log;
}
const cloudStorageKeys = [
  STORAGE_KEY,
  CATEGORY_STORAGE_KEY,
  BRAND_MODEL_STORAGE_KEY,
  USER_STORAGE_KEY,
  LOG_STORAGE_KEY,
  AGENDA_STORAGE_KEY,
  AGENDA_COUNTER_STORAGE_KEY,
  SERVICE_ORDER_STORAGE_KEY,
  SERVICE_ORDER_COUNTER_STORAGE_KEY,
  SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY,
  EXTERNAL_REPAIR_LOCATION_STORAGE_KEY,
  EMAIL_TYPE_STORAGE_KEY,
  AUTHORIZATION_STORAGE_KEY
];
const dashboardSections = [
  { id: "overview", label: "Dashboard" },
  { id: "clients", label: "Cadastro de clientes" },
  { id: "agenda", label: "Agenda" },
  { id: "serviceOrders", label: "Ordem de Servico" },
  { id: "users", label: "Usuarios" },
  { id: "logs", label: "Logs" },
  { id: "permissions", label: "Permissoes" },
  { id: "reports", label: "Relatorios" },
  { id: "settings", label: "Configuracoes" }
];
const defaultEquipmentCategories = ["Computadores", "Redes", "Impressoras", "Telefonia", "Perifericos"];
const emptyEmailSettings = {
  accountType: "IMAP",
  domain: "",
  incomingServer: "",
  incomingPort: "",
  outgoingServer: "",
  outgoingPort: "",
  security: "Automatico",
  smtpAuth: false
};
const emptyNetworkSettings = {
  serverHostname: "",
  localDomain: "",
  serverIp: "",
  subnetMask: "",
  dns: "",
  wins: ""
};

const emptyClient = {
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

let clients = loadClients();
let equipmentCategories = loadEquipmentCategories();
let equipmentBrandModels = loadEquipmentBrandModels();
let users = loadUsers();
let logs = loadLogs();
let agendaItems = loadAgendaItems();
let agendaCounter = loadAgendaCounter();
agendaItems = ensureAgendaNumbers(agendaItems);
agendaCounter = loadAgendaCounter();
let serviceOrders = loadServiceOrders();
let serviceOrderCounter = loadServiceOrderCounter();
let serviceOrderEquipmentTypes = loadServiceOrderEquipmentTypes();
let externalRepairLocations = loadExternalRepairLocations();
let emailTypes = loadEmailTypes();
let authorizationRequests = loadAuthorizationRequests();
let selectedId = clients[0]?.id ?? "";
let activeTab = "profile";
let activeDashboardTab = "overview";
let activeServiceOrderView = "list";
let editingEmailSettings = false;
let editingNetworkSettings = false;
let editingAgendaId = "";
let editingEquipmentId = "";
let editingEmailId = "";
let editingServiceOrderId = "";
let editingPasswordUserId = "";
let permissionDrafts = {};
let currentUser = loadSessionUser();
let isAdminLoggedIn = currentUser?.role === "admin";
let firebaseDb = null;
let firebaseAuth = null;
let firebaseSyncEnabled = false;
let firebaseAuthRequired = false;
let firebaseHydrating = false;

const appState = {
  get clients() {
    return clients;
  },
  set clients(value) {
    clients = value;
  },
  get serviceOrders() {
    return serviceOrders;
  },
  set serviceOrders(value) {
    serviceOrders = value;
  },
  get agendaItems() {
    return agendaItems;
  },
  set agendaItems(value) {
    agendaItems = value;
  },
  get logs() {
    return logs;
  },
  set logs(value) {
    logs = value;
  }
};

const welcomeScreen = document.querySelector("#welcomeScreen");
const appScreen = document.querySelector("#appScreen");
const loginForm = document.querySelector("#loginForm");
const loginUser = document.querySelector("#loginUser");
const loginPassword = document.querySelector("#loginPassword");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const adminStatus = document.querySelector(".user-name");
const notificationButton = document.querySelector("#notificationButton");
const notificationCount = document.querySelector("#notificationCount");
const notificationPanel = document.querySelector("#notificationPanel");
const notificationList = document.querySelector("#notificationList");
const dashboardClientTotal = document.querySelector("#dashboardClientTotal");
const dashboardUserTotal = document.querySelector("#dashboardUserTotal");
const dashboardLogTotal = document.querySelector("#dashboardLogTotal");
const dashboardAgendaTotal = document.querySelector("#dashboardAgendaTotal");
const userForm = document.querySelector("#userForm");
const userMessage = document.querySelector("#userMessage");
const userList = document.querySelector("#userList");
const logList = document.querySelector("#logList");
const permissionList = document.querySelector("#permissionList");
const openAgendaDialogButton = document.querySelector("#openAgendaDialogButton");
const agendaActionMessage = document.querySelector("#agendaActionMessage");
const agendaDialog = document.querySelector("#agendaDialog");
const agendaForm = document.querySelector("#agendaForm");
const agendaDialogTitle = document.querySelector("#agendaDialogTitle");
const agendaClient = document.querySelector("#agendaClient");
const closeAgendaDialogButton = document.querySelector("#closeAgendaDialogButton");
const agendaDialogMessage = document.querySelector("#agendaDialogMessage");
const agendaSubmitButton = document.querySelector("#agendaSubmitButton");
const agendaList = document.querySelector("#agendaList");
const agendaSearchInput = document.querySelector("#agendaSearchInput");
const agendaStatusFilter = document.querySelector("#agendaStatusFilter");
const serviceOrderForm = document.querySelector("#serviceOrderForm");
const serviceOrderFormTitle = document.querySelector("#serviceOrderFormTitle");
const serviceOrderSubmitButton = document.querySelector("#serviceOrderSubmitButton");
const serviceOrderViewButtons = document.querySelectorAll(".service-order-tab");
const serviceOrderListPanel = document.querySelector("#serviceOrderListPanel");
const serviceOrderStatusFilter = document.querySelector("#serviceOrderStatusFilter");
const serviceOrderSearchInput = document.querySelector("#serviceOrderSearchInput");
const serviceOrderClient = document.querySelector("#serviceOrderClient");
const serviceOrderEquipment = document.querySelector("#serviceOrderEquipment");
const newServiceOrderEquipmentTypeLabel = document.querySelector("#newServiceOrderEquipmentTypeLabel");
const newServiceOrderEquipmentType = document.querySelector("#newServiceOrderEquipmentType");
const computerServiceOrderFields = document.querySelector("#computerServiceOrderFields");
const powerSupplyServiceOrderFields = document.querySelector("#powerSupplyServiceOrderFields");
const serviceOrderPowerSupplyYes = document.querySelector("#serviceOrderPowerSupplyYes");
const serviceOrderPowerSupplyNo = document.querySelector("#serviceOrderPowerSupplyNo");
const serviceOrderBrandModel = document.querySelector("#serviceOrderBrandModel");
const serviceOrderSerialNumber = document.querySelector("#serviceOrderSerialNumber");
const serviceOrderProcessor = document.querySelector("#serviceOrderProcessor");
const serviceOrderMemory = document.querySelector("#serviceOrderMemory");
const serviceOrderMemoryDdr = document.querySelector("#serviceOrderMemoryDdr");
const serviceOrderStorageType = document.querySelector("#serviceOrderStorageType");
const serviceOrderWindowsType = document.querySelector("#serviceOrderWindowsType");
const serviceOrderExternalRepair = document.querySelector("#serviceOrderExternalRepair");
const externalRepairLocationWrap = document.querySelector("#externalRepairLocationWrap");
const externalRepairLocation = document.querySelector("#externalRepairLocation");
const addExternalRepairLocationButton = document.querySelector("#addExternalRepairLocationButton");
const externalRepairLocationActions = document.querySelector("#externalRepairLocationActions");
const confirmExternalRepairLocationButton = document.querySelector("#confirmExternalRepairLocationButton");
const cancelExternalRepairLocationButton = document.querySelector("#cancelExternalRepairLocationButton");
const newExternalRepairLocationLabel = document.querySelector("#newExternalRepairLocationLabel");
const newExternalRepairLocation = document.querySelector("#newExternalRepairLocation");
const serviceOrderEquipmentNotes = document.querySelector("#serviceOrderEquipmentNotes");
const serviceOrderMessage = document.querySelector("#serviceOrderMessage");
const serviceOrderList = document.querySelector("#serviceOrderList");
const form = document.querySelector("#clientForm");
const equipmentForm = document.querySelector("#equipmentForm");
const networkSettingsForm = document.querySelector("#networkSettingsForm");
const emailSettingsForm = document.querySelector("#emailSettingsForm");
const emailForm = document.querySelector("#emailForm");
const networkSettingsGuide = document.querySelector("#networkSettingsGuide");
const networkSettingsSummary = document.querySelector("#networkSettingsSummary");
const editNetworkSettingsButton = document.querySelector("#editNetworkSettingsButton");
const emailSettingsGuide = document.querySelector("#emailSettingsGuide");
const emailSettingsSummary = document.querySelector("#emailSettingsSummary");
const editEmailSettingsButton = document.querySelector("#editEmailSettingsButton");
const list = document.querySelector("#clientList");
const searchInput = document.querySelector("#searchInput");
const selectedTitle = document.querySelector("#selectedTitle");
const clientCount = document.querySelector("#clientCount");
const updatedAt = document.querySelector("#updatedAt");
const clientId = document.querySelector("#clientId");
const clientActionMessage = document.querySelector("#clientActionMessage");
const newClientButton = document.querySelector("#newClientButton");
const deleteClientButton = document.querySelector("#deleteClientButton");
const emptyStateTemplate = document.querySelector("#emptyStateTemplate");
const emptyRecordsTemplate = document.querySelector("#emptyRecordsTemplate");
const equipmentList = document.querySelector("#equipmentList");
const emailList = document.querySelector("#emailList");
const extraEmailType = document.querySelector("#extraEmailType");
const newEmailTypeLabel = document.querySelector("#newEmailTypeLabel");
const newEmailType = document.querySelector("#newEmailType");
const equipmentFilter = document.querySelector("#equipmentFilter");
const equipmentCategory = document.querySelector("#equipmentCategory");
const newCategoryLabel = document.querySelector("#newCategoryLabel");
const newEquipmentCategory = document.querySelector("#newEquipmentCategory");
const equipmentBrand = document.querySelector("#equipmentBrand");
const equipmentModel = document.querySelector("#equipmentModel");
const newEquipmentBrandModel = document.querySelector("#newEquipmentBrandModel");
const newEquipmentBrand = document.querySelector("#newEquipmentBrand");
const newEquipmentModel = document.querySelector("#newEquipmentModel");
const equipmentNetworkType = document.querySelector("#equipmentNetworkType");
const equipmentIpLabel = document.querySelector("#equipmentIpLabel");
const equipmentIp = document.querySelector("#equipmentIp");
const equipmentDialog = document.querySelector("#equipmentDialog");
const editEquipmentForm = document.querySelector("#editEquipmentForm");
const editEquipmentCategory = document.querySelector("#editEquipmentCategory");
const editEquipmentBrand = document.querySelector("#editEquipmentBrand");
const editEquipmentModel = document.querySelector("#editEquipmentModel");
const editNewEquipmentBrandModel = document.querySelector("#editNewEquipmentBrandModel");
const editNewEquipmentBrand = document.querySelector("#editNewEquipmentBrand");
const editNewEquipmentModel = document.querySelector("#editNewEquipmentModel");
const editEquipmentNetworkType = document.querySelector("#editEquipmentNetworkType");
const editEquipmentIpLabel = document.querySelector("#editEquipmentIpLabel");
const editEquipmentIp = document.querySelector("#editEquipmentIp");
const printerFields = document.querySelector("#printerFields");
const computerFields = document.querySelector("#computerFields");
const networkEquipmentFields = document.querySelector("#networkEquipmentFields");
const closeEquipmentDialogButton = document.querySelector("#closeEquipmentDialogButton");
const deleteEquipmentButton = document.querySelector("#deleteEquipmentButton");
const equipmentActionMessage = document.querySelector("#equipmentActionMessage");
const passwordDialog = document.querySelector("#passwordDialog");
const passwordForm = document.querySelector("#passwordForm");
const passwordDialogTitle = document.querySelector("#passwordDialogTitle");
const closePasswordDialogButton = document.querySelector("#closePasswordDialogButton");
const passwordMessage = document.querySelector("#passwordMessage");
const dashboardTabs = document.querySelectorAll(".dashboard-tab");
const tabs = document.querySelectorAll(".tab");
const dashboardPanels = {
  overview: document.querySelector("#overviewDashboardPanel"),
  clients: document.querySelector("#clientsDashboardPanel"),
  agenda: document.querySelector("#agendaDashboardPanel"),
  serviceOrders: document.querySelector("#serviceOrdersDashboardPanel"),
  users: document.querySelector("#usersDashboardPanel"),
  logs: document.querySelector("#logsDashboardPanel"),
  permissions: document.querySelector("#permissionsDashboardPanel"),
  reports: document.querySelector("#reportsDashboardPanel"),
  settings: document.querySelector("#settingsDashboardPanel")
};
const panels = {
  profile: document.querySelector("#profilePanel"),
  equipment: document.querySelector("#equipmentPanel"),
  network: document.querySelector("#networkPanel"),
  emails: document.querySelector("#emailsPanel")
};

const fields = {
  name: document.querySelector("#name"),
  document: document.querySelector("#document"),
  phone: document.querySelector("#phone"),
  email: document.querySelector("#email"),
  city: document.querySelector("#city"),
  status: document.querySelector("#status"),
  address: document.querySelector("#address"),
  notes: document.querySelector("#notes")
};

const emailSettingsFields = {
  accountType: document.querySelector("#emailAccountType"),
  domain: document.querySelector("#emailDomain"),
  incomingServer: document.querySelector("#incomingServer"),
  incomingPort: document.querySelector("#incomingPort"),
  outgoingServer: document.querySelector("#outgoingServer"),
  outgoingPort: document.querySelector("#outgoingPort"),
  security: document.querySelector("#emailSecurity"),
  smtpAuth: document.querySelector("#smtpAuth")
};

const networkSettingsFields = {
  serverHostname: document.querySelector("#serverHostname"),
  localDomain: document.querySelector("#localDomain"),
  serverIp: document.querySelector("#serverIp"),
  subnetMask: document.querySelector("#subnetMask"),
  dns: document.querySelector("#dns"),
  wins: document.querySelector("#wins")
};

loginForm.addEventListener("submit", loginAdmin);
logoutButton.addEventListener("click", logoutAdmin);
notificationButton.addEventListener("click", () => notificationPanel.classList.toggle("hidden"));
userForm.addEventListener("submit", createUser);
passwordForm.addEventListener("submit", saveChangedPassword);
agendaForm.addEventListener("submit", addAgendaItem);
openAgendaDialogButton.addEventListener("click", openAgendaDialog);
closeAgendaDialogButton.addEventListener("click", () => agendaDialog.close());
agendaSearchInput.addEventListener("input", renderAgendaItems);
agendaStatusFilter.addEventListener("change", renderAgendaItems);
serviceOrderForm.addEventListener("submit", addServiceOrder);
document.querySelector("#cancelServiceOrderButton").addEventListener("click", resetServiceOrderForm);
serviceOrderStatusFilter.addEventListener("change", renderServiceOrders);
serviceOrderSearchInput.addEventListener("input", renderServiceOrders);
serviceOrderViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.serviceOrderView === "create") {
      startNewServiceOrder();
      return;
    }

    switchServiceOrderView("list");
  });
});
serviceOrderEquipment.addEventListener("change", toggleComputerServiceOrderFields);
serviceOrderPowerSupplyYes.addEventListener("change", () => togglePowerSupplyOption(serviceOrderPowerSupplyYes));
serviceOrderPowerSupplyNo.addEventListener("change", () => togglePowerSupplyOption(serviceOrderPowerSupplyNo));
serviceOrderExternalRepair.addEventListener("change", toggleExternalRepairLocationFields);
addExternalRepairLocationButton.addEventListener("click", showExternalRepairLocationInput);
confirmExternalRepairLocationButton.addEventListener("click", saveExternalRepairLocation);
cancelExternalRepairLocationButton.addEventListener("click", cancelExternalRepairLocationInput);
form.addEventListener("submit", saveClient);
equipmentForm.addEventListener("submit", addEquipment);
editEquipmentForm.addEventListener("submit", saveEditedEquipment);
networkSettingsForm.addEventListener("submit", saveNetworkSettings);
emailSettingsForm.addEventListener("submit", saveEmailSettings);
emailForm.addEventListener("submit", addEmail);
extraEmailType.addEventListener("change", toggleNewEmailTypeField);
editNetworkSettingsButton.addEventListener("click", () => {
  if (!requireModify("clients")) {
    return;
  }

  editingNetworkSettings = true;
  renderNetworkSettingsMode(getSelectedClient().networkSettings);
});
editEmailSettingsButton.addEventListener("click", () => {
  if (!requireModify("clients")) {
    return;
  }

  editingEmailSettings = true;
  renderEmailSettingsMode(getSelectedClient().emailSettings);
});
equipmentCategory.addEventListener("change", toggleNewCategoryField);
equipmentBrand.addEventListener("change", () => {
  renderModelOptions(equipmentBrand, equipmentModel);
  toggleNewBrandModelFields(newEquipmentBrandModel, newEquipmentBrand, newEquipmentModel, equipmentBrand, equipmentModel);
});
equipmentModel.addEventListener("change", () =>
  toggleNewBrandModelFields(newEquipmentBrandModel, newEquipmentBrand, newEquipmentModel, equipmentBrand, equipmentModel)
);
equipmentNetworkType.addEventListener("change", () => toggleEquipmentIpField(equipmentNetworkType, equipmentIpLabel, equipmentIp));
editEquipmentCategory.addEventListener("change", renderEquipmentExtraFields);
editEquipmentBrand.addEventListener("change", () => {
  renderModelOptions(editEquipmentBrand, editEquipmentModel);
  toggleNewBrandModelFields(editNewEquipmentBrandModel, editNewEquipmentBrand, editNewEquipmentModel, editEquipmentBrand, editEquipmentModel);
});
editEquipmentModel.addEventListener("change", () =>
  toggleNewBrandModelFields(editNewEquipmentBrandModel, editNewEquipmentBrand, editNewEquipmentModel, editEquipmentBrand, editEquipmentModel)
);
editEquipmentNetworkType.addEventListener("change", () => toggleEquipmentIpField(editEquipmentNetworkType, editEquipmentIpLabel, editEquipmentIp));
closeEquipmentDialogButton.addEventListener("click", closeEquipmentDialog);
deleteEquipmentButton.addEventListener("click", deleteEditingEquipment);
closePasswordDialogButton.addEventListener("click", closePasswordDialog);
equipmentFilter.addEventListener("input", renderRelatedRecords);
searchInput.addEventListener("input", renderList);
newClientButton.addEventListener("click", startNewClient);
deleteClientButton.addEventListener("click", deleteSelectedClient);
dashboardTabs.forEach((tab) => tab.addEventListener("click", () => switchDashboardTab(tab.dataset.dashboardTab)));
tabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));
document.addEventListener("click", handlePasswordToggleClick);

renderAuth();
render();
initializeFirebaseSync();
window.suporteTiAppReady = true;

function loadClients() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsedClients = JSON.parse(stored);
    return parsedClients.map(normalizeClient);
  } catch {
    return [];
  }
}

function loadEquipmentCategories() {
  const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);

  if (!stored) {
    return [...defaultEquipmentCategories];
  }

  try {
    const parsedCategories = JSON.parse(stored);
    const categories = Array.isArray(parsedCategories) ? parsedCategories : [];
    return uniqueCategories([...defaultEquipmentCategories, ...categories]);
  } catch {
    return [...defaultEquipmentCategories];
  }
}

function loadEquipmentBrandModels() {
  const stored = localStorage.getItem(BRAND_MODEL_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsedItems = JSON.parse(stored);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
}

function loadUsers() {
  const stored = localStorage.getItem(USER_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(stored);
    return Array.isArray(parsedUsers) ? parsedUsers.map(normalizeUser) : [];
  } catch {
    return [];
  }
}

function normalizeUser(user) {
  return {
    id: user.id || createId("USR"),
    uid: user.uid || "",
    email: user.email || "",
    name: user.name || "Usuario sem nome",
    login: user.login || "",
    password: "",
    active: user.active !== false,
    role: user.role || "user",
    fullControl: Boolean(user.fullControl),
    permissions: {
      ...createDefaultPermissions(),
      ...(user.permissions ?? {})
    },
    createdAt: user.createdAt || new Date().toISOString()
  };
}

function createDefaultPermissions() {
  return dashboardSections.reduce((permissions, section) => {
    permissions[section.id] = {
      access: section.id === "overview" || section.id === "clients",
      modify: false
    };
    return permissions;
  }, {});
}

function loadLogs() {
  const stored = localStorage.getItem(LOG_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsedLogs = JSON.parse(stored);
    return Array.isArray(parsedLogs) ? parsedLogs : [];
  } catch {
    return [];
  }
}

function loadServiceOrders() {
  const stored = localStorage.getItem(SERVICE_ORDER_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsedOrders = JSON.parse(stored);
    return Array.isArray(parsedOrders) ? parsedOrders : [];
  } catch {
    return [];
  }
}

function loadServiceOrderCounter() {
  const storedCounter = Number(localStorage.getItem(SERVICE_ORDER_COUNTER_STORAGE_KEY));

  if (Number.isInteger(storedCounter) && storedCounter > 0) {
    return storedCounter;
  }

  const highestExistingNumber = serviceOrders.reduce((highest, order) => {
    const orderNumber = Number(order.number);
    return Number.isInteger(orderNumber) && orderNumber > highest ? orderNumber : highest;
  }, 0);

  return highestExistingNumber + 1;
}

function loadAgendaCounter() {
  const storedCounter = Number(localStorage.getItem(AGENDA_COUNTER_STORAGE_KEY));

  if (Number.isInteger(storedCounter) && storedCounter > 0) {
    return storedCounter;
  }

  const highestExistingNumber = agendaItems.reduce((highest, item) => {
    const agendaNumber = Number(item.number);
    return Number.isInteger(agendaNumber) && agendaNumber > highest ? agendaNumber : highest;
  }, 0);

  return highestExistingNumber + 1;
}

function ensureAgendaNumbers(items) {
  let nextNumber = items.reduce((highest, item) => {
    const agendaNumber = Number(item.number);
    return Number.isInteger(agendaNumber) && agendaNumber > highest ? agendaNumber : highest;
  }, 0);

  return items.map((item) => {
    if (Number.isInteger(Number(item.number)) && Number(item.number) > 0) {
      return item;
    }

    nextNumber += 1;
    return {
      ...item,
      number: nextNumber
    };
  });
}

function loadServiceOrderEquipmentTypes() {
  const stored = localStorage.getItem(SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY);

  if (!stored) {
    return defaultServiceOrderEquipmentTypes;
  }

  try {
    const parsedTypes = JSON.parse(stored);
    return Array.isArray(parsedTypes) ? uniqueServiceOrderEquipmentTypes([...defaultServiceOrderEquipmentTypes, ...parsedTypes]) : defaultServiceOrderEquipmentTypes;
  } catch {
    return defaultServiceOrderEquipmentTypes;
  }
}

function loadEmailTypes() {
  const stored = localStorage.getItem(EMAIL_TYPE_STORAGE_KEY);

  if (!stored) {
    return defaultEmailTypes;
  }

  try {
    const parsedTypes = JSON.parse(stored);
    return Array.isArray(parsedTypes) ? uniqueTextOptions([...defaultEmailTypes, ...parsedTypes]) : defaultEmailTypes;
  } catch {
    return defaultEmailTypes;
  }
}

function loadExternalRepairLocations() {
  const stored = localStorage.getItem(EXTERNAL_REPAIR_LOCATION_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsedLocations = JSON.parse(stored);
    return Array.isArray(parsedLocations) ? parsedLocations : [];
  } catch {
    return [];
  }
}

function loadAgendaItems() {
  const stored = localStorage.getItem(AGENDA_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsedItems = JSON.parse(stored);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
}

function loadAuthorizationRequests() {
  const stored = localStorage.getItem(AUTHORIZATION_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsedItems = JSON.parse(stored);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
}

function loadSessionUser() {
  const storedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  if (storedSession === "true") {
    return { login: ADMIN_USER, name: "Administrador", role: "admin" };
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    return null;
  }
}

function normalizeClient(client) {
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

function initializeFirebaseSync() {
  const config = window.firebaseConfig;

  if (!config?.enabled) {
    return;
  }

  if (!window.firebase?.initializeApp || !window.firebase?.firestore) {
    console.warn("Firebase nao foi carregado. O sistema seguira usando dados locais.");
    return;
  }

  try {
    window.firebase.initializeApp(config);
    firebaseDb = window.firebase.firestore();
    firebaseAuth = window.firebase.auth ? window.firebase.auth() : null;
    firebaseAuthRequired = Boolean(config.requireAuth);
    firebaseSyncEnabled = true;
    if (!firebaseAuthRequired || firebaseAuth?.currentUser) {
      hydrateFromFirebase();
    }
  } catch (error) {
    console.warn("Nao foi possivel iniciar o Firebase. O sistema seguira usando dados locais.", error);
  }
}

function getFirestoreCollectionName(key) {
  const collectionByKey = {
    [USER_STORAGE_KEY]: "users",
    [STORAGE_KEY]: "clients",
    [SERVICE_ORDER_STORAGE_KEY]: "serviceOrders",
    [AGENDA_STORAGE_KEY]: "agenda",
    [LOG_STORAGE_KEY]: "logs",
    [AUTHORIZATION_STORAGE_KEY]: "authorizationRequests",
    [CATEGORY_STORAGE_KEY]: "equipmentCategories",
    [BRAND_MODEL_STORAGE_KEY]: "equipmentBrandModels",
    [SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY]: "serviceOrderEquipmentTypes",
    [EXTERNAL_REPAIR_LOCATION_STORAGE_KEY]: "externalRepairLocations",
    [EMAIL_TYPE_STORAGE_KEY]: "emailTypes",
    [SERVICE_ORDER_COUNTER_STORAGE_KEY]: "counters",
    [AGENDA_COUNTER_STORAGE_KEY]: "counters"
  };

  return collectionByKey[key] || "";
}

function getCollectionItemId(collectionName, item, index = 0) {
  if (["equipmentCategories", "serviceOrderEquipmentTypes", "externalRepairLocations", "emailTypes"].includes(collectionName)) {
    return slugifyId(String(item));
  }

  if (collectionName === "equipmentBrandModels") {
    return slugifyId(item.brand || `brand-${index}`);
  }

  if (collectionName === "counters") {
    return "serviceOrders";
  }

  if (collectionName === "users") {
    return item.uid || item.id || slugifyId(item.login || `user-${index}`);
  }

  return item.id || `item-${index}`;
}

function serializeCollectionItem(collectionName, item) {
  if (["equipmentCategories", "serviceOrderEquipmentTypes", "externalRepairLocations", "emailTypes"].includes(collectionName)) {
    return { value: item };
  }

  if (collectionName === "counters") {
    return { value: Number(item || 1) };
  }

  return item;
}

function deserializeCollectionItem(collectionName, docData) {
  if (["equipmentCategories", "serviceOrderEquipmentTypes", "externalRepairLocations", "emailTypes"].includes(collectionName)) {
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

async function hydrateFromFirebase() {
  if (!firebaseSyncEnabled) {
    return;
  }

  try {
    firebaseHydrating = true;
    await migrateLegacyAppState();
    await Promise.all(cloudStorageKeys.map((key) => hydrateCollectionToLocalState(key)));
    reloadStateFromLocalStorage();
    renderAuth();
    render();
  } catch (error) {
    console.warn("Nao foi possivel sincronizar com o Firebase.", error);
  } finally {
    firebaseHydrating = false;
  }
}

async function uploadLocalStateToFirebase() {
  await Promise.all(cloudStorageKeys.map((key) => syncStateToFirebase(key, readLocalState(key))));
}

async function hydrateCollectionToLocalState(key) {
  const collectionName = getFirestoreCollectionName(key);

  if (!collectionName) {
    return;
  }

  if (collectionName === "counters") {
    const counterDoc = await firebaseDb.collection(collectionName).doc(getCounterDocumentId(key)).get();
    if (counterDoc.exists) {
      writeLocalState(key, counterDoc.data().value || 1);
    }
    return;
  }

  const snapshot = await firebaseDb.collection(collectionName).get();

  if (snapshot.empty) {
    return;
  }

  const items = snapshot.docs.map((doc) => deserializeCollectionItem(collectionName, { id: doc.id, ...doc.data() })).filter((item) => item !== undefined);
  writeLocalState(key, items);
}

async function migrateLegacyAppState() {
  const legacyRef = firebaseDb.collection("appState").doc("main");
  const migratedRef = firebaseDb.collection("appState").doc("migration");
  const migratedSnapshot = await migratedRef.get();

  if (migratedSnapshot.exists && migratedSnapshot.data()?.collectionsMigrated) {
    return;
  }

  const legacySnapshot = await legacyRef.get();

  if (!legacySnapshot.exists) {
    await migratedRef.set({ collectionsMigrated: true, migratedAt: new Date().toISOString() }, { merge: true });
    return;
  }

  const legacyState = legacySnapshot.data() || {};
  await Promise.all(
    cloudStorageKeys.map((key) => {
      if (!Object.prototype.hasOwnProperty.call(legacyState, key)) {
        return Promise.resolve();
      }
      return syncStateToFirebase(key, legacyState[key], { force: true });
    })
  );
  await migratedRef.set({ collectionsMigrated: true, migratedAt: new Date().toISOString() }, { merge: true });
}

function getFirebaseLoginEmail(login) {
  const mappedEmail = window.firebaseConfig?.authUsers?.[login] || window.firebaseConfig?.authUsers?.[normalize(login)];

  if (mappedEmail) {
    return mappedEmail;
  }

  if (login.includes("@")) {
    return login;
  }

  const domain = window.firebaseConfig?.authEmailDomain || "sistema.local";
  return `${normalize(login).replace(/\s+/g, "")}@${domain}`;
}

async function signInFirebaseUser(login, password) {
  if (!firebaseSyncEnabled || !firebaseAuthRequired) {
    loginMessage.textContent = "Firebase Authentication precisa estar ativo.";
    return null;
  }

  if (!firebaseAuth) {
    loginMessage.textContent = "Firebase Authentication nao foi carregado.";
    return null;
  }

  const firebaseEmail = getFirebaseLoginEmail(login);

  try {
    const credential = await firebaseAuth.signInWithEmailAndPassword(firebaseEmail, password);
    return credential.user;
  } catch (error) {
    console.warn("Falha no login do Firebase.", error);
    loginMessage.textContent = `${getFirebaseAuthErrorMessage(error)} Firebase: ${firebaseEmail}. Codigo: ${error?.code || "desconhecido"}.`;
    loginPassword.value = "";
    loginPassword.focus();
    return null;
  }
}

function getFirebaseAuthErrorMessage(error) {
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

function readLocalState(key) {
  const value = localStorage.getItem(key);

  if (isCounterStorageKey(key)) {
    return Number(value || 1);
  }

  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function writeLocalState(key, value) {
  if (isCounterStorageKey(key)) {
    localStorage.setItem(key, String(value || 1));
    return;
  }

  if (value === null || value === undefined) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function persistState(key, value) {
  writeLocalState(key, value);
  syncStateToFirebase(key, value);
}

function syncStateToFirebase(key, value, options = {}) {
  if (!firebaseSyncEnabled || (firebaseHydrating && !options.force)) {
    return;
  }

  const collectionName = getFirestoreCollectionName(key);

  if (!collectionName) {
    return;
  }

  if (collectionName === "counters") {
    firebaseDb
      .collection(collectionName)
      .doc(getCounterDocumentId(key))
      .set({ value: Number(value || 1), updatedAt: new Date().toISOString() }, { merge: true })
      .catch((error) => console.warn("Nao foi possivel salvar contador no Firebase.", error));
    return;
  }

  const items = Array.isArray(value) ? value : [];
  syncCollection(collectionName, items).catch((error) => console.warn(`Nao foi possivel salvar ${collectionName} no Firebase.`, error));
}

function isCounterStorageKey(key) {
  return key === SERVICE_ORDER_COUNTER_STORAGE_KEY || key === AGENDA_COUNTER_STORAGE_KEY;
}

function getCounterDocumentId(key) {
  return key === AGENDA_COUNTER_STORAGE_KEY ? "agenda" : "serviceOrders";
}

async function syncCollection(collectionName, items) {
  const collectionRef = firebaseDb.collection(collectionName);
  const snapshot = await collectionRef.get();
  const nextIds = new Set(items.map((item, index) => getCollectionItemId(collectionName, item, index)));
  const batch = firebaseDb.batch();

  snapshot.docs.forEach((doc) => {
    if (!nextIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  items.forEach((item, index) => {
    const id = getCollectionItemId(collectionName, item, index);
    batch.set(collectionRef.doc(id), serializeCollectionItem(collectionName, item), { merge: false });
  });

  await batch.commit();
}

function reloadStateFromLocalStorage() {
  clients = loadClients();
  equipmentCategories = loadEquipmentCategories();
  equipmentBrandModels = loadEquipmentBrandModels();
  users = loadUsers();
  logs = loadLogs();
  agendaItems = ensureAgendaNumbers(loadAgendaItems());
  agendaCounter = loadAgendaCounter();
  serviceOrders = loadServiceOrders();
  serviceOrderCounter = loadServiceOrderCounter();
  serviceOrderEquipmentTypes = loadServiceOrderEquipmentTypes();
  externalRepairLocations = loadExternalRepairLocations();
  emailTypes = loadEmailTypes();
  authorizationRequests = loadAuthorizationRequests();
  selectedId = clients.some((client) => client.id === selectedId) ? selectedId : clients[0]?.id ?? "";
}

function persistClients() {
  persistState(STORAGE_KEY, clients);
}

function persistEquipmentCategories() {
  persistState(CATEGORY_STORAGE_KEY, equipmentCategories);
}

function persistEquipmentBrandModels() {
  persistState(BRAND_MODEL_STORAGE_KEY, equipmentBrandModels);
}

function persistUsers() {
  persistState(USER_STORAGE_KEY, users);
}

function persistLogs() {
  persistState(LOG_STORAGE_KEY, logs);
}

function persistAgendaItems() {
  persistState(AGENDA_STORAGE_KEY, agendaItems);
}

function persistAgendaCounter() {
  persistState(AGENDA_COUNTER_STORAGE_KEY, agendaCounter);
}

function persistServiceOrders() {
  persistState(SERVICE_ORDER_STORAGE_KEY, serviceOrders);
}

function persistServiceOrderCounter() {
  persistState(SERVICE_ORDER_COUNTER_STORAGE_KEY, serviceOrderCounter);
}

function persistServiceOrderEquipmentTypes() {
  persistState(SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY, serviceOrderEquipmentTypes);
}

function persistExternalRepairLocations() {
  persistState(EXTERNAL_REPAIR_LOCATION_STORAGE_KEY, externalRepairLocations);
}

function persistEmailTypes() {
  persistState(EMAIL_TYPE_STORAGE_KEY, emailTypes);
}

function persistAuthorizationRequests() {
  persistState(AUTHORIZATION_STORAGE_KEY, authorizationRequests);
}

function logActivity(action, details = "") {
  createLogRecord({ state: appState, persistLogs, createId, currentUser, action, details });
  renderLogs();
  updateDashboardTotals();
}

async function loginAdmin(event) {
  event.preventDefault();

  const user = loginUser.value.trim();
  const password = loginPassword.value;
  const firebaseUser = await signInFirebaseUser(user, password);

  if (!firebaseUser) {
    currentUser = null;
    isAdminLoggedIn = false;
    return;
  }

  const storedUser = await getOrCreateFirebaseUserProfile(firebaseUser, user);

  if (!storedUser?.active) {
    loginMessage.textContent = "Usuario inativo.";
    loginPassword.value = "";
    await firebaseAuth.signOut();
    return;
  }

  currentUser = { id: storedUser.id, uid: storedUser.uid, login: storedUser.login, name: storedUser.name, role: storedUser.role || "user" };
  isAdminLoggedIn = currentUser.role === "admin" || storedUser.fullControl === true;
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
  await hydrateFromFirebase();
  logActivity("Login realizado", `Usuario ${currentUser.login} entrou no sistema.`);
  loginMessage.textContent = "";
  loginForm.reset();
  renderAuth();
  render();
}

async function getOrCreateFirebaseUserProfile(firebaseUser, typedLogin) {
  if (firebaseSyncEnabled && firebaseDb) {
    try {
      const userSnapshot = await firebaseDb.collection("users").doc(firebaseUser.uid).get();

      if (userSnapshot.exists) {
        const firestoreUser = normalizeUser({ id: userSnapshot.id, ...userSnapshot.data() });
        users = [firestoreUser, ...users.filter((item) => item.uid !== firestoreUser.uid && item.id !== firestoreUser.id)];
        writeLocalState(USER_STORAGE_KEY, users);
        return firestoreUser;
      }
    } catch (error) {
      console.warn("Nao foi possivel carregar o perfil do usuario no Firestore.", error);
    }
  }

  const existingUser = users.find((item) => item.uid === firebaseUser.uid || normalize(item.email || "") === normalize(firebaseUser.email || ""));

  if (existingUser) {
    return existingUser;
  }

  const isBootstrapAdmin = isBootstrapAdminUser(firebaseUser);
  const userProfile = normalizeUser({
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    login: typedLogin || firebaseUser.email,
    email: firebaseUser.email,
    name: isBootstrapAdmin ? "Administrador" : firebaseUser.email,
    active: true,
    role: isBootstrapAdmin ? "admin" : "user",
    fullControl: isBootstrapAdmin,
    permissions: createDefaultPermissions(),
    createdAt: new Date().toISOString()
  });

  users = [userProfile, ...users];

  if (firebaseSyncEnabled && firebaseDb) {
    try {
      await firebaseDb.collection("users").doc(userProfile.uid || userProfile.id).set(userProfile, { merge: true });
    } catch (error) {
      console.warn("Nao foi possivel salvar o perfil do usuario no Firestore.", error);
    }
  }

  persistUsers();
  return userProfile;
}

function isBootstrapAdminUser(firebaseUser) {
  return normalize(firebaseUser?.email || "") === normalize(window.firebaseConfig?.bootstrapAdminEmail || "eduarddo.black@gmail.com");
}

function logoutAdmin() {
  logActivity("Logout realizado", `Usuario ${currentUser?.login || "desconhecido"} saiu do sistema.`);
  if (firebaseAuth?.currentUser) {
    firebaseAuth.signOut().catch((error) => console.warn("Nao foi possivel sair do Firebase.", error));
  }
  currentUser = null;
  isAdminLoggedIn = false;
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  closeEquipmentDialog();
  renderAuth();
  render();
}

function renderAuth() {
  const isLoggedIn = Boolean(currentUser);
  welcomeScreen.classList.toggle("hidden", isLoggedIn);
  appScreen.classList.toggle("hidden", !isLoggedIn);

  if (currentUser) {
    adminStatus.textContent = isAdminLoggedIn ? "Administrador conectado" : `${currentUser.name} conectado`;
  }

  if (!isLoggedIn) {
    loginUser.focus();
  }
}

function requireAdmin() {
  if (isAdminLoggedIn) {
    return true;
  }

  renderAuth();
  loginMessage.textContent = "Entre como administrador para fazer alteracoes.";
  return false;
}

function canAccess(tabName) {
  if (isAdminLoggedIn) {
    return true;
  }

  if (!currentUser) {
    return false;
  }

  if (tabName === "overview") {
    return true;
  }

  if (tabName === "permissions") {
    return isAdminLoggedIn;
  }

  const user = getCurrentStoredUser();
  if (!user?.active) {
    return false;
  }

  if (user.fullControl) {
    return true;
  }

  return Boolean(user.permissions?.[tabName]?.access);
}

function canModify(tabName) {
  if (isAdminLoggedIn) {
    return true;
  }

  const user = getCurrentStoredUser();
  if (!user?.active) {
    return false;
  }

  if (user.fullControl) {
    return tabName !== "users" && tabName !== "permissions";
  }

  return Boolean(user.permissions?.[tabName]?.modify);
}

function requireModify(tabName) {
  if (canModify(tabName)) {
    return true;
  }

  loginMessage.textContent = "Seu usuario nao tem permissao para modificar esta area.";
  return false;
}

function canApproveAuthorizationRequests() {
  return Boolean(isAdminLoggedIn || getCurrentStoredUser()?.fullControl);
}

function needsDeleteAuthorization() {
  return Boolean(currentUser && !isAdminLoggedIn && !getCurrentStoredUser()?.fullControl);
}

function requestDeleteAuthorization(type, title, details, payload) {
  if (!currentUser) {
    return false;
  }

  if (hasPendingDeleteAuthorization(type, payload)) {
    return false;
  }

  authorizationRequests = [
    {
      id: createId("AUT"),
      type,
      title,
      details,
      payload,
      status: "Pendente",
      requesterName: currentUser.name,
      requesterLogin: currentUser.login,
      createdAt: new Date().toISOString()
    },
    ...authorizationRequests
  ];

  persistAuthorizationRequests();
  logActivity("Autorizacao solicitada", `${title} por ${currentUser.login}.`);
  renderNotifications();
  return true;
}

function requestAgendaAuthorization(payload) {
  if (!currentUser) {
    return false;
  }

  if (hasPendingAgendaAuthorization(payload)) {
    return false;
  }

  authorizationRequests = [
    {
      id: createId("AUT"),
      type: "create-agenda",
      title: "Solicitar agendamento",
      details: `${payload.clientName}: ${payload.occurrence}`,
      payload,
      status: "Pendente",
      requesterName: currentUser.name,
      requesterLogin: currentUser.login,
      createdAt: new Date().toISOString()
    },
    ...authorizationRequests
  ];

  persistAuthorizationRequests();
  logActivity("Agendamento solicitado", `${payload.clientName} por ${currentUser.login}.`);
  renderNotifications();
  return true;
}

function hasPendingDeleteAuthorization(type, payload) {
  return authorizationRequests.some((request) => {
    if (request.status !== "Pendente" || request.type !== type) {
      return false;
    }

    if (type === "delete-client") {
      return request.payload.clientId === payload.clientId;
    }

    return (
      request.payload.clientId === payload.clientId &&
      request.payload.collection === payload.collection &&
      request.payload.itemId === payload.itemId
    );
  });
}

function hasPendingAgendaAuthorization(payload) {
  return authorizationRequests.some((request) => {
    return (
      request.status === "Pendente" &&
      request.type === "create-agenda" &&
      request.requesterLogin === currentUser.login &&
      request.payload.clientId === payload.clientId &&
      request.payload.date === payload.date &&
      normalize(request.payload.occurrence) === normalize(payload.occurrence)
    );
  });
}

function approveAuthorizationRequest(requestId) {
  if (!canApproveAuthorizationRequests()) {
    return;
  }

  const request = authorizationRequests.find((item) => item.id === requestId);

  if (!request || request.status !== "Pendente") {
    return;
  }

  executeAuthorizedRequest(request);
  authorizationRequests = authorizationRequests.map((item) =>
    item.id === requestId
      ? {
          ...item,
          status: "Autorizado",
          reviewerName: currentUser.name,
          reviewerLogin: currentUser.login,
          reviewedAt: new Date().toISOString()
        }
      : item
  );
  persistAuthorizationRequests();
  logActivity("Autorizacao aprovada", `${request.title} aprovado por ${currentUser.login}.`);
  render();
}

function denyAuthorizationRequest(requestId) {
  if (!canApproveAuthorizationRequests()) {
    return;
  }

  const request = authorizationRequests.find((item) => item.id === requestId);

  authorizationRequests = authorizationRequests.map((item) =>
    item.id === requestId
      ? {
          ...item,
          status: "Negado",
          reviewerName: currentUser.name,
          reviewerLogin: currentUser.login,
          reviewedAt: new Date().toISOString()
        }
      : item
  );
  persistAuthorizationRequests();
  logActivity("Autorizacao negada", `${request?.title || "Solicitacao"} negada por ${currentUser.login}.`);
  renderNotifications();
}

function getCurrentStoredUser() {
  if (!currentUser || currentUser.role === "admin") {
    return null;
  }

  return users.find((user) => user.id === currentUser.id || normalize(user.login) === normalize(currentUser.login));
}

async function createUser(event) {
  event.preventDefault();

  if (!requireAdmin()) {
    return;
  }

  const formData = Object.fromEntries(new FormData(userForm).entries());
  const login = formData.login.trim();
  const name = formData.name.trim();
  const password = formData.password;
  const passwordConfirm = formData.passwordConfirm;

  userMessage.textContent = "";

  if (login.toLowerCase() === ADMIN_USER || users.some((user) => normalize(user.login) === normalize(login))) {
    userMessage.textContent = "Esse login ja esta em uso.";
    return;
  }

  if (password !== passwordConfirm) {
    userMessage.textContent = "As senhas nao conferem.";
    return;
  }

  userMessage.textContent = "Criando usuario no Firebase...";
  const firebaseAccount = await createFirebaseAuthAccount(login, password);

  if (!firebaseAccount) {
    return;
  }

  users = [
    normalizeUser({
      id: firebaseAccount.uid || createId("USR"),
      uid: firebaseAccount.uid || "",
      email: firebaseAccount.email,
      name,
      login,
      active: true,
      fullControl: false,
      permissions: createDefaultPermissions(),
      createdAt: new Date().toISOString()
    }),
    ...users
  ];

  persistUsers();
  logActivity("Usuario criado", `Login ${login} foi criado.`);
  userForm.reset();
  userMessage.textContent = "Usuario criado com sucesso.";
  renderUsers();
}

async function createFirebaseAuthAccount(login, password) {
  if (!firebaseSyncEnabled || !firebaseAuthRequired || !firebaseAuth) {
    userMessage.textContent = "Firebase Authentication precisa estar ativo para criar usuarios.";
    return null;
  }

  const email = getFirebaseLoginEmail(login);
  const apiKey = window.firebaseConfig?.apiKey;

  if (!apiKey) {
    userMessage.textContent = "Chave do Firebase nao encontrada.";
    return null;
  }

  try {
    const createdAccount = await requestFirebaseAuthAccount("signUp", apiKey, {
      email,
      password,
      returnSecureToken: true
    });

    await requestFirebaseAuthAccount("signInWithPassword", apiKey, {
      email,
      password,
      returnSecureToken: true
    });

    return {
      uid: createdAccount.localId,
      email
    };
  } catch (error) {
    console.warn("Nao foi possivel criar usuario no Firebase Authentication.", error);

    if (error?.code === "EMAIL_EXISTS") {
      userMessage.textContent = `Esse login ja existe no Firebase (${email}).`;
      return null;
    }

    if (error?.code === "WEAK_PASSWORD") {
      userMessage.textContent = "A senha precisa ter pelo menos 6 caracteres.";
      return null;
    }

    if (error?.code === "INVALID_EMAIL") {
      userMessage.textContent = `Login invalido para o Firebase: ${email}.`;
      return null;
    }

    userMessage.textContent = `Nao foi possivel criar o usuario no Firebase. Codigo: ${error?.code || "desconhecido"}.`;
    return null;
  }
}

async function requestFirebaseAuthAccount(action, apiKey, body) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.error?.message || "FIREBASE_AUTH_ERROR");
    error.code = data?.error?.message || "FIREBASE_AUTH_ERROR";
    throw error;
  }

  return data;
}

function addAgendaItem(event) {
  event.preventDefault();

  if (!canAccess("agenda")) {
    return;
  }

  const data = Object.fromEntries(new FormData(agendaForm).entries());
  const client = clients.find((item) => item.id === data.clientId);

  if (!client) {
    return;
  }

  const editingAgenda = agendaItems.find((item) => item.id === editingAgendaId);
  const payload = {
    clientId: data.clientId,
    clientName: client.name || "Cliente sem nome",
    occurrence: data.occurrence.trim(),
    requester: data.requester.trim(),
    date: data.date,
    status: data.status,
    openedByName: editingAgenda?.openedByName || currentUser?.name || "Usuario nao identificado",
    openedByLogin: editingAgenda?.openedByLogin || currentUser?.login || "",
    updatedAt: new Date().toISOString()
  };

  if (!canModify("agenda") && !editingAgenda) {
    const sent = requestAgendaAuthorization(payload);
    agendaDialogMessage.textContent = sent ? "solicitação de agendamento enviada" : "solicitação de agendamento já enviada";

    if (sent) {
      agendaForm.reset();
      renderAgendaClientOptions();
      agendaDialog.close();
      agendaActionMessage.textContent = "solicitação de agendamento enviada";
    }

    return;
  }

  if (!canModify("agenda")) {
    return;
  }

  if (editingAgenda) {
    updateAgendaFromPayload(editingAgenda.id, payload);
  } else {
    createAgendaFromPayload(payload);
  }

  const wasEditing = Boolean(editingAgenda);
  editingAgendaId = "";
  agendaForm.reset();
  agendaDialog.close();
  agendaActionMessage.textContent = wasEditing ? "Agendamento atualizado." : "Agendamento adicionado.";
  renderAgendaClientOptions();
}

function createAgendaFromPayload(payload) {
  createAgendaItem({ state: appState, persistAgendaItems, createId, payload: { ...payload, number: getNextAgendaNumber() } });
  logActivity("Agenda criada", `${payload.clientName || "Cliente sem nome"}: ${payload.occurrence}`);
  renderAgendaItems();
  updateDashboardTotals();
}

function updateAgendaFromPayload(itemId, payload) {
  const previousItem = agendaItems.find((item) => item.id === itemId);
  agendaItems = agendaItems.map((item) =>
    item.id === itemId
      ? {
          ...item,
          ...payload,
          number: item.number,
          openedByName: item.openedByName,
          openedByLogin: item.openedByLogin,
          createdAt: item.createdAt
        }
      : item
  );
  persistAgendaItems();
  logActivity("Agenda editada", `${formatAgendaNumber(previousItem || {})} - ${payload.clientName || "Cliente sem nome"}.`);
  renderAgendaItems();
}

function getNextAgendaNumber() {
  const nextNumber = agendaCounter;
  agendaCounter += 1;
  persistAgendaCounter();
  return nextNumber;
}

function openAgendaDialog() {
  if (!canAccess("agenda")) {
    return;
  }

  agendaDialogMessage.textContent = "";
  agendaActionMessage.textContent = "";
  editingAgendaId = "";
  agendaDialogTitle.textContent = "Novo agendamento";
  agendaSubmitButton.textContent = "+";
  agendaSubmitButton.title = "Adicionar agendamento";
  agendaSubmitButton.setAttribute("aria-label", "Adicionar agendamento");
  agendaSubmitButton.disabled = clients.length === 0;
  agendaForm.reset();
  renderAgendaClientOptions();

  if (agendaForm.elements.status) {
    agendaForm.elements.status.value = "Aberto";
  }

  agendaDialog.showModal();
}

async function addServiceOrder(event) {
  event.preventDefault();

  if (!requireModify("serviceOrders")) {
    return;
  }

  const data = Object.fromEntries(new FormData(serviceOrderForm).entries());
  const client = clients.find((item) => item.id === data.clientId);
  const equipmentType = resolveServiceOrderEquipmentType(data);

  if (!client) {
    serviceOrderMessage.textContent = "Selecione um cliente cadastrado.";
    return;
  }

  if (!equipmentType) {
    serviceOrderMessage.textContent = "Informe o tipo de equipamento.";
    return;
  }

  const externalRepair = data.externalRepair === "Sim";
  let externalRepairLocationName = externalRepair ? data.externalRepairLocation || "" : "";

  if (externalRepair && !externalRepairLocationName) {
    serviceOrderMessage.textContent = "Informe o local do conserto externo.";
    return;
  }

  const requiresComputerDetails = isComputerServiceOrderType(equipmentType);
  const requiresPowerSupply = requiresComputerDetails || isPrinterServiceOrderType(equipmentType);
  const powerSupply = getServiceOrderPowerSupply();

  if (requiresPowerSupply && !powerSupply) {
    serviceOrderMessage.textContent = "Informe se o equipamento possui fonte.";
    return;
  }

  const editingOrder = serviceOrders.find((orderItem) => orderItem.id === editingServiceOrderId);
  const orderData = {
    openedAt: data.openedAt || getTodayInputValue(),
    clientId: data.clientId,
    clientName: client.name || "Cliente sem nome",
    equipmentType,
    defect: data.defect.trim(),
    equipmentNotes: data.equipmentNotes.trim(),
    status: data.status,
    budgetSent: data.budgetSent || "Nao",
    externalRepair: externalRepair ? "Sim" : "Nao",
    externalRepairLocation: externalRepairLocationName,
    technicalDetails: requiresPowerSupply
      ? {
          powerSupply,
          brandModel: data.brandModel.trim(),
          ...(requiresComputerDetails
            ? {
                serialNumber: data.serialNumber.trim(),
                processor: data.processor.trim(),
                memory: data.memory,
                memoryDdr: data.memoryDdr,
                storageType: data.storageType,
                windowsType: data.windowsType
              }
            : {})
        }
      : {
          brandModel: data.brandModel.trim()
        },
    openedByName: editingOrder?.openedByName || currentUser?.name || "Usuario nao identificado",
    openedByLogin: editingOrder?.openedByLogin || currentUser?.login || "",
    createdAt: editingOrder?.createdAt || new Date().toISOString()
  };

  const order = editingOrder
    ? await updateServiceOrderRecord({ state: appState, persistServiceOrders, orderId: editingOrder.id, data: orderData })
    : await createServiceOrderRecord({ state: appState, persistServiceOrders, getNextServiceOrderNumber, createId, order: orderData });
  logActivity(editingOrder ? "Ordem de servico editada" : "Ordem de servico criada", `${formatServiceOrderNumber(order)} - ${order.clientName}`);
  editingServiceOrderId = "";
  serviceOrderForm.reset();
  serviceOrderMessage.textContent = editingOrder ? "Ordem de servico atualizada." : "Ordem de servico adicionada.";
  updateServiceOrderFormMode();
  toggleComputerServiceOrderFields();
  toggleExternalRepairLocationFields();
  renderServiceOrderClientOptions();
  renderServiceOrderEquipmentTypeOptions();
  renderExternalRepairLocationOptions();
  renderServiceOrders();
  switchServiceOrderView("list");
}

function resolveServiceOrderEquipmentType(data) {
  if (!isNewServiceOrderEquipmentType(data.equipmentType)) {
    return data.equipmentType;
  }

  const newType = data.newEquipmentType.trim();

  if (!newType) {
    return "";
  }

  ensureServiceOrderEquipmentType(newType);
  return newType;
}

function isNewServiceOrderEquipmentType(value) {
  return value === NEW_SERVICE_ORDER_EQUIPMENT_TYPE_VALUE || value === "Outro";
}

function ensureServiceOrderEquipmentType(type) {
  const cleanType = String(type || "").trim();

  if (!cleanType || serviceOrderEquipmentTypes.some((item) => normalize(item) === normalize(cleanType))) {
    return;
  }

  serviceOrderEquipmentTypes = uniqueServiceOrderEquipmentTypes([...serviceOrderEquipmentTypes, cleanType]);
  persistServiceOrderEquipmentTypes();
}

function uniqueServiceOrderEquipmentTypes(types) {
  return uniqueTextOptions(types);
}

function getNextServiceOrderNumber() {
  const nextNumber = serviceOrderCounter;
  serviceOrderCounter += 1;
  persistServiceOrderCounter();
  return nextNumber;
}

function startNewServiceOrder() {
  editingServiceOrderId = "";
  resetServiceOrderForm();
  switchServiceOrderView("create");
}

function resetServiceOrderForm() {
  editingServiceOrderId = "";
  serviceOrderForm.reset();
  serviceOrderMessage.textContent = "";
  updateServiceOrderFormMode();
  toggleComputerServiceOrderFields();
  toggleExternalRepairLocationFields();
  renderExternalRepairLocationOptions();
}

function editServiceOrder(orderId) {
  if (!canModify("serviceOrders")) {
    return;
  }

  const order = serviceOrders.find((item) => item.id === orderId);

  if (!order) {
    return;
  }

  editingServiceOrderId = orderId;
  serviceOrderForm.elements.openedAt.value = order.openedAt || "";
  serviceOrderForm.elements.clientId.value = order.clientId || "";
  renderServiceOrderEquipmentTypeOptions(order.equipmentType || "Notebook");
  serviceOrderForm.elements.equipmentType.value = order.equipmentType || "Notebook";
  serviceOrderForm.elements.status.value = order.status || "Aberta";
  serviceOrderForm.elements.defect.value = order.defect || "";
  serviceOrderForm.elements.equipmentNotes.value = order.equipmentNotes || "";
  serviceOrderForm.elements.budgetSent.value = order.budgetSent || "Nao";
  serviceOrderForm.elements.externalRepair.value = order.externalRepair || "Nao";

  const technicalData = order.technicalDetails ?? {};
  serviceOrderPowerSupplyYes.checked = technicalData.powerSupply === "Sim";
  serviceOrderPowerSupplyNo.checked = technicalData.powerSupply === "Nao";
  serviceOrderBrandModel.value = technicalData.brandModel || "";
  serviceOrderSerialNumber.value = technicalData.serialNumber || "";
  serviceOrderProcessor.value = technicalData.processor || "";
  serviceOrderMemory.value = technicalData.memory || "";
  serviceOrderMemoryDdr.value = technicalData.memoryDdr || "";
  serviceOrderStorageType.value = technicalData.storageType || "";
  serviceOrderWindowsType.value = technicalData.windowsType || "";

  renderExternalRepairLocationOptions(order.externalRepairLocation || "");
  updateServiceOrderFormMode();
  toggleComputerServiceOrderFields();
  toggleExternalRepairLocationFields();
  switchServiceOrderView("create");
}

function updateServiceOrderFormMode() {
  const isEditing = Boolean(editingServiceOrderId);
  serviceOrderFormTitle.textContent = isEditing ? "Editar ordem" : "Dados da ordem";
  serviceOrderSubmitButton.textContent = isEditing ? "Salvar" : "Adicionar";
  serviceOrderSubmitButton.title = isEditing ? "Salvar ordem de servico" : "Adicionar ordem de servico";
  serviceOrderSubmitButton.setAttribute("aria-label", serviceOrderSubmitButton.title);
}

function updateServiceOrderStatus(orderId) {
  if (!canModify("serviceOrders")) {
    return;
  }

  const order = serviceOrders.find((item) => item.id === orderId);

  if (!order) {
    return;
  }

  const nextStatus = getNextServiceOrderStatus(order.status);
  serviceOrders = serviceOrders.map((item) => (item.id === orderId ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item));
  persistServiceOrders();
  logActivity("Status da OS alterado", `${formatServiceOrderNumber(order)} para ${getServiceOrderStatusLabel(nextStatus)}.`);
  renderServiceOrders();
}

function getNextServiceOrderStatus(status) {
  return getNextServiceOrderStatusValue(status);
}

function getServiceOrderStatusGroup(status) {
  if (["Aberta", "Aberto"].includes(status)) {
    return "open";
  }

  if (["Concluida", "Cancelada", "Fechada"].includes(status)) {
    return "closed";
  }

  return "inProgress";
}

function getServiceOrderStatusLabel(status) {
  return status || "Aberta";
}

function getServiceOrderStatusClass(status) {
  if (status === "Aberta" || status === "Aberto") {
    return "status-open";
  }

  if (status === "Em analise") {
    return "status-analysis";
  }

  if (status === "Aguardando orcamento") {
    return "status-budget";
  }

  if (status === "Em conserto") {
    return "status-repair";
  }

  if (status === "Fechada") {
    return "status-closed";
  }

  if (status === "Concluida") {
    return "status-done";
  }

  if (status === "Cancelada") {
    return "status-canceled";
  }

  return "status-open";
}

function isComputerServiceOrderType(equipmentType) {
  return equipmentType === "Notebook" || equipmentType === "Computador" || equipmentType === "All-In-One";
}

function isPrinterServiceOrderType(equipmentType) {
  return equipmentType === "Impressora";
}

function getServiceOrderPowerSupply() {
  if (serviceOrderPowerSupplyYes.checked) {
    return "Sim";
  }

  if (serviceOrderPowerSupplyNo.checked) {
    return "Nao";
  }

  return "";
}

function togglePowerSupplyOption(selectedInput) {
  if (!selectedInput.checked) {
    return;
  }

  if (selectedInput === serviceOrderPowerSupplyYes) {
    serviceOrderPowerSupplyNo.checked = false;
  } else {
    serviceOrderPowerSupplyYes.checked = false;
  }
}

function toggleComputerServiceOrderFields() {
  const isComputerType = isComputerServiceOrderType(serviceOrderEquipment.value);
  const isPrinterType = isPrinterServiceOrderType(serviceOrderEquipment.value);
  const isAddingNewType = isNewServiceOrderEquipmentType(serviceOrderEquipment.value);
  const needsPowerSupply = isComputerType || isPrinterType;
  const detailFields = [
    serviceOrderSerialNumber,
    serviceOrderProcessor,
    serviceOrderMemory,
    serviceOrderMemoryDdr,
    serviceOrderStorageType,
    serviceOrderWindowsType
  ];

  computerServiceOrderFields.classList.toggle("hidden", !isComputerType);
  powerSupplyServiceOrderFields.classList.toggle("hidden", !needsPowerSupply);
  newServiceOrderEquipmentTypeLabel.classList.toggle("hidden", !isAddingNewType);
  newServiceOrderEquipmentType.required = isAddingNewType;
  newServiceOrderEquipmentType.disabled = !isAddingNewType || !canModify("serviceOrders");
  serviceOrderBrandModel.required = true;
  serviceOrderBrandModel.disabled = !canModify("serviceOrders");
  detailFields.forEach((field) => {
    field.required = isComputerType;
    field.disabled = !isComputerType || !canModify("serviceOrders");
  });
  serviceOrderPowerSupplyYes.disabled = !needsPowerSupply || !canModify("serviceOrders");
  serviceOrderPowerSupplyNo.disabled = !needsPowerSupply || !canModify("serviceOrders");

  if (!isComputerType) {
    detailFields.forEach((field) => {
      field.value = "";
    });
  }

  if (!needsPowerSupply) {
    serviceOrderPowerSupplyYes.checked = false;
    serviceOrderPowerSupplyNo.checked = false;
  }

  if (!isAddingNewType) {
    newServiceOrderEquipmentType.value = "";
  }
}

function showExternalRepairLocationInput() {
  if (!requireModify("serviceOrders")) {
    return;
  }

  newExternalRepairLocationLabel.classList.remove("hidden");
  externalRepairLocationActions.classList.remove("hidden");
  addExternalRepairLocationButton.classList.add("hidden");
  newExternalRepairLocation.focus();
}

function saveExternalRepairLocation() {
  if (!requireModify("serviceOrders")) {
    return;
  }

  const value = newExternalRepairLocation.value.trim();

  if (!value) {
    serviceOrderMessage.textContent = "Digite o nome do local.";
    return;
  }

  const savedLocation = ensureExternalRepairLocation(value);
  closeExternalRepairLocationInput();
  renderExternalRepairLocationOptions(savedLocation);
  serviceOrderMessage.textContent = "Local adicionado.";
}

function cancelExternalRepairLocationInput() {
  closeExternalRepairLocationInput();
  serviceOrderMessage.textContent = "";
}

function closeExternalRepairLocationInput() {
  newExternalRepairLocation.value = "";
  newExternalRepairLocationLabel.classList.add("hidden");
  externalRepairLocationActions.classList.add("hidden");
  addExternalRepairLocationButton.classList.remove("hidden");
}

function ensureExternalRepairLocation(value) {
  const existing = externalRepairLocations.find((item) => normalize(item) === normalize(value));

  if (existing) {
    return existing;
  }

  externalRepairLocations = [...externalRepairLocations, value].sort((a, b) => a.localeCompare(b));
  persistExternalRepairLocations();
  return value;
}

function toggleExternalRepairLocationFields() {
  const isExternal = serviceOrderExternalRepair.value === "Sim";
  externalRepairLocationWrap.classList.toggle("hidden", !isExternal);
  externalRepairLocation.disabled = !isExternal || !canModify("serviceOrders");
  addExternalRepairLocationButton.disabled = !isExternal || !canModify("serviceOrders");
  confirmExternalRepairLocationButton.disabled = !isExternal || !canModify("serviceOrders");
  cancelExternalRepairLocationButton.disabled = !isExternal || !canModify("serviceOrders");
  newExternalRepairLocation.disabled = !isExternal || !canModify("serviceOrders");

  if (!isExternal) {
    closeExternalRepairLocationInput();
  }
}

function render() {
  renderList();
  renderAgendaClientOptions();
  renderAgendaItems();
  renderServiceOrderClientOptions();
  renderExternalRepairLocationOptions();
  renderEmailTypeOptions();
  renderServiceOrders();
  renderServiceOrderView();
  renderUsers();
  renderLogs();
  renderNotifications();
  renderPermissionList();
  renderForm();
  renderEquipmentCategories();
  renderBrandOptions(equipmentBrand, equipmentModel);
  renderBrandOptions(editEquipmentBrand, editEquipmentModel);
  renderRelatedRecords();
  updateDashboardTotals();
  renderDashboardTabs();
  renderTabs();
  renderPermissions();
}

function switchServiceOrderView(viewName) {
  activeServiceOrderView = viewName === "create" ? "create" : "list";
  serviceOrderMessage.textContent = "";
  renderServiceOrderView();
}

function renderServiceOrderView() {
  serviceOrderViewButtons.forEach((button) => {
    const isActive = button.dataset.serviceOrderView === activeServiceOrderView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  serviceOrderListPanel.classList.toggle("active", activeServiceOrderView === "list");
  serviceOrderForm.classList.toggle("active", activeServiceOrderView === "create");
}

function renderNotifications() {
  notificationList.innerHTML = "";

  const visibleRequests = getVisibleAuthorizationRequests();
  notificationCount.textContent = String(visibleRequests.filter((item) => item.status === "Pendente").length);

  if (visibleRequests.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state compact";
    emptyState.innerHTML = "<strong>Nenhuma notificacao</strong><span>Solicitacoes de autorizacao aparecerao aqui.</span>";
    notificationList.append(emptyState);
    return;
  }

  visibleRequests.forEach((request) => {
    const card = document.createElement("article");
    card.className = "notification-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const tag = document.createElement("span");
    tag.className = "record-tag";
    tag.textContent = request.status;

    const title = document.createElement("strong");
    title.textContent = request.title;

    const details = document.createElement("span");
    details.textContent = `${request.details} | Solicitado por: ${request.requesterName}`;

    content.append(tag, title, details);
    card.append(content);

    if (request.status === "Pendente" && canApproveAuthorizationRequests()) {
      const actions = document.createElement("div");
      actions.className = "notification-actions";

      const denyButton = document.createElement("button");
      denyButton.className = "danger symbol-button";
      denyButton.type = "button";
      denyButton.textContent = "x";
      denyButton.title = "Negar";
      denyButton.setAttribute("aria-label", "Negar");
      denyButton.addEventListener("click", () => denyAuthorizationRequest(request.id));

      const approveButton = document.createElement("button");
      approveButton.className = "primary";
      approveButton.type = "button";
      approveButton.textContent = "Autorizar";
      approveButton.addEventListener("click", () => approveAuthorizationRequest(request.id));

      actions.append(denyButton, approveButton);
      card.append(actions);
    }

    notificationList.append(card);
  });
}

function getVisibleAuthorizationRequests() {
  if (!currentUser) {
    return [];
  }

  if (canApproveAuthorizationRequests()) {
    return authorizationRequests;
  }

  return authorizationRequests.filter((request) => request.requesterLogin === currentUser.login);
}

function updateDashboardTotals() {
  dashboardClientTotal.textContent = String(clients.length);
  dashboardUserTotal.textContent = String(users.length);
  dashboardLogTotal.textContent = String(logs.length);
  dashboardAgendaTotal.textContent = String(agendaItems.length);
}

function renderPermissions() {
  const canModifyClients = canModify("clients");
  const canAccessAgenda = canAccess("agenda");
  const canModifyAgenda = canModify("agenda");
  const canModifyServiceOrders = canModify("serviceOrders");
  const canModifyUsers = isAdminLoggedIn;
  const restrictedElements = [
    ...form.elements,
    ...equipmentForm.elements,
    ...networkSettingsForm.elements,
    ...emailSettingsForm.elements,
    ...emailForm.elements,
    ...editEquipmentForm.elements,
    newClientButton,
    deleteClientButton,
    editNetworkSettingsButton,
    editEmailSettingsButton,
    deleteEquipmentButton
  ];

  restrictedElements.forEach((element) => {
    element.disabled = !canModifyClients;
  });

  [...userForm.elements].forEach((element) => {
    element.disabled = !canModifyUsers;
  });

  [...agendaForm.elements].forEach((element) => {
    element.disabled = !canAccessAgenda;
  });
  openAgendaDialogButton.disabled = !canAccessAgenda;
  openAgendaDialogButton.textContent = "+";
  openAgendaDialogButton.title = "Adicionar agendamento";
  openAgendaDialogButton.setAttribute("aria-label", "Adicionar agendamento");
  agendaSubmitButton.textContent = "+";
  agendaSubmitButton.title = "Adicionar agendamento";
  agendaSubmitButton.setAttribute("aria-label", "Adicionar agendamento");
  agendaSubmitButton.disabled = !canAccessAgenda || clients.length === 0;

  [...serviceOrderForm.elements].forEach((element) => {
    element.disabled = !canModifyServiceOrders;
  });
  toggleComputerServiceOrderFields();
  toggleExternalRepairLocationFields();

  if (canModifyClients) {
    setRelatedFormsDisabled(!selectedId);
    deleteClientButton.disabled = !selectedId;
  }
}

function renderUsers() {
  userList.innerHTML = "";

  if (users.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum usuario criado";
    emptyState.querySelector("span").textContent = "Crie usuarios quando quiser liberar novos acessos.";
    userList.append(emptyState);
    return;
  }

  users.forEach((user) => {
    const card = document.createElement("article");
    card.className = "record-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const title = document.createElement("strong");
    title.textContent = user.name;

    const details = document.createElement("span");
    details.textContent = `Login: ${user.login} | ${user.active ? "Ativo" : "Inativo"}`;

    const tag = document.createElement("span");
    tag.className = "record-tag";
    tag.textContent = "Usuario";

    const changePasswordButton = document.createElement("button");
    changePasswordButton.className = "subtle";
    changePasswordButton.type = "button";
    changePasswordButton.textContent = "Alterar senha";
    changePasswordButton.disabled = !isAdminLoggedIn;
    changePasswordButton.addEventListener("click", () => openPasswordDialog(user.id));

    content.append(tag, title, details);
    card.append(content, changePasswordButton);
    userList.append(card);
  });
}

function renderLogs() {
  logList.innerHTML = "";

  if (logs.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhuma atividade registrada";
    emptyState.querySelector("span").textContent = "As proximas acoes do sistema aparecerao aqui.";
    logList.append(emptyState);
    return;
  }

  logs.forEach((log) => {
    const card = document.createElement("article");
    card.className = "record-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const tag = document.createElement("span");
    tag.className = "record-tag";
    tag.textContent = formatDate(log.createdAt);

    const title = document.createElement("strong");
    title.textContent = log.action;

    const details = document.createElement("span");
    details.textContent = `${log.details || "Sem detalhes"} | Usuario: ${log.actor} (${log.login})`;

    content.append(tag, title, details);
    card.append(content);
    logList.append(card);
  });
}

function renderPermissionList() {
  permissionList.innerHTML = "";

  if (users.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum usuario para configurar";
    emptyState.querySelector("span").textContent = "Crie usuarios antes de ajustar permissoes.";
    permissionList.append(emptyState);
    return;
  }

  users.forEach((user) => {
    const draft = getPermissionDraft(user);
    const card = document.createElement("article");
    card.className = `permission-card${permissionDrafts[user.id] ? " has-draft" : ""}`;

    const header = document.createElement("div");
    header.className = "settings-header";

    const titleWrap = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = user.login;
    const title = document.createElement("h3");
    title.textContent = user.name;
    titleWrap.append(eyebrow, title);

    const statusWrap = document.createElement("div");
    statusWrap.className = "permission-status";

    const activeLabel = document.createElement("label");
    activeLabel.className = "switch-row";
    const activeInput = document.createElement("input");
    activeInput.type = "checkbox";
    activeInput.checked = draft.active;
    activeInput.addEventListener("change", () => updatePermissionDraft(user.id, (nextDraft) => ({ ...nextDraft, active: activeInput.checked })));
    const activeSwitch = document.createElement("span");
    activeSwitch.className = "switch";
    const activeText = document.createElement("span");
    activeText.textContent = "Ativo";
    activeLabel.append(activeInput, activeSwitch, activeText);

    const fullControlLabel = document.createElement("label");
    fullControlLabel.className = "check-row";
    const fullControlInput = document.createElement("input");
    fullControlInput.type = "checkbox";
    fullControlInput.checked = Boolean(draft.fullControl);
    fullControlInput.addEventListener("change", () => updatePermissionDraft(user.id, (nextDraft) => applyFullControlToDraft(nextDraft, fullControlInput.checked)));
    const fullControlText = document.createElement("span");
    fullControlText.textContent = "Controle total";
    fullControlLabel.append(fullControlInput, fullControlText);

    statusWrap.append(activeLabel, fullControlLabel);
    header.append(titleWrap, statusWrap);

    const draftActions = document.createElement("div");
    draftActions.className = "permission-draft-actions";

    const cancelButton = document.createElement("button");
    cancelButton.className = "draft-button cancel";
    cancelButton.type = "button";
    cancelButton.textContent = "✕";
    cancelButton.title = "Cancelar alteracoes";
    cancelButton.disabled = !permissionDrafts[user.id];
    cancelButton.addEventListener("click", () => cancelPermissionDraft(user.id));

    const saveButton = document.createElement("button");
    saveButton.className = "draft-button save";
    saveButton.type = "button";
    saveButton.textContent = "✓";
    saveButton.title = "Salvar permissoes";
    saveButton.disabled = !permissionDrafts[user.id];
    saveButton.addEventListener("click", () => savePermissionDraft(user.id));

    draftActions.append(cancelButton, saveButton);
    statusWrap.append(draftActions);

    const viewGroup = createPermissionGroup("Visualizacao", user, draft, "access");
    const editGroup = createPermissionGroup("Alteracao", user, draft, "modify");

    card.append(header, viewGroup, editGroup);
    permissionList.append(card);
  });
}

function createPermissionGroup(title, user, draft, type) {
  const group = document.createElement("div");
  group.className = "permission-group";

  const heading = document.createElement("span");
  heading.className = "permission-group-title";
  heading.textContent = title;

  const matrix = document.createElement("div");
  matrix.className = "permission-matrix";

  dashboardSections.forEach((section) => {
    if (section.id === "permissions") {
      return;
    }

    matrix.append(createPanelPermissionCheckbox(user, draft, section, type));
  });

  group.append(heading, matrix);
  return group;
}

function createPanelPermissionCheckbox(user, draft, section, type) {
  const wrapper = document.createElement("label");
  wrapper.className = "check-row permission-option";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = Boolean(draft.fullControl || draft.permissions?.[section.id]?.[type]);
  input.disabled = !isAdminLoggedIn || draft.fullControl || (section.id === "overview" && type === "access");
  input.addEventListener("change", () => updatePermissionDraft(user.id, (nextDraft) => updateDraftPermission(nextDraft, section.id, type, input.checked)));

  const text = document.createElement("span");
  text.textContent = section.label;

  wrapper.append(input, text);
  return wrapper;
}

function getPermissionDraft(user) {
  return permissionDrafts[user.id] ?? clonePermissionState(user);
}

function clonePermissionState(user) {
  return {
    active: user.active,
    fullControl: Boolean(user.fullControl),
    permissions: JSON.parse(JSON.stringify({ ...createDefaultPermissions(), ...user.permissions }))
  };
}

function updatePermissionDraft(userId, updater) {
  if (!requireAdmin()) {
    renderPermissionList();
    return;
  }

  const user = users.find((item) => item.id === userId);

  if (!user) {
    return;
  }

  const currentDraft = getPermissionDraft(user);
  permissionDrafts = {
    ...permissionDrafts,
    [userId]: updater(currentDraft)
  };
  renderPermissionList();
}

function applyFullControlToDraft(draft, fullControl) {
  const allPermissions = createDefaultPermissions();

  dashboardSections.forEach((section) => {
    if (section.id === "permissions") {
      return;
    }

    allPermissions[section.id] = {
      access: true,
      modify: section.id !== "users" && section.id !== "permissions"
    };
  });

  return {
    ...draft,
    fullControl,
    permissions: fullControl ? allPermissions : draft.permissions
  };
}

function updateDraftPermission(draft, sectionId, type, value) {
  const permissions = {
    ...createDefaultPermissions(),
    ...draft.permissions,
    [sectionId]: {
      ...createDefaultPermissions()[sectionId],
      ...(draft.permissions?.[sectionId] ?? {}),
      [type]: value
    }
  };

  if (type === "modify" && value) {
    permissions[sectionId].access = true;
  }

  if (type === "access" && !value) {
    permissions[sectionId].modify = false;
  }

  return { ...draft, permissions };
}

function savePermissionDraft(userId) {
  if (!requireAdmin() || !permissionDrafts[userId]) {
    return;
  }

  const changedUser = users.find((user) => user.id === userId);
  const draft = permissionDrafts[userId];
  users = users.map((user) => (user.id === userId ? { ...user, ...draft } : user));
  delete permissionDrafts[userId];
  persistUsers();
  logActivity("Permissoes salvas", `Permissoes de ${changedUser?.login || "Usuario"} foram atualizadas.`);
  render();
}

function cancelPermissionDraft(userId) {
  delete permissionDrafts[userId];
  render();
}

function openPasswordDialog(userId) {
  if (!requireAdmin()) {
    return;
  }

  const user = users.find((item) => item.id === userId);

  if (!user) {
    return;
  }

  editingPasswordUserId = userId;
  passwordDialogTitle.textContent = `Alterar senha de ${user.name}`;
  passwordMessage.textContent = "";
  passwordForm.reset();
  passwordDialog.showModal();
}

function closePasswordDialog() {
  editingPasswordUserId = "";

  if (passwordDialog.open) {
    passwordDialog.close();
  }
}

async function saveChangedPassword(event) {
  event.preventDefault();

  if (!requireAdmin()) {
    return;
  }

  const data = Object.fromEntries(new FormData(passwordForm).entries());

  if (data.password !== data.passwordConfirm) {
    passwordMessage.textContent = "As senhas nao conferem.";
    return;
  }

  const changedUser = users.find((user) => user.id === editingPasswordUserId);
  passwordMessage.textContent = "Alterando senha no Firebase...";

  const passwordUpdated = await updateFirebaseUserPassword(changedUser, data.password);

  if (!passwordUpdated) {
    return;
  }

  users = users.map((user) => (user.id === editingPasswordUserId ? { ...user, password: "" } : user));
  persistUsers();
  logActivity("Senha alterada", `Senha do usuario ${changedUser?.login || "desconhecido"} foi alterada.`);
  closePasswordDialog();
  renderUsers();
}

async function updateFirebaseUserPassword(user, password) {
  if (!user) {
    passwordMessage.textContent = "Usuario nao encontrado.";
    return false;
  }

  if (!window.firebase?.functions) {
    passwordMessage.textContent = "Firebase Functions nao foi carregado. Suba o index.html atualizado.";
    return false;
  }

  if (!firebaseAuth?.currentUser) {
    passwordMessage.textContent = "Faça login novamente como administrador.";
    return false;
  }

  try {
    const changePassword = window.firebase.functions().httpsCallable("updateUserPassword");
    await changePassword({
      uid: user.uid || user.id,
      email: user.email || getFirebaseLoginEmail(user.login),
      password
    });
    return true;
  } catch (error) {
    console.warn("Nao foi possivel alterar a senha no Firebase Authentication.", error);
    const code = error?.code || error?.details?.code || "";

    if (code.includes("not-found")) {
      passwordMessage.textContent = "A funcao updateUserPassword ainda nao foi publicada no Firebase.";
      return false;
    }

    if (code.includes("permission-denied")) {
      passwordMessage.textContent = "Somente o administrador pode alterar senhas.";
      return false;
    }

    if (code.includes("invalid-argument")) {
      passwordMessage.textContent = error?.message || "Senha invalida ou usuario sem conta no Firebase.";
      return false;
    }

    passwordMessage.textContent = `Nao foi possivel alterar a senha no Firebase. Codigo: ${code || "desconhecido"}.`;
    return false;
  }
}

function renderList() {
  list.innerHTML = "";
  clientCount.textContent = String(clients.length);

  const search = normalize(searchInput.value);
  const visibleClients = clients.filter((client) => {
    const extraEmails = client.emails.map((item) => item.email).join(" ");
    const haystack = normalize(`${client.name} ${client.phone} ${client.email} ${client.document} ${extraEmails}`);
    return haystack.includes(search);
  });

  if (visibleClients.length === 0) {
    list.append(emptyStateTemplate.content.cloneNode(true));
    return;
  }

  visibleClients.forEach((client) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `client-item${client.id === selectedId ? " active" : ""}`;
    button.setAttribute("role", "listitem");
    button.addEventListener("click", () => selectClient(client.id));

    const name = document.createElement("span");
    name.className = "client-name";
    name.textContent = client.name || "Cliente sem nome";

    const meta = document.createElement("span");
    meta.className = "client-meta";
    meta.textContent = [client.phone, client.email, client.status].filter(Boolean).join(" | ") || "Sem contato informado";

    button.append(name, meta);
    list.append(button);
  });
}

function renderAgendaClientOptions() {
  const selectedValue = agendaClient.value;
  agendaClient.innerHTML = "";

  if (clients.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Nenhum cliente cadastrado";
    agendaClient.append(option);
    return;
  }

  clients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name || "Cliente sem nome";
    agendaClient.append(option);
  });

  if ([...agendaClient.options].some((option) => option.value === selectedValue)) {
    agendaClient.value = selectedValue;
  }
}

function renderAgendaItems() {
  agendaList.innerHTML = "";
  const visibleItems = agendaItems.filter((item) => matchesAgendaFilter(item, agendaStatusFilter.value) && matchesAgendaSearch(item));

  if (visibleItems.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = agendaItems.length === 0 ? "Nenhuma ocorrencia na agenda" : "Nenhuma agenda encontrada";
    emptyState.querySelector("span").textContent =
      agendaItems.length === 0 ? "Registre uma solicitacao para acompanhar por aqui." : "Altere a busca para encontrar outros chamados.";
    agendaList.append(emptyState);
    return;
  }

  visibleItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = `record-card service-order-card ${getAgendaStatusClass(item.status)}`;

    const content = document.createElement("div");
    content.className = "record-content";

    const titleRow = document.createElement("div");
    titleRow.className = "service-order-title-row";

    const titleWrap = document.createElement("div");
    titleWrap.className = "record-content";

    const statusButton = document.createElement("button");
    statusButton.className = `service-order-status ${getAgendaStatusClass(item.status)}`;
    statusButton.type = "button";
    statusButton.textContent = getAgendaStatusLabel(item.status);
    statusButton.title = canModify("agenda") ? "Clique para alterar o status" : "Status da agenda";
    statusButton.disabled = !canModify("agenda");
    statusButton.addEventListener("click", () => updateAgendaStatus(item.id));

    const title = document.createElement("strong");
    title.textContent = formatAgendaNumber(item);

    const clientName = document.createElement("span");
    clientName.textContent = item.clientName || "Cliente nao encontrado";

    const actions = document.createElement("div");
    actions.className = "service-order-card-actions";
    actions.append(statusButton);

    if (canModify("agenda")) {
      const editButton = document.createElement("button");
      editButton.className = "ghost symbol-button";
      editButton.type = "button";
      editButton.textContent = "✎";
      editButton.title = "Editar agenda";
      editButton.setAttribute("aria-label", "Editar agenda");
      editButton.addEventListener("click", () => editAgendaItem(item.id));
      actions.append(editButton);
    }

    titleWrap.append(title, clientName);
    titleRow.append(titleWrap, actions);

    const summary = document.createElement("div");
    summary.className = "service-order-summary";
    summary.append(
      createServiceOrderSummaryItem("Data", formatSimpleDate(item.date)),
      createServiceOrderSummaryItem("Solicitante", item.requester || "Nao informado"),
      createServiceOrderSummaryItem("Aberto por", item.openedByName || "Nao informado")
    );

    const occurrence = document.createElement("span");
    occurrence.className = "service-order-defect";
    occurrence.textContent = item.occurrence;

    content.append(titleRow, summary, occurrence);
    card.append(content);
    agendaList.append(card);
  });
}

function updateAgendaStatus(itemId) {
  if (!requireModify("agenda")) {
    return;
  }

  const item = agendaItems.find((agendaItem) => agendaItem.id === itemId);

  if (!item) {
    return;
  }

  const nextStatus = getNextAgendaStatus(item.status);
  agendaItems = agendaItems.map((agendaItem) => (agendaItem.id === itemId ? { ...agendaItem, status: nextStatus } : agendaItem));
  persistAgendaItems();
  logActivity("Status da agenda alterado", `${item.clientName || "Cliente"} alterado para ${nextStatus}.`);
  renderAgendaItems();
}

function editAgendaItem(itemId) {
  if (!requireModify("agenda")) {
    return;
  }

  const item = agendaItems.find((agendaItem) => agendaItem.id === itemId);

  if (!item) {
    return;
  }

  editingAgendaId = itemId;
  agendaDialogMessage.textContent = "";
  agendaActionMessage.textContent = "";
  agendaDialogTitle.textContent = `Editar ${formatAgendaNumber(item)}`;
  agendaSubmitButton.textContent = "✓";
  agendaSubmitButton.title = "Salvar agendamento";
  agendaSubmitButton.setAttribute("aria-label", "Salvar agendamento");
  agendaSubmitButton.disabled = false;
  renderAgendaClientOptions();
  agendaForm.elements.clientId.value = item.clientId || "";
  agendaForm.elements.requester.value = item.requester || "";
  agendaForm.elements.date.value = item.date || "";
  agendaForm.elements.status.value = normalizeAgendaStatus(item.status);
  agendaForm.elements.occurrence.value = item.occurrence || "";
  agendaDialog.showModal();
}

function matchesAgendaFilter(item, filter) {
  const status = normalizeAgendaStatus(item.status);

  if (filter === "open") {
    return status === "Aberto";
  }

  if (filter === "analysis") {
    return status === "Em analise";
  }

  if (filter === "done") {
    return status === "Concluido";
  }

  if (filter === "canceled") {
    return status === "Cancelado";
  }

  return true;
}

function matchesAgendaSearch(item) {
  const search = normalize(agendaSearchInput.value);

  if (!search) {
    return true;
  }

  const haystack = normalize(
    [
      formatAgendaNumber(item),
      item.number,
      item.clientName,
      item.requester,
      item.openedByName,
      item.date,
      formatSimpleDate(item.date),
      item.occurrence,
      item.status
    ]
      .filter(Boolean)
      .join(" ")
  );

  return haystack.includes(search);
}

function getNextAgendaStatus(status) {
  const normalizedStatus = normalizeAgendaStatus(status);
  const currentIndex = agendaStatuses.indexOf(normalizedStatus);

  if (currentIndex === -1 || currentIndex === agendaStatuses.length - 1) {
    return agendaStatuses[0];
  }

  return agendaStatuses[currentIndex + 1];
}

function getAgendaStatusLabel(status) {
  return normalizeAgendaStatus(status);
}

function getAgendaStatusClass(status) {
  const normalizedStatus = normalizeAgendaStatus(status);

  if (normalizedStatus === "Aberto") {
    return "status-open";
  }

  if (normalizedStatus === "Em analise") {
    return "status-analysis";
  }

  if (normalizedStatus === "Concluido") {
    return "status-done";
  }

  if (normalizedStatus === "Cancelado") {
    return "status-canceled";
  }

  return "status-open";
}

function normalizeAgendaStatus(status) {
  if (status === "Em andamento") {
    return "Em analise";
  }

  return agendaStatuses.includes(status) ? status : "Aberto";
}

function formatAgendaNumber(item) {
  return item.number ? `AG #${String(item.number).padStart(4, "0")}` : "AG sem numero";
}

function renderServiceOrderClientOptions() {
  const selectedValue = serviceOrderClient.value;
  serviceOrderClient.innerHTML = "";

  if (clients.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Nenhum cliente cadastrado";
    serviceOrderClient.append(option);
    return;
  }

  clients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name || "Cliente sem nome";
    serviceOrderClient.append(option);
  });

  if ([...serviceOrderClient.options].some((option) => option.value === selectedValue)) {
    serviceOrderClient.value = selectedValue;
  }
}

function renderServiceOrderEquipmentTypeOptions(selectedValue = serviceOrderEquipment.value) {
  serviceOrderEquipment.innerHTML = "";

  serviceOrderEquipmentTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    serviceOrderEquipment.append(option);
  });

  const newOption = document.createElement("option");
  newOption.value = NEW_SERVICE_ORDER_EQUIPMENT_TYPE_VALUE;
  newOption.textContent = "Outro";
  serviceOrderEquipment.append(newOption);

  if ([...serviceOrderEquipment.options].some((option) => option.value === selectedValue)) {
    serviceOrderEquipment.value = selectedValue;
  }

  toggleComputerServiceOrderFields();
}

function renderExternalRepairLocationOptions(selectedValue = externalRepairLocation.value) {
  externalRepairLocation.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = externalRepairLocations.length ? "Selecione" : "Nenhum local cadastrado";
  externalRepairLocation.append(emptyOption);

  externalRepairLocations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    externalRepairLocation.append(option);
  });

  if ([...externalRepairLocation.options].some((option) => option.value === selectedValue)) {
    externalRepairLocation.value = selectedValue;
  }
}

function renderEmailTypeOptions(selectedValue = extraEmailType.value) {
  extraEmailType.innerHTML = "";

  emailTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    extraEmailType.append(option);
  });

  const newOption = document.createElement("option");
  newOption.value = NEW_EMAIL_TYPE_VALUE;
  newOption.textContent = "Outro";
  extraEmailType.append(newOption);

  if ([...extraEmailType.options].some((option) => option.value === selectedValue)) {
    extraEmailType.value = selectedValue;
  }

  toggleNewEmailTypeField();
}

function renderServiceOrders() {
  serviceOrderList.innerHTML = "";
  const visibleOrders = serviceOrders.filter((order) => matchesServiceOrderFilter(order, serviceOrderStatusFilter.value) && matchesServiceOrderSearch(order));

  if (visibleOrders.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent =
      serviceOrders.length === 0 ? "Nenhuma ordem de servico" : "Nenhuma OS encontrada no filtro";
    emptyState.querySelector("span").textContent =
      serviceOrders.length === 0 ? "Abra uma OS para acompanhar os atendimentos por aqui." : "Altere o filtro para ver outras ordens.";
    serviceOrderList.append(emptyState);
    return;
  }

  visibleOrders.forEach((order) => {
    const card = document.createElement("article");
    card.className = `record-card service-order-card ${getServiceOrderStatusClass(order.status)}`;

    const content = document.createElement("div");
    content.className = "record-content";

    const titleRow = document.createElement("div");
    titleRow.className = "service-order-title-row";

    const titleWrap = document.createElement("div");
    titleWrap.className = "record-content";

    const title = document.createElement("strong");
    title.textContent = formatServiceOrderNumber(order);

    const clientName = document.createElement("span");
    clientName.textContent = order.clientName || "Cliente nao encontrado";

    const orderActions = document.createElement("div");
    orderActions.className = "service-order-card-actions";

    const statusButton = document.createElement("button");
    statusButton.className = `service-order-status ${getServiceOrderStatusClass(order.status)}`;
    statusButton.type = "button";
    statusButton.textContent = getServiceOrderStatusLabel(order.status);
    statusButton.title = canModify("serviceOrders") ? "Clique para alterar o status" : "Status da OS";
    statusButton.disabled = !canModify("serviceOrders");
    statusButton.addEventListener("click", () => updateServiceOrderStatus(order.id));

    orderActions.append(statusButton);

    if (canModify("serviceOrders")) {
      const editButton = document.createElement("button");
      editButton.className = "ghost symbol-button";
      editButton.type = "button";
      editButton.textContent = "✎";
      editButton.title = "Editar ordem de servico";
      editButton.setAttribute("aria-label", "Editar ordem de servico");
      editButton.addEventListener("click", () => editServiceOrder(order.id));
      orderActions.append(editButton);
    }

    titleWrap.append(title, clientName);
    titleRow.append(titleWrap, orderActions);

    const summary = document.createElement("div");
    summary.className = "service-order-summary";
    summary.append(
      createServiceOrderSummaryItem("Abertura", formatSimpleDate(order.openedAt)),
      createServiceOrderSummaryItem("Aberto por", order.openedByName || "Nao informado"),
      createServiceOrderSummaryItem("Equipamento", order.equipmentType || "Nao informado"),
      createServiceOrderSummaryItem("Orcamento", order.budgetSent || "Nao"),
      createServiceOrderSummaryItem(
        "Externo",
        `${order.externalRepair || "Nao"}${order.externalRepairLocation ? ` - ${order.externalRepairLocation}` : ""}`
      )
    );

    const technicalData = order.technicalDetails ?? {};
    const technicalLine = document.createElement("p");
    technicalLine.className = "service-order-technical";

    if (isComputerServiceOrderType(order.equipmentType)) {
      technicalLine.textContent = [
        `Fonte: ${technicalData.powerSupply || "Nao informado"}`,
        technicalData.brandModel || "Sem marca/modelo",
        `S/N: ${technicalData.serialNumber || "Nao informado"}`,
        technicalData.processor || "Sem processador",
        `RAM: ${[technicalData.memory, technicalData.memoryDdr].filter(Boolean).join(" ") || "Nao informado"}`,
        `Armazenamento: ${technicalData.storageType || "Nao informado"}`,
        technicalData.windowsType || "Windows nao informado"
      ].join(" | ");
    } else if (isPrinterServiceOrderType(order.equipmentType)) {
      technicalLine.textContent = `${technicalData.brandModel || "Sem marca/modelo"} | Fonte: ${technicalData.powerSupply || "Nao informado"}`;
    } else {
      technicalLine.textContent = technicalData.brandModel || "Sem marca/modelo";
    }

    const defect = document.createElement("p");
    defect.className = "service-order-defect";
    defect.textContent = [`Defeito: ${order.defect}`, order.equipmentNotes ? `Observacoes: ${order.equipmentNotes}` : ""].filter(Boolean).join(" | ");

    content.append(titleRow, summary);
    if (technicalLine.textContent) {
      content.append(technicalLine);
    }
    content.append(defect);
    card.append(content);
    serviceOrderList.append(card);
  });
}

function createServiceOrderSummaryItem(label, value) {
  const item = document.createElement("span");
  item.className = "service-order-summary-item";

  const labelElement = document.createElement("strong");
  labelElement.textContent = `${label}: `;
  item.append(labelElement, document.createTextNode(value || "Nao informado"));
  return item;
}

function matchesServiceOrderFilter(order, filter) {
  if (filter === "open") {
    return getServiceOrderStatusGroup(order.status) === "open";
  }

  if (filter === "inProgress") {
    return getServiceOrderStatusGroup(order.status) === "inProgress";
  }

  if (filter === "closed") {
    return getServiceOrderStatusGroup(order.status) === "closed";
  }

  return true;
}

function matchesServiceOrderSearch(order) {
  const search = normalize(serviceOrderSearchInput.value);

  if (!search) {
    return true;
  }

  const haystack = normalize(
    [
      formatServiceOrderNumber(order),
      order.number,
      order.clientName,
      order.openedAt,
      formatSimpleDate(order.openedAt),
      order.openedByName,
      order.equipmentType,
      order.defect,
      order.status
    ]
      .filter(Boolean)
      .join(" ")
  );

  return haystack.includes(search);
}

function formatServiceOrderNumber(order) {
  return order.number ? `OS #${String(order.number).padStart(4, "0")}` : "OS sem numero";
}

function renderForm() {
  const selectedClient = getSelectedClient();
  clientActionMessage.textContent = "";

  Object.keys(fields).forEach((key) => {
    fields[key].value = selectedClient[key] ?? "";
  });

  selectedTitle.textContent = selectedClient.id ? selectedClient.name || "Cliente sem nome" : "Novo cliente";
  updatedAt.textContent = selectedClient.updatedAt ? formatDate(selectedClient.updatedAt) : "Ainda nao salvo";
  clientId.textContent = selectedClient.id || "Novo cadastro";
  deleteClientButton.disabled = !selectedClient.id;
  if (selectedClient.id && needsDeleteAuthorization() && hasPendingDeleteAuthorization("delete-client", { clientId: selectedClient.id })) {
    deleteClientButton.disabled = true;
    clientActionMessage.textContent = "solicitação de exclusão enviada";
  }
  renderNetworkSettings(selectedClient.networkSettings);
  renderEmailSettings(selectedClient.emailSettings);
  setRelatedFormsDisabled(!selectedClient.id);
}

function renderNetworkSettings(settings) {
  Object.entries(networkSettingsFields).forEach(([key, field]) => {
    field.value = settings[key] ?? "";
  });

  renderNetworkSettingsMode(settings);
}

function renderNetworkSettingsMode(settings) {
  const hasSettings = hasSavedNetworkSettings(settings);
  const showForm = selectedId && (editingNetworkSettings || !hasSettings);

  networkSettingsForm.classList.toggle("hidden", !showForm);
  networkSettingsGuide.classList.toggle("hidden", !selectedId || showForm);
  renderNetworkSettingsSummary(settings);
}

function renderNetworkSettingsSummary(settings) {
  networkSettingsSummary.innerHTML = "";

  if (!hasSavedNetworkSettings(settings)) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state compact";
    emptyState.innerHTML = "<strong>Nenhuma configuracao salva</strong><span>Preencha os dados da rede para usar como guia.</span>";
    networkSettingsSummary.append(emptyState);
    return;
  }

  const rows = [
    ["Hostname", settings.serverHostname],
    ["Dominio local", settings.localDomain],
    ["IP do servidor", settings.serverIp],
    ["Mascara", settings.subnetMask],
    ["DNS", settings.dns],
    ["WINS", settings.wins]
  ];

  rows.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "summary-item";

    const labelElement = document.createElement("span");
    labelElement.textContent = label;

    const valueElement = document.createElement("strong");
    valueElement.textContent = value || "Nao informado";

    item.append(labelElement, valueElement);
    networkSettingsSummary.append(item);
  });
}

function renderEmailSettings(settings) {
  Object.entries(emailSettingsFields).forEach(([key, field]) => {
    if (field.type === "checkbox") {
      field.checked = Boolean(settings[key]);
      return;
    }

    field.value = settings[key] ?? "";
  });

  renderEmailSettingsMode(settings);
}

function renderEmailSettingsMode(settings) {
  const hasSettings = hasSavedEmailSettings(settings);
  const showForm = selectedId && (editingEmailSettings || !hasSettings);

  emailSettingsForm.classList.toggle("hidden", !showForm);
  emailSettingsGuide.classList.toggle("hidden", !selectedId || showForm);
  renderEmailSettingsSummary(settings);
}

function renderEmailSettingsSummary(settings) {
  emailSettingsSummary.innerHTML = "";

  if (!hasSavedEmailSettings(settings)) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state compact";
    emptyState.innerHTML = "<strong>Nenhuma configuracao salva</strong><span>Preencha os dados do servidor para usar como guia.</span>";
    emailSettingsSummary.append(emptyState);
    return;
  }

  const rows = [
    ["Tipo", settings.accountType],
    ["Dominio", settings.domain],
    ["Entrada", joinServerPort(settings.incomingServer, settings.incomingPort)],
    ["Saida", joinServerPort(settings.outgoingServer, settings.outgoingPort)],
    ["Seguranca", settings.security],
    ["SMTP autentica", settings.smtpAuth ? "Sim" : "Nao"]
  ];

  rows.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "summary-item";

    const labelElement = document.createElement("span");
    labelElement.textContent = label;

    const valueElement = document.createElement("strong");
    valueElement.textContent = value || "Nao informado";

    item.append(labelElement, valueElement);
    emailSettingsSummary.append(item);
  });
}

function renderRelatedRecords() {
  const selectedClient = getSelectedClient();
  renderEquipment(selectedClient.equipment);
  renderEmails(selectedClient.emails);
}

function renderEquipment(equipment) {
  equipmentList.innerHTML = "";
  const search = normalize(equipmentFilter.value);
  const visibleEquipment = equipment.filter((item) => {
    const haystack = normalize(`${item.category} ${getEquipmentModel(item)} ${item.networkType}`);
    return haystack.includes(search);
  });

  if (!selectedId || equipment.length === 0) {
    equipmentList.append(emptyRecordsTemplate.content.cloneNode(true));
    return;
  }

  if (visibleEquipment.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum equipamento encontrado";
    emptyState.querySelector("span").textContent = "Ajuste o filtro para ver outros equipamentos.";
    equipmentList.append(emptyState);
    return;
  }

  visibleEquipment.forEach((item) => {
    const card = document.createElement("button");
    card.className = "record-card clickable";
    card.type = "button";
    card.addEventListener("click", () => openEquipmentDialog(item.id));

    const content = document.createElement("div");
    content.className = "record-content";

    const title = document.createElement("strong");
    title.textContent = getEquipmentModel(item);

    const category = document.createElement("span");
    category.className = "record-tag";
    category.textContent = item.category || "Sem categoria";

    const details = document.createElement("span");
    const network = item.networkType === "Estatico" ? `Estatico: ${item.ipAddress || "sem IP"}` : "DHCP";
    details.textContent = [network, getEquipmentDetailsSummary(item)].filter(Boolean).join(" | ");

    content.append(category, title, details);
    card.append(content);
    equipmentList.append(card);
  });
}

function renderEquipmentCategories() {
  const selectedValue = equipmentCategory.value;
  fillCategorySelect(equipmentCategory, { includeNewOption: true });

  if ([...equipmentCategory.options].some((option) => option.value === selectedValue)) {
    equipmentCategory.value = selectedValue;
  }

  toggleNewCategoryField();
  fillCategorySelect(editEquipmentCategory);
}

function renderEmails(emails) {
  emailList.innerHTML = "";

  if (!selectedId || emails.length === 0) {
    emailList.append(emptyRecordsTemplate.content.cloneNode(true));
    return;
  }

  emails.forEach((item) => {
    const card = document.createElement("article");
    card.className = "record-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const title = document.createElement("strong");
    title.textContent = item.email;

    const details = document.createElement("span");
    details.textContent = item.type;

    const passwordRow = document.createElement("span");
    passwordRow.className = "email-password-row";

    const passwordValue = document.createElement("code");
    passwordValue.textContent = item.password ? "••••••••" : "Sem senha";

    const togglePasswordButton = document.createElement("button");
    togglePasswordButton.className = "password-toggle inline";
    togglePasswordButton.type = "button";
    togglePasswordButton.textContent = "👁";
    togglePasswordButton.title = "Mostrar senha";
    togglePasswordButton.setAttribute("aria-label", "Mostrar senha");
    togglePasswordButton.disabled = !item.password;
    togglePasswordButton.addEventListener("click", () => {
      const isHidden = passwordValue.dataset.visible !== "true";
      passwordValue.dataset.visible = isHidden ? "true" : "false";
      passwordValue.textContent = isHidden ? item.password : "••••••••";
      togglePasswordButton.title = isHidden ? "Ocultar senha" : "Mostrar senha";
      togglePasswordButton.setAttribute("aria-label", togglePasswordButton.title);
    });

    passwordRow.append("Senha: ", passwordValue, togglePasswordButton);

    const actions = document.createElement("div");
    actions.className = "record-actions";

    const editButton = document.createElement("button");
    editButton.className = "ghost symbol-button";
    editButton.type = "button";
    editButton.textContent = "✎";
    editButton.title = "Editar e-mail";
    editButton.setAttribute("aria-label", "Editar e-mail");
    editButton.disabled = !canModify("clients");
    editButton.addEventListener("click", () => editEmail(item.id));

    const removeButton = document.createElement("button");
    removeButton.className = "icon-danger symbol-button";
    removeButton.type = "button";
    removeButton.textContent = "x";
    removeButton.title = "Excluir e-mail";
    removeButton.setAttribute("aria-label", "Excluir e-mail");
    removeButton.addEventListener("click", () => removeRelatedRecord("emails", item.id));

    actions.append(editButton, removeButton);
    content.append(title, details, passwordRow);
    card.append(content, actions);
    emailList.append(card);
  });
}

function saveClient(event) {
  event.preventDefault();

  if (!requireModify("clients")) {
    return;
  }

  const formData = Object.fromEntries(new FormData(form).entries());
  const now = new Date().toISOString();
  const existingIndex = clients.findIndex((client) => client.id === selectedId);
  const action = existingIndex >= 0 ? "Cliente atualizado" : "Cliente criado";

  if (existingIndex >= 0) {
    clients[existingIndex] = {
      ...clients[existingIndex],
      ...formData,
      updatedAt: now
    };
    selectedId = clients[existingIndex].id;
  } else {
    const client = normalizeClient({
      ...formData,
      id: createId("CLI"),
      updatedAt: now
    });
    clients = [client, ...clients];
    selectedId = client.id;
  }

  persistClients();
  logActivity(action, `Cliente ${formData.name || "sem nome"}.`);
  render();
}

function addEquipment(event) {
  event.preventDefault();

  if (!requireModify("clients")) {
    return;
  }

  const formData = Object.fromEntries(new FormData(equipmentForm).entries());
  const category = resolveEquipmentCategory(formData);
  const brandModel = resolveBrandModel(formData);

  if (!category) {
    newEquipmentCategory.focus();
    return;
  }

  if (!brandModel) {
    newEquipmentBrand.focus();
    return;
  }

  updateSelectedClient((client) => {
    const item = {
      id: createId("EQP"),
      category,
      brand: brandModel.brand,
      model: brandModel.model,
      networkType: formData.networkType,
      ipAddress: formData.networkType === "Estatico" ? formData.ipAddress.trim() : ""
    };

    return {
      ...client,
      equipment: [item, ...client.equipment],
      updatedAt: new Date().toISOString()
    };
  });

  equipmentForm.reset();
  equipmentCategory.value = equipmentCategories[0] ?? "";
  toggleNewCategoryField();
  renderBrandOptions(equipmentBrand, equipmentModel);
  toggleNewBrandModelFields(newEquipmentBrandModel, newEquipmentBrand, newEquipmentModel, equipmentBrand, equipmentModel);
  toggleEquipmentIpField(equipmentNetworkType, equipmentIpLabel, equipmentIp);
  logActivity("Equipamento adicionado", `${brandModel.brand} ${brandModel.model} em ${getSelectedClient().name || "cliente sem nome"}.`);
}

function openEquipmentDialog(itemId) {
  if (!canAccess("clients")) {
    return;
  }

  const item = getSelectedClient().equipment.find((equipmentItem) => equipmentItem.id === itemId);

  if (!item) {
    return;
  }

  editingEquipmentId = itemId;
  equipmentActionMessage.textContent = "";
  deleteEquipmentButton.disabled =
    needsDeleteAuthorization() &&
    hasPendingDeleteAuthorization("delete-equipment", { clientId: selectedId, collection: "equipment", itemId });
  if (deleteEquipmentButton.disabled) {
    equipmentActionMessage.textContent = "solicitação de exclusão enviada";
  }
  ensureCategoryOption(item.category);
  ensureBrandModelOption(item.brand, item.model || item.name);
  editEquipmentCategory.value = item.category || equipmentCategories[0] || "";
  editEquipmentBrand.value = item.brand || "";
  renderModelOptions(editEquipmentBrand, editEquipmentModel);
  editEquipmentModel.value = item.model || item.name || "";
  toggleNewBrandModelFields(editNewEquipmentBrandModel, editNewEquipmentBrand, editNewEquipmentModel, editEquipmentBrand, editEquipmentModel);
  editEquipmentNetworkType.value = item.networkType || "DHCP";
  editEquipmentIp.value = item.ipAddress || "";
  toggleEquipmentIpField(editEquipmentNetworkType, editEquipmentIpLabel, editEquipmentIp);
  fillEquipmentDetailsForm(item);
  renderEquipmentExtraFields();
  equipmentDialog.showModal();
}

function closeEquipmentDialog() {
  editingEquipmentId = "";

  if (equipmentDialog.open) {
    equipmentDialog.close();
  }
}

function saveEditedEquipment(event) {
  event.preventDefault();

  if (!requireModify("clients")) {
    return;
  }

  if (!editingEquipmentId) {
    return;
  }

  const data = Object.fromEntries(new FormData(editEquipmentForm).entries());
  const brandModel = resolveBrandModel(data);
  const details = readEquipmentDetails(data.category, data);

  if (!brandModel) {
    editNewEquipmentBrand.focus();
    return;
  }

  updateSelectedClient((client) => ({
    ...client,
    equipment: client.equipment.map((item) => {
      if (item.id !== editingEquipmentId) {
        return item;
      }

      return {
        ...item,
        category: data.category,
        brand: brandModel.brand,
        model: brandModel.model,
        networkType: data.networkType,
        ipAddress: data.networkType === "Estatico" ? data.ipAddress.trim() : "",
        details
      };
    }),
    updatedAt: new Date().toISOString()
  }));

  closeEquipmentDialog();
  logActivity("Equipamento atualizado", `${brandModel.brand} ${brandModel.model} em ${getSelectedClient().name || "cliente sem nome"}.`);
}

function deleteEditingEquipment() {
  if (!requireModify("clients")) {
    return;
  }

  if (!editingEquipmentId) {
    return;
  }

  removeRelatedRecord("equipment", editingEquipmentId);
  closeEquipmentDialog();
}

function addEmail(event) {
  event.preventDefault();

  if (!requireModify("clients")) {
    return;
  }

  const selectedClient = getSelectedClient();
  const data = Object.fromEntries(new FormData(emailForm).entries());
  const fullEmail = buildClientEmailAddress(data.emailUser, selectedClient.emailSettings?.domain);
  const emailType = resolveEmailType(data.type, data.newType);

  if (!fullEmail || !emailType) {
    return;
  }

  updateSelectedClient((client) => {
    const item = {
      id: editingEmailId || createId("EML"),
      email: fullEmail,
      emailUser: extractEmailUser(fullEmail),
      password: data.password,
      type: emailType
    };

    if (editingEmailId) {
      return {
        ...client,
        emails: client.emails.map((email) => (email.id === editingEmailId ? item : email)),
        updatedAt: new Date().toISOString()
      };
    }

    return {
      ...client,
      emails: [item, ...client.emails],
      updatedAt: new Date().toISOString()
    };
  });

  const action = editingEmailId ? "E-mail atualizado" : "E-mail adicionado";
  editingEmailId = "";
  emailForm.reset();
  toggleNewEmailTypeField();
  logActivity(action, `${fullEmail} em ${getSelectedClient().name || "cliente sem nome"}.`);
}

function editEmail(emailId) {
  if (!requireModify("clients")) {
    return;
  }

  const selectedClient = getSelectedClient();
  const email = selectedClient.emails.find((item) => item.id === emailId);

  if (!email) {
    return;
  }

  editingEmailId = emailId;
  emailForm.elements.emailUser.value = email.emailUser || extractEmailUser(email.email);
  emailForm.elements.password.value = email.password || "";
  renderEmailTypeOptions(emailTypes.some((type) => normalize(type) === normalize(email.type)) ? email.type : NEW_EMAIL_TYPE_VALUE);

  if (extraEmailType.value === NEW_EMAIL_TYPE_VALUE) {
    newEmailType.value = email.type || "";
  }

  toggleNewEmailTypeField();
  emailForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resolveEmailType(type, newType) {
  if (type !== NEW_EMAIL_TYPE_VALUE) {
    return type;
  }

  const cleanType = String(newType || "").trim();

  if (!cleanType) {
    newEmailType.focus();
    return "";
  }

  ensureEmailType(cleanType);
  renderEmailTypeOptions(cleanType);
  return cleanType;
}

function ensureEmailType(type) {
  const cleanType = String(type || "").trim();

  if (!cleanType || emailTypes.some((item) => normalize(item) === normalize(cleanType))) {
    return;
  }

  emailTypes = uniqueTextOptions([...emailTypes, cleanType]);
  persistEmailTypes();
}

function uniqueTextOptions(values) {
  return [...new Map(values.filter(Boolean).map((value) => [normalize(value), String(value).trim()])).values()].sort((first, second) =>
    first.localeCompare(second, "pt-BR")
  );
}

function toggleNewEmailTypeField() {
  const isNewType = extraEmailType.value === NEW_EMAIL_TYPE_VALUE;
  newEmailTypeLabel.classList.toggle("hidden", !isNewType);
  newEmailType.required = isNewType;

  if (!isNewType) {
    newEmailType.value = "";
  }
}

function buildClientEmailAddress(emailUser, configuredDomain) {
  const rawUser = String(emailUser || "").trim();

  if (!rawUser) {
    return "";
  }

  if (rawUser.includes("@")) {
    return rawUser;
  }

  const domain = normalizeEmailDomain(configuredDomain);

  if (!domain) {
    return rawUser;
  }

  return `${rawUser}${domain}`;
}

function normalizeEmailDomain(domain) {
  const value = String(domain || "").trim();

  if (!value) {
    return "";
  }

  return value.startsWith("@") ? value : `@${value}`;
}

function extractEmailUser(email) {
  return String(email || "").split("@")[0] || "";
}

function handlePasswordToggleClick(event) {
  const button = event.target.closest("[data-toggle-password]");

  if (!button) {
    return;
  }

  const input = document.querySelector(`#${button.dataset.togglePassword}`);

  if (!input) {
    return;
  }

  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.title = shouldShow ? "Ocultar senha" : "Mostrar senha";
  button.setAttribute("aria-label", button.title);
}

function saveNetworkSettings(event) {
  event.preventDefault();

  if (!requireModify("clients")) {
    return;
  }

  const settings = readNetworkSettings();

  updateSelectedClient((client) => ({
    ...client,
    networkSettings: settings,
    updatedAt: new Date().toISOString()
  }));

  editingNetworkSettings = false;
  renderNetworkSettingsMode(settings);
  logActivity("Rede atualizada", `Configuracao de rede de ${getSelectedClient().name || "cliente sem nome"}.`);
}

function saveEmailSettings(event) {
  event.preventDefault();

  if (!requireModify("clients")) {
    return;
  }

  const settings = readEmailSettings();

  updateSelectedClient((client) => ({
    ...client,
    emailSettings: settings,
    updatedAt: new Date().toISOString()
  }));

  editingEmailSettings = false;
  renderEmailSettingsMode(settings);
  logActivity("Servidor de e-mail atualizado", `Configuracao de e-mail de ${getSelectedClient().name || "cliente sem nome"}.`);
}

function removeRelatedRecord(collection, itemId) {
  if (!requireModify("clients")) {
    return;
  }

  const selectedClient = getSelectedClient();
  const item = selectedClient[collection].find((record) => record.id === itemId);

  if (needsDeleteAuthorization()) {
    const sent = requestDeleteAuthorization(
      collection === "emails" ? "delete-email" : "delete-equipment",
      collection === "emails" ? "Excluir e-mail" : "Excluir equipamento",
      `${collection === "emails" ? item?.email : getEquipmentModel(item || {})} de ${selectedClient.name || "cliente sem nome"}`,
      { clientId: selectedClient.id, collection, itemId }
    );
    equipmentActionMessage.textContent = sent ? "solicitação de exclusão enviada" : "solicitação de exclusão já enviada";
    deleteEquipmentButton.disabled = true;
    return;
  }

  deleteRelatedRecord(selectedClient.id, collection, itemId);
}

function deleteRelatedRecord(clientId, collection, itemId) {
  const clientBeforeDelete = clients.find((client) => client.id === clientId);
  clients = clients.map((client) => {
    if (client.id !== clientId) {
      return client;
    }

    return normalizeClient({
      ...client,
      [collection]: client[collection].filter((item) => item.id !== itemId),
      updatedAt: new Date().toISOString()
    });
  });
  persistClients();
  logActivity("Registro excluido", `${collection === "emails" ? "E-mail" : "Equipamento"} removido de ${clientBeforeDelete?.name || "cliente sem nome"}.`);
  render();
}

function updateSelectedClient(updater) {
  if (!selectedId) {
    return;
  }

  clients = clients.map((client) => {
    if (client.id !== selectedId) {
      return client;
    }

    return normalizeClient(updater(client));
  });

  persistClients();
  render();
}

function selectClient(id) {
  selectedId = id;
  editingNetworkSettings = false;
  editingEmailSettings = false;
  editingAgendaId = "";
  editingEmailId = "";
  render();
}

function startNewClient() {
  if (!requireModify("clients")) {
    return;
  }

  selectedId = "";
  activeTab = "profile";
  editingNetworkSettings = true;
  editingEmailSettings = true;
  editingAgendaId = "";
  editingEmailId = "";
  form.reset();
  equipmentForm.reset();
  networkSettingsForm.reset();
  emailSettingsForm.reset();
  emailForm.reset();
  equipmentFilter.value = "";
  toggleNewBrandModelFields(newEquipmentBrandModel, newEquipmentBrand, newEquipmentModel, equipmentBrand, equipmentModel);
  fields.status.value = "Ativo";
  render();
  fields.name.focus();
}

function deleteSelectedClient() {
  if (!requireModify("clients")) {
    return;
  }

  if (!selectedId) {
    return;
  }

  const selectedClient = clients.find((client) => client.id === selectedId);

  if (needsDeleteAuthorization()) {
    const sent = requestDeleteAuthorization("delete-client", "Excluir cliente", `Cliente ${selectedClient?.name || "sem nome"}`, {
      clientId: selectedId
    });
    clientActionMessage.textContent = sent ? "solicitação de exclusão enviada" : "solicitação de exclusão já enviada";
    deleteClientButton.disabled = true;
    return;
  }

  const confirmed = window.confirm(`Excluir ${selectedClient?.name || "este cliente"}?`);

  if (!confirmed) {
    return;
  }

  clients = clients.filter((client) => client.id !== selectedId);
  selectedId = clients[0]?.id ?? "";
  activeTab = "profile";
  editingNetworkSettings = false;
  editingEmailSettings = false;
  persistClients();
  logActivity("Cliente excluido", `Cliente ${selectedClient?.name || "sem nome"} foi excluido.`);
  render();
}

function executeAuthorizedRequest(request) {
  if (request.type === "create-agenda") {
    createAgendaFromPayload(request.payload);
    return;
  }

  if (request.type === "delete-client") {
    deleteClientById(request.payload.clientId, false);
    return;
  }

  if (request.type === "delete-equipment" || request.type === "delete-email") {
    deleteRelatedRecord(request.payload.clientId, request.payload.collection, request.payload.itemId);
  }
}

function deleteClientById(clientId, askConfirmation = true) {
  const client = clients.find((item) => item.id === clientId);

  if (!client) {
    return;
  }

  if (askConfirmation && !window.confirm(`Excluir ${client.name || "este cliente"}?`)) {
    return;
  }

  clients = clients.filter((item) => item.id !== clientId);
  selectedId = clients[0]?.id ?? "";
  activeTab = "profile";
  editingNetworkSettings = false;
  editingEmailSettings = false;
  persistClients();
  logActivity("Cliente excluido", `Cliente ${client.name || "sem nome"} foi excluido.`);
  render();
}

function switchDashboardTab(tabName) {
  if (!canAccess(tabName)) {
    return;
  }

  editingAgendaId = "";
  activeDashboardTab = tabName;
  renderDashboardTabs();
}

function renderDashboardTabs() {
  if (!canAccess(activeDashboardTab)) {
    activeDashboardTab = "overview";
  }

  dashboardTabs.forEach((tab) => {
    const isActive = tab.dataset.dashboardTab === activeDashboardTab;
    const isAccessible = canAccess(tab.dataset.dashboardTab);
    tab.classList.toggle("active", isActive);
    tab.classList.toggle("hidden", !isAccessible);
    tab.disabled = !isAccessible;
    tab.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(dashboardPanels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === activeDashboardTab);
  });
}

function switchTab(tabName) {
  if (tabName !== "emails") {
    editingEmailId = "";
    emailForm.reset();
    toggleNewEmailTypeField();
  }

  activeTab = tabName;
  renderTabs();
}

function renderTabs() {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === activeTab;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(panels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === activeTab);
  });
}

function setRelatedFormsDisabled(disabled) {
  [...equipmentForm.elements, ...networkSettingsForm.elements, ...emailSettingsForm.elements, ...emailForm.elements].forEach((element) => {
    element.disabled = disabled;
  });
}

function readNetworkSettings() {
  return {
    serverHostname: networkSettingsFields.serverHostname.value.trim(),
    localDomain: networkSettingsFields.localDomain.value.trim(),
    serverIp: networkSettingsFields.serverIp.value.trim(),
    subnetMask: networkSettingsFields.subnetMask.value.trim(),
    dns: networkSettingsFields.dns.value.trim(),
    wins: networkSettingsFields.wins.value.trim()
  };
}

function readEmailSettings() {
  return {
    accountType: emailSettingsFields.accountType.value,
    domain: emailSettingsFields.domain.value.trim(),
    incomingServer: emailSettingsFields.incomingServer.value.trim(),
    incomingPort: emailSettingsFields.incomingPort.value.trim(),
    outgoingServer: emailSettingsFields.outgoingServer.value.trim(),
    outgoingPort: emailSettingsFields.outgoingPort.value.trim(),
    security: emailSettingsFields.security.value,
    smtpAuth: emailSettingsFields.smtpAuth.checked
  };
}

function hasSavedEmailSettings(settings) {
  return Boolean(
    settings.domain ||
      settings.incomingServer ||
      settings.incomingPort ||
      settings.outgoingServer ||
      settings.outgoingPort ||
      settings.smtpAuth
  );
}

function hasSavedNetworkSettings(settings) {
  return Boolean(settings.serverHostname || settings.localDomain || settings.serverIp || settings.subnetMask || settings.dns || settings.wins);
}

function joinServerPort(server, port) {
  if (server && port) {
    return `${server}:${port}`;
  }

  return server || port;
}

function toggleNewCategoryField() {
  const isCreatingCategory = equipmentCategory.value === NEW_CATEGORY_VALUE;
  newCategoryLabel.classList.toggle("hidden", !isCreatingCategory);
  newEquipmentCategory.required = isCreatingCategory;

  if (!isCreatingCategory) {
    newEquipmentCategory.value = "";
  }
}

function resolveEquipmentCategory(formData) {
  if (formData.category !== NEW_CATEGORY_VALUE) {
    return formData.category;
  }

  const newCategory = formData.newCategory.trim();

  if (!newCategory) {
    return "";
  }

  const existingCategory = equipmentCategories.find((category) => normalize(category) === normalize(newCategory));

  if (existingCategory) {
    return existingCategory;
  }

  equipmentCategories = uniqueCategories([...equipmentCategories, newCategory]).sort((first, second) =>
    first.localeCompare(second, "pt-BR")
  );
  persistEquipmentCategories();
  renderEquipmentCategories();

  return newCategory;
}

function uniqueCategories(categories) {
  return categories.reduce((accumulator, category) => {
    const cleanCategory = String(category).trim();

    if (!cleanCategory) {
      return accumulator;
    }

    const alreadyExists = accumulator.some((item) => normalize(item) === normalize(cleanCategory));
    return alreadyExists ? accumulator : [...accumulator, cleanCategory];
  }, []);
}

function fillCategorySelect(select, options = {}) {
  select.innerHTML = "";

  equipmentCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.append(option);
  });

  if (options.includeNewOption) {
    const newOption = document.createElement("option");
    newOption.value = NEW_CATEGORY_VALUE;
    newOption.textContent = "Criar nova categoria";
    select.append(newOption);
  }
}

function ensureCategoryOption(category) {
  if (!category || equipmentCategories.some((item) => normalize(item) === normalize(category))) {
    fillCategorySelect(editEquipmentCategory);
    return;
  }

  equipmentCategories = uniqueCategories([...equipmentCategories, category]).sort((first, second) =>
    first.localeCompare(second, "pt-BR")
  );
  persistEquipmentCategories();
  fillCategorySelect(editEquipmentCategory);
}

function renderBrandOptions(brandSelect, modelSelect) {
  const selectedBrand = brandSelect.value;
  brandSelect.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Selecione";
  brandSelect.append(emptyOption);

  getBrandNames().forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.append(option);
  });

  const addOption = document.createElement("option");
  addOption.value = NEW_BRAND_MODEL_VALUE;
  addOption.textContent = "Adicionar marca/modelo";
  brandSelect.append(addOption);

  if ([...brandSelect.options].some((option) => option.value === selectedBrand)) {
    brandSelect.value = selectedBrand;
  }

  renderModelOptions(brandSelect, modelSelect);
}

function renderModelOptions(brandSelect, modelSelect) {
  const selectedModel = modelSelect.value;
  modelSelect.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = brandSelect.value === NEW_BRAND_MODEL_VALUE ? "Novo modelo" : "Selecione";
  modelSelect.append(emptyOption);

  if (brandSelect.value && brandSelect.value !== NEW_BRAND_MODEL_VALUE) {
    getModelsForBrand(brandSelect.value).forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.append(option);
    });
  }

  const addOption = document.createElement("option");
  addOption.value = NEW_BRAND_MODEL_VALUE;
  addOption.textContent = "Adicionar marca/modelo";
  modelSelect.append(addOption);

  if ([...modelSelect.options].some((option) => option.value === selectedModel)) {
    modelSelect.value = selectedModel;
  }
}

function toggleNewBrandModelFields(wrapper, brandInput, modelInput, brandSelect, modelSelect) {
  const isAdding = brandSelect.value === NEW_BRAND_MODEL_VALUE || modelSelect.value === NEW_BRAND_MODEL_VALUE;
  wrapper.classList.toggle("hidden", !isAdding);
  brandInput.required = isAdding;
  modelInput.required = isAdding;
  modelSelect.disabled = brandSelect.value === NEW_BRAND_MODEL_VALUE;

  if (!isAdding) {
    brandInput.value = "";
    modelInput.value = "";
  }
}

function resolveBrandModel(formData) {
  const isAdding = formData.brand === NEW_BRAND_MODEL_VALUE || formData.model === NEW_BRAND_MODEL_VALUE;
  const brand = isAdding ? formData.newBrand.trim() : formData.brand;
  const model = isAdding ? formData.newModel.trim() : formData.model;

  if (!brand || !model) {
    return null;
  }

  ensureBrandModelOption(brand, model);
  return { brand, model };
}

function ensureBrandModelOption(brand, model) {
  const cleanBrand = String(brand || "").trim();
  const cleanModel = String(model || "").trim();

  if (!cleanBrand || !cleanModel) {
    return;
  }

  const existingBrand = equipmentBrandModels.find((item) => normalize(item.brand) === normalize(cleanBrand));

  if (existingBrand) {
    if (!existingBrand.models.some((item) => normalize(item) === normalize(cleanModel))) {
      existingBrand.models = [...existingBrand.models, cleanModel].sort((first, second) => first.localeCompare(second, "pt-BR"));
      persistEquipmentBrandModels();
    }
    return;
  }

  equipmentBrandModels = [...equipmentBrandModels, { brand: cleanBrand, models: [cleanModel] }].sort((first, second) =>
    first.brand.localeCompare(second.brand, "pt-BR")
  );
  persistEquipmentBrandModels();
}

function getBrandNames() {
  return equipmentBrandModels.map((item) => item.brand).filter(Boolean);
}

function getModelsForBrand(brand) {
  return equipmentBrandModels.find((item) => normalize(item.brand) === normalize(brand))?.models ?? [];
}

function renderEquipmentExtraFields() {
  const type = getEquipmentCategoryType(editEquipmentCategory.value);

  printerFields.classList.toggle("hidden", type !== "printer");
  computerFields.classList.toggle("hidden", type !== "computer");
  networkEquipmentFields.classList.toggle("hidden", type !== "network");
}

function toggleEquipmentIpField(select, label, input) {
  const isStatic = select.value === "Estatico";
  label.classList.toggle("hidden", !isStatic);
  input.required = isStatic;

  if (!isStatic) {
    input.value = "";
  }
}

function fillEquipmentDetailsForm(item) {
  const details = item.details ?? {};
  editEquipmentForm.querySelector("#printerSerial").value = details.printerSerial ?? item.serial ?? "";
  editEquipmentForm.querySelector("#printerSector").value = details.printerSector ?? "";
  editEquipmentForm.querySelector("#printerMac").value = details.printerMac ?? "";
  editEquipmentForm.querySelector("#computerType").value = details.computerType ?? "";
  editEquipmentForm.querySelector("#computerSerial").value = details.computerSerial ?? item.serial ?? "";
  editEquipmentForm.querySelector("#networkEquipmentType").value = details.networkEquipmentType ?? "";
  editEquipmentForm.querySelector("#networkEquipmentMac").value = details.networkEquipmentMac ?? "";
}

function readEquipmentDetails(category, data) {
  const type = getEquipmentCategoryType(category);

  if (type === "printer") {
    return {
      printerSerial: data.printerSerial?.trim() ?? "",
      printerSector: data.printerSector?.trim() ?? "",
      printerMac: data.printerMac?.trim() ?? ""
    };
  }

  if (type === "computer") {
    return {
      computerType: data.computerType ?? "",
      computerSerial: data.computerSerial?.trim() ?? ""
    };
  }

  if (type === "network") {
    return {
      networkEquipmentType: data.networkEquipmentType ?? "",
      networkEquipmentMac: data.networkEquipmentMac?.trim() ?? ""
    };
  }

  return {};
}

function getEquipmentDetailsSummary(item) {
  const details = item.details ?? {};
  const type = getEquipmentCategoryType(item.category);

  if (type === "printer") {
    return [details.printerSerial && `S/N ${details.printerSerial}`, details.printerSector, details.printerMac && `MAC ${details.printerMac}`]
      .filter(Boolean)
      .join(" | ");
  }

  if (type === "computer") {
    return [details.computerType, details.computerSerial && `SN ${details.computerSerial}`].filter(Boolean).join(" | ");
  }

  if (type === "network") {
    return [details.networkEquipmentType, details.networkEquipmentMac && `MAC ${details.networkEquipmentMac}`].filter(Boolean).join(" | ");
  }

  return "";
}

function getEquipmentCategoryType(category) {
  const normalized = normalize(category);

  if (normalized.includes("impressora")) {
    return "printer";
  }

  if (normalized.includes("computador")) {
    return "computer";
  }

  if (normalized.includes("rede")) {
    return "network";
  }

  return "";
}

function getEquipmentModel(item) {
  return [item.brand, item.model || item.name].filter(Boolean).join(" ") || "Sem marca/modelo";
}

function getSelectedClient() {
  return clients.find((client) => client.id === selectedId) ?? emptyClient;
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSimpleDate(value) {
  if (!value) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
}
