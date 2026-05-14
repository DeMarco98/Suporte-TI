const STORAGE_KEY = "cadastros-clientes";
const CATEGORY_STORAGE_KEY = "cadastros-categorias-equipamentos";
const BRAND_MODEL_STORAGE_KEY = "cadastros-marcas-modelos-equipamentos";
const USER_STORAGE_KEY = "cadastros-usuarios";
const LOG_STORAGE_KEY = "cadastros-logs";
const COMPANY_STORAGE_KEY = "cadastros-minha-empresa";
const AGENDA_STORAGE_KEY = "cadastros-agenda";
const AGENDA_COUNTER_STORAGE_KEY = "cadastros-agenda-contador";
const INFRASTRUCTURE_AGENDA_STORAGE_KEY = "cadastros-agenda-infraestrutura";
const INFRASTRUCTURE_AGENDA_COUNTER_STORAGE_KEY = "cadastros-agenda-infraestrutura-contador";
const SERVICE_ORDER_STORAGE_KEY = "cadastros-ordens-servico";
const SERVICE_ORDER_COUNTER_STORAGE_KEY = "cadastros-ordens-servico-contador";
const SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY = "cadastros-tipos-equipamento-os";
const EXTERNAL_REPAIR_LOCATION_STORAGE_KEY = "cadastros-locais-conserto-externo";
const EMAIL_TYPE_STORAGE_KEY = "cadastros-tipos-email";
const AUTHORIZATION_STORAGE_KEY = "cadastros-autorizacoes";
const SESSION_STORAGE_KEY = "cadastros-admin-logado";
const DISMISSED_NOTIFICATION_STORAGE_KEY = "cadastros-notificacoes-limpas";
const WORKSPACE_STATE_STORAGE_KEY = "cadastros-posicao-usuario";
const FORM_DRAFT_STORAGE_KEY = "cadastros-rascunhos-formularios";
const LOG_BACKUP_STORAGE_KEY = "cadastros-logs-backup-local";
const LOCAL_BACKUP_STORAGE_KEY = "cadastros-backup-local";
const LOCAL_THEME_STORAGE_KEY = "cadastros-tema-local";
const ADMIN_USER = "administrador";
const NEW_CATEGORY_VALUE = "__new_category__";
const NEW_BRAND_MODEL_VALUE = "__new_brand_model__";
const NEW_SERVICE_ORDER_EQUIPMENT_TYPE_VALUE = "__new_service_order_equipment_type__";
const NEW_EMAIL_TYPE_VALUE = "__new_email_type__";
const NEW_COMPANY_STOCK_TYPE_VALUE = "__new_company_stock_type__";
const serviceOrderStatuses = ["Aberta", "Em analise", "Aguardando orcamento", "Em conserto", "Conserto Externo", "Fechada", "Concluida", "Cancelada"];
const agendaStatuses = ["Aberto", "Em analise", "Concluido", "Cancelado"];
const defaultServiceOrderEquipmentTypes = ["Notebook", "Computador", "All-In-One", "Impressora"];
const defaultEmailTypes = ["Comercial", "Financeiro", "Suporte", "Pessoal"];
const defaultCompanyStockTypes = ["Toner", "Cabo", "Mouse", "Teclado", "Fonte", "HD", "SSD"];

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
  COMPANY_STORAGE_KEY,
  AGENDA_STORAGE_KEY,
  AGENDA_COUNTER_STORAGE_KEY,
  INFRASTRUCTURE_AGENDA_STORAGE_KEY,
  INFRASTRUCTURE_AGENDA_COUNTER_STORAGE_KEY,
  SERVICE_ORDER_STORAGE_KEY,
  SERVICE_ORDER_COUNTER_STORAGE_KEY,
  SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY,
  EXTERNAL_REPAIR_LOCATION_STORAGE_KEY,
  EMAIL_TYPE_STORAGE_KEY,
  AUTHORIZATION_STORAGE_KEY
];
const dashboardSections = [
  { id: "overview", label: "Dashboard" },
  { id: "clients", label: "Clientes" },
  { id: "agenda", label: "Agendamentos" },
  { id: "infrastructureAgenda", label: "Agendamentos Infraestrutura" },
  { id: "serviceOrders", label: "Ordem de Servico" },
  { id: "company", label: "Minha Empresa" },
  { id: "users", label: "Usuarios" },
  { id: "logs", label: "Logs" },
  { id: "permissions", label: "Permissoes" },
  { id: "reports", label: "Relatorios" },
  { id: "finance", label: "Financeiro" },
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
const emptyAlertSettings = {
  agendaDays: 0,
  serviceOrderDays: 0
};
const emptyThemeSettings = {
  systemColor: "#f6f4ef",
  primaryColor: "#256d85",
  secondaryColor: "#527853",
  layout: "classic",
  mode: "light",
  fontSize: "normal",
  density: "normal",
  statusOpenColor: "#16833a",
  statusAnalysisColor: "#9b7200",
  statusBudgetColor: "#b86b00",
  statusRepairColor: "#8a7800",
  statusExternalRepairColor: "#6d5bd0",
  statusClosedColor: "#a33a3a",
  statusDoneColor: "#1f7a4d",
  statusCanceledColor: "#777777"
};
const emptyCompanyInfo = {
  companyName: "",
  companyDocument: "",
  companyPhone: "",
  companyEmail: "",
  companyAddress: "",
  networkProvider: "",
  networkIp: "",
  networkGateway: "",
  networkDns: "",
  wifiName: "",
  wifiPassword: "",
  notes: "",
  vehicles: [],
  stockTypes: defaultCompanyStockTypes,
  stockItems: [],
  finance: {},
  financeGlobal: {
    expenses: [],
    payments: [],
    clients: {}
  },
  alertSettings: emptyAlertSettings,
  themeSettings: emptyThemeSettings,
  updatedAt: ""
};

const emptyClient = {
  id: "",
  clientType: "Mensalista",
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
  cftv: [],
  emailSettings: emptyEmailSettings,
  networkSettings: emptyNetworkSettings,
  updatedAt: ""
};

let clients = loadClients();
let equipmentCategories = loadEquipmentCategories();
let equipmentBrandModels = loadEquipmentBrandModels();
let companyInfo = loadCompanyInfo();
let users = loadUsers();
let logs = loadLogs();
let agendaItems = loadAgendaItems();
let agendaCounter = loadAgendaCounter();
agendaItems = ensureAgendaNumbers(agendaItems);
agendaCounter = loadAgendaCounter();
let infrastructureAgendaItems = loadInfrastructureAgendaItems();
let infrastructureAgendaCounter = loadInfrastructureAgendaCounter();
infrastructureAgendaItems = ensureAgendaNumbers(infrastructureAgendaItems);
infrastructureAgendaCounter = loadInfrastructureAgendaCounter();
let serviceOrders = loadServiceOrders();
let serviceOrderCounter = loadServiceOrderCounter();
let serviceOrderEquipmentTypes = loadServiceOrderEquipmentTypes();
let externalRepairLocations = loadExternalRepairLocations();
let emailTypes = loadEmailTypes();
let authorizationRequests = loadAuthorizationRequests();
let dismissedNotifications = loadDismissedNotifications();
let selectedId = clients[0]?.id ?? "";
let activeTab = "profile";
let activeDashboardTab = "overview";
let activeServiceOrderView = "list";
let activeAgendaView = "list";
let activeInfrastructureAgendaView = "list";
let activeCompanyView = "profile";
let activeSettingsView = "theme";
let activeFinanceMainView = "employees";
let editingEmailSettings = false;
let editingNetworkSettings = false;
let editingAgendaId = "";
let editingInfrastructureAgendaId = "";
let editingEquipmentId = "";
let editingEmailId = "";
let editingDvrId = "";
let editingServiceOrderId = "";
let editingCompanyVehicleId = "";
let editingCompanyVehicleFineDrafts = [];
let editingCompanyVehicleDocumentationDraft = createEmptyVehicleDocumentation();
let editingCompanyStockItemId = "";
let editingFinanceUserId = "";
let editingFinanceAdvanceId = "";
let selectedFinanceClientId = "";
let editingFinanceClientBilling = false;
let editingPasswordUserId = "";
let permissionDrafts = {};
let currentUser = loadSessionUser();
let isAdminLoggedIn = currentUser?.role === "admin";
restoreWorkspaceState({ applyFields: false });
let firebaseDb = null;
let firebaseAuth = null;
let firebaseSyncEnabled = false;
let firebaseAuthRequired = false;
let firebaseHydrating = false;
let firebaseRealtimeStarted = false;
let firebaseSnapshotApplying = false;
let firebaseSyncStatus = "offline";
let firebaseUnsubscribers = [];
const firebaseCollectionDocIds = {};

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
  get infrastructureAgendaItems() {
    return infrastructureAgendaItems;
  },
  set infrastructureAgendaItems(value) {
    infrastructureAgendaItems = value;
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
const syncStatus = document.querySelector("#syncStatus");
const alertButton = document.querySelector("#alertButton");
const alertCount = document.querySelector("#alertCount");
const alertPanel = document.querySelector("#alertPanel");
const alertList = document.querySelector("#alertList");
const notificationButton = document.querySelector("#notificationButton");
const notificationCount = document.querySelector("#notificationCount");
const notificationPanel = document.querySelector("#notificationPanel");
const notificationList = document.querySelector("#notificationList");
const clearNotificationsButton = document.querySelector("#clearNotificationsButton");
const dashboardClientTotal = document.querySelector("#dashboardClientTotal");
const dashboardActiveClientTotal = document.querySelector("#dashboardActiveClientTotal");
const dashboardUserTotal = document.querySelector("#dashboardUserTotal");
const dashboardActiveUserTotal = document.querySelector("#dashboardActiveUserTotal");
const dashboardAgendaTotal = document.querySelector("#dashboardAgendaTotal");
const dashboardOpenAgendaTotal = document.querySelector("#dashboardOpenAgendaTotal");
const dashboardServiceOrderTotal = document.querySelector("#dashboardServiceOrderTotal");
const dashboardOpenServiceOrderTotal = document.querySelector("#dashboardOpenServiceOrderTotal");
const dashboardAlertTotal = document.querySelector("#dashboardAlertTotal");
const dashboardAuthorizationTotal = document.querySelector("#dashboardAuthorizationTotal");
const dashboardStatusList = document.querySelector("#dashboardStatusList");
const dashboardPendingList = document.querySelector("#dashboardPendingList");
const dashboardRecentLogs = document.querySelector("#dashboardRecentLogs");
const userForm = document.querySelector("#userForm");
const userMessage = document.querySelector("#userMessage");
const userList = document.querySelector("#userList");
const openUserFormButton = document.querySelector("#openUserFormButton");
const userDialog = document.querySelector("#userDialog");
const closeUserDialogButton = document.querySelector("#closeUserDialogButton");
const cancelUserCreateButton = document.querySelector("#cancelUserCreateButton");
const logList = document.querySelector("#logList");
const permissionList = document.querySelector("#permissionList");
const agendaActionMessage = document.querySelector("#agendaActionMessage");
const agendaForm = document.querySelector("#agendaForm");
const agendaDialogTitle = document.querySelector("#agendaDialogTitle");
const agendaClient = document.querySelector("#agendaClient");
const agendaDialogMessage = document.querySelector("#agendaDialogMessage");
const agendaSubmitButton = document.querySelector("#agendaSubmitButton");
const agendaList = document.querySelector("#agendaList");
const agendaSearchInput = document.querySelector("#agendaSearchInput");
const agendaStatusFilter = document.querySelector("#agendaStatusFilter");
const agendaViewButtons = document.querySelectorAll("[data-agenda-view]");
const agendaListPanel = document.querySelector("#agendaListPanel");
const cancelAgendaButton = document.querySelector("#cancelAgendaButton");
const infrastructureAgendaActionMessage = document.querySelector("#infrastructureAgendaActionMessage");
const infrastructureAgendaForm = document.querySelector("#infrastructureAgendaForm");
const infrastructureAgendaDialogTitle = document.querySelector("#infrastructureAgendaDialogTitle");
const infrastructureAgendaClient = document.querySelector("#infrastructureAgendaClient");
const infrastructureAgendaDialogMessage = document.querySelector("#infrastructureAgendaDialogMessage");
const infrastructureAgendaSubmitButton = document.querySelector("#infrastructureAgendaSubmitButton");
const infrastructureAgendaList = document.querySelector("#infrastructureAgendaList");
const infrastructureAgendaSearchInput = document.querySelector("#infrastructureAgendaSearchInput");
const infrastructureAgendaStatusFilter = document.querySelector("#infrastructureAgendaStatusFilter");
const infrastructureAgendaViewButtons = document.querySelectorAll("[data-infrastructure-agenda-view]");
const infrastructureAgendaListPanel = document.querySelector("#infrastructureAgendaListPanel");
const cancelInfrastructureAgendaButton = document.querySelector("#cancelInfrastructureAgendaButton");
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
const addDvrButton = document.querySelector("#addDvrButton");
const dvrList = document.querySelector("#dvrList");
const dvrDialog = document.querySelector("#dvrDialog");
const dvrForm = document.querySelector("#dvrForm");
const dvrDialogTitle = document.querySelector("#dvrDialogTitle");
const closeDvrDialogButton = document.querySelector("#closeDvrDialogButton");
const deleteDvrButton = document.querySelector("#deleteDvrButton");
const dvrActionMessage = document.querySelector("#dvrActionMessage");
const dvrNetworkType = document.querySelector("#dvrNetworkType");
const dvrIpLabel = document.querySelector("#dvrIpLabel");
const dvrIpAddress = document.querySelector("#dvrIpAddress");
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
const companyForm = document.querySelector("#companyForm");
const companyMessage = document.querySelector("#companyMessage");
const companyViewButtons = document.querySelectorAll(".company-tab");
const companyNetworkPanel = document.querySelector("#companyNetworkPanel");
const companyNetworkForm = document.querySelector("#companyNetworkForm");
const companyNetworkMessage = document.querySelector("#companyNetworkMessage");
const companyVehiclesPanel = document.querySelector("#companyVehiclesPanel");
const companyStockPanel = document.querySelector("#companyStockPanel");
const addCompanyVehicleButton = document.querySelector("#addCompanyVehicleButton");
const companyVehicleDialog = document.querySelector("#companyVehicleDialog");
const companyVehicleForm = document.querySelector("#companyVehicleForm");
const companyVehicleDialogTitle = document.querySelector("#companyVehicleDialogTitle");
const companyVehicleDriver = document.querySelector("#companyVehicleDriver");
const closeCompanyVehicleDialogButton = document.querySelector("#closeCompanyVehicleDialogButton");
const deleteCompanyVehicleButton = document.querySelector("#deleteCompanyVehicleButton");
const companyVehicleDetailsDialog = document.querySelector("#companyVehicleDetailsDialog");
const companyVehicleDetailsForm = document.querySelector("#companyVehicleDetailsForm");
const companyVehicleDetailsTitle = document.querySelector("#companyVehicleDetailsTitle");
const closeCompanyVehicleDetailsDialogButton = document.querySelector("#closeCompanyVehicleDetailsDialogButton");
const vehicleDetailTabs = document.querySelectorAll(".vehicle-detail-tab");
const vehicleDetailPanels = {
  info: document.querySelector("#vehicleInfoDetailPanel"),
  maintenance: document.querySelector("#vehicleMaintenanceDetailPanel"),
  documentation: document.querySelector("#vehicleDocumentationDetailPanel"),
  fines: document.querySelector("#vehicleFinesDetailPanel")
};
const companyVehicleInfoSummary = document.querySelector("#companyVehicleInfoSummary");
const companyVehicleFineDriver = document.querySelector("#companyVehicleFineDriver");
const addCompanyVehicleFineButton = document.querySelector("#addCompanyVehicleFineButton");
const companyVehicleFineList = document.querySelector("#companyVehicleFineList");
const vehicleIpvaPdfInput = document.querySelector("#vehicleIpvaPdfInput");
const vehicleLicensingPdfInput = document.querySelector("#vehicleLicensingPdfInput");
const importVehicleIpvaPdfButton = document.querySelector("#importVehicleIpvaPdfButton");
const importVehicleLicensingPdfButton = document.querySelector("#importVehicleLicensingPdfButton");
const exportVehicleIpvaPdfButton = document.querySelector("#exportVehicleIpvaPdfButton");
const exportVehicleLicensingPdfButton = document.querySelector("#exportVehicleLicensingPdfButton");
const vehicleIpvaPdfName = document.querySelector("#vehicleIpvaPdfName");
const vehicleLicensingPdfName = document.querySelector("#vehicleLicensingPdfName");
const companyVehicleMessage = document.querySelector("#companyVehicleMessage");
const companyVehicleList = document.querySelector("#companyVehicleList");
const companyStockForm = document.querySelector("#companyStockForm");
const companyStockType = document.querySelector("#companyStockType");
const companyStockQuantity = document.querySelector("#companyStockQuantity");
const companyStockSubmitButton = document.querySelector("#companyStockSubmitButton");
const newCompanyStockTypeLabel = document.querySelector("#newCompanyStockTypeLabel");
const newCompanyStockType = document.querySelector("#newCompanyStockType");
const companyStockMessage = document.querySelector("#companyStockMessage");
const companyStockList = document.querySelector("#companyStockList");
const dashboardTabs = document.querySelectorAll(".dashboard-tab");
const tabs = document.querySelectorAll(".tab");
const dashboardPanels = {
  overview: document.querySelector("#overviewDashboardPanel"),
  clients: document.querySelector("#clientsDashboardPanel"),
  agenda: document.querySelector("#agendaDashboardPanel"),
  infrastructureAgenda: document.querySelector("#infrastructureAgendaDashboardPanel"),
  serviceOrders: document.querySelector("#serviceOrdersDashboardPanel"),
  company: document.querySelector("#companyDashboardPanel"),
  users: document.querySelector("#usersDashboardPanel"),
  logs: document.querySelector("#logsDashboardPanel"),
  permissions: document.querySelector("#permissionsDashboardPanel"),
  reports: document.querySelector("#reportsDashboardPanel"),
  finance: document.querySelector("#financeDashboardPanel"),
  settings: document.querySelector("#settingsDashboardPanel")
};
const settingsViewButtons = document.querySelectorAll("[data-settings-view]");
const settingsPanels = {
  theme: document.querySelector("#settingsThemePanel"),
  alerts: document.querySelector("#settingsAlertsPanel"),
  password: document.querySelector("#settingsPasswordPanel"),
  logs: document.querySelector("#settingsLogsPanel"),
  system: document.querySelector("#settingsSystemPanel"),
  integrations: document.querySelector("#settingsIntegrationsPanel"),
  backup: document.querySelector("#settingsBackupPanel")
};
const currentPasswordForm = document.querySelector("#currentPasswordForm");
const currentPasswordMessage = document.querySelector("#currentPasswordMessage");
const themeSettingsForm = document.querySelector("#themeSettingsForm");
const themeSettingsMessage = document.querySelector("#themeSettingsMessage");
const restoreDefaultThemeButton = document.querySelector("#restoreDefaultThemeButton");
const alertSettingsForm = document.querySelector("#alertSettingsForm");
const alertSettingsMessage = document.querySelector("#alertSettingsMessage");
const clearAllLogsButton = document.querySelector("#clearAllLogsButton");
const clearLogsBeforeDate = document.querySelector("#clearLogsBeforeDate");
const clearLogsBeforeButton = document.querySelector("#clearLogsBeforeButton");
const settingsLogsMessage = document.querySelector("#settingsLogsMessage");
const resetAgendaCounterButton = document.querySelector("#resetAgendaCounterButton");
const resetServiceOrderCounterButton = document.querySelector("#resetServiceOrderCounterButton");
const settingsSystemMessage = document.querySelector("#settingsSystemMessage");
const downloadBackupButton = document.querySelector("#downloadBackupButton");
const saveLocalBackupButton = document.querySelector("#saveLocalBackupButton");
const restoreBackupFileButton = document.querySelector("#restoreBackupFileButton");
const restoreLocalBackupButton = document.querySelector("#restoreLocalBackupButton");
const clearLocalBackupButton = document.querySelector("#clearLocalBackupButton");
const backupFileInput = document.querySelector("#backupFileInput");
const backupLocalInfo = document.querySelector("#backupLocalInfo");
const backupMessage = document.querySelector("#backupMessage");
const clientReportForm = document.querySelector("#clientReportForm");
const clientReportServiceOrderStatuses = document.querySelector("#clientReportServiceOrderStatuses");
const clientReportAgendaStatuses = document.querySelector("#clientReportAgendaStatuses");
const stockReportForm = document.querySelector("#stockReportForm");
const vehicleReportForm = document.querySelector("#vehicleReportForm");
const reportMessage = document.querySelector("#reportMessage");
const financeUserList = document.querySelector("#financeUserList");
const financeEmployeeSearchInput = document.querySelector("#financeEmployeeSearchInput");
const financeMainTabs = document.querySelectorAll(".finance-main-tab");
const financeMainPanels = {
  employees: document.querySelector("#financeEmployeesPanel"),
  expenses: document.querySelector("#financeGlobalExpensesPanel"),
  payments: document.querySelector("#financePaymentsPanel"),
  clients: document.querySelector("#financeClientsPanel")
};
const financeGlobalExpenseForm = document.querySelector("#financeGlobalExpenseForm");
const financeGlobalExpenseSearchInput = document.querySelector("#financeGlobalExpenseSearchInput");
const financeGlobalExpenseList = document.querySelector("#financeGlobalExpenseList");
const financePaymentForm = document.querySelector("#financePaymentForm");
const financePaymentClient = document.querySelector("#financePaymentClient");
const financePaymentSearchInput = document.querySelector("#financePaymentSearchInput");
const financePaymentList = document.querySelector("#financePaymentList");
const financeClientBillingSearchInput = document.querySelector("#financeClientBillingSearchInput");
const financeClientBillingList = document.querySelector("#financeClientBillingList");
const financeClientBillingDetails = document.querySelector("#financeClientBillingDetails");
const financePanelMessage = document.querySelector("#financePanelMessage");
const financeDialog = document.querySelector("#financeDialog");
const financeDialogTitle = document.querySelector("#financeDialogTitle");
const closeFinanceDialogButton = document.querySelector("#closeFinanceDialogButton");
const financeTabs = document.querySelectorAll(".finance-tab");
const financePanels = {
  employee: document.querySelector("#financeEmployeePanel"),
  advances: document.querySelector("#financeAdvancesPanel"),
  commissions: document.querySelector("#financeCommissionsPanel")
};
const financeEmployeeSummary = document.querySelector("#financeEmployeeSummary");
const financeEmployeeSettingsForm = document.querySelector("#financeEmployeeSettingsForm");
const financeEmployeeSalary = document.querySelector("#financeEmployeeSalary");
const financeVacationForm = document.querySelector("#financeVacationForm");
const financeVacationSearchInput = document.querySelector("#financeVacationSearchInput");
const financeVacationList = document.querySelector("#financeVacationList");
const financeAdvanceForm = document.querySelector("#financeAdvanceForm");
const financeAdvanceSubmitButton = document.querySelector("#financeAdvanceSubmitButton");
const financeAdvanceSearchInput = document.querySelector("#financeAdvanceSearchInput");
const financeAdvanceList = document.querySelector("#financeAdvanceList");
const financeCommissionForm = document.querySelector("#financeCommissionForm");
const financeCommissionClient = document.querySelector("#financeCommissionClient");
const addTemporaryFinanceClientButton = document.querySelector("#addTemporaryFinanceClientButton");
const temporaryFinanceClientLabel = document.querySelector("#temporaryFinanceClientLabel");
const temporaryFinanceClientName = document.querySelector("#temporaryFinanceClientName");
const financeCommissionSearchInput = document.querySelector("#financeCommissionSearchInput");
const financeCommissionList = document.querySelector("#financeCommissionList");
const financeExpenseForm = document.querySelector("#financeExpenseForm");
const financeExpenseList = document.querySelector("#financeExpenseList");
const financeMonthlyForm = document.querySelector("#financeMonthlyForm");
const financeMonthlyClient = document.querySelector("#financeMonthlyClient");
const addTemporaryMonthlyClientButton = document.querySelector("#addTemporaryMonthlyClientButton");
const temporaryMonthlyClientLabel = document.querySelector("#temporaryMonthlyClientLabel");
const temporaryMonthlyClientName = document.querySelector("#temporaryMonthlyClientName");
const financeMonthlyList = document.querySelector("#financeMonthlyList");
const financeSporadicForm = document.querySelector("#financeSporadicForm");
const financeSporadicClient = document.querySelector("#financeSporadicClient");
const addTemporarySporadicClientButton = document.querySelector("#addTemporarySporadicClientButton");
const temporarySporadicClientLabel = document.querySelector("#temporarySporadicClientLabel");
const temporarySporadicClientName = document.querySelector("#temporarySporadicClientName");
const financeSporadicList = document.querySelector("#financeSporadicList");
const financeMessage = document.querySelector("#financeMessage");
const panels = {
  profile: document.querySelector("#profilePanel"),
  equipment: document.querySelector("#equipmentPanel"),
  network: document.querySelector("#networkPanel"),
  emails: document.querySelector("#emailsPanel"),
  cftv: document.querySelector("#cftvPanel")
};

const fields = {
  clientType: document.querySelector("#clientType"),
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
alertButton.addEventListener("click", () => alertPanel.classList.toggle("hidden"));
clearNotificationsButton.addEventListener("click", clearVisibleNotifications);
document.addEventListener("click", closeFloatingPanelsOnOutsideClick);
openUserFormButton.addEventListener("click", openUserDialog);
closeUserDialogButton.addEventListener("click", closeUserDialog);
cancelUserCreateButton.addEventListener("click", closeUserDialog);
userForm.addEventListener("submit", createUser);
passwordForm.addEventListener("submit", saveChangedPassword);
currentPasswordForm.addEventListener("submit", saveCurrentUserPassword);
themeSettingsForm.addEventListener("submit", saveThemeSettings);
themeSettingsForm.addEventListener("input", previewThemeSettings);
restoreDefaultThemeButton.addEventListener("click", restoreDefaultTheme);
alertSettingsForm.addEventListener("submit", saveAlertSettings);
clearAllLogsButton.addEventListener("click", clearAllLogsFromSettings);
clearLogsBeforeButton.addEventListener("click", clearLogsBeforeSelectedDate);
resetAgendaCounterButton.addEventListener("click", resetAgendaCounterFromSettings);
resetServiceOrderCounterButton.addEventListener("click", resetServiceOrderCounterFromSettings);
downloadBackupButton.addEventListener("click", downloadSystemBackup);
saveLocalBackupButton.addEventListener("click", saveLocalSystemBackup);
restoreBackupFileButton.addEventListener("click", () => backupFileInput.click());
restoreLocalBackupButton.addEventListener("click", restoreLocalSystemBackup);
clearLocalBackupButton.addEventListener("click", clearLocalSystemBackup);
backupFileInput.addEventListener("change", restoreSystemBackupFromFile);
clientReportForm.addEventListener("submit", generateClientReport);
stockReportForm.addEventListener("submit", generateStockReport);
vehicleReportForm.addEventListener("submit", generateVehicleReport);
closeFinanceDialogButton.addEventListener("click", closeFinanceDialog);
financeMainTabs.forEach((tab) => tab.addEventListener("click", () => switchFinanceMainView(tab.dataset.financeMainView)));
financeEmployeeSearchInput.addEventListener("input", renderFinanceUsers);
financeGlobalExpenseSearchInput.addEventListener("input", renderFinanceGlobalRecords);
financeGlobalExpenseForm.addEventListener("submit", addFinanceGlobalExpense);
financePaymentSearchInput.addEventListener("input", renderFinanceGlobalRecords);
financePaymentForm.addEventListener("submit", addFinancePayment);
financeClientBillingSearchInput.addEventListener("input", renderFinanceClientBillingList);
financeTabs.forEach((tab) => tab.addEventListener("click", () => switchFinanceView(tab.dataset.financeView)));
financeEmployeeSettingsForm.addEventListener("submit", saveFinanceEmployeeSettings);
financeVacationForm.addEventListener("submit", addFinanceVacation);
financeVacationSearchInput.addEventListener("input", renderFinanceRecords);
financeAdvanceForm.addEventListener("submit", addFinanceAdvance);
financeAdvanceSearchInput.addEventListener("input", renderFinanceRecords);
financeCommissionForm.addEventListener("submit", addFinanceCommission);
financeCommissionSearchInput.addEventListener("input", renderFinanceRecords);
financeExpenseForm.addEventListener("submit", addFinanceExpense);
financeMonthlyForm.addEventListener("submit", addFinanceMonthly);
financeSporadicForm.addEventListener("submit", addFinanceSporadic);
addTemporaryFinanceClientButton.addEventListener("click", showTemporaryFinanceClientField);
addTemporaryMonthlyClientButton.addEventListener("click", showTemporaryMonthlyClientField);
addTemporarySporadicClientButton.addEventListener("click", showTemporarySporadicClientField);
settingsViewButtons.forEach((button) => button.addEventListener("click", () => switchSettingsView(button.dataset.settingsView)));
companyForm.addEventListener("submit", saveCompanyInfo);
companyNetworkForm.addEventListener("submit", saveCompanyNetworkInfo);
companyViewButtons.forEach((button) => button.addEventListener("click", () => switchCompanyView(button.dataset.companyView)));
addCompanyVehicleButton.addEventListener("click", () => openCompanyVehicleDialog());
companyVehicleForm.addEventListener("submit", addCompanyVehicle);
closeCompanyVehicleDialogButton.addEventListener("click", closeCompanyVehicleDialog);
deleteCompanyVehicleButton.addEventListener("click", deleteEditingCompanyVehicle);
companyVehicleDetailsForm.addEventListener("submit", saveCompanyVehicleDetails);
closeCompanyVehicleDetailsDialogButton.addEventListener("click", closeCompanyVehicleDetailsDialog);
addCompanyVehicleFineButton.addEventListener("click", addCompanyVehicleFineDraft);
vehicleDetailTabs.forEach((tab) => tab.addEventListener("click", () => switchCompanyVehicleDetailView(tab.dataset.vehicleDetailView)));
importVehicleIpvaPdfButton.addEventListener("click", () => vehicleIpvaPdfInput.click());
importVehicleLicensingPdfButton.addEventListener("click", () => vehicleLicensingPdfInput.click());
vehicleIpvaPdfInput.addEventListener("change", (event) => importCompanyVehicleDocumentPdf(event, "ipva"));
vehicleLicensingPdfInput.addEventListener("change", (event) => importCompanyVehicleDocumentPdf(event, "licensing"));
exportVehicleIpvaPdfButton.addEventListener("click", () => exportCompanyVehicleDocumentPdf("ipva"));
exportVehicleLicensingPdfButton.addEventListener("click", () => exportCompanyVehicleDocumentPdf("licensing"));
companyStockForm.addEventListener("submit", saveCompanyStockType);
companyStockType.addEventListener("change", toggleNewCompanyStockTypeField);
document.addEventListener(
  "blur",
  (event) => {
    if (event.target.matches("[data-money-input]")) {
      formatMoneyInput(event.target);
    }
  },
  true
);
agendaForm.addEventListener("submit", addAgendaItem);
cancelAgendaButton.addEventListener("click", resetAgendaForm);
agendaSearchInput.addEventListener("input", renderAgendaItems);
agendaSearchInput.addEventListener("input", saveWorkspaceState);
agendaStatusFilter.addEventListener("change", () => {
  saveWorkspaceState();
  renderAgendaItems();
});
agendaViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.agendaView === "create") {
      startNewAgendaItem();
      return;
    }

    switchAgendaView("list");
  });
});
infrastructureAgendaForm.addEventListener("submit", addInfrastructureAgendaItem);
cancelInfrastructureAgendaButton.addEventListener("click", resetInfrastructureAgendaForm);
infrastructureAgendaSearchInput.addEventListener("input", renderInfrastructureAgendaItems);
infrastructureAgendaSearchInput.addEventListener("input", saveWorkspaceState);
infrastructureAgendaStatusFilter.addEventListener("change", () => {
  saveWorkspaceState();
  renderInfrastructureAgendaItems();
});
infrastructureAgendaViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.infrastructureAgendaView === "create") {
      startNewInfrastructureAgendaItem();
      return;
    }

    switchInfrastructureAgendaView("list");
  });
});
serviceOrderForm.addEventListener("submit", addServiceOrder);
document.querySelector("#cancelServiceOrderButton").addEventListener("click", resetServiceOrderForm);
serviceOrderStatusFilter.addEventListener("change", renderServiceOrders);
serviceOrderStatusFilter.addEventListener("change", saveWorkspaceState);
serviceOrderSearchInput.addEventListener("input", renderServiceOrders);
serviceOrderSearchInput.addEventListener("input", saveWorkspaceState);
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
dvrForm.addEventListener("submit", saveDvr);
addDvrButton.addEventListener("click", openDvrDialog);
closeDvrDialogButton.addEventListener("click", closeDvrDialog);
deleteDvrButton.addEventListener("click", deleteEditingDvr);
dvrNetworkType.addEventListener("change", () => toggleEquipmentIpField(dvrNetworkType, dvrIpLabel, dvrIpAddress));
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
equipmentFilter.addEventListener("input", saveWorkspaceState);
searchInput.addEventListener("input", renderList);
searchInput.addEventListener("input", saveWorkspaceState);
newClientButton.addEventListener("click", startNewClient);
deleteClientButton.addEventListener("click", deleteSelectedClient);
dashboardTabs.forEach((tab) => tab.addEventListener("click", () => switchDashboardTab(tab.dataset.dashboardTab)));
tabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));
document.addEventListener("click", handlePasswordToggleClick);
setupFormDraftAutosave();
restoreWorkspaceState({ applyFields: true });

initializeFirebaseSync();
renderAuth();

if (!currentUser || !firebaseSyncEnabled) {
  render();
}
window.suporteTiAppReady = true;

function getUserScopedStorageKey(baseKey) {
  const userKey = currentUser?.uid || currentUser?.id || normalize(currentUser?.login || "visitante");
  return `${baseKey}:${userKey || "visitante"}`;
}

function loadWorkspaceState() {
  const stored = localStorage.getItem(getUserScopedStorageKey(WORKSPACE_STATE_STORAGE_KEY));

  if (!stored) {
    return {};
  }

  try {
    const parsedState = JSON.parse(stored);
    return parsedState && typeof parsedState === "object" ? parsedState : {};
  } catch {
    return {};
  }
}

function saveWorkspaceState() {
  if (!currentUser) {
    return;
  }

  const state = {
    selectedId,
    activeTab,
    activeDashboardTab,
    activeServiceOrderView,
    activeAgendaView,
    activeInfrastructureAgendaView,
    activeCompanyView,
    activeSettingsView,
    activeFinanceMainView,
    search: searchInput?.value || "",
    equipmentFilter: equipmentFilter?.value || "",
    agendaSearch: agendaSearchInput?.value || "",
    agendaStatus: agendaStatusFilter?.value || "all",
    infrastructureAgendaSearch: infrastructureAgendaSearchInput?.value || "",
    infrastructureAgendaStatus: infrastructureAgendaStatusFilter?.value || "all",
    serviceOrderSearch: serviceOrderSearchInput?.value || "",
    serviceOrderStatus: serviceOrderStatusFilter?.value || "all",
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(getUserScopedStorageKey(WORKSPACE_STATE_STORAGE_KEY), JSON.stringify(state));
}

function restoreWorkspaceState({ applyFields = true } = {}) {
  const state = loadWorkspaceState();

  if (state.selectedId && clients.some((client) => client.id === state.selectedId)) {
    selectedId = state.selectedId;
  }

  if (["profile", "equipment", "network", "emails", "cftv"].includes(state.activeTab)) {
    activeTab = state.activeTab;
  }

  if (dashboardSections.some((section) => section.id === state.activeDashboardTab)) {
    activeDashboardTab = state.activeDashboardTab;
  }

  if (["list", "create"].includes(state.activeServiceOrderView)) {
    activeServiceOrderView = state.activeServiceOrderView;
  }

  if (["list", "create"].includes(state.activeAgendaView)) {
    activeAgendaView = state.activeAgendaView;
  }

  if (["list", "create"].includes(state.activeInfrastructureAgendaView)) {
    activeInfrastructureAgendaView = state.activeInfrastructureAgendaView;
  }

  if (["profile", "network", "vehicles", "stock"].includes(state.activeCompanyView)) {
    activeCompanyView = state.activeCompanyView;
  }

  if (["theme", "alerts", "password", "logs", "system", "integrations", "backup"].includes(state.activeSettingsView)) {
    activeSettingsView = state.activeSettingsView;
  }

  if (["employees", "expenses", "payments", "clients"].includes(state.activeFinanceMainView)) {
    activeFinanceMainView = state.activeFinanceMainView;
  }

  if (!applyFields) {
    return;
  }

  if (searchInput) {
    searchInput.value = state.search || "";
  }

  if (equipmentFilter) {
    equipmentFilter.value = state.equipmentFilter || "";
  }

  if (agendaSearchInput) {
    agendaSearchInput.value = state.agendaSearch || "";
  }

  if (agendaStatusFilter) {
    agendaStatusFilter.value = state.agendaStatus || "all";
  }

  if (infrastructureAgendaSearchInput) {
    infrastructureAgendaSearchInput.value = state.infrastructureAgendaSearch || "";
  }

  if (infrastructureAgendaStatusFilter) {
    infrastructureAgendaStatusFilter.value = state.infrastructureAgendaStatus || "all";
  }

  if (serviceOrderSearchInput) {
    serviceOrderSearchInput.value = state.serviceOrderSearch || "";
  }

  if (serviceOrderStatusFilter) {
    serviceOrderStatusFilter.value = state.serviceOrderStatus || "all";
  }
}

function getFormDraftKey(formElement) {
  const formId = formElement?.id || "formulario";

  if (formElement === form) {
    return `${formId}:${selectedId || "novo"}`;
  }

  if (formElement === agendaForm) {
    return `${formId}:${editingAgendaId || "novo"}`;
  }

  if (formElement === infrastructureAgendaForm) {
    return `${formId}:${editingInfrastructureAgendaId || "novo"}`;
  }

  if (formElement === serviceOrderForm) {
    return `${formId}:${editingServiceOrderId || "novo"}`;
  }

  if (formElement === companyStockForm) {
    return `${formId}:${editingCompanyStockItemId || "novo"}`;
  }

  return `${formId}:padrao`;
}

function loadFormDrafts() {
  const stored = localStorage.getItem(getUserScopedStorageKey(FORM_DRAFT_STORAGE_KEY));

  if (!stored) {
    return {};
  }

  try {
    const drafts = JSON.parse(stored);
    return drafts && typeof drafts === "object" ? drafts : {};
  } catch {
    return {};
  }
}

function saveFormDraft(formElement) {
  if (!currentUser || !formElement) {
    return;
  }

  const formKey = getFormDraftKey(formElement);
  const drafts = loadFormDrafts();
  drafts[formKey] = readFormDraft(formElement);
  localStorage.setItem(getUserScopedStorageKey(FORM_DRAFT_STORAGE_KEY), JSON.stringify(drafts));
}

function clearFormDraft(formElement) {
  if (!formElement) {
    return;
  }

  clearFormDraftByKey(getFormDraftKey(formElement));
}

function clearFormDraftByKey(formKey) {
  const drafts = loadFormDrafts();
  delete drafts[formKey];
  localStorage.setItem(getUserScopedStorageKey(FORM_DRAFT_STORAGE_KEY), JSON.stringify(drafts));
}

function readFormDraft(formElement) {
  const draft = {};

  Array.from(formElement.elements).forEach((element) => {
    if (!element.name || element.disabled) {
      return;
    }

    if (element.type === "checkbox") {
      draft[element.name] = element.checked;
      return;
    }

    if (element.type === "radio") {
      if (element.checked) {
        draft[element.name] = element.value;
      }
      return;
    }

    draft[element.name] = element.value;
  });

  return draft;
}

function applyFormDraft(formElement) {
  const draft = loadFormDrafts()[getFormDraftKey(formElement)];

  if (!draft) {
    return;
  }

  Array.from(formElement.elements).forEach((element) => {
    if (!element.name || !(element.name in draft)) {
      return;
    }

    if (element.type === "checkbox") {
      element.checked = Boolean(draft[element.name]);
      return;
    }

    if (element.type === "radio") {
      element.checked = element.value === draft[element.name];
      return;
    }

    element.value = draft[element.name] ?? "";
  });
}

function restoreVisibleFormDrafts() {
  [form, agendaForm, infrastructureAgendaForm, serviceOrderForm, companyForm, companyNetworkForm, companyVehicleForm, companyVehicleDetailsForm, companyStockForm, financeEmployeeSettingsForm, financeVacationForm, financeAdvanceForm, financeCommissionForm, financeExpenseForm, financeMonthlyForm, financeSporadicForm, financeGlobalExpenseForm, financePaymentForm, userForm].forEach((formElement) => {
    if (!formElement || formElement.offsetParent === null) {
      return;
    }

    applyFormDraft(formElement);
  });

  toggleComputerServiceOrderFields();
  toggleExternalRepairLocationFields();
  toggleNewCompanyStockTypeField();
}

function setupFormDraftAutosave() {
  [form, agendaForm, infrastructureAgendaForm, serviceOrderForm, companyForm, companyNetworkForm, companyVehicleForm, companyVehicleDetailsForm, companyStockForm, financeEmployeeSettingsForm, financeVacationForm, financeAdvanceForm, financeCommissionForm, financeExpenseForm, financeMonthlyForm, financeSporadicForm, financeGlobalExpenseForm, financePaymentForm, userForm].forEach((formElement) => {
    if (!formElement) {
      return;
    }

    formElement.addEventListener("input", () => saveFormDraft(formElement));
    formElement.addEventListener("change", () => saveFormDraft(formElement));
  });
}

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

function loadCompanyInfo() {
  const stored = localStorage.getItem(COMPANY_STORAGE_KEY);

  if (!stored) {
    return normalizeCompanyInfo();
  }

  try {
    return normalizeCompanyInfo(JSON.parse(stored));
  } catch {
    return normalizeCompanyInfo();
  }
}

function normalizeCompanyInfo(info = {}) {
  return {
    ...emptyCompanyInfo,
    ...info,
    vehicles: Array.isArray(info.vehicles) ? info.vehicles.map(normalizeCompanyVehicle) : [],
    stockTypes: Array.isArray(info.stockTypes) ? info.stockTypes : defaultCompanyStockTypes,
    stockItems: Array.isArray(info.stockItems) ? info.stockItems : [],
    finance: normalizeFinanceInfo(info.finance),
    financeGlobal: normalizeFinanceGlobalInfo(info.financeGlobal),
    alertSettings: {
      ...emptyAlertSettings,
      ...(info.alertSettings || {})
    },
    themeSettings: {
      ...emptyThemeSettings,
      ...(info.themeSettings || {})
    }
  };
}

function normalizeFinanceGlobalInfo(financeGlobal = {}) {
  return {
    expenses: Array.isArray(financeGlobal.expenses)
      ? financeGlobal.expenses.map((item) => ({
          id: item.id || createId("DES"),
          date: item.date || "",
          dueDate: item.dueDate || "",
          category: item.category || "",
          value: item.value || "",
          payment: item.payment || "",
          status: item.status || "Pendente",
          description: item.description || "",
          createdAt: item.createdAt || new Date().toISOString()
        }))
      : [],
    payments: Array.isArray(financeGlobal.payments)
      ? financeGlobal.payments.map((item) => ({
          id: item.id || createId("PAG"),
          date: item.date || "",
          clientId: item.clientId || "",
          clientName: item.clientName || "",
          value: item.value || "",
          payment: item.payment || "",
          status: item.status || "Recebido",
          description: item.description || "",
          createdAt: item.createdAt || new Date().toISOString()
        }))
      : [],
    clients: Object.entries(financeGlobal.clients && typeof financeGlobal.clients === "object" ? financeGlobal.clients : {}).reduce((records, [clientId, value]) => {
      records[clientId] = {
        monthlyValue: value?.monthlyValue || "",
        dueDay: value?.dueDay || "",
        paymentMethod: value?.paymentMethod || "",
        billed: value?.billed || "Nao",
        sendType: value?.sendType || "WhatsApp",
        email: value?.email || "",
        boletoSent: value?.boletoSent || "Nao",
        updatedAt: value?.updatedAt || ""
      };
      return records;
    }, {})
  };
}

function normalizeFinanceInfo(finance = {}) {
  return Object.entries(finance && typeof finance === "object" ? finance : {}).reduce((records, [userId, value]) => {
    records[userId] = {
      salary: value?.salary || "",
      vacations: Array.isArray(value?.vacations)
        ? value.vacations.map((item) => ({
            id: item.id || createId("FER"),
            startDate: item.startDate || "",
            endDate: item.endDate || "",
            status: item.status || "Programada",
            description: item.description || "",
            createdAt: item.createdAt || new Date().toISOString()
          }))
        : [],
      advances: Array.isArray(value?.advances)
        ? value.advances.map((item) => ({
            id: item.id || createId("VAL"),
            date: item.date || "",
            value: item.value || "",
            description: item.description || "",
            createdAt: item.createdAt || new Date().toISOString()
          }))
        : [],
      commissions: Array.isArray(value?.commissions)
        ? value.commissions.map((item) => ({
            id: item.id || createId("COM"),
            date: item.date || "",
            clientId: item.clientId || "",
            clientName: item.clientName || "",
            value: item.value || "",
            description: item.description || "",
            temporary: Boolean(item.temporary),
            createdAt: item.createdAt || new Date().toISOString()
          }))
        : [],
      sporadic: Array.isArray(value?.sporadic)
        ? value.sporadic.map((item) => ({
            id: item.id || createId("ESP"),
            clientId: item.clientId || "",
            clientName: item.clientName || "",
            service: item.service || "",
            date: item.date || "",
            value: item.value || "",
            payment: item.payment || "",
            status: item.status || "Pendente",
            description: item.description || "",
            temporary: Boolean(item.temporary),
            createdAt: item.createdAt || new Date().toISOString()
          }))
        : [],
      expenses: Array.isArray(value?.expenses)
        ? value.expenses.map((item) => ({
            id: item.id || createId("DES"),
            date: item.date || "",
            dueDate: item.dueDate || "",
            category: item.category || "",
            value: item.value || "",
            payment: item.payment || "",
            status: item.status || "Pendente",
            description: item.description || "",
            createdAt: item.createdAt || new Date().toISOString()
          }))
        : [],
      monthly: Array.isArray(value?.monthly)
        ? value.monthly.map((item) => ({
            id: item.id || createId("MEN"),
            clientId: item.clientId || "",
            clientName: item.clientName || "",
            service: item.service || "",
            value: item.value || "",
            dueDay: item.dueDay || "",
            frequency: item.frequency || "Mensal",
            status: item.status || "Ativo",
            description: item.description || "",
            temporary: Boolean(item.temporary),
            createdAt: item.createdAt || new Date().toISOString()
          }))
        : []
    };
    return records;
  }, {});
}

function normalizeCompanyVehicle(vehicle = {}) {
  return {
    id: vehicle.id || createId("VEI"),
    type: vehicle.type || "Carro",
    model: vehicle.model || "",
    plate: vehicle.plate || "",
    driverId: vehicle.driverId || "",
    driverName: vehicle.driverName || "",
    maintenanceDate: vehicle.maintenanceDate || "",
    maintenance: vehicle.maintenance || "",
    documentation: normalizeVehicleDocumentation(vehicle.documentation),
    fines: Array.isArray(vehicle.fines)
      ? vehicle.fines.map((fine) => ({
          id: fine.id || createId("MUL"),
          type: fine.type || "",
          severity: fine.severity || "",
          points: fine.points || "",
          value: fine.value || "",
          date: fine.date || "",
          driverId: fine.driverId || "",
          driverName: fine.driverName || ""
        }))
      : [],
    createdAt: vehicle.createdAt || new Date().toISOString(),
    updatedAt: vehicle.updatedAt || ""
  };
}

function createEmptyVehicleDocumentation() {
  return {
    ipva: {
      year: "",
      dueDate: "",
      value: "",
      status: "",
      notes: "",
      pdfName: "",
      pdfData: ""
    },
    licensing: {
      year: "",
      dueDate: "",
      value: "",
      status: "",
      notes: "",
      pdfName: "",
      pdfData: ""
    }
  };
}

function normalizeVehicleDocumentation(documentation = {}) {
  const emptyDocumentation = createEmptyVehicleDocumentation();
  return {
    ipva: {
      ...emptyDocumentation.ipva,
      ...(documentation.ipva || {})
    },
    licensing: {
      ...emptyDocumentation.licensing,
      ...(documentation.licensing || {})
    }
  };
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
  const backup = loadLocalLogBackup();

  if (!stored) {
    return backup;
  }

  try {
    const parsedLogs = JSON.parse(stored);
    return mergeLogsWithBackup(Array.isArray(parsedLogs) ? parsedLogs : [], backup);
  } catch {
    return backup;
  }
}

function loadLocalLogBackup() {
  const stored = localStorage.getItem(LOG_BACKUP_STORAGE_KEY);

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

function mergeLogsWithBackup(primaryLogs = [], backupLogs = []) {
  const merged = [...primaryLogs, ...backupLogs];
  const unique = new Map();

  merged.forEach((log) => {
    if (!log?.id) {
      return;
    }

    unique.set(log.id, log);
  });

  return [...unique.values()]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 250);
}

function appendLocalLogBackup(log) {
  if (!log?.id) {
    return;
  }

  const backupLogs = mergeLogsWithBackup([log], loadLocalLogBackup()).slice(0, 500);
  localStorage.setItem(LOG_BACKUP_STORAGE_KEY, JSON.stringify(backupLogs));
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

function loadInfrastructureAgendaCounter() {
  const storedCounter = Number(localStorage.getItem(INFRASTRUCTURE_AGENDA_COUNTER_STORAGE_KEY));

  if (Number.isInteger(storedCounter) && storedCounter > 0) {
    return storedCounter;
  }

  const highestExistingNumber = infrastructureAgendaItems.reduce((highest, item) => {
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

function loadInfrastructureAgendaItems() {
  const stored = localStorage.getItem(INFRASTRUCTURE_AGENDA_STORAGE_KEY);

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

function loadDismissedNotifications() {
  const stored = localStorage.getItem(DISMISSED_NOTIFICATION_STORAGE_KEY);

  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
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
    clientType: client.clientType || "Mensalista",
    equipment: Array.isArray(client.equipment) ? client.equipment : [],
    emails: Array.isArray(client.emails) ? client.emails : [],
    cftv: Array.isArray(client.cftv) ? client.cftv : [],
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
    updateSyncStatus("syncing", "Sincronizando");
    const persistenceReady = firebaseDb.enablePersistence
      ? firebaseDb.enablePersistence({ synchronizeTabs: true }).catch((error) => {
          console.warn("Persistencia offline do Firebase nao foi ativada.", error);
        })
      : Promise.resolve();

    persistenceReady.finally(() => {
      if (!firebaseAuthRequired) {
        hydrateFromFirebase();
        return;
      }

      if (!firebaseAuth) {
        updateSyncStatus("offline", "Offline");
        render();
        return;
      }

      firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          hydrateFromFirebase();
          return;
        }

        if (currentUser) {
          updateSyncStatus("offline", "Aguardando login");
          render();
        }
      });
    });
  } catch (error) {
    console.warn("Nao foi possivel iniciar o Firebase. O sistema seguira usando dados locais.", error);
    updateSyncStatus("offline", "Offline");
  }
}

function getFirestoreCollectionName(key) {
  const collectionByKey = {
    [USER_STORAGE_KEY]: "users",
    [COMPANY_STORAGE_KEY]: "companyInfo",
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
    [AGENDA_COUNTER_STORAGE_KEY]: "counters",
    [INFRASTRUCTURE_AGENDA_STORAGE_KEY]: "infrastructureAgenda",
    [INFRASTRUCTURE_AGENDA_COUNTER_STORAGE_KEY]: "counters"
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

  if (collectionName === "companyInfo") {
    return "main";
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
    updateSyncStatus("syncing", "Sincronizando");
    firebaseHydrating = true;
    await migrateLegacyAppState();
    await Promise.all(cloudStorageKeys.map((key) => hydrateCollectionToLocalState(key)));
    reloadStateFromLocalStorage();
    renderAuth();
    render();
    startFirebaseRealtimeListeners();
    updateSyncStatus("synced", "Online");
  } catch (error) {
    console.warn("Nao foi possivel sincronizar com o Firebase.", error);
    updateSyncStatus("offline", "Offline");
    reloadStateFromLocalStorage();
    renderAuth();
    render();
  } finally {
    firebaseHydrating = false;
  }
}

async function hydrateCollectionToLocalState(key) {
  const collectionName = getFirestoreCollectionName(key);

  if (!collectionName) {
    return;
  }

  if (collectionName === "counters") {
    const counterDoc = await firebaseDb.collection(collectionName).doc(getCounterDocumentId(key)).get();
    writeLocalState(key, counterDoc.exists ? counterDoc.data().value || 1 : 1);
    firebaseCollectionDocIds[getFirebaseListenerId(key)] = new Set(counterDoc.exists ? [counterDoc.id] : []);
    return;
  }

  if (collectionName === "companyInfo") {
    const companyDoc = await firebaseDb.collection(collectionName).doc("main").get();
    if (companyDoc.exists) {
      writeLocalState(key, normalizeCompanyInfo(companyDoc.data()));
      firebaseCollectionDocIds[getFirebaseListenerId(key)] = new Set([companyDoc.id]);
      return;
    }

    const legacyCompanyInfo = await getLegacyCompanyInfo();
    const nextCompanyInfo = legacyCompanyInfo ? normalizeCompanyInfo(legacyCompanyInfo) : normalizeCompanyInfo();
    writeLocalState(key, nextCompanyInfo);
    firebaseCollectionDocIds[getFirebaseListenerId(key)] = new Set(legacyCompanyInfo ? ["main"] : []);

    if (legacyCompanyInfo) {
      await syncStateToFirebase(COMPANY_STORAGE_KEY, nextCompanyInfo, { force: true });
    }
    return;
  }

  const snapshot = await firebaseDb.collection(collectionName).get();

  const items = snapshot.docs.map((doc) => deserializeCollectionItem(collectionName, { id: doc.id, ...doc.data() })).filter((item) => item !== undefined);
  firebaseCollectionDocIds[getFirebaseListenerId(key)] = new Set(snapshot.docs.map((doc) => doc.id));
  writeLocalState(key, items);
}

function startFirebaseRealtimeListeners() {
  if (!firebaseSyncEnabled || firebaseRealtimeStarted) {
    return;
  }

  firebaseRealtimeStarted = true;
  firebaseUnsubscribers = cloudStorageKeys.map((key) => listenToFirebaseState(key)).filter(Boolean);
}

function stopFirebaseRealtimeListeners() {
  firebaseUnsubscribers.forEach((unsubscribe) => unsubscribe());
  firebaseUnsubscribers = [];
  firebaseRealtimeStarted = false;
}

function listenToFirebaseState(key) {
  const collectionName = getFirestoreCollectionName(key);

  if (!collectionName) {
    return null;
  }

  if (collectionName === "counters") {
    return firebaseDb
      .collection(collectionName)
      .doc(getCounterDocumentId(key))
      .onSnapshot(
        (doc) => applyFirebaseDocumentSnapshot(key, doc),
        (error) => handleFirebaseSnapshotError(error)
      );
  }

  if (collectionName === "companyInfo") {
    return firebaseDb
      .collection(collectionName)
      .doc("main")
      .onSnapshot(
        (doc) => applyFirebaseDocumentSnapshot(key, doc),
        (error) => handleFirebaseSnapshotError(error)
      );
  }

  return firebaseDb.collection(collectionName).onSnapshot(
    (snapshot) => applyFirebaseCollectionSnapshot(key, snapshot),
    (error) => handleFirebaseSnapshotError(error)
  );
}

function applyFirebaseDocumentSnapshot(key, doc) {
  const listenerId = getFirebaseListenerId(key);
  firebaseCollectionDocIds[listenerId] = new Set(doc.exists ? [doc.id] : []);

  if (doc.metadata?.hasPendingWrites) {
    updateSyncStatus("syncing", "Sincronizando");
    return;
  }

  if (doc.metadata?.fromCache) {
    updateSyncStatus("offline", "Offline");
  } else {
    updateSyncStatus("synced", "Online");
  }

  if (isCounterStorageKey(key)) {
    applyFirebaseState(key, doc.exists ? doc.data().value || 1 : 1);
    return;
  }

  applyFirebaseState(key, doc.exists ? normalizeCompanyInfo(doc.data()) : normalizeCompanyInfo());
}

function applyFirebaseCollectionSnapshot(key, snapshot) {
  const collectionName = getFirestoreCollectionName(key);
  const listenerId = getFirebaseListenerId(key);
  firebaseCollectionDocIds[listenerId] = new Set(snapshot.docs.map((doc) => doc.id));

  if (snapshot.metadata?.hasPendingWrites) {
    updateSyncStatus("syncing", "Sincronizando");
    return;
  }

  updateSyncStatus(snapshot.metadata?.fromCache ? "offline" : "synced", snapshot.metadata?.fromCache ? "Offline" : "Online");

  const items = snapshot.docs.map((doc) => deserializeCollectionItem(collectionName, { id: doc.id, ...doc.data() })).filter((item) => item !== undefined);
  applyFirebaseState(key, items);
}

function applyFirebaseState(key, value) {
  if (firebaseHydrating) {
    return;
  }

  firebaseSnapshotApplying = true;
  const nextValue = key === LOG_STORAGE_KEY ? mergeLogsWithBackup(Array.isArray(value) ? value : [], loadLocalLogBackup()) : value;
  writeLocalState(key, nextValue);
  reloadStateFromLocalStorage();
  firebaseSnapshotApplying = false;
  renderAuth();
  render();
}

function handleFirebaseSnapshotError(error) {
  console.warn("Nao foi possivel receber atualizacoes em tempo real do Firebase.", error);
  updateSyncStatus("offline", "Offline");
}

function getFirebaseListenerId(key) {
  const collectionName = getFirestoreCollectionName(key);
  return collectionName === "counters" ? `${collectionName}/${getCounterDocumentId(key)}` : collectionName;
}

function updateSyncStatus(status, label) {
  firebaseSyncStatus = status;

  if (!syncStatus) {
    return;
  }

  syncStatus.className = `sync-status ${status}`;
  syncStatus.textContent = label;
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
      const legacyValue = getLegacyStateValue(legacyState, key);

      if (legacyValue === undefined) {
        return Promise.resolve();
      }

      return syncStateToFirebase(key, legacyValue, { force: true });
    })
  );
  await migratedRef.set({ collectionsMigrated: true, migratedAt: new Date().toISOString() }, { merge: true });
}

async function getLegacyCompanyInfo() {
  try {
    const legacySnapshot = await firebaseDb.collection("appState").doc("main").get();

    if (!legacySnapshot.exists) {
      return null;
    }

    return getLegacyStateValue(legacySnapshot.data() || {}, COMPANY_STORAGE_KEY) || null;
  } catch (error) {
    console.warn("Nao foi possivel verificar companyInfo legado.", error);
    return null;
  }
}

function getLegacyStateValue(legacyState, key) {
  if (Object.prototype.hasOwnProperty.call(legacyState, key)) {
    return legacyState[key];
  }

  const legacyNameByKey = {
    [STORAGE_KEY]: "clients",
    [CATEGORY_STORAGE_KEY]: "equipmentCategories",
    [BRAND_MODEL_STORAGE_KEY]: "equipmentBrandModels",
    [USER_STORAGE_KEY]: "users",
    [LOG_STORAGE_KEY]: "logs",
    [COMPANY_STORAGE_KEY]: "companyInfo",
    [AGENDA_STORAGE_KEY]: "agendaItems",
    [AGENDA_COUNTER_STORAGE_KEY]: "agendaCounter",
    [INFRASTRUCTURE_AGENDA_STORAGE_KEY]: "infrastructureAgendaItems",
    [INFRASTRUCTURE_AGENDA_COUNTER_STORAGE_KEY]: "infrastructureAgendaCounter",
    [SERVICE_ORDER_STORAGE_KEY]: "serviceOrders",
    [SERVICE_ORDER_COUNTER_STORAGE_KEY]: "serviceOrderCounter",
    [SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY]: "serviceOrderEquipmentTypes",
    [EXTERNAL_REPAIR_LOCATION_STORAGE_KEY]: "externalRepairLocations",
    [EMAIL_TYPE_STORAGE_KEY]: "emailTypes",
    [AUTHORIZATION_STORAGE_KEY]: "authorizationRequests"
  };
  const legacyName = legacyNameByKey[key];
  return legacyName && Object.prototype.hasOwnProperty.call(legacyState, legacyName) ? legacyState[legacyName] : undefined;
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
    loginMessage.textContent = getFirebaseAuthErrorMessage(error);
    loginPassword.value = "";
    loginPassword.focus();
    return null;
  }
}

function getFirebaseAuthErrorMessage(error) {
  const code = error?.code || "";

  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Usuario ou senha incorretos.";
  }

  if (code === "auth/unauthorized-domain") {
    return "Dominio nao autorizado no Firebase.";
  }

  if (code === "auth/too-many-requests") {
    return "Muitas tentativas. Aguarde alguns minutos.";
  }

  return "Usuario ou senha incorretos.";
}

function readLocalState(key) {
  const value = localStorage.getItem(key);

  if (isCounterStorageKey(key)) {
    return Number(value || 1);
  }

  if (key === COMPANY_STORAGE_KEY) {
    return loadCompanyInfo();
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

  if (firebaseSnapshotApplying) {
    return Promise.resolve({ saved: true, localOnly: true });
  }

  updateSyncStatus(firebaseSyncEnabled ? "syncing" : "offline", firebaseSyncEnabled ? "Sincronizando" : "Offline");
  return syncStateToFirebase(key, value);
}

function syncStateToFirebase(key, value, options = {}) {
  if (!firebaseSyncEnabled || (firebaseHydrating && !options.force)) {
    return Promise.resolve({ saved: false, localOnly: true });
  }

  const collectionName = getFirestoreCollectionName(key);

  if (!collectionName) {
    return Promise.resolve({ saved: false, localOnly: true });
  }

  if (collectionName === "counters") {
    return firebaseDb
      .collection(collectionName)
      .doc(getCounterDocumentId(key))
      .set({ value: Number(value || 1), updatedAt: new Date().toISOString() }, { merge: true })
      .then(() => {
        updateSyncStatus("synced", "Online");
        return { saved: true };
      })
      .catch((error) => {
        console.warn("Nao foi possivel salvar contador no Firebase.", error);
        updateSyncStatus("offline", "Offline");
        return { saved: false, error };
      });
  }

  if (collectionName === "companyInfo") {
    const normalizedCompanyInfo = normalizeCompanyInfo(value);
    return firebaseDb
      .collection(collectionName)
      .doc("main")
      .set(normalizedCompanyInfo, { merge: true })
      .then(() => verifyCompanyInfoSaved(normalizedCompanyInfo.updatedAt))
      .then((verified) => {
        updateSyncStatus("synced", "Online");
        return { saved: true, verified };
      })
      .catch((error) => {
        console.warn("Nao foi possivel salvar companyInfo no Firebase.", error);
        updateSyncStatus("offline", "Offline");
        return { saved: false, error };
      });
  }

  const items = Array.isArray(value) ? value : [];
  return syncCollection(collectionName, items)
    .then(() => ({ saved: true }))
    .catch((error) => {
      console.warn(`Nao foi possivel salvar ${collectionName} no Firebase.`, error);
      updateSyncStatus("offline", "Offline");
      return { saved: false, error };
    });
}

async function verifyCompanyInfoSaved(expectedUpdatedAt) {
  const companyDoc = await firebaseDb.collection("companyInfo").doc("main").get({ source: "server" });

  if (!companyDoc.exists) {
    const error = new Error("companyInfo/main nao foi encontrado no servidor.");
    error.code = "companyInfo/not-found";
    throw error;
  }

  if (expectedUpdatedAt && companyDoc.data()?.updatedAt !== expectedUpdatedAt) {
    const error = new Error("companyInfo/main nao retornou a ultima alteracao no servidor.");
    error.code = "companyInfo/server-mismatch";
    throw error;
  }

  return true;
}

function isCounterStorageKey(key) {
  return key === SERVICE_ORDER_COUNTER_STORAGE_KEY || key === AGENDA_COUNTER_STORAGE_KEY || key === INFRASTRUCTURE_AGENDA_COUNTER_STORAGE_KEY;
}

function getCounterDocumentId(key) {
  if (key === AGENDA_COUNTER_STORAGE_KEY) {
    return "agenda";
  }

  if (key === INFRASTRUCTURE_AGENDA_COUNTER_STORAGE_KEY) {
    return "infrastructureAgenda";
  }

  return "serviceOrders";
}

async function syncCollection(collectionName, items) {
  const collectionRef = firebaseDb.collection(collectionName);
  const nextIds = new Set(items.map((item, index) => getCollectionItemId(collectionName, item, index)));
  const knownIds = firebaseCollectionDocIds[collectionName] || new Set();
  const batch = firebaseDb.batch();

  knownIds.forEach((id) => {
    if (!nextIds.has(id)) {
      batch.delete(collectionRef.doc(id));
    }
  });

  items.forEach((item, index) => {
    const id = getCollectionItemId(collectionName, item, index);
    batch.set(collectionRef.doc(id), serializeCollectionItem(collectionName, item), { merge: false });
  });

  await batch.commit();
  firebaseCollectionDocIds[collectionName] = nextIds;
  updateSyncStatus("synced", "Online");
}

function reloadStateFromLocalStorage() {
  clients = loadClients();
  equipmentCategories = loadEquipmentCategories();
  equipmentBrandModels = loadEquipmentBrandModels();
  companyInfo = loadCompanyInfo();
  users = loadUsers();
  logs = loadLogs();
  agendaItems = ensureAgendaNumbers(loadAgendaItems());
  agendaCounter = loadAgendaCounter();
  infrastructureAgendaItems = ensureAgendaNumbers(loadInfrastructureAgendaItems());
  infrastructureAgendaCounter = loadInfrastructureAgendaCounter();
  serviceOrders = loadServiceOrders();
  serviceOrderCounter = loadServiceOrderCounter();
  serviceOrderEquipmentTypes = loadServiceOrderEquipmentTypes();
  externalRepairLocations = loadExternalRepairLocations();
  emailTypes = loadEmailTypes();
  authorizationRequests = loadAuthorizationRequests();
  if (currentUser) {
    const updatedCurrentUser = users.find((user) => user.uid === currentUser.uid || user.id === currentUser.id || normalize(user.login) === normalize(currentUser.login));

    if (updatedCurrentUser) {
      currentUser = {
        id: updatedCurrentUser.id,
        uid: updatedCurrentUser.uid,
        login: updatedCurrentUser.login,
        name: updatedCurrentUser.name,
        role: updatedCurrentUser.role || "user"
      };
      isAdminLoggedIn = currentUser.role === "admin" || updatedCurrentUser.fullControl === true;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    }
  }
  selectedId = clients.some((client) => client.id === selectedId) ? selectedId : clients[0]?.id ?? "";
  restoreWorkspaceState({ applyFields: true });
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

function persistCompanyInfo() {
  return persistState(COMPANY_STORAGE_KEY, companyInfo);
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

function persistInfrastructureAgendaItems() {
  persistState(INFRASTRUCTURE_AGENDA_STORAGE_KEY, infrastructureAgendaItems);
}

function persistInfrastructureAgendaCounter() {
  persistState(INFRASTRUCTURE_AGENDA_COUNTER_STORAGE_KEY, infrastructureAgendaCounter);
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
  createLogRecord({ state: appState, persistLogs, createId, currentUser, action, details }).then(appendLocalLogBackup);
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
  let firestoreProfileChecked = false;

  if (firebaseSyncEnabled && firebaseDb) {
    try {
      const userSnapshot = await firebaseDb.collection("users").doc(firebaseUser.uid).get();
      firestoreProfileChecked = true;

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

  const isBootstrapAdmin = isBootstrapAdminUser(firebaseUser);

  if (firestoreProfileChecked && !isBootstrapAdmin) {
    return null;
  }

  const existingUser = users.find((item) => item.uid === firebaseUser.uid || normalize(item.email || "") === normalize(firebaseUser.email || ""));

  if (existingUser) {
    return existingUser;
  }

  if (!isBootstrapAdmin) {
    return null;
  }

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

  if (firebaseSyncEnabled && firebaseDb) {
    writeLocalState(USER_STORAGE_KEY, users);
  } else {
    persistUsers();
  }
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
  stopFirebaseRealtimeListeners();
  updateSyncStatus(firebaseSyncEnabled ? "syncing" : "offline", firebaseSyncEnabled ? "Aguardando login" : "Offline");
  closeEquipmentDialog();
  renderAuth();
  render();
}

function renderAuth() {
  const isLoggedIn = Boolean(currentUser);
  welcomeScreen.classList.toggle("hidden", isLoggedIn);
  appScreen.classList.toggle("hidden", !isLoggedIn);
  syncStatus.classList.toggle("hidden", !isLoggedIn || !firebaseSyncEnabled);

  if (currentUser) {
    adminStatus.textContent = isAdminLoggedIn ? "Administrador" : currentUser.name;
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

  if (tabName === "settings") {
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

function canModifyGlobalTheme() {
  return canApproveAuthorizationRequests();
}

function canManageBackups() {
  return canApproveAuthorizationRequests();
}

function canManageUsers() {
  return Boolean(isAdminLoggedIn || getCurrentStoredUser()?.fullControl);
}

function openUserDialog() {
  if (!requireAdmin()) {
    return;
  }

  userMessage.textContent = "";
  clearFormDraft(userForm);
  userForm.reset();
  userDialog.showModal();
  document.querySelector("#newUserName")?.focus();
}

function closeUserDialog() {
  userMessage.textContent = "";
  clearFormDraft(userForm);
  userForm.reset();

  if (userDialog.open) {
    userDialog.close();
  }
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

function requestInfrastructureAgendaAuthorization(payload) {
  if (!currentUser) {
    return false;
  }

  if (hasPendingInfrastructureAgendaAuthorization(payload)) {
    return false;
  }

  authorizationRequests = [
    {
      id: createId("AUT"),
      type: "create-infrastructure-agenda",
      title: "Solicitar agendamento infraestrutura",
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
  logActivity("Agendamento infraestrutura solicitado", `${payload.clientName} por ${currentUser.login}.`);
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

    if (type === "delete-company-stock") {
      return request.payload.itemId === payload.itemId;
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

function hasPendingInfrastructureAgendaAuthorization(payload) {
  return authorizationRequests.some((request) => {
    return (
      request.status === "Pendente" &&
      request.type === "create-infrastructure-agenda" &&
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
  clearFormDraft(userForm);
  userForm.reset();
  userMessage.textContent = "Usuario criado com sucesso.";
  closeUserDialog();
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
      resetAgendaForm();
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
  resetAgendaForm();
  agendaActionMessage.textContent = wasEditing ? "Agendamento atualizado." : "Agendamento adicionado.";
  switchAgendaView("list");
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
  clearFormDraft(agendaForm);
  renderAgendaItems();
}

function getNextAgendaNumber() {
  const nextNumber = agendaCounter;
  agendaCounter += 1;
  persistAgendaCounter();
  return nextNumber;
}

function startNewAgendaItem() {
  if (!canAccess("agenda")) {
    return;
  }

  resetAgendaForm();
  switchAgendaView("create");
}

function resetAgendaForm() {
  editingAgendaId = "";
  agendaDialogMessage.textContent = "";
  agendaActionMessage.textContent = "";
  agendaDialogTitle.textContent = "Novo agendamento";
  agendaSubmitButton.textContent = "Adicionar";
  agendaSubmitButton.title = editingAgendaId ? "Salvar agendamento" : "Adicionar agendamento";
  agendaSubmitButton.setAttribute("aria-label", "Adicionar agendamento");
  agendaSubmitButton.disabled = clients.length === 0;
  agendaForm.reset();
  clearFormDraft(agendaForm);
  renderAgendaClientOptions();

  if (agendaForm.elements.status) {
    agendaForm.elements.status.value = "Aberto";
  }
}

function addInfrastructureAgendaItem(event) {
  event.preventDefault();

  if (!canAccess("infrastructureAgenda")) {
    return;
  }

  const data = Object.fromEntries(new FormData(infrastructureAgendaForm).entries());
  const client = clients.find((item) => item.id === data.clientId);

  if (!client) {
    return;
  }

  const editingAgenda = infrastructureAgendaItems.find((item) => item.id === editingInfrastructureAgendaId);
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

  if (!canModify("infrastructureAgenda") && !editingAgenda) {
    const sent = requestInfrastructureAgendaAuthorization(payload);
    infrastructureAgendaDialogMessage.textContent = sent ? "solicitação de agendamento enviada" : "solicitação de agendamento já enviada";

    if (sent) {
      resetInfrastructureAgendaForm();
      infrastructureAgendaActionMessage.textContent = "solicitação de agendamento enviada";
    }

    return;
  }

  if (!canModify("infrastructureAgenda")) {
    return;
  }

  if (editingAgenda) {
    updateInfrastructureAgendaFromPayload(editingAgenda.id, payload);
  } else {
    createInfrastructureAgendaFromPayload(payload);
  }

  const wasEditing = Boolean(editingAgenda);
  editingInfrastructureAgendaId = "";
  resetInfrastructureAgendaForm();
  infrastructureAgendaActionMessage.textContent = wasEditing ? "Agendamento atualizado." : "Agendamento adicionado.";
  switchInfrastructureAgendaView("list");
}

function createInfrastructureAgendaFromPayload(payload) {
  const item = {
    id: createId("AINF"),
    number: getNextInfrastructureAgendaNumber(),
    ...payload,
    createdAt: new Date().toISOString()
  };
  infrastructureAgendaItems = [item, ...infrastructureAgendaItems];
  persistInfrastructureAgendaItems();
  logActivity("Agendamento infraestrutura criado", `${payload.clientName || "Cliente sem nome"}: ${payload.occurrence}`);
  renderInfrastructureAgendaItems();
  updateDashboardTotals();
}

function updateInfrastructureAgendaFromPayload(itemId, payload) {
  const previousItem = infrastructureAgendaItems.find((item) => item.id === itemId);
  infrastructureAgendaItems = infrastructureAgendaItems.map((item) =>
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
  persistInfrastructureAgendaItems();
  logActivity("Agendamento infraestrutura editado", `${formatInfrastructureAgendaNumber(previousItem || {})} - ${payload.clientName || "Cliente sem nome"}.`);
  clearFormDraft(infrastructureAgendaForm);
  renderInfrastructureAgendaItems();
}

function getNextInfrastructureAgendaNumber() {
  const nextNumber = infrastructureAgendaCounter;
  infrastructureAgendaCounter += 1;
  persistInfrastructureAgendaCounter();
  return nextNumber;
}

function startNewInfrastructureAgendaItem() {
  if (!canAccess("infrastructureAgenda")) {
    return;
  }

  resetInfrastructureAgendaForm();
  switchInfrastructureAgendaView("create");
}

function resetInfrastructureAgendaForm() {
  editingInfrastructureAgendaId = "";
  infrastructureAgendaDialogMessage.textContent = "";
  infrastructureAgendaActionMessage.textContent = "";
  infrastructureAgendaDialogTitle.textContent = "Novo agendamento";
  infrastructureAgendaSubmitButton.textContent = "Adicionar";
  infrastructureAgendaSubmitButton.title = "Adicionar agendamento infraestrutura";
  infrastructureAgendaSubmitButton.setAttribute("aria-label", "Adicionar agendamento infraestrutura");
  infrastructureAgendaSubmitButton.disabled = clients.length === 0;
  infrastructureAgendaForm.reset();
  clearFormDraft(infrastructureAgendaForm);
  renderInfrastructureAgendaClientOptions();

  if (infrastructureAgendaForm.elements.status) {
    infrastructureAgendaForm.elements.status.value = "Aberto";
  }
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
  clearFormDraft(serviceOrderForm);
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
  clearFormDraft(serviceOrderForm);
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

function createServiceOrderStatusSelect(order) {
  const select = document.createElement("select");
  select.className = `service-order-status status-select ${getServiceOrderStatusClass(order.status)}`;
  select.title = canModify("serviceOrders") ? "Selecionar status da OS" : "Status da OS";
  select.disabled = !canModify("serviceOrders");

  serviceOrderStatuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = getServiceOrderStatusLabel(status);
    select.append(option);
  });

  select.value = normalizeServiceOrderStatus(order.status);
  select.addEventListener("change", () => updateServiceOrderStatus(order.id, select.value));
  return select;
}

function updateServiceOrderStatus(orderId, nextStatus) {
  if (!canModify("serviceOrders")) {
    return;
  }

  const order = serviceOrders.find((item) => item.id === orderId);

  if (!order) {
    return;
  }

  nextStatus = normalizeServiceOrderStatus(nextStatus);

  if (normalizeServiceOrderStatus(order.status) === nextStatus) {
    return;
  }

  serviceOrders = serviceOrders.map((item) => (item.id === orderId ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item));
  persistServiceOrders();
  logActivity("Status da OS alterado", `${formatServiceOrderNumber(order)} para ${getServiceOrderStatusLabel(nextStatus)}.`);
  renderServiceOrders();
  renderSystemAlerts();
  renderNotifications();
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
  return normalizeServiceOrderStatus(status);
}

function normalizeServiceOrderStatus(status) {
  if (status === "Aberto") {
    return "Aberta";
  }

  return serviceOrderStatuses.includes(status) ? status : "Aberta";
}

function getServiceOrderStatusClass(status) {
  status = normalizeServiceOrderStatus(status);

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

  if (status === "Conserto Externo") {
    return "status-external-repair";
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
  renderAgendaView();
  renderInfrastructureAgendaClientOptions();
  renderInfrastructureAgendaItems();
  renderInfrastructureAgendaView();
  renderServiceOrderClientOptions();
  renderExternalRepairLocationOptions();
  renderEmailTypeOptions();
  renderServiceOrders();
  renderServiceOrderView();
  renderCompanyInfo();
  renderCompanyView();
  renderUsers();
  renderLogs();
  renderSystemAlerts();
  renderNotifications();
  renderPermissionList();
  renderSettingsView();
  renderReportOptions();
  renderFinanceUsers();
  renderFinanceMainView();
  renderFinanceGlobalRecords();
  renderFinancePaymentClientOptions();
  renderFinanceClientBillingList();
  renderForm();
  renderEquipmentCategories();
  renderBrandOptions(equipmentBrand, equipmentModel);
  renderBrandOptions(editEquipmentBrand, editEquipmentModel);
  renderRelatedRecords();
  updateDashboardTotals();
  renderDashboardTabs();
  renderTabs();
  renderPermissions();
  restoreVisibleFormDrafts();
}

function switchServiceOrderView(viewName) {
  activeServiceOrderView = viewName === "create" ? "create" : "list";
  serviceOrderMessage.textContent = "";
  saveWorkspaceState();
  renderServiceOrderView();
}

function switchAgendaView(viewName) {
  activeAgendaView = viewName === "create" ? "create" : "list";
  agendaActionMessage.textContent = "";
  saveWorkspaceState();
  renderAgendaView();
}

function switchInfrastructureAgendaView(viewName) {
  activeInfrastructureAgendaView = viewName === "create" ? "create" : "list";
  infrastructureAgendaActionMessage.textContent = "";
  saveWorkspaceState();
  renderInfrastructureAgendaView();
}

function switchSettingsView(viewName) {
  activeSettingsView = getAllowedSettingsViews().includes(viewName) ? viewName : getDefaultSettingsView();
  saveWorkspaceState();
  renderSettingsView();
}

function renderSettingsView() {
  const allowedViews = getAllowedSettingsViews();

  if (!allowedViews.includes(activeSettingsView)) {
    activeSettingsView = getDefaultSettingsView();
  }

  settingsViewButtons.forEach((button) => {
    const isActive = button.dataset.settingsView === activeSettingsView;
    const isAllowed = allowedViews.includes(button.dataset.settingsView);
    button.classList.toggle("active", isActive);
    button.classList.toggle("hidden", !isAllowed);
    button.disabled = !isAllowed;
    button.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(settingsPanels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === activeSettingsView);
  });

  renderThemeSettings();
  renderAlertSettings();
  renderBackupInfo();
}

function getAllowedSettingsViews() {
  if (canApproveAuthorizationRequests()) {
    return Object.keys(settingsPanels);
  }

  return ["theme", "password"];
}

function getDefaultSettingsView() {
  return "theme";
}

function renderThemeSettings() {
  const settings = getThemeSettings();
  Object.entries(settings).forEach(([key, value]) => {
    const field = themeSettingsForm.elements[key];

    if (field) {
      field.value = value;
    }
  });
  applyThemeSettings(settings);
}

function renderAlertSettings() {
  const settings = getAlertSettings();
  alertSettingsForm.elements.agendaDays.value = String(settings.agendaDays);
  alertSettingsForm.elements.serviceOrderDays.value = String(settings.serviceOrderDays);
}

function getThemeSettings() {
  return {
    ...emptyThemeSettings,
    ...(companyInfo.themeSettings || {}),
    ...getLocalThemeSettings()
  };
}

function getGlobalThemeSettings() {
  return {
    ...emptyThemeSettings,
    ...(companyInfo.themeSettings || {})
  };
}

function getSaveResultMessage(result, successMessage) {
  if (result?.saved) {
    return `${successMessage} Sincronizado e validado no Firebase.`;
  }

  if (result?.localOnly) {
    return `${successMessage} Atenção: ficou apenas neste navegador porque o Firebase nao esta conectado.`;
  }

  const code = result?.error?.code || result?.error?.message || "";
  return `${successMessage} Atenção: nao foi possivel confirmar a sincronizacao com o Firebase${code ? ` (${code})` : ""}.`;
}

function getLocalThemeSettings() {
  if (!currentUser) {
    return {};
  }

  const stored = localStorage.getItem(getUserScopedStorageKey(LOCAL_THEME_STORAGE_KEY));

  if (!stored) {
    return {};
  }

  try {
    const parsedTheme = JSON.parse(stored);
    return parsedTheme && typeof parsedTheme === "object" ? parsedTheme : {};
  } catch {
    return {};
  }
}

function saveLocalThemeSettings(settings) {
  if (!currentUser) {
    return;
  }

  localStorage.setItem(getUserScopedStorageKey(LOCAL_THEME_STORAGE_KEY), JSON.stringify(settings));
}

function clearLocalThemeSettings() {
  if (!currentUser) {
    return;
  }

  localStorage.removeItem(getUserScopedStorageKey(LOCAL_THEME_STORAGE_KEY));
}

function readThemeSettings() {
  const data = Object.fromEntries(new FormData(themeSettingsForm).entries());
  return {
    ...getThemeSettings(),
    ...data
  };
}

function previewThemeSettings() {
  if (!canModifyGlobalTheme() && !currentUser) {
    return;
  }

  applyThemeSettings(readThemeSettings());
}

function restoreDefaultTheme() {
  if (!canModifyGlobalTheme()) {
    const theme = {
      ...getGlobalThemeSettings(),
      mode: emptyThemeSettings.mode
    };
    saveLocalThemeSettings({ mode: emptyThemeSettings.mode });
    renderThemeSettings();
    applyThemeSettings(theme);
    themeSettingsMessage.textContent = "Tema local restaurado.";
    return;
  }

  Object.entries(emptyThemeSettings).forEach(([key, value]) => {
    const field = themeSettingsForm.elements[key];

    if (field) {
      field.value = value;
    }
  });
  applyThemeSettings(emptyThemeSettings);
  themeSettingsMessage.textContent = "Tema padrao restaurado. Clique em Salvar para manter.";
}

function applyThemeSettings(settings = getThemeSettings()) {
  const theme = {
    ...emptyThemeSettings,
    ...settings
  };
  document.documentElement.style.setProperty("--bg", theme.systemColor);
  document.documentElement.style.setProperty("--accent", theme.primaryColor);
  document.documentElement.style.setProperty("--accent-dark", shadeColor(theme.primaryColor, -24));
  document.documentElement.style.setProperty("--green", theme.secondaryColor);
  document.documentElement.style.setProperty("--status-open", theme.statusOpenColor);
  document.documentElement.style.setProperty("--status-analysis", theme.statusAnalysisColor);
  document.documentElement.style.setProperty("--status-budget", theme.statusBudgetColor);
  document.documentElement.style.setProperty("--status-repair", theme.statusRepairColor);
  document.documentElement.style.setProperty("--status-external-repair", theme.statusExternalRepairColor);
  document.documentElement.style.setProperty("--status-closed", theme.statusClosedColor);
  document.documentElement.style.setProperty("--status-done", theme.statusDoneColor);
  document.documentElement.style.setProperty("--status-canceled", theme.statusCanceledColor);
  document.body.dataset.themeMode = theme.mode;
  document.body.dataset.layout = theme.layout;
  document.body.dataset.fontSize = theme.fontSize;
  document.body.dataset.density = theme.density;
}

function renderAgendaView() {
  agendaViewButtons.forEach((button) => {
    const isActive = button.dataset.agendaView === activeAgendaView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  agendaListPanel.classList.toggle("active", activeAgendaView === "list");
  agendaForm.classList.toggle("active", activeAgendaView === "create");
}

function renderInfrastructureAgendaView() {
  infrastructureAgendaViewButtons.forEach((button) => {
    const isActive = button.dataset.infrastructureAgendaView === activeInfrastructureAgendaView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  infrastructureAgendaListPanel.classList.toggle("active", activeInfrastructureAgendaView === "list");
  infrastructureAgendaForm.classList.toggle("active", activeInfrastructureAgendaView === "create");
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

  const visibleNotifications = getVisibleAuthorizationRequests();
  clearNotificationsButton.disabled = visibleNotifications.length === 0;
  notificationCount.textContent = String(visibleNotifications.filter((item) => item.status === "Pendente").length);

  if (visibleNotifications.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state compact";
    emptyState.innerHTML = "<strong>Nenhuma notificacao</strong><span>Solicitacoes de autorizacao aparecerao aqui.</span>";
    notificationList.append(emptyState);
    return;
  }

  visibleNotifications.forEach((request) => {
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
      denyButton.className = "danger";
      denyButton.type = "button";
      denyButton.textContent = "Negar";
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

function renderSystemAlerts() {
  alertList.innerHTML = "";
  const alerts = getSystemAlerts();
  alertCount.textContent = String(alerts.length);
  alertButton.classList.toggle("has-alerts", alerts.length > 0);

  if (alerts.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state compact";
    emptyState.innerHTML = "<strong>Nenhum alerta</strong><span>Chamados e OS dentro dos prazos configurados.</span>";
    alertList.append(emptyState);
    return;
  }

  alerts.forEach((alert) => {
    const card = document.createElement("article");
    card.className = "notification-card alert-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const tag = document.createElement("span");
    tag.className = "record-tag";
    tag.textContent = alert.status;

    const title = document.createElement("strong");
    title.textContent = alert.title;

    const details = document.createElement("span");
    details.textContent = alert.details;

    content.append(tag, title, details);
    card.append(content);
    alertList.append(card);
  });
}

function getVisibleAuthorizationRequests() {
  if (!currentUser) {
    return [];
  }

  const dismissed = getDismissedNotificationIds();
  const notDismissed = (request) => !dismissed.has(request.id);

  if (canApproveAuthorizationRequests()) {
    return authorizationRequests.filter(notDismissed);
  }

  return authorizationRequests.filter((request) => request.requesterLogin === currentUser.login && notDismissed(request));
}

function getDismissedNotificationIds() {
  const key = getNotificationDismissKey();
  return new Set(Array.isArray(dismissedNotifications[key]) ? dismissedNotifications[key] : []);
}

function getSystemAlerts() {
  if (!currentUser) {
    return [];
  }

  const settings = getAlertSettings();
  const dismissed = getDismissedNotificationIds();
  const alerts = [];

  if (settings.agendaDays > 0 && canAccess("agenda")) {
    agendaItems.forEach((item) => {
      const reason = getAgendaAlertReason(item, settings.agendaDays);

      if (!reason) {
        return;
      }

      const alert = {
        id: `alert-agenda-${reason.type}-${item.id}-${settings.agendaDays}`,
        kind: "system-alert",
        status: "Alerta",
        title: `${formatAgendaNumber(item)} ${reason.title}`,
        details: `${item.clientName || "Cliente sem nome"} ${reason.details}`
      };

      if (!dismissed.has(alert.id)) {
        alerts.push(alert);
      }
    });
  }

  if (settings.serviceOrderDays > 0 && canAccess("serviceOrders")) {
    serviceOrders.forEach((order) => {
      const reason = getServiceOrderAlertReason(order, settings.serviceOrderDays);

      if (!reason) {
        return;
      }

      const alert = {
        id: `alert-os-${reason.type}-${order.id}-${settings.serviceOrderDays}`,
        kind: "system-alert",
        status: "Alerta",
        title: `${formatServiceOrderNumber(order)} ${reason.title}`,
        details: `${order.clientName || "Cliente sem nome"} ${reason.details}`
      };

      if (!dismissed.has(alert.id)) {
        alerts.push(alert);
      }
    });
  }

  return alerts;
}

function getAlertSettings() {
  return {
    ...emptyAlertSettings,
    ...(companyInfo.alertSettings || {})
  };
}

function isAgendaClosedForAlert(item) {
  return ["Concluido", "Cancelado"].includes(normalizeAgendaStatus(item.status));
}

function getAgendaAlertReason(item, days) {
  if (isAgendaClosedForAlert(item)) {
    return null;
  }

  const isOpen = normalizeAgendaStatus(item.status) === "Aberto";
  const openedDate = item.date || item.createdAt;
  const unchangedDate = item.updatedAt || item.createdAt || item.date;
  const openedDays = getElapsedAlertDays(openedDate);
  const unchangedDays = getElapsedAlertDays(unchangedDate);

  if (isOpen && openedDays >= Number(days || 0)) {
    return {
      type: "open",
      title: "em aberto",
      details: `está em aberto há ${openedDays} dia(s), desde ${formatAlertDate(openedDate)}.`
    };
  }

  if (!isOpen && unchangedDays >= Number(days || 0)) {
    return {
      type: "stale",
      title: "sem alteração",
      details: `está há ${unchangedDays} dia(s) sem mudança de status, desde ${formatAlertDate(unchangedDate)}.`
    };
  }

  return null;
}

function getServiceOrderAlertReason(order, days) {
  const statusGroup = getServiceOrderStatusGroup(order.status);
  const openedDate = order.openedAt || order.createdAt;
  const unchangedDate = order.updatedAt || order.createdAt || order.openedAt;
  const openedDays = getElapsedAlertDays(openedDate);
  const unchangedDays = getElapsedAlertDays(unchangedDate);

  if (statusGroup === "closed") {
    return null;
  }

  if (statusGroup === "open" && openedDays >= Number(days || 0)) {
    return {
      type: "open",
      title: "em aberto",
      details: `está em aberto há ${openedDays} dia(s), desde ${formatAlertDate(openedDate)}.`
    };
  }

  if (statusGroup !== "open" && unchangedDays >= Number(days || 0)) {
    return {
      type: "stale",
      title: "sem alteração",
      details: `está há ${unchangedDays} dia(s) sem mudança de status, desde ${formatAlertDate(unchangedDate)}.`
    };
  }

  return null;
}

function isAlertOverdue(dateValue, days) {
  return getElapsedAlertDays(dateValue) >= Number(days || 0);
}

function getElapsedAlertDays(dateValue) {
  const date = parseAlertDate(dateValue);

  if (!date) {
    return 0;
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(0, Math.floor((todayStart.getTime() - dateStart.getTime()) / (24 * 60 * 60 * 1000)));
}

function parseAlertDate(value) {
  if (!value) {
    return null;
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatAlertDate(value) {
  const date = parseAlertDate(value);

  if (!date) {
    return "data nao informada";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function getNotificationDismissKey() {
  return currentUser?.uid || currentUser?.id || normalize(currentUser?.login || "anonimo");
}

function persistDismissedNotifications() {
  localStorage.setItem(DISMISSED_NOTIFICATION_STORAGE_KEY, JSON.stringify(dismissedNotifications));
}

function clearVisibleNotifications() {
  if (!currentUser) {
    return;
  }

  const visibleRequests = getVisibleAuthorizationRequests();
  const key = getNotificationDismissKey();
  const dismissed = new Set([...(dismissedNotifications[key] || []), ...visibleRequests.map((request) => request.id)]);
  dismissedNotifications = {
    ...dismissedNotifications,
    [key]: [...dismissed]
  };
  persistDismissedNotifications();
  renderNotifications();
}

function closeFloatingPanelsOnOutsideClick(event) {
  if (!notificationPanel.classList.contains("hidden") && !notificationPanel.contains(event.target) && !notificationButton.contains(event.target)) {
    notificationPanel.classList.add("hidden");
  }

  if (!alertPanel.classList.contains("hidden") && !alertPanel.contains(event.target) && !alertButton.contains(event.target)) {
    alertPanel.classList.add("hidden");
  }
}

function updateDashboardTotals() {
  const openAgenda = [...agendaItems, ...infrastructureAgendaItems].filter((item) => normalizeAgendaStatus(item.status) === "Aberto").length;
  const openOrders = serviceOrders.filter((order) => getServiceOrderStatusGroup(order.status) === "open").length;
  const pendingAuthorizations = getVisibleAuthorizationRequests().filter((item) => item.status === "Pendente").length;
  const alerts = getSystemAlerts().length;

  dashboardClientTotal.textContent = String(clients.length);
  dashboardActiveClientTotal.textContent = `${clients.filter((client) => client.status !== "Inativo").length} ativos`;
  dashboardUserTotal.textContent = String(users.length);
  dashboardActiveUserTotal.textContent = `${users.filter((user) => user.active).length} ativos`;
  dashboardAgendaTotal.textContent = String(agendaItems.length + infrastructureAgendaItems.length);
  dashboardOpenAgendaTotal.textContent = `${openAgenda} em aberto`;
  dashboardServiceOrderTotal.textContent = String(serviceOrders.length);
  dashboardOpenServiceOrderTotal.textContent = `${openOrders} em aberto`;
  dashboardAlertTotal.textContent = String(alerts);
  dashboardAuthorizationTotal.textContent = String(pendingAuthorizations);
  renderDashboardStatusList();
  renderDashboardPendingList();
  renderDashboardRecentLogs();
}

function renderDashboardStatusList() {
  dashboardStatusList.innerHTML = "";
  const items = [
    ["Agenda aberta", agendaItems.filter((item) => normalizeAgendaStatus(item.status) === "Aberto").length],
    ["Infra aberta", infrastructureAgendaItems.filter((item) => normalizeAgendaStatus(item.status) === "Aberto").length],
    ["Agenda em análise", [...agendaItems, ...infrastructureAgendaItems].filter((item) => normalizeAgendaStatus(item.status) === "Em analise").length],
    ["Agenda concluída", [...agendaItems, ...infrastructureAgendaItems].filter((item) => normalizeAgendaStatus(item.status) === "Concluido").length],
    ["OS abertas", serviceOrders.filter((order) => getServiceOrderStatusGroup(order.status) === "open").length],
    ["OS em andamento", serviceOrders.filter((order) => getServiceOrderStatusGroup(order.status) === "inProgress").length],
    ["OS fechadas", serviceOrders.filter((order) => getServiceOrderStatusGroup(order.status) === "closed").length]
  ];

  items.forEach(([label, value]) => {
    dashboardStatusList.append(createDashboardStatusItem(label, value));
  });
}

function createDashboardStatusItem(label, value) {
  const item = document.createElement("div");
  item.className = "dashboard-status-item";
  item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
  return item;
}

function renderDashboardPendingList() {
  dashboardPendingList.innerHTML = "";
  const items = [
    ...getSystemAlerts().slice(0, 4).map((alert) => ({ title: alert.title, details: alert.details })),
    ...getVisibleAuthorizationRequests()
      .filter((request) => request.status === "Pendente")
      .slice(0, 4)
      .map((request) => ({ title: request.title, details: `Solicitado por ${request.requesterName}` }))
  ].slice(0, 6);

  if (items.length === 0) {
    dashboardPendingList.append(createDashboardMiniItem("Nada pendente", "Alertas e autorizações aparecerão aqui."));
    return;
  }

  items.forEach((item) => dashboardPendingList.append(createDashboardMiniItem(item.title, item.details)));
}

function renderDashboardRecentLogs() {
  dashboardRecentLogs.innerHTML = "";
  const recentLogs = logs.slice(0, 6);

  if (recentLogs.length === 0) {
    dashboardRecentLogs.append(createDashboardMiniItem("Sem atividades", "As próximas ações serão listadas aqui."));
    return;
  }

  recentLogs.forEach((log) => {
    dashboardRecentLogs.append(createDashboardMiniItem(log.action, `${log.actor || "Sistema"} | ${formatDate(log.createdAt)}`));
  });
}

function createDashboardMiniItem(title, details) {
  const item = document.createElement("article");
  item.className = "dashboard-mini-item";
  const strong = document.createElement("strong");
  strong.textContent = title;
  const span = document.createElement("span");
  span.textContent = details;
  item.append(strong, span);
  return item;
}

function renderPermissions() {
  const canModifyClients = canModify("clients");
  const canAccessAgenda = canAccess("agenda");
  const canAccessInfrastructureAgenda = canAccess("infrastructureAgenda");
  const canModifyAgenda = canModify("agenda");
  const canModifyInfrastructureAgenda = canModify("infrastructureAgenda");
  const canModifyServiceOrders = canModify("serviceOrders");
  const canModifyCompany = canModify("company");
  const canModifyFinance = canModify("finance");
  const canModifySettings = canModify("settings");
  const canModifyTheme = canModifyGlobalTheme();
  const canModifyLocalTheme = Boolean(currentUser);
  const canBackup = canManageBackups();
  const hasLocalBackup = Boolean(getLocalSystemBackup());
  const canModifyUsers = isAdminLoggedIn;
  const restrictedElements = [
    ...form.elements,
    ...equipmentForm.elements,
    ...networkSettingsForm.elements,
    ...emailSettingsForm.elements,
    ...emailForm.elements,
    ...editEquipmentForm.elements,
    ...dvrForm.elements,
    addDvrButton,
    deleteDvrButton,
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
  openUserFormButton.disabled = !canModifyUsers;

  [...agendaForm.elements].forEach((element) => {
    element.disabled = !canAccessAgenda;
  });
  agendaViewButtons.forEach((button) => {
    button.disabled = !canAccessAgenda;
  });
  companyViewButtons.forEach((button) => {
    button.disabled = !canAccess("company");
  });
  agendaSubmitButton.textContent = editingAgendaId ? "Salvar" : "Adicionar";
  agendaSubmitButton.title = editingAgendaId ? "Salvar agendamento" : "Adicionar agendamento";
  agendaSubmitButton.setAttribute("aria-label", agendaSubmitButton.title);
  agendaSubmitButton.disabled = !canAccessAgenda || clients.length === 0;

  [...infrastructureAgendaForm.elements].forEach((element) => {
    element.disabled = !canAccessInfrastructureAgenda;
  });
  infrastructureAgendaViewButtons.forEach((button) => {
    button.disabled = !canAccessInfrastructureAgenda;
  });
  infrastructureAgendaSubmitButton.textContent = editingInfrastructureAgendaId ? "Salvar" : "Adicionar";
  infrastructureAgendaSubmitButton.title = editingInfrastructureAgendaId ? "Salvar agendamento" : "Adicionar agendamento";
  infrastructureAgendaSubmitButton.setAttribute("aria-label", infrastructureAgendaSubmitButton.title);
  infrastructureAgendaSubmitButton.disabled = !canAccessInfrastructureAgenda || clients.length === 0 || (!canModifyInfrastructureAgenda && Boolean(editingInfrastructureAgendaId));

  [...serviceOrderForm.elements].forEach((element) => {
    element.disabled = !canModifyServiceOrders;
  });
  [...companyForm.elements].forEach((element) => {
    element.disabled = !canModifyCompany;
  });
  [...companyNetworkForm.elements].forEach((element) => {
    element.disabled = !canModifyCompany;
  });
  [...companyVehicleForm.elements].forEach((element) => {
    element.disabled = !canModifyCompany;
  });
  [...companyVehicleDetailsForm.elements].forEach((element) => {
    element.disabled = !canModifyCompany;
  });
  addCompanyVehicleButton.disabled = !canModifyCompany;
  addCompanyVehicleFineButton.disabled = !canModifyCompany;
  deleteCompanyVehicleButton.disabled = !canModifyCompany;
  [...companyStockForm.elements].forEach((element) => {
    element.disabled = !canModifyCompany;
  });
  [...alertSettingsForm.elements].forEach((element) => {
    element.disabled = !canModifySettings;
  });
  [...themeSettingsForm.elements].forEach((element) => {
    if (canModifyTheme) {
      element.disabled = false;
      return;
    }

    if (element.name === "mode" || element.type === "submit") {
      element.disabled = !canModifyLocalTheme;
      return;
    }

    element.disabled = true;
  });
  restoreDefaultThemeButton.disabled = !canModifyLocalTheme;
  clearAllLogsButton.disabled = !canModifySettings;
  clearLogsBeforeDate.disabled = !canModifySettings;
  clearLogsBeforeButton.disabled = !canModifySettings;
  resetAgendaCounterButton.disabled = !canModifySettings;
  resetServiceOrderCounterButton.disabled = !canModifySettings;
  [downloadBackupButton, saveLocalBackupButton, restoreBackupFileButton, restoreLocalBackupButton, clearLocalBackupButton].forEach((button) => {
    button.disabled = !canBackup;
  });
  restoreLocalBackupButton.disabled = !canBackup || !hasLocalBackup;
  clearLocalBackupButton.disabled = !canBackup || !hasLocalBackup;
  [...financeEmployeeSettingsForm.elements, ...financeVacationForm.elements, ...financeAdvanceForm.elements, ...financeCommissionForm.elements, ...financeExpenseForm.elements, ...financeMonthlyForm.elements, ...financeSporadicForm.elements].forEach((element) => {
    element.disabled = !canModifyFinance;
  });
  [...financeGlobalExpenseForm.elements, ...financePaymentForm.elements].forEach((element) => {
    element.disabled = !canModifyFinance;
  });
  financeClientBillingList.querySelectorAll("input, select, button, textarea").forEach((element) => {
    element.disabled = !canModifyFinance;
  });
  addTemporaryFinanceClientButton.disabled = !canModifyFinance;
  addTemporaryMonthlyClientButton.disabled = !canModifyFinance;
  addTemporarySporadicClientButton.disabled = !canModifyFinance;
  companyStockSubmitButton.textContent = editingCompanyStockItemId ? "Salvar" : "Adicionar";
  companyStockSubmitButton.title = editingCompanyStockItemId ? "Salvar produto" : "Adicionar produto";
  companyStockSubmitButton.setAttribute("aria-label", companyStockSubmitButton.title);
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

    const actions = document.createElement("div");
    actions.className = "record-actions";
    actions.append(changePasswordButton);

    if (canManageUsers() && user.id !== currentUser?.id && user.uid !== currentUser?.uid) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "icon-danger";
      deleteButton.type = "button";
      deleteButton.textContent = "Excluir";
      deleteButton.title = "Excluir usuario";
      deleteButton.setAttribute("aria-label", "Excluir usuario");
      deleteButton.addEventListener("click", () => deleteUser(user.id));
      actions.append(deleteButton);
    }

    content.append(tag, title, details);
    card.append(content, actions);
    userList.append(card);
  });
}

async function deleteUser(userId) {
  if (!canManageUsers()) {
    return;
  }

  const user = users.find((item) => item.id === userId);

  if (!user) {
    return;
  }

  if (user.id === currentUser?.id || user.uid === currentUser?.uid) {
    userMessage.textContent = "Nao e possivel excluir o usuario conectado.";
    return;
  }

  const confirmed = window.confirm(`Excluir o usuario ${user.name}?`);

  if (!confirmed) {
    return;
  }

  users = users.filter((item) => item.id !== user.id);
  persistUsers();

  try {
    await deleteFirebaseUserAccount(user);
  } catch (error) {
    console.warn("Nao foi possivel excluir a conta do Firebase Authentication.", error);
  }

  userMessage.textContent = "Usuario excluido.";
  logActivity("Usuario excluido", `${user.login} foi excluido do sistema.`);
  renderUsers();
  renderPermissionList();
  updateDashboardTotals();
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

function renderCompanyInfo() {
  Object.entries(companyInfo).forEach(([key, value]) => {
    const field = companyForm.elements[key];

    if (field) {
      field.value = value || "";
    }

    const networkField = companyNetworkForm.elements[key];

    if (networkField) {
      networkField.value = value || "";
    }
  });
  renderCompanyVehicles();
  renderCompanyStockTypes();
  renderCompanyStockItems();
}

function switchCompanyView(viewName) {
  activeCompanyView = ["profile", "network", "vehicles", "stock"].includes(viewName) ? viewName : "profile";
  saveWorkspaceState();
  renderCompanyView();
}

function renderCompanyView() {
  companyViewButtons.forEach((button) => {
    const isActive = button.dataset.companyView === activeCompanyView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  companyForm.classList.toggle("active", activeCompanyView === "profile");
  companyNetworkPanel.classList.toggle("active", activeCompanyView === "network");
  companyVehiclesPanel.classList.toggle("active", activeCompanyView === "vehicles");
  companyStockPanel.classList.toggle("active", activeCompanyView === "stock");
}

async function saveCompanyInfo(event) {
  event.preventDefault();

  if (!requireModify("company")) {
    return;
  }

  companyInfo = {
    ...emptyCompanyInfo,
    ...companyInfo,
    ...Object.fromEntries(new FormData(companyForm).entries()),
    vehicles: Array.isArray(companyInfo.vehicles) ? companyInfo.vehicles : [],
    stockTypes: getCompanyStockTypes(),
    stockItems: getCompanyStockItems(),
    updatedAt: new Date().toISOString()
  };
  const saveResult = await persistCompanyInfo();
  clearFormDraft(companyForm);
  companyMessage.textContent = getSaveResultMessage(saveResult, "Perfil da empresa salvo.");
  logActivity("Perfil da empresa atualizado", "Dados do perfil interno da empresa foram atualizados.");
}

async function saveCompanyNetworkInfo(event) {
  event.preventDefault();

  if (!requireModify("company")) {
    return;
  }

  companyInfo = {
    ...emptyCompanyInfo,
    ...companyInfo,
    ...Object.fromEntries(new FormData(companyNetworkForm).entries()),
    vehicles: Array.isArray(companyInfo.vehicles) ? companyInfo.vehicles : [],
    stockTypes: getCompanyStockTypes(),
    stockItems: getCompanyStockItems(),
    updatedAt: new Date().toISOString()
  };
  const saveResult = await persistCompanyInfo();
  clearFormDraft(companyNetworkForm);
  companyNetworkMessage.textContent = getSaveResultMessage(saveResult, "Rede interna salva.");
  logActivity("Rede interna atualizada", "Informacoes de rede da empresa foram atualizadas.");
}

function saveAlertSettings(event) {
  event.preventDefault();

  if (!requireModify("settings")) {
    return;
  }

  const data = Object.fromEntries(new FormData(alertSettingsForm).entries());
  companyInfo = normalizeCompanyInfo({
    ...companyInfo,
    alertSettings: {
      agendaDays: Number(data.agendaDays || 0),
      serviceOrderDays: Number(data.serviceOrderDays || 0)
    },
    updatedAt: new Date().toISOString()
  });
  persistCompanyInfo();
  alertSettingsMessage.textContent = "Alertas salvos.";
  logActivity("Alertas atualizados", "Prazos de alerta da agenda e das OS foram atualizados.");
  renderSystemAlerts();
  renderNotifications();
}

function saveThemeSettings(event) {
  event.preventDefault();

  if (!currentUser) {
    themeSettingsMessage.textContent = "Faça login para salvar o tema.";
    return;
  }

  const themeSettings = readThemeSettings();

  if (!canModifyGlobalTheme()) {
    saveLocalThemeSettings({ mode: themeSettings.mode });
    applyThemeSettings({
      ...getGlobalThemeSettings(),
      mode: themeSettings.mode
    });
    themeSettingsMessage.textContent = "Tema salvo apenas para seu usuario.";
    logActivity("Tema local atualizado", `Modo ${themeSettings.mode === "dark" ? "escuro" : "claro"} salvo por ${currentUser?.login || "usuario"}.`);
    return;
  }

  const applyForEveryone = window.confirm("Aplicar tema para todos os usuarios? Clique em OK para todos ou Cancelar para salvar apenas para seu usuario.");

  if (!applyForEveryone) {
    saveLocalThemeSettings(themeSettings);
    applyThemeSettings(themeSettings);
    themeSettingsMessage.textContent = "Tema salvo apenas para seu usuario.";
    logActivity("Tema local atualizado", `Configuracoes visuais salvas apenas para ${currentUser?.login || "usuario"}.`);
    return;
  }

  companyInfo = normalizeCompanyInfo({
    ...companyInfo,
    themeSettings,
    updatedAt: new Date().toISOString()
  });
  clearLocalThemeSettings();
  persistCompanyInfo();
  applyThemeSettings(themeSettings);
  themeSettingsMessage.textContent = "Tema salvo para todos os usuarios.";
  logActivity("Tema global atualizado", "Configuracoes visuais do sistema foram atualizadas para todos os usuarios.");
}

function clearAllLogsFromSettings() {
  if (!requireModify("settings")) {
    return;
  }

  if (!window.confirm("Limpar todos os logs do sistema?")) {
    return;
  }

  logs = [];
  localStorage.removeItem(LOG_BACKUP_STORAGE_KEY);
  persistLogs();
  logActivity("Logs limpos", `Todos os logs foram limpos por ${currentUser?.login || "usuario"}.`);
  settingsLogsMessage.textContent = "Logs limpos.";
  renderLogs();
  updateDashboardTotals();
}

function clearLogsBeforeSelectedDate() {
  if (!requireModify("settings")) {
    return;
  }

  const selectedDate = clearLogsBeforeDate.value;

  if (!selectedDate) {
    settingsLogsMessage.textContent = "Selecione uma data.";
    clearLogsBeforeDate.focus();
    return;
  }

  const cutoff = new Date(`${selectedDate}T00:00:00`);

  if (Number.isNaN(cutoff.getTime())) {
    settingsLogsMessage.textContent = "Data invalida.";
    return;
  }

  const beforeCount = logs.length;
  logs = logs.filter((log) => new Date(log.createdAt || 0) >= cutoff);
  localStorage.setItem(LOG_BACKUP_STORAGE_KEY, JSON.stringify(logs));
  persistLogs();
  const removedCount = beforeCount - logs.length;
  logActivity("Logs limpos", `${removedCount} log(s) anteriores a ${formatSimpleDate(selectedDate)} foram removidos por ${currentUser?.login || "usuario"}.`);
  clearLogsBeforeDate.value = "";
  settingsLogsMessage.textContent = `${removedCount} log(s) removido(s).`;
  renderLogs();
  updateDashboardTotals();
}

function resetAgendaCounterFromSettings() {
  if (!requireModify("settings")) {
    return;
  }

  if (!window.confirm("Resetar a contagem de Agendamentos para AG #0001?")) {
    return;
  }

  agendaCounter = 1;
  persistAgendaCounter();
  settingsSystemMessage.textContent = "Contagem de Agendamentos resetada.";
  logActivity("Contagem resetada", `Contagem de Agendamentos resetada por ${currentUser?.login || "usuario"}.`);
}

function resetServiceOrderCounterFromSettings() {
  if (!requireModify("settings")) {
    return;
  }

  if (!window.confirm("Resetar a contagem de OS para OS #0001?")) {
    return;
  }

  serviceOrderCounter = 1;
  persistServiceOrderCounter();
  settingsSystemMessage.textContent = "Contagem de OS resetada.";
  logActivity("Contagem resetada", `Contagem de OS resetada por ${currentUser?.login || "usuario"}.`);
}

function renderBackupInfo() {
  const backup = getLocalSystemBackup();

  if (!backup) {
    backupLocalInfo.textContent = "Nenhuma copia local salva neste navegador.";
    return;
  }

  backupLocalInfo.textContent = `Copia local salva em ${formatDate(backup.createdAt)} por ${backup.createdBy?.login || "usuario"}.`;
}

function createSystemBackup() {
  return {
    app: "Suporte-TI",
    type: "system-backup",
    version: 1,
    createdAt: new Date().toISOString(),
    createdBy: {
      name: currentUser?.name || "Usuario",
      login: currentUser?.login || "usuario"
    },
    data: {
      clients,
      equipmentCategories,
      equipmentBrandModels,
      companyInfo,
      users,
      logs,
      agendaItems,
      agendaCounter,
      infrastructureAgendaItems,
      infrastructureAgendaCounter,
      serviceOrders,
      serviceOrderCounter,
      serviceOrderEquipmentTypes,
      externalRepairLocations,
      emailTypes,
      authorizationRequests
    }
  };
}

function downloadSystemBackup() {
  if (!canManageBackups()) {
    backupMessage.textContent = "Apenas administrador ou Controle Total pode gerar backup.";
    return;
  }

  const backup = createSystemBackup();
  const content = JSON.stringify(backup, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `suporte-ti-backup-${getBackupFileDate()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  backupMessage.textContent = "Backup baixado.";
  logActivity("Backup exportado", `Backup JSON gerado por ${currentUser?.login || "usuario"}.`);
}

function saveLocalSystemBackup() {
  if (!canManageBackups()) {
    backupMessage.textContent = "Apenas administrador ou Controle Total pode salvar backup.";
    return;
  }

  const backup = createSystemBackup();
  localStorage.setItem(LOCAL_BACKUP_STORAGE_KEY, JSON.stringify(backup));
  backupMessage.textContent = "Copia local salva neste navegador.";
  renderBackupInfo();
  logActivity("Backup local salvo", `Backup local salvo por ${currentUser?.login || "usuario"}.`);
}

function restoreSystemBackupFromFile(event) {
  if (!canManageBackups()) {
    backupMessage.textContent = "Apenas administrador ou Controle Total pode restaurar backup.";
    backupFileInput.value = "";
    return;
  }

  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const backup = JSON.parse(String(reader.result || "{}"));
      restoreSystemBackup(backup, "arquivo");
    } catch {
      backupMessage.textContent = "Arquivo de backup invalido.";
    } finally {
      backupFileInput.value = "";
    }
  };
  reader.readAsText(file);
}

function restoreLocalSystemBackup() {
  if (!canManageBackups()) {
    backupMessage.textContent = "Apenas administrador ou Controle Total pode restaurar backup.";
    return;
  }

  const backup = getLocalSystemBackup();

  if (!backup) {
    backupMessage.textContent = "Nenhuma copia local encontrada.";
    return;
  }

  restoreSystemBackup(backup, "copia local");
}

function clearLocalSystemBackup() {
  if (!canManageBackups()) {
    backupMessage.textContent = "Apenas administrador ou Controle Total pode apagar backup.";
    return;
  }

  if (!window.confirm("Apagar a copia local de backup deste navegador?")) {
    return;
  }

  localStorage.removeItem(LOCAL_BACKUP_STORAGE_KEY);
  backupMessage.textContent = "Copia local apagada.";
  renderBackupInfo();
  logActivity("Backup local apagado", `Backup local apagado por ${currentUser?.login || "usuario"}.`);
}

function restoreSystemBackup(backup, sourceLabel) {
  const data = getBackupData(backup);

  if (!data) {
    backupMessage.textContent = "Backup invalido ou incompatível.";
    return;
  }

  if (!window.confirm(`Restaurar backup de ${sourceLabel}? Os dados atuais serao substituidos.`)) {
    return;
  }

  applySystemBackupData(data);
  backupMessage.textContent = "Backup restaurado com sucesso.";
  logActivity("Backup restaurado", `Backup restaurado de ${sourceLabel} por ${currentUser?.login || "usuario"}.`);
  render();
}

function getBackupData(backup) {
  if (!backup || typeof backup !== "object") {
    return null;
  }

  const data = backup.data && typeof backup.data === "object" ? backup.data : backup;
  return data.clients || data.companyInfo || data.serviceOrders || data.agendaItems ? data : null;
}

function applySystemBackupData(data) {
  clients = Array.isArray(data.clients) ? data.clients.map(normalizeClient) : clients;
  equipmentCategories = Array.isArray(data.equipmentCategories) ? uniqueTextOptions(data.equipmentCategories) : equipmentCategories;
  equipmentBrandModels = Array.isArray(data.equipmentBrandModels) ? data.equipmentBrandModels : equipmentBrandModels;
  companyInfo = data.companyInfo ? normalizeCompanyInfo(data.companyInfo) : companyInfo;
  users = Array.isArray(data.users) ? data.users.map(normalizeUser) : users;
  logs = Array.isArray(data.logs) ? data.logs : logs;
  agendaItems = Array.isArray(data.agendaItems) ? ensureAgendaNumbers(data.agendaItems) : agendaItems;
  agendaCounter = Number(data.agendaCounter || getNextCounterFromItems(agendaItems));
  infrastructureAgendaItems = Array.isArray(data.infrastructureAgendaItems) ? ensureAgendaNumbers(data.infrastructureAgendaItems) : infrastructureAgendaItems;
  infrastructureAgendaCounter = Number(data.infrastructureAgendaCounter || getNextCounterFromItems(infrastructureAgendaItems));
  serviceOrders = Array.isArray(data.serviceOrders) ? data.serviceOrders : serviceOrders;
  serviceOrderCounter = Number(data.serviceOrderCounter || getNextCounterFromItems(serviceOrders));
  serviceOrderEquipmentTypes = Array.isArray(data.serviceOrderEquipmentTypes) ? uniqueTextOptions(data.serviceOrderEquipmentTypes) : serviceOrderEquipmentTypes;
  externalRepairLocations = Array.isArray(data.externalRepairLocations) ? uniqueTextOptions(data.externalRepairLocations) : externalRepairLocations;
  emailTypes = Array.isArray(data.emailTypes) ? uniqueTextOptions(data.emailTypes) : emailTypes;
  authorizationRequests = Array.isArray(data.authorizationRequests) ? data.authorizationRequests : authorizationRequests;
  selectedId = clients.some((client) => client.id === selectedId) ? selectedId : clients[0]?.id ?? "";
  persistAllSystemBackupData();
  localStorage.setItem(LOG_BACKUP_STORAGE_KEY, JSON.stringify(logs));
}

function persistAllSystemBackupData() {
  persistClients();
  persistEquipmentCategories();
  persistEquipmentBrandModels();
  persistCompanyInfo();
  persistUsers();
  persistLogs();
  persistAgendaItems();
  persistAgendaCounter();
  persistInfrastructureAgendaItems();
  persistInfrastructureAgendaCounter();
  persistServiceOrders();
  persistServiceOrderCounter();
  persistServiceOrderEquipmentTypes();
  persistExternalRepairLocations();
  persistEmailTypes();
  persistAuthorizationRequests();
}

function getLocalSystemBackup() {
  const stored = localStorage.getItem(LOCAL_BACKUP_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const backup = JSON.parse(stored);
    return getBackupData(backup) ? backup : null;
  } catch {
    return null;
  }
}

function getBackupFileDate() {
  return new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
}

function getNextCounterFromItems(items) {
  const maxNumber = items.reduce((max, item) => Math.max(max, Number(item.number || 0)), 0);
  return maxNumber + 1 || 1;
}

function renderReportOptions() {
  renderReportStatusChecks(clientReportServiceOrderStatuses, serviceOrderStatuses, "report-os-status");
  renderReportStatusChecks(clientReportAgendaStatuses, agendaStatuses, "report-ag-status");
}

function renderReportStatusChecks(container, statuses, name) {
  if (!container || container.children.length > 0) {
    return;
  }

  statuses.forEach((status) => {
    const label = document.createElement("label");
    label.className = "compact-check-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = name;
    checkbox.value = status;
    checkbox.checked = true;

    const span = document.createElement("span");
    span.textContent = getReportStatusLabel(status);

    label.append(checkbox, span);
    container.append(label);
  });
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseMoney(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const text = String(value || "")
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(parseMoney(value));
}

function formatMoneyInput(input) {
  if (!input.value.trim()) {
    return;
  }

  input.value = formatMoney(input.value);
}

function getFinanceTotals(records) {
  const salary = parseMoney(records.salary);
  const advances = records.advances.reduce((total, item) => total + parseMoney(item.value), 0);
  const commissions = records.commissions.reduce((total, item) => total + parseMoney(item.value), 0);

  return {
    salary,
    advances,
    commissions,
    net: salary + commissions - advances
  };
}

function renderFinanceUsers() {
  financeUserList.innerHTML = "";
  const search = normalizeSearch(financeEmployeeSearchInput.value);
  const visibleUsers = users.filter((user) => {
    if (user.active === false && !canApproveAuthorizationRequests()) {
      return false;
    }

    if (!search) {
      return true;
    }

    const records = getFinanceRecords(user.id);
    const totals = getFinanceTotals(records);
    return normalizeSearch([user.name, user.login, records.salary, formatMoney(totals.net), records.advances.length, records.commissions.length].join(" ")).includes(search);
  });

  if (visibleUsers.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum usuario cadastrado";
    emptyState.querySelector("span").textContent = "Crie usuarios para controlar vales e comissoes.";
    financeUserList.append(emptyState);
    return;
  }

  visibleUsers.forEach((user) => {
    const records = getFinanceRecords(user.id);
    const card = document.createElement("article");
    card.className = "record-card clickable";
    card.tabIndex = 0;

    const content = document.createElement("div");
    content.className = "record-content";

    const tag = document.createElement("span");
    tag.className = "record-tag";
    tag.textContent = user.active === false ? "Inativo" : "Usuario";

    const title = document.createElement("strong");
    title.textContent = user.name || user.login || "Usuario";

    const totals = getFinanceTotals(records);
    const details = document.createElement("span");
    details.textContent = `Salario: ${formatMoney(totals.salary)} | Vales: ${formatMoney(totals.advances)} | Comissoes: ${formatMoney(totals.commissions)} | Liquido: ${formatMoney(totals.net)}`;

    card.addEventListener("click", () => openFinanceDialog(user.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFinanceDialog(user.id);
      }
    });

    content.append(tag, title, details);
    card.append(content);
    financeUserList.append(card);
  });
}

function openFinanceDialog(userId) {
  if (!canAccess("finance")) {
    return;
  }

  const user = users.find((item) => item.id === userId);

  if (!user) {
    return;
  }

  editingFinanceUserId = user.id;
  editingFinanceAdvanceId = "";
  financeDialogTitle.textContent = user.name || user.login || "Usuario";
  financeMessage.textContent = "";
  financeEmployeeSettingsForm.reset();
  financeVacationForm.reset();
  financeAdvanceForm.reset();
  financeAdvanceSubmitButton.textContent = "Adicionar vale";
  financeCommissionForm.reset();
  renderFinanceEmployeeSettings();
  renderFinanceClientOptions();
  hideTemporaryFinanceClientField();
  renderFinanceRecords();
  switchFinanceView("employee");
  financeDialog.showModal();
  renderPermissions();
}

function closeFinanceDialog() {
  editingFinanceUserId = "";
  editingFinanceAdvanceId = "";
  financeEmployeeSettingsForm.reset();
  financeVacationForm.reset();
  financeAdvanceForm.reset();
  financeAdvanceSubmitButton.textContent = "Adicionar vale";
  financeCommissionForm.reset();
  hideTemporaryFinanceClientField();

  if (financeDialog.open) {
    financeDialog.close();
  }
}

function switchFinanceMainView(viewName) {
  activeFinanceMainView = financeMainPanels[viewName] ? viewName : "employees";
  financePanelMessage.textContent = "";
  saveWorkspaceState();
  renderFinanceMainView();
}

function renderFinanceMainView() {
  financeMainTabs.forEach((tab) => {
    const isActive = tab.dataset.financeMainView === activeFinanceMainView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(financeMainPanels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === activeFinanceMainView);
  });
}

function switchFinanceView(viewName) {
  const activeView = financePanels[viewName] ? viewName : "employee";
  financeTabs.forEach((tab) => {
    const isActive = tab.dataset.financeView === activeView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  Object.entries(financePanels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === activeView);
  });
}

function renderFinanceClientOptions() {
  fillFinanceClientSelect(financeCommissionClient);

  if (clients.length === 0) {
    showTemporaryFinanceClientField();
  }
}

function renderFinancePaymentClientOptions() {
  fillFinanceClientSelect(financePaymentClient);
}

function renderFinanceMonthlyClientOptions() {
  fillFinanceClientSelect(financeMonthlyClient);

  if (clients.length === 0) {
    showTemporaryMonthlyClientField();
  }
}

function renderFinanceSporadicClientOptions() {
  fillFinanceClientSelect(financeSporadicClient, "Esporadico");

  if (clients.filter((client) => client.clientType === "Esporadico").length === 0) {
    showTemporarySporadicClientField();
  }
}

function fillFinanceClientSelect(select, clientType = "") {
  select.innerHTML = "";
  const sourceClients = clientType ? clients.filter((client) => client.clientType === clientType) : clients;
  sourceClients
    .slice()
    .sort((first, second) => (first.name || "").localeCompare(second.name || ""))
    .forEach((client) => {
      const option = document.createElement("option");
      option.value = client.id;
      option.textContent = client.name || "Cliente sem nome";
      select.append(option);
    });
}

function showTemporaryFinanceClientField() {
  temporaryFinanceClientLabel.classList.remove("hidden");
  temporaryFinanceClientName.required = true;
  financeCommissionClient.required = clients.length > 0 && temporaryFinanceClientName.value.trim() === "";
}

function hideTemporaryFinanceClientField() {
  temporaryFinanceClientLabel.classList.add("hidden");
  temporaryFinanceClientName.required = false;
  temporaryFinanceClientName.value = "";
  financeCommissionClient.required = clients.length > 0;
}

function showTemporaryMonthlyClientField() {
  temporaryMonthlyClientLabel.classList.remove("hidden");
  temporaryMonthlyClientName.required = true;
  financeMonthlyClient.required = clients.length > 0 && temporaryMonthlyClientName.value.trim() === "";
}

function hideTemporaryMonthlyClientField() {
  temporaryMonthlyClientLabel.classList.add("hidden");
  temporaryMonthlyClientName.required = false;
  temporaryMonthlyClientName.value = "";
  financeMonthlyClient.required = clients.length > 0;
}

function showTemporarySporadicClientField() {
  temporarySporadicClientLabel.classList.remove("hidden");
  temporarySporadicClientName.required = true;
  financeSporadicClient.required = clients.filter((client) => client.clientType === "Esporadico").length > 0 && temporarySporadicClientName.value.trim() === "";
}

function hideTemporarySporadicClientField() {
  temporarySporadicClientLabel.classList.add("hidden");
  temporarySporadicClientName.required = false;
  temporarySporadicClientName.value = "";
  financeSporadicClient.required = clients.filter((client) => client.clientType === "Esporadico").length > 0;
}

function renderFinanceEmployeeSettings() {
  const records = getFinanceRecords(editingFinanceUserId);
  const totals = getFinanceTotals(records);
  financeEmployeeSalary.value = records.salary || "";
  financeEmployeeSummary.innerHTML = `
    <span class="summary-item">
      <small>Salario</small>
      <strong>${escapeHtml(formatMoney(totals.salary))}</strong>
    </span>
    <span class="summary-item">
      <small>Vales</small>
      <strong>${escapeHtml(formatMoney(totals.advances))}</strong>
    </span>
    <span class="summary-item">
      <small>Comissoes</small>
      <strong>${escapeHtml(formatMoney(totals.commissions))}</strong>
    </span>
    <span class="summary-item finance-net-value">
      <small>Liquido</small>
      <strong>${escapeHtml(formatMoney(totals.net))}</strong>
    </span>
  `;
}

async function saveFinanceEmployeeSettings(event) {
  event.preventDefault();

  if (!requireModify("finance") || !editingFinanceUserId) {
    return;
  }

  const data = Object.fromEntries(new FormData(financeEmployeeSettingsForm).entries());
  const salary = formatMoney(data.salary);
  const saveResult = await updateFinanceRecords(editingFinanceUserId, (records) => ({
    ...records,
    salary
  }));
  financeEmployeeSalary.value = salary;
  financeMessage.textContent = getSaveResultMessage(saveResult, "Salario salvo.");
  logActivity("Salario financeiro atualizado", `${getFinanceUserName(editingFinanceUserId)} teve o salario atualizado.`);
  renderFinanceEmployeeSettings();
  renderFinanceUsers();
}

async function addFinanceVacation(event) {
  event.preventDefault();

  if (!requireModify("finance") || !editingFinanceUserId) {
    return;
  }

  const data = Object.fromEntries(new FormData(financeVacationForm).entries());
  const saveResult = await updateFinanceRecords(editingFinanceUserId, (records) => ({
    ...records,
    vacations: [
      {
        id: createId("FER"),
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status || "Programada",
        description: data.description.trim(),
        createdAt: new Date().toISOString()
      },
      ...records.vacations
    ]
  }));
  financeVacationForm.reset();
  financeMessage.textContent = getSaveResultMessage(saveResult, "Ferias registradas.");
  logActivity("Ferias financeiras registradas", `${getFinanceUserName(editingFinanceUserId)} teve ferias registradas.`);
  renderFinanceRecords();
}

async function addFinanceAdvance(event) {
  event.preventDefault();

  if (!requireModify("finance") || !editingFinanceUserId) {
    return;
  }

  const data = Object.fromEntries(new FormData(financeAdvanceForm).entries());
  const value = formatMoney(data.value);
  const advance = {
    id: editingFinanceAdvanceId || createId("VAL"),
    date: data.date,
    value,
    description: data.description.trim(),
    createdAt: new Date().toISOString()
  };
  const isEditing = Boolean(editingFinanceAdvanceId);
  const saveResult = await updateFinanceRecords(editingFinanceUserId, (records) => ({
    ...records,
    advances: isEditing ? records.advances.map((item) => (item.id === editingFinanceAdvanceId ? { ...item, ...advance, createdAt: item.createdAt || advance.createdAt } : item)) : [advance, ...records.advances]
  }));
  editingFinanceAdvanceId = "";
  financeAdvanceForm.reset();
  financeAdvanceSubmitButton.textContent = "Adicionar vale";
  financeMessage.textContent = getSaveResultMessage(saveResult, isEditing ? "Vale atualizado." : "Vale adicionado.");
  logActivity(isEditing ? "Vale financeiro atualizado" : "Vale financeiro adicionado", `${getFinanceUserName(editingFinanceUserId)} recebeu um vale de ${value}.`);
  renderFinanceEmployeeSettings();
  renderFinanceEmployeeSettings();
  renderFinanceRecords();
  renderFinanceUsers();
}

async function addFinanceCommission(event) {
  event.preventDefault();

  if (!requireModify("finance") || !editingFinanceUserId) {
    return;
  }

  const data = Object.fromEntries(new FormData(financeCommissionForm).entries());
  const temporaryClientName = data.temporaryClientName?.trim() || "";
  const client = clients.find((item) => item.id === data.clientId);
  const clientName = temporaryClientName || client?.name || "";
  const value = formatMoney(data.value);

  if (!clientName) {
    temporaryFinanceClientName.focus();
    return;
  }

  const saveResult = await updateFinanceRecords(editingFinanceUserId, (records) => ({
    ...records,
    commissions: [
      {
        id: createId("COM"),
        date: data.date,
        clientId: temporaryClientName ? "" : data.clientId,
        clientName,
        value,
        description: data.description.trim(),
        temporary: Boolean(temporaryClientName),
        createdAt: new Date().toISOString()
      },
      ...records.commissions
    ]
  }));
  financeCommissionForm.reset();
  renderFinanceClientOptions();
  hideTemporaryFinanceClientField();
  financeMessage.textContent = getSaveResultMessage(saveResult, "Comissão adicionada.");
  logActivity("Comissão financeira adicionada", `${getFinanceUserName(editingFinanceUserId)} recebeu comissão de ${data.value}.`);
  renderFinanceRecords();
  renderFinanceUsers();
}

function addFinanceExpense(event) {
  event.preventDefault();

  if (!requireModify("finance") || !editingFinanceUserId) {
    return;
  }

  const data = Object.fromEntries(new FormData(financeExpenseForm).entries());
  const value = formatMoney(data.value);
  updateFinanceRecords(editingFinanceUserId, (records) => ({
    ...records,
    expenses: [
      {
        id: createId("DES"),
        date: data.date,
        dueDate: data.dueDate || "",
        category: data.category,
        value,
        payment: data.payment || "",
        status: data.status || "Pendente",
        description: data.description.trim(),
        createdAt: new Date().toISOString()
      },
      ...records.expenses
    ]
  }));
  financeExpenseForm.reset();
  financeMessage.textContent = "Despesa adicionada.";
  logActivity("Despesa financeira adicionada", `${getFinanceUserName(editingFinanceUserId)} registrou despesa de ${value}.`);
  renderFinanceRecords();
  renderFinanceUsers();
}

async function addFinanceGlobalExpense(event) {
  event.preventDefault();

  if (!requireModify("finance")) {
    return;
  }

  const data = Object.fromEntries(new FormData(financeGlobalExpenseForm).entries());
  const value = formatMoney(data.value);
  const saveResult = await updateFinanceGlobalRecords((records) => ({
    ...records,
    expenses: [
      {
        id: createId("DES"),
        date: data.date,
        dueDate: data.dueDate || "",
        category: data.category.trim(),
        value,
        payment: data.payment || "",
        status: data.status || "Pendente",
        description: data.description.trim(),
        createdAt: new Date().toISOString()
      },
      ...records.expenses
    ]
  }));
  financeGlobalExpenseForm.reset();
  financePanelMessage.textContent = getSaveResultMessage(saveResult, "Despesa adicionada.");
  logActivity("Despesa financeira adicionada", `${data.category} - ${value}.`);
  renderFinanceGlobalRecords();
}

async function addFinancePayment(event) {
  event.preventDefault();

  if (!requireModify("finance")) {
    return;
  }

  const data = Object.fromEntries(new FormData(financePaymentForm).entries());
  const client = clients.find((item) => item.id === data.clientId);
  const value = formatMoney(data.value);

  if (!client) {
    return;
  }

  const saveResult = await updateFinanceGlobalRecords((records) => ({
    ...records,
    payments: [
      {
        id: createId("PAG"),
        date: data.date,
        clientId: client.id,
        clientName: client.name || "Cliente sem nome",
        value,
        payment: data.payment || "",
        status: data.status || "Recebido",
        description: data.description.trim(),
        createdAt: new Date().toISOString()
      },
      ...records.payments
    ]
  }));
  financePaymentForm.reset();
  renderFinancePaymentClientOptions();
  financePanelMessage.textContent = getSaveResultMessage(saveResult, "Pagamento adicionado.");
  logActivity("Pagamento financeiro adicionado", `${client.name || "Cliente"} - ${value}.`);
  renderFinanceGlobalRecords();
}

function addFinanceMonthly(event) {
  event.preventDefault();

  if (!requireModify("finance") || !editingFinanceUserId) {
    return;
  }

  const data = Object.fromEntries(new FormData(financeMonthlyForm).entries());
  const temporaryClientName = data.temporaryClientName?.trim() || "";
  const client = clients.find((item) => item.id === data.clientId);
  const clientName = temporaryClientName || client?.name || "";
  const value = formatMoney(data.value);

  if (!clientName) {
    temporaryMonthlyClientName.focus();
    return;
  }

  updateFinanceRecords(editingFinanceUserId, (records) => ({
    ...records,
    monthly: [
      {
        id: createId("MEN"),
        clientId: temporaryClientName ? "" : data.clientId,
        clientName,
        service: data.service.trim(),
        value,
        dueDay: data.dueDay || "",
        frequency: data.frequency || "Mensal",
        status: data.status || "Ativo",
        description: data.description.trim(),
        temporary: Boolean(temporaryClientName),
        createdAt: new Date().toISOString()
      },
      ...records.monthly
    ]
  }));
  financeMonthlyForm.reset();
  renderFinanceMonthlyClientOptions();
  hideTemporaryMonthlyClientField();
  financeMessage.textContent = "Mensalista adicionado.";
  logActivity("Mensalista financeiro adicionado", `${clientName} foi vinculado a ${getFinanceUserName(editingFinanceUserId)}.`);
  renderFinanceRecords();
  renderFinanceUsers();
}

function addFinanceSporadic(event) {
  event.preventDefault();

  if (!requireModify("finance") || !editingFinanceUserId) {
    return;
  }

  const data = Object.fromEntries(new FormData(financeSporadicForm).entries());
  const temporaryClientName = data.temporaryClientName?.trim() || "";
  const client = clients.find((item) => item.id === data.clientId);
  const clientName = temporaryClientName || client?.name || "";
  const value = formatMoney(data.value);

  if (!clientName) {
    temporarySporadicClientName.focus();
    return;
  }

  updateFinanceRecords(editingFinanceUserId, (records) => ({
    ...records,
    sporadic: [
      {
        id: createId("ESP"),
        clientId: temporaryClientName ? "" : data.clientId,
        clientName,
        service: data.service.trim(),
        date: data.date,
        value,
        payment: data.payment || "",
        status: data.status || "Pendente",
        description: data.description.trim(),
        temporary: Boolean(temporaryClientName),
        createdAt: new Date().toISOString()
      },
      ...records.sporadic
    ]
  }));
  financeSporadicForm.reset();
  renderFinanceSporadicClientOptions();
  hideTemporarySporadicClientField();
  financeMessage.textContent = "Cliente esporadico adicionado.";
  logActivity("Cliente esporadico financeiro adicionado", `${clientName} foi vinculado a ${getFinanceUserName(editingFinanceUserId)}.`);
  renderFinanceRecords();
  renderFinanceUsers();
}

function renderFinanceRecords() {
  const records = getFinanceRecords(editingFinanceUserId);
  renderFinanceEmployeeSettings();
  renderFinanceRecordList(financeVacationList, filterFinanceRecords(records.vacations, "Ferias", financeVacationSearchInput.value), "Ferias");
  renderFinanceRecordList(financeAdvanceList, filterFinanceRecords(records.advances, "Vale", financeAdvanceSearchInput.value), "Vale");
  renderFinanceRecordList(financeCommissionList, records.commissions, "Comissão");
}

function renderFinanceGlobalRecords() {
  const records = getFinanceGlobalRecords();
  renderFinanceRecordList(financeGlobalExpenseList, filterFinanceRecords(records.expenses, "Despesa", financeGlobalExpenseSearchInput.value), "Despesa");
  renderFinanceRecordList(financePaymentList, filterFinanceRecords(records.payments, "Pagamento", financePaymentSearchInput.value), "Pagamento");
}

function renderFinanceClientBillingList() {
  financeClientBillingList.innerHTML = "";
  financeClientBillingDetails.innerHTML = "";

  if (clients.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum cliente cadastrado";
    emptyState.querySelector("span").textContent = "Cadastre clientes para configurar o faturamento.";
    financeClientBillingList.append(emptyState);
    return;
  }

  const search = normalizeSearch(financeClientBillingSearchInput.value);
  const sortedClients = clients
    .filter((client) => {
      if (!search) {
        return true;
      }

      const billing = getFinanceGlobalRecords().clients[client.id] || {};
      return normalizeSearch([client.name, client.clientType, billing.monthlyValue, billing.dueDay, billing.paymentMethod, billing.billed, billing.sendType, billing.email, billing.boletoSent].join(" ")).includes(search);
    })
    .sort((first, second) => (first.name || "").localeCompare(second.name || ""));

  if (sortedClients.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum cliente encontrado";
    emptyState.querySelector("span").textContent = "Ajuste a pesquisa para localizar o cliente.";
    financeClientBillingList.append(emptyState);
    return;
  }

  if (!selectedFinanceClientId || !sortedClients.some((client) => client.id === selectedFinanceClientId)) {
    selectedFinanceClientId = sortedClients[0]?.id || "";
    editingFinanceClientBilling = false;
  }

  sortedClients.forEach((client) => {
    const billing = getFinanceGlobalRecords().clients[client.id] || {};
    const button = document.createElement("button");
    button.className = `client-item${client.id === selectedFinanceClientId ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <span class="client-name">${escapeHtml(client.name || "Cliente sem nome")}</span>
      <span class="client-meta">${escapeHtml(client.clientType || "Cliente")} | ${billing.monthlyValue ? escapeHtml(formatMoney(billing.monthlyValue)) : "Sem mensalidade"}</span>
    `;
    button.addEventListener("click", () => selectFinanceClient(client.id));
    financeClientBillingList.append(button);
  });

  renderFinanceClientBillingDetails();
}

function selectFinanceClient(clientId) {
  selectedFinanceClientId = clientId;
  editingFinanceClientBilling = false;
  financePanelMessage.textContent = "";
  renderFinanceClientBillingList();
}

function renderFinanceClientBillingDetails() {
  financeClientBillingDetails.innerHTML = "";
  const client = clients.find((item) => item.id === selectedFinanceClientId);

  if (!client) {
    return;
  }

  const billing = getFinanceGlobalRecords().clients[client.id] || {};

  if (!editingFinanceClientBilling) {
    const wrapper = document.createElement("div");
    wrapper.className = "settings-guide compact-summary";
    wrapper.innerHTML = `
      <div class="settings-header">
        <div>
          <p class="eyebrow">${escapeHtml(client.clientType || "Cliente")}</p>
          <h3>${escapeHtml(client.name || "Cliente sem nome")}</h3>
        </div>
        <button id="editFinanceClientBillingButton" class="subtle" type="button">Editar</button>
      </div>
      <div class="service-order-summary">
        ${createFinanceClientSummaryItem("Mensalidade", billing.monthlyValue ? formatMoney(billing.monthlyValue) : "Nao informado")}
        ${createFinanceClientSummaryItem("Vencimento", billing.dueDay ? `Dia ${billing.dueDay}` : "Nao informado")}
        ${createFinanceClientSummaryItem("Pagamento", billing.paymentMethod || "Nao informado")}
        ${createFinanceClientSummaryItem("Faturado", billing.billed || "Nao")}
        ${createFinanceClientSummaryItem("Envio", billing.sendType || "WhatsApp")}
        ${createFinanceClientSummaryItem("Email", billing.sendType === "Email" ? billing.email || "Nao informado" : "Nao utilizado")}
        ${createFinanceClientSummaryItem("Boleto", billing.boletoSent || "Nao")}
      </div>
    `;
    financeClientBillingDetails.append(wrapper);
    const editButton = wrapper.querySelector("#editFinanceClientBillingButton");
    editButton.disabled = !canModify("finance");
    editButton.addEventListener("click", () => {
      editingFinanceClientBilling = true;
      renderFinanceClientBillingDetails();
    });
    return;
  }

  const formElement = document.createElement("form");
  formElement.className = "settings-form compact-create-form finance-client-billing-form";
  formElement.dataset.clientId = client.id;
  formElement.innerHTML = `
    <div class="settings-header">
      <div>
        <p class="eyebrow">${escapeHtml(client.clientType || "Cliente")}</p>
        <h3>${escapeHtml(client.name || "Cliente sem nome")}</h3>
      </div>
    </div>
    <div class="form-grid compact-form-grid">
      <label>
        <span>Mensalidade</span>
        <input name="monthlyValue" inputmode="decimal" placeholder="R$ 0,00" value="${escapeAttribute(billing.monthlyValue || "")}" data-money-input />
      </label>
      <label>
        <span>Vencimento</span>
        <input name="dueDay" type="number" min="1" max="31" placeholder="Dia" value="${escapeAttribute(billing.dueDay || "")}" />
      </label>
      <label>
        <span>Forma de pagamento</span>
        <select name="paymentMethod">
          ${createSelectOptions(["", "Pix", "Dinheiro", "Cartao", "Boleto", "Transferencia"], billing.paymentMethod || "", "Nao informado")}
        </select>
      </label>
      <label>
        <span>Faturado</span>
        <select name="billed">
          ${createSelectOptions(["Sim", "Nao"], billing.billed || "Nao")}
        </select>
      </label>
      <label>
        <span>Tipo de envio</span>
        <select name="sendType" data-send-type>
          ${createSelectOptions(["WhatsApp", "Email"], billing.sendType || "WhatsApp")}
        </select>
      </label>
      <label data-email-wrap>
        <span>Email de envio</span>
        <input name="email" type="email" placeholder="financeiro@cliente.com.br" value="${escapeAttribute(billing.email || client.email || "")}" />
      </label>
      <label>
        <span>Boleto enviado</span>
        <select name="boletoSent">
          ${createSelectOptions(["Sim", "Nao"], billing.boletoSent || "Nao")}
        </select>
      </label>
    </div>
    <div class="form-actions service-order-form-actions">
      <button class="danger" type="button" data-cancel-billing>Cancelar</button>
      <button class="primary" type="submit">Salvar</button>
    </div>
  `;
  formElement.addEventListener("submit", saveFinanceClientBilling);
  formElement.querySelector("[data-cancel-billing]").addEventListener("click", () => {
    editingFinanceClientBilling = false;
    renderFinanceClientBillingDetails();
  });
  const sendTypeSelect = formElement.querySelector("[data-send-type]");
  const emailWrap = formElement.querySelector("[data-email-wrap]");
  const emailInput = formElement.elements.email;
  const toggleEmailField = () => {
    const isEmail = sendTypeSelect.value === "Email";
    emailWrap.classList.toggle("hidden", !isEmail);
    emailInput.disabled = !isEmail || !canModify("finance");
    emailInput.required = isEmail;
  };
  sendTypeSelect.addEventListener("change", toggleEmailField);
  toggleEmailField();
  financeClientBillingDetails.append(formElement);
}

function createFinanceClientSummaryItem(label, value) {
  return `
    <span class="summary-item">
      <small>${escapeHtml(label)}</small>
      <strong>${escapeHtml(value || "Nao informado")}</strong>
    </span>
  `;
}

async function saveFinanceClientBilling(event) {
  event.preventDefault();

  if (!requireModify("finance")) {
    return;
  }

  const clientId = event.currentTarget.dataset.clientId;
  const client = clients.find((item) => item.id === clientId);

  if (!client) {
    return;
  }

  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const saveResult = await updateFinanceGlobalRecords((records) => ({
    ...records,
    clients: {
      ...records.clients,
      [clientId]: {
        monthlyValue: data.monthlyValue ? formatMoney(data.monthlyValue) : "",
        dueDay: data.dueDay || "",
        paymentMethod: data.paymentMethod || "",
        billed: data.billed || "Nao",
        sendType: data.sendType || "WhatsApp",
        email: data.sendType === "Email" ? data.email.trim() : "",
        boletoSent: data.boletoSent || "Nao",
        updatedAt: new Date().toISOString()
      }
    }
  }));
  financePanelMessage.textContent = getSaveResultMessage(saveResult, "Dados do cliente salvos.");
  logActivity("Faturamento do cliente atualizado", `${client.name || "Cliente sem nome"} atualizado no financeiro.`);
  editingFinanceClientBilling = false;
  renderFinanceClientBillingList();
  renderPermissions();
}

function createSelectOptions(options, selectedValue, emptyLabel = "") {
  return options
    .map((value) => {
      const label = value || emptyLabel || value;
      const selected = value === selectedValue ? " selected" : "";
      return `<option value="${escapeAttribute(value)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function renderFinanceRecordList(container, items, type) {
  container.innerHTML = "";
  const visibleItems = filterFinanceRecords(items, type, getFinanceListSearchValue(type));

  if (visibleItems.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = `Nenhum registro de ${type.toLowerCase()}`;
    emptyState.querySelector("span").textContent = "Os lançamentos aparecerão aqui.";
    container.append(emptyState);
    return;
  }

  visibleItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "record-card compact-record-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const title = document.createElement("strong");
    title.textContent = getFinanceRecordTitle(item, type);

    const details = document.createElement("span");
    details.textContent = getFinanceRecordDetails(item, type);

    content.append(title, details);
    card.append(content);

    if (type === "Vale") {
      const actions = document.createElement("div");
      actions.className = "record-actions";

      const editButton = document.createElement("button");
      editButton.className = "subtle icon-button";
      editButton.type = "button";
      editButton.title = "Editar vale";
      editButton.setAttribute("aria-label", "Editar vale");
      editButton.textContent = "✎";
      editButton.disabled = !canModify("finance");
      editButton.addEventListener("click", () => editFinanceAdvance(item.id));

      const deleteButton = document.createElement("button");
      deleteButton.className = "danger icon-button";
      deleteButton.type = "button";
      deleteButton.title = "Excluir vale";
      deleteButton.setAttribute("aria-label", "Excluir vale");
      deleteButton.textContent = "x";
      deleteButton.disabled = !canModify("finance");
      deleteButton.addEventListener("click", () => deleteFinanceAdvance(item.id));

      actions.append(editButton, deleteButton);
      card.append(actions);
    }
    container.append(card);
  });
}

function getFinanceListSearchValue(type) {
  if (type === "Vale") {
    return financeAdvanceSearchInput.value;
  }

  if (type === "Comissao" || type.startsWith("Comiss")) {
    return financeCommissionSearchInput.value;
  }

  if (type === "Ferias") {
    return financeVacationSearchInput.value;
  }

  if (type === "Despesa") {
    return financeGlobalExpenseSearchInput.value;
  }

  if (type === "Pagamento") {
    return financePaymentSearchInput.value;
  }

  return "";
}

function filterFinanceRecords(items, type, searchValue = "") {
  const search = normalizeSearch(searchValue);

  if (!search) {
    return items;
  }

  return items.filter((item) => normalizeSearch([type, getFinanceRecordTitle(item, type), getFinanceRecordDetails(item, type), item.value, item.status, item.date, item.startDate, item.endDate, item.description].join(" ")).includes(search));
}

function editFinanceAdvance(advanceId) {
  if (!canModify("finance")) {
    return;
  }

  const records = getFinanceRecords(editingFinanceUserId);
  const advance = records.advances.find((item) => item.id === advanceId);

  if (!advance) {
    return;
  }

  editingFinanceAdvanceId = advance.id;
  financeAdvanceForm.elements.date.value = advance.date || "";
  financeAdvanceForm.elements.value.value = advance.value || "";
  financeAdvanceForm.elements.description.value = advance.description || "";
  financeAdvanceSubmitButton.textContent = "Salvar vale";
  switchFinanceView("advances");
}

async function deleteFinanceAdvance(advanceId) {
  if (!requireModify("finance") || !editingFinanceUserId) {
    return;
  }

  const confirmed = window.confirm("Excluir este vale?");

  if (!confirmed) {
    return;
  }

  const saveResult = await updateFinanceRecords(editingFinanceUserId, (records) => ({
    ...records,
    advances: records.advances.filter((item) => item.id !== advanceId)
  }));
  financeMessage.textContent = getSaveResultMessage(saveResult, "Vale excluido.");
  logActivity("Vale financeiro excluido", `${getFinanceUserName(editingFinanceUserId)} teve um vale removido.`);
  renderFinanceEmployeeSettings();
  renderFinanceRecords();
  renderFinanceUsers();
}

function updateFinanceRecords(userId, updater) {
  const finance = normalizeFinanceInfo(companyInfo.finance);
  finance[userId] = updater(getFinanceRecords(userId));
  companyInfo = normalizeCompanyInfo({
    ...companyInfo,
    finance,
    updatedAt: new Date().toISOString()
  });
  return persistCompanyInfo();
}

function updateFinanceGlobalRecords(updater) {
  const financeGlobal = updater(getFinanceGlobalRecords());
  companyInfo = normalizeCompanyInfo({
    ...companyInfo,
    financeGlobal,
    updatedAt: new Date().toISOString()
  });
  return persistCompanyInfo();
}

function getFinanceRecords(userId) {
  return normalizeFinanceInfo(companyInfo.finance)[userId] || { salary: "", vacations: [], advances: [], commissions: [], sporadic: [], expenses: [], monthly: [] };
}

function getFinanceGlobalRecords() {
  return normalizeFinanceGlobalInfo(companyInfo.financeGlobal);
}

function getFinanceRecordTitle(item, type) {
  if (type === "Ferias") {
    return `${formatSimpleDate(item.startDate)} ate ${formatSimpleDate(item.endDate)}`;
  }

  if (type === "Comissao" || type.startsWith("Comiss")) {
    return `${item.clientName || "Cliente"} - ${formatMoney(item.value)}`;
  }

  if (type === "Despesa") {
    return `${item.category || "Despesa"} - ${formatMoney(item.value)}`;
  }

  if (type === "Pagamento") {
    return `${item.clientName || "Cliente"} - ${formatMoney(item.value)}`;
  }

  if (["Mensalista", "Esporadico", "Vale"].includes(type)) {
    return type === "Vale" ? formatMoney(item.value) : `${item.clientName || "Cliente"} - ${formatMoney(item.value)}`;
  }

  if (type === "Comissão") {
    return `${item.clientName || "Cliente"} - ${item.value || "0,00"}`;
  }

  if (type === "Despesa") {
    return `${item.category || "Despesa"} - ${item.value || "0,00"}`;
  }

  if (type === "Pagamento") {
    return `${item.clientName || "Cliente"} - ${item.value || "0,00"}`;
  }

  if (type === "Mensalista") {
    return `${item.clientName || "Cliente"} - ${item.value || "0,00"}`;
  }

  if (type === "Esporadico") {
    return `${item.clientName || "Cliente"} - ${item.value || "0,00"}`;
  }

  return item.value || "0,00";
}

function getFinanceRecordDetails(item, type) {
  if (type === "Ferias") {
    return [
      `Inicio: ${formatSimpleDate(item.startDate)}`,
      `Fim: ${formatSimpleDate(item.endDate)}`,
      `Status: ${item.status || "Programada"}`,
      item.description
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (type === "Despesa") {
    return [
      `Data: ${formatSimpleDate(item.date)}`,
      item.dueDate ? `Vencimento: ${formatSimpleDate(item.dueDate)}` : "",
      item.payment ? `Pagamento: ${item.payment}` : "",
      `Status: ${item.status || "Pendente"}`,
      item.description
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (type === "Pagamento") {
    return [
      `Data: ${formatSimpleDate(item.date)}`,
      item.payment ? `Pagamento: ${item.payment}` : "",
      `Status: ${item.status || "Recebido"}`,
      item.description
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (type === "Mensalista") {
    return [
      item.service,
      item.dueDay ? `Vencimento dia ${item.dueDay}` : "",
      item.frequency || "Mensal",
      `Status: ${item.status || "Ativo"}`,
      item.temporary ? "cliente momentaneo" : "",
      item.description
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (type === "Esporadico") {
    return [
      item.service,
      `Data: ${formatSimpleDate(item.date)}`,
      item.payment ? `Pagamento: ${item.payment}` : "",
      `Status: ${item.status || "Pendente"}`,
      item.temporary ? "cliente momentaneo" : "",
      item.description
    ]
      .filter(Boolean)
      .join(" | ");
  }

  return [formatSimpleDate(item.date), item.description, item.temporary ? "cliente momentaneo" : ""].filter(Boolean).join(" | ");
}

function getFinanceUserName(userId) {
  const user = users.find((item) => item.id === userId);
  return user?.name || user?.login || "Usuario";
}

function generateClientReport(event) {
  event.preventDefault();
  reportMessage.textContent = "";

  const data = Object.fromEntries(new FormData(clientReportForm).entries());
  const selectedOrderStatuses = getCheckedReportValues(clientReportServiceOrderStatuses);
  const selectedAgendaStatuses = getCheckedReportValues(clientReportAgendaStatuses);
  const filteredOrders = serviceOrders.filter(
    (order) => isDateInReportRange(order.openedAt, data.startDate, data.endDate) && selectedOrderStatuses.includes(normalizeServiceOrderStatus(order.status))
  );
  const filteredAgenda = agendaItems.filter(
    (item) => isDateInReportRange(item.date, data.startDate, data.endDate) && selectedAgendaStatuses.includes(normalizeAgendaStatus(item.status))
  );

  const pdf = createReportPdf("Relatorio de Clientes");
  addPdfSection(pdf, "Periodo", [`De: ${formatSimpleDate(data.startDate)}`, `Ate: ${formatSimpleDate(data.endDate)}`]);
  addPdfSection(pdf, "Resumo", [
    `OS encontradas: ${filteredOrders.length}`,
    `Agendamentos encontrados: ${filteredAgenda.length}`,
    `Status OS: ${selectedOrderStatuses.map(getServiceOrderStatusLabel).join(", ") || "Nenhum"}`,
    `Status Agendamentos: ${selectedAgendaStatuses.map(getAgendaStatusLabel).join(", ") || "Nenhum"}`
  ]);

  const clientIds = new Set([...filteredOrders.map((order) => order.clientId), ...filteredAgenda.map((item) => item.clientId)].filter(Boolean));
  const reportClients = [...clientIds].map((clientId) => clients.find((client) => client.id === clientId)).filter(Boolean);

  if (reportClients.length === 0 && (filteredOrders.length > 0 || filteredAgenda.length > 0)) {
    addPdfSection(pdf, "Clientes", ["Existem registros no periodo, mas o cliente original nao foi localizado no cadastro."]);
  }

  reportClients.forEach((client) => {
    const clientOrders = filteredOrders.filter((order) => order.clientId === client.id);
    const clientAgenda = filteredAgenda.filter((item) => item.clientId === client.id);
    const lines = [
      `Documento: ${client.document || "Nao informado"}`,
      `Telefone: ${client.phone || "Nao informado"}`,
      `E-mail: ${client.email || "Nao informado"}`,
      `Cidade: ${client.city || "Nao informado"}`
    ];

    if (clientOrders.length > 0) {
      lines.push("Ordens de Servico:");
      clientOrders.forEach((order) => {
        lines.push(`- ${formatServiceOrderNumber(order)} | ${formatSimpleDate(order.openedAt)} | ${getServiceOrderStatusLabel(order.status)} | ${order.equipmentType || "Equipamento"} | ${order.defect || "Sem defeito informado"}`);
      });
    }

    if (clientAgenda.length > 0) {
      lines.push("Agendamentos:");
      clientAgenda.forEach((item) => {
        lines.push(`- ${formatAgendaNumber(item)} | ${formatSimpleDate(item.date)} | ${getAgendaStatusLabel(item.status)} | ${item.occurrence || "Sem ocorrencia informada"}`);
      });
    }

    addPdfSection(pdf, client.name || "Cliente sem nome", lines);
  });

  if (reportClients.length === 0 && filteredOrders.length === 0 && filteredAgenda.length === 0) {
    addPdfSection(pdf, "Resultado", ["Nenhum registro encontrado para os filtros selecionados."]);
  }

  saveReportPdf(pdf, `relatorio-clientes-${getReportFileDate()}.pdf`);
  reportMessage.textContent = "Relatorio de clientes gerado.";
  logActivity("Relatorio gerado", "Relatorio de clientes em PDF foi gerado.");
}

function generateStockReport(event) {
  event.preventDefault();
  reportMessage.textContent = "";

  const pdf = createReportPdf("Relatorio de Estoque");
  const stockItems = getCompanyStockItems().sort((first, second) => first.type.localeCompare(second.type));
  addPdfSection(pdf, "Resumo", [`Itens cadastrados: ${stockItems.length}`, `Quantidade total: ${stockItems.reduce((total, item) => total + Number(item.quantity || 0), 0)}`]);

  if (stockItems.length === 0) {
    addPdfSection(pdf, "Estoque", ["Nenhum produto cadastrado no estoque."]);
  } else {
    addPdfSection(
      pdf,
      "Itens",
      stockItems.map((item) => `${item.type || "Produto"} | Quantidade: ${Number(item.quantity || 0)}`)
    );
  }

  saveReportPdf(pdf, `relatorio-estoque-${getReportFileDate()}.pdf`);
  reportMessage.textContent = "Relatorio de estoque gerado.";
  logActivity("Relatorio gerado", "Relatorio de estoque em PDF foi gerado.");
}

function generateVehicleReport(event) {
  event.preventDefault();
  reportMessage.textContent = "";

  const pdf = createReportPdf("Relatorio de Veiculos");
  const vehicles = Array.isArray(companyInfo.vehicles) ? companyInfo.vehicles : [];
  addPdfSection(pdf, "Resumo", [`Veiculos cadastrados: ${vehicles.length}`, `Multas registradas: ${vehicles.reduce((total, vehicle) => total + (vehicle.fines?.length || 0), 0)}`]);

  if (vehicles.length === 0) {
    addPdfSection(pdf, "Veiculos", ["Nenhum veiculo cadastrado."]);
  }

  vehicles.forEach((vehicle) => {
    const lines = [
      `Tipo: ${vehicle.type || "Nao informado"}`,
      `Modelo: ${vehicle.model || "Nao informado"}`,
      `Placa: ${vehicle.plate || "Nao informado"}`,
      `Condutor: ${getCompanyVehicleDriverName(vehicle)}`,
      `Ultima manutencao: ${formatSimpleDate(vehicle.maintenanceDate)}`,
      `Manutencao feita: ${vehicle.maintenance || "Nao informado"}`
    ];
    const documentation = normalizeVehicleDocumentation(vehicle.documentation);
    lines.push(
      `IPVA: Ano ${documentation.ipva.year || "Nao informado"} | Vencimento ${formatSimpleDate(documentation.ipva.dueDate)} | Valor ${documentation.ipva.value || "Nao informado"} | Status ${documentation.ipva.status || "Nao informado"}`,
      `Licenciamento: Ano ${documentation.licensing.year || "Nao informado"} | Vencimento ${formatSimpleDate(documentation.licensing.dueDate)} | Valor ${documentation.licensing.value || "Nao informado"} | Status ${documentation.licensing.status || "Nao informado"}`
    );

    if (vehicle.fines?.length) {
      lines.push("Multas:");
      vehicle.fines.forEach((fine) => {
        lines.push(
          `- ${fine.type || "Multa"} | Gravidade: ${fine.severity || "Nao informado"} | Pontos: ${fine.points || "0"} | Valor: ${fine.value || "Nao informado"} | Infrator: ${fine.driverName || "Nao informado"} | Data: ${formatSimpleDate(fine.date)}`
        );
      });
    } else {
      lines.push("Multas: nenhuma registrada");
    }

    addPdfSection(pdf, [vehicle.model, vehicle.plate].filter(Boolean).join(" - ") || "Veiculo", lines);
  });

  saveReportPdf(pdf, `relatorio-veiculos-${getReportFileDate()}.pdf`);
  reportMessage.textContent = "Relatorio de veiculos gerado.";
  logActivity("Relatorio gerado", "Relatorio de veiculos em PDF foi gerado.");
}

function createReportPdf(title) {
  const PdfConstructor = window.jspdf?.jsPDF;

  if (!PdfConstructor) {
    reportMessage.textContent = "Nao foi possivel carregar o gerador de PDF. Verifique a conexao com a internet.";
    throw new Error("jsPDF indisponivel");
  }

  const pdf = new PdfConstructor({ unit: "mm", format: "a4" });
  pdf.setProperties({ title });
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text(title, 14, 18);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(`Gerado em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date())}`, 14, 25);
  pdf.lastY = 34;
  return pdf;
}

function addPdfSection(pdf, title, lines) {
  ensurePdfSpace(pdf, 18);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(String(title), 14, pdf.lastY);
  pdf.lastY += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  lines.forEach((line) => {
    const wrappedLines = pdf.splitTextToSize(String(line || "Nao informado"), 180);
    ensurePdfSpace(pdf, wrappedLines.length * 5 + 2);
    pdf.text(wrappedLines, 16, pdf.lastY);
    pdf.lastY += wrappedLines.length * 5;
  });

  pdf.lastY += 4;
}

function ensurePdfSpace(pdf, neededHeight) {
  if (pdf.lastY + neededHeight <= 285) {
    return;
  }

  pdf.addPage();
  pdf.lastY = 18;
}

function saveReportPdf(pdf, filename) {
  pdf.save(filename);
}

function getCheckedReportValues(container) {
  return [...container.querySelectorAll("input[type='checkbox']:checked")].map((checkbox) => checkbox.value);
}

function isDateInReportRange(value, startDate, endDate) {
  if (!value) {
    return false;
  }

  const dateValue = String(value).slice(0, 10);
  return (!startDate || dateValue >= startDate) && (!endDate || dateValue <= endDate);
}

function getReportStatusLabel(status) {
  return status || "Nao informado";
}

function getReportFileDate() {
  return new Date().toISOString().slice(0, 10);
}

async function addCompanyVehicle(event) {
  event.preventDefault();

  if (!requireModify("company")) {
    return;
  }

  const data = Object.fromEntries(new FormData(companyVehicleForm).entries());
  const driver = getCompanyVehicleDriver(data.driverId);
  const wasEditingVehicle = Boolean(editingCompanyVehicleId);
  const vehicle = normalizeCompanyVehicle({
    id: editingCompanyVehicleId || createId("VEI"),
    ...(getCompanyVehicleById(editingCompanyVehicleId) || {}),
    type: data.type,
    model: data.model.trim(),
    plate: data.plate.trim().toUpperCase(),
    driverId: data.driverId || "",
    driverName: driver?.name || "",
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  });

  const vehicles = Array.isArray(companyInfo.vehicles) ? companyInfo.vehicles : [];
  const nextVehicles = editingCompanyVehicleId
    ? vehicles.map((item) => (item.id === editingCompanyVehicleId ? { ...item, ...vehicle, createdAt: item.createdAt || vehicle.createdAt } : item))
    : [vehicle, ...vehicles];

  companyInfo = {
    ...emptyCompanyInfo,
    ...companyInfo,
    vehicles: nextVehicles,
    stockItems: getCompanyStockItems(),
    updatedAt: new Date().toISOString()
  };
  const saveResult = await persistCompanyInfo();
  clearFormDraft(companyVehicleForm);
  closeCompanyVehicleDialog();
  companyVehicleMessage.textContent = getSaveResultMessage(saveResult, wasEditingVehicle ? "Veiculo atualizado." : "Veiculo adicionado.");
  logActivity(wasEditingVehicle ? "Veiculo interno atualizado" : "Veiculo interno criado", `${vehicle.type} ${vehicle.model} - ${vehicle.plate}.`);
  renderCompanyVehicles();
}

function renderCompanyVehicles() {
  companyVehicleList.innerHTML = "";
  const vehicles = Array.isArray(companyInfo.vehicles) ? companyInfo.vehicles : [];

  if (vehicles.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum veiculo cadastrado";
    emptyState.querySelector("span").textContent = "Cadastre carros ou motos da empresa para consulta interna.";
    companyVehicleList.append(emptyState);
    return;
  }

  vehicles.forEach((vehicle) => {
    const card = document.createElement("article");
    card.className = "record-card clickable";
    card.tabIndex = 0;
    card.title = "Abrir detalhes do veiculo";

    const content = document.createElement("div");
    content.className = "record-content";

    const tag = document.createElement("span");
    tag.className = "record-tag";
    tag.textContent = vehicle.type || "Veiculo";

    const title = document.createElement("strong");
    title.textContent = [vehicle.model, vehicle.plate].filter(Boolean).join(" - ") || "Veiculo sem identificacao";

    const details = document.createElement("span");
    const maintenance = vehicle.maintenanceDate ? formatSimpleDate(vehicle.maintenanceDate) : "Nao informado";
    details.textContent = `Condutor: ${getCompanyVehicleDriverName(vehicle)} | Ultima manutencao: ${maintenance} | Multas: ${vehicle.fines?.length || 0}`;

    const actions = document.createElement("div");
    actions.className = "record-actions";

    const editButton = document.createElement("button");
    editButton.className = "ghost symbol-button";
    editButton.type = "button";
    editButton.textContent = "✎";
    editButton.title = "Editar veiculo";
    editButton.setAttribute("aria-label", "Editar veiculo");
    editButton.disabled = !canModify("company");
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openCompanyVehicleDialog(vehicle.id);
    });

    actions.append(editButton);
    card.addEventListener("click", () => openCompanyVehicleDetailsDialog(vehicle.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCompanyVehicleDetailsDialog(vehicle.id);
      }
    });

    content.append(tag, title, details);
    card.append(content, actions);
    companyVehicleList.append(card);
  });
}

function openCompanyVehicleDialog(vehicleId = "") {
  if (!requireModify("company")) {
    return;
  }

  const vehicle = getCompanyVehicleById(vehicleId);
  editingCompanyVehicleId = vehicle?.id || "";
  companyVehicleDialogTitle.textContent = editingCompanyVehicleId ? "Editar veiculo" : "Adicionar veiculo";
  companyVehicleForm.reset();
  renderCompanyVehicleDriverOptions(companyVehicleDriver, vehicle?.driverId || "");
  deleteCompanyVehicleButton.classList.toggle("hidden", !editingCompanyVehicleId);

  if (vehicle) {
    companyVehicleForm.elements.type.value = vehicle.type || "Carro";
    companyVehicleForm.elements.model.value = vehicle.model || "";
    companyVehicleForm.elements.plate.value = vehicle.plate || "";
    companyVehicleForm.elements.driverId.value = vehicle.driverId || "";
  }

  companyVehicleDialog.showModal();
}

function closeCompanyVehicleDialog() {
  editingCompanyVehicleId = "";
  companyVehicleForm.reset();

  if (companyVehicleDialog.open) {
    companyVehicleDialog.close();
  }
}

function openCompanyVehicleDetailsDialog(vehicleId) {
  const vehicle = getCompanyVehicleById(vehicleId);

  if (!vehicle) {
    return;
  }

  editingCompanyVehicleId = vehicle.id;
  editingCompanyVehicleFineDrafts = Array.isArray(vehicle.fines) ? vehicle.fines.map((fine) => ({ ...fine })) : [];
  editingCompanyVehicleDocumentationDraft = normalizeVehicleDocumentation(vehicle.documentation);
  companyVehicleDetailsTitle.textContent = [vehicle.model, vehicle.plate].filter(Boolean).join(" - ") || "Detalhes do veiculo";
  companyVehicleDetailsForm.reset();
  renderCompanyVehicleInfoSummary(vehicle);
  companyVehicleDetailsForm.elements.maintenanceDate.value = vehicle.maintenanceDate || "";
  companyVehicleDetailsForm.elements.maintenance.value = vehicle.maintenance || "";
  fillCompanyVehicleDocumentationForm(editingCompanyVehicleDocumentationDraft);
  renderCompanyVehicleDriverOptions(companyVehicleFineDriver);
  renderCompanyVehicleFineDrafts();
  switchCompanyVehicleDetailView("info");
  companyVehicleDetailsDialog.showModal();
}

function closeCompanyVehicleDetailsDialog() {
  editingCompanyVehicleFineDrafts = [];
  editingCompanyVehicleDocumentationDraft = createEmptyVehicleDocumentation();
  companyVehicleDetailsForm.reset();

  if (companyVehicleDetailsDialog.open) {
    companyVehicleDetailsDialog.close();
  }
}

function switchCompanyVehicleDetailView(viewName) {
  const activeView = vehicleDetailPanels[viewName] ? viewName : "info";

  vehicleDetailTabs.forEach((tab) => {
    const isActive = tab.dataset.vehicleDetailView === activeView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(vehicleDetailPanels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === activeView);
  });
}

function renderCompanyVehicleInfoSummary(vehicle) {
  companyVehicleInfoSummary.innerHTML = "";
  [
    ["Tipo", vehicle.type],
    ["Modelo", vehicle.model],
    ["Placa", vehicle.plate],
    ["Condutor", getCompanyVehicleDriverName(vehicle)],
    ["Ultima manutencao", formatSimpleDate(vehicle.maintenanceDate)],
    ["Multas", String(vehicle.fines?.length || 0)]
  ].forEach(([label, value]) => {
    const item = document.createElement("span");
    item.className = "compact-summary-item";

    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    item.append(strong, document.createTextNode(value || "Nao informado"));
    companyVehicleInfoSummary.append(item);
  });
}

function fillCompanyVehicleDocumentationForm(documentation) {
  companyVehicleDetailsForm.elements.ipvaYear.value = documentation.ipva.year || "";
  companyVehicleDetailsForm.elements.ipvaDueDate.value = documentation.ipva.dueDate || "";
  companyVehicleDetailsForm.elements.ipvaValue.value = documentation.ipva.value || "";
  companyVehicleDetailsForm.elements.ipvaStatus.value = documentation.ipva.status || "";
  companyVehicleDetailsForm.elements.ipvaNotes.value = documentation.ipva.notes || "";
  companyVehicleDetailsForm.elements.licensingYear.value = documentation.licensing.year || "";
  companyVehicleDetailsForm.elements.licensingDueDate.value = documentation.licensing.dueDate || "";
  companyVehicleDetailsForm.elements.licensingValue.value = documentation.licensing.value || "";
  companyVehicleDetailsForm.elements.licensingStatus.value = documentation.licensing.status || "";
  companyVehicleDetailsForm.elements.licensingNotes.value = documentation.licensing.notes || "";
  renderCompanyVehicleDocumentFileNames();
}

function readCompanyVehicleDocumentationForm() {
  editingCompanyVehicleDocumentationDraft = normalizeVehicleDocumentation({
    ipva: {
      ...editingCompanyVehicleDocumentationDraft.ipva,
      year: companyVehicleDetailsForm.elements.ipvaYear.value.trim(),
      dueDate: companyVehicleDetailsForm.elements.ipvaDueDate.value,
      value: companyVehicleDetailsForm.elements.ipvaValue.value.trim(),
      status: companyVehicleDetailsForm.elements.ipvaStatus.value,
      notes: companyVehicleDetailsForm.elements.ipvaNotes.value.trim()
    },
    licensing: {
      ...editingCompanyVehicleDocumentationDraft.licensing,
      year: companyVehicleDetailsForm.elements.licensingYear.value.trim(),
      dueDate: companyVehicleDetailsForm.elements.licensingDueDate.value,
      value: companyVehicleDetailsForm.elements.licensingValue.value.trim(),
      status: companyVehicleDetailsForm.elements.licensingStatus.value,
      notes: companyVehicleDetailsForm.elements.licensingNotes.value.trim()
    }
  });
  return editingCompanyVehicleDocumentationDraft;
}

function renderCompanyVehicleDocumentFileNames() {
  vehicleIpvaPdfName.textContent = editingCompanyVehicleDocumentationDraft.ipva.pdfName || "Sem PDF";
  vehicleLicensingPdfName.textContent = editingCompanyVehicleDocumentationDraft.licensing.pdfName || "Sem PDF";
  exportVehicleIpvaPdfButton.disabled = !editingCompanyVehicleDocumentationDraft.ipva.pdfData || !canModify("company");
  exportVehicleLicensingPdfButton.disabled = !editingCompanyVehicleDocumentationDraft.licensing.pdfData || !canModify("company");
}

function importCompanyVehicleDocumentPdf(event, documentType) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    companyVehicleMessage.textContent = "Importe apenas arquivos PDF.";
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    editingCompanyVehicleDocumentationDraft = normalizeVehicleDocumentation({
      ...editingCompanyVehicleDocumentationDraft,
      [documentType]: {
        ...editingCompanyVehicleDocumentationDraft[documentType],
        pdfName: file.name,
        pdfData: reader.result
      }
    });
    renderCompanyVehicleDocumentFileNames();
    event.target.value = "";
  });
  reader.readAsDataURL(file);
}

function exportCompanyVehicleDocumentPdf(documentType) {
  const documentData = editingCompanyVehicleDocumentationDraft[documentType];

  if (!documentData?.pdfData) {
    return;
  }

  const link = document.createElement("a");
  link.href = documentData.pdfData;
  link.download = documentData.pdfName || `${documentType}-${getReportFileDate()}.pdf`;
  link.click();
}

async function saveCompanyVehicleDetails(event) {
  event.preventDefault();

  if (!requireModify("company") || !editingCompanyVehicleId) {
    return;
  }

  const data = Object.fromEntries(new FormData(companyVehicleDetailsForm).entries());
  const vehicle = getCompanyVehicleById(editingCompanyVehicleId);
  const documentation = readCompanyVehicleDocumentationForm();

  companyInfo = {
    ...emptyCompanyInfo,
    ...companyInfo,
    vehicles: (companyInfo.vehicles || []).map((item) =>
      item.id === editingCompanyVehicleId
        ? normalizeCompanyVehicle({
            ...item,
            maintenanceDate: data.maintenanceDate || "",
            maintenance: data.maintenance.trim(),
            documentation,
            fines: editingCompanyVehicleFineDrafts,
            updatedAt: new Date().toISOString()
          })
        : item
    ),
    updatedAt: new Date().toISOString()
  };
  const saveResult = await persistCompanyInfo();
  clearFormDraft(companyVehicleDetailsForm);
  closeCompanyVehicleDetailsDialog();
  companyVehicleMessage.textContent = getSaveResultMessage(saveResult, "Detalhes do veiculo salvos.");
  logActivity("Veiculo interno atualizado", `Detalhes de ${vehicle?.model || "veiculo"} foram atualizados.`);
  renderCompanyVehicles();
}

function addCompanyVehicleFineDraft() {
  if (!requireModify("company")) {
    return;
  }

  const typeInput = companyVehicleDetailsForm.elements.fineType;
  const severityInput = companyVehicleDetailsForm.elements.fineSeverity;
  const pointsInput = companyVehicleDetailsForm.elements.finePoints;
  const valueInput = companyVehicleDetailsForm.elements.fineValue;
  const dateInput = companyVehicleDetailsForm.elements.fineDate;
  const driverInput = companyVehicleDetailsForm.elements.fineDriverId;
  const type = typeInput.value.trim();

  if (!type) {
    typeInput.focus();
    return;
  }

  const driver = getCompanyVehicleDriver(driverInput.value);
  editingCompanyVehicleFineDrafts = [
    {
      id: createId("MUL"),
      type,
      severity: severityInput.value || "",
      points: pointsInput.value || "",
      value: valueInput.value.trim(),
      date: dateInput.value || "",
      driverId: driverInput.value || "",
      driverName: driver?.name || ""
    },
    ...editingCompanyVehicleFineDrafts
  ];
  typeInput.value = "";
  severityInput.value = "";
  pointsInput.value = "";
  valueInput.value = "";
  dateInput.value = "";
  driverInput.value = "";
  renderCompanyVehicleFineDrafts();
}

function renderCompanyVehicleFineDrafts() {
  companyVehicleFineList.innerHTML = "";

  if (editingCompanyVehicleFineDrafts.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhuma multa cadastrada";
    emptyState.querySelector("span").textContent = "Adicione multas quando houver registros para este veiculo.";
    companyVehicleFineList.append(emptyState);
    return;
  }

  editingCompanyVehicleFineDrafts.forEach((fine) => {
    const card = document.createElement("article");
    card.className = "record-card compact-record-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const title = document.createElement("strong");
    title.textContent = fine.type || "Multa";

    const details = document.createElement("span");
    details.textContent = [
      `Gravidade: ${fine.severity || "Nao informado"}`,
      `Pontos: ${fine.points || "0"}`,
      `Valor: ${fine.value || "Nao informado"}`,
      `Infrator: ${fine.driverName || "Nao informado"}`,
      `Data: ${formatSimpleDate(fine.date)}`
    ].join(" | ");

    const removeButton = document.createElement("button");
    removeButton.className = "icon-danger";
    removeButton.type = "button";
    removeButton.textContent = "Excluir";
    removeButton.addEventListener("click", () => {
      editingCompanyVehicleFineDrafts = editingCompanyVehicleFineDrafts.filter((item) => item.id !== fine.id);
      renderCompanyVehicleFineDrafts();
    });

    content.append(title, details);
    card.append(content, removeButton);
    companyVehicleFineList.append(card);
  });
}

async function deleteEditingCompanyVehicle() {
  if (!requireModify("company") || !editingCompanyVehicleId) {
    return;
  }

  const vehicle = getCompanyVehicleById(editingCompanyVehicleId);

  if (!window.confirm(`Excluir o veiculo ${vehicle?.model || ""} ${vehicle?.plate || ""}?`)) {
    return;
  }

  companyInfo = {
    ...emptyCompanyInfo,
    ...companyInfo,
    vehicles: (companyInfo.vehicles || []).filter((item) => item.id !== editingCompanyVehicleId),
    updatedAt: new Date().toISOString()
  };
  const saveResult = await persistCompanyInfo();
  closeCompanyVehicleDialog();
  companyVehicleMessage.textContent = getSaveResultMessage(saveResult, "Veiculo excluido.");
  logActivity("Veiculo interno excluido", `${vehicle?.model || "Veiculo"} ${vehicle?.plate || ""} foi removido.`);
  renderCompanyVehicles();
}

function getCompanyVehicleById(vehicleId) {
  return (companyInfo.vehicles || []).find((vehicle) => vehicle.id === vehicleId);
}

function renderCompanyVehicleDriverOptions(select, selectedValue = "") {
  select.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Sem condutor";
  select.append(emptyOption);

  getCompanyVehicleDrivers().forEach((driver) => {
    const option = document.createElement("option");
    option.value = driver.id;
    option.textContent = driver.name;
    select.append(option);
  });

  select.value = [...select.options].some((option) => option.value === selectedValue) ? selectedValue : "";
}

function getCompanyVehicleDrivers() {
  const storedUsers = users
    .filter((user) => user.active !== false)
    .map((user) => ({ id: user.id || user.uid || normalize(user.login), name: user.name || user.login || user.email || "Usuario" }));

  if (currentUser && !storedUsers.some((user) => user.id === currentUser.id || user.id === currentUser.uid)) {
    storedUsers.unshift({
      id: currentUser.id || currentUser.uid || normalize(currentUser.login),
      name: currentUser.name || currentUser.login || currentUser.email || "Usuario atual"
    });
  }

  return storedUsers;
}

function getCompanyVehicleDriver(driverId) {
  return getCompanyVehicleDrivers().find((driver) => driver.id === driverId);
}

function getCompanyVehicleDriverName(vehicle) {
  if (vehicle.driverName) {
    return vehicle.driverName;
  }

  return getCompanyVehicleDriver(vehicle.driverId)?.name || "Nao informado";
}

function renderCompanyStockTypes(selectedValue = companyStockType.value) {
  companyStockType.innerHTML = "";

  getCompanyStockTypes().forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    companyStockType.append(option);
  });

  const newOption = document.createElement("option");
  newOption.value = NEW_COMPANY_STOCK_TYPE_VALUE;
  newOption.textContent = "Adicionar novo produto";
  companyStockType.append(newOption);

  if ([...companyStockType.options].some((option) => option.value === selectedValue)) {
    companyStockType.value = selectedValue;
  }

  toggleNewCompanyStockTypeField();
}

async function saveCompanyStockType(event) {
  event.preventDefault();

  if (!requireModify("company")) {
    return;
  }

  const isNewType = companyStockType.value === NEW_COMPANY_STOCK_TYPE_VALUE;
  const cleanType = isNewType ? newCompanyStockType.value.trim() : companyStockType.value;
  const quantity = Number(companyStockQuantity.value);

  if (!cleanType) {
    newCompanyStockType.focus();
    return;
  }

  if (!Number.isFinite(quantity) || quantity < 0) {
    companyStockQuantity.focus();
    return;
  }

  const stockItems = getCompanyStockItems();
  const editingItem = stockItems.find((item) => item.id === editingCompanyStockItemId);
  const existingItem = stockItems.find((item) => normalize(item.type) === normalize(cleanType) && item.id !== editingCompanyStockItemId);
  let nextStockItems;

  if (editingItem) {
    nextStockItems = existingItem
      ? stockItems
          .filter((item) => item.id !== editingItem.id)
          .map((item) =>
            item.id === existingItem.id
              ? {
                  ...item,
                  quantity,
                  updatedAt: new Date().toISOString()
                }
              : item
          )
      : stockItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                type: cleanType,
                quantity,
                updatedAt: new Date().toISOString()
              }
            : item
        );
  } else {
    nextStockItems = existingItem
      ? stockItems.map((item) =>
          item.id === existingItem.id
            ? {
                ...item,
                quantity,
                updatedAt: new Date().toISOString()
              }
            : item
        )
      : [
          {
            id: createId("EST"),
            type: cleanType,
            quantity,
            createdAt: new Date().toISOString(),
            updatedAt: ""
          },
          ...stockItems
        ];
  }

  companyInfo = {
    ...emptyCompanyInfo,
    ...companyInfo,
    stockTypes: uniqueTextOptions([...getCompanyStockTypes(), cleanType]),
    stockItems: nextStockItems,
    updatedAt: new Date().toISOString()
  };
  const saveResult = await persistCompanyInfo();
  clearFormDraft(companyStockForm);
  companyStockForm.reset();
  editingCompanyStockItemId = "";
  renderCompanyStockTypes(cleanType);
  renderCompanyStockItems();
  companyStockMessage.textContent = getSaveResultMessage(saveResult, editingItem || existingItem ? "Produto atualizado." : "Produto adicionado ao estoque.");
  logActivity("Estoque atualizado", `${cleanType}: ${quantity} unidade(s).`);
  renderPermissions();
}

function getCompanyStockTypes() {
  return uniqueTextOptions([...(Array.isArray(companyInfo.stockTypes) ? companyInfo.stockTypes : []), ...defaultCompanyStockTypes]);
}

function getCompanyStockItems() {
  return Array.isArray(companyInfo.stockItems) ? companyInfo.stockItems : [];
}

function renderCompanyStockItems() {
  companyStockList.innerHTML = "";
  const stockItems = getCompanyStockItems();

  if (stockItems.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum produto no estoque";
    emptyState.querySelector("span").textContent = "Selecione um produto, informe a quantidade e adicione ao estoque.";
    companyStockList.append(emptyState);
    return;
  }

  stockItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "record-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const tag = document.createElement("span");
    tag.className = "record-tag";
    tag.textContent = "Estoque";

    const title = document.createElement("strong");
    title.textContent = item.type || "Produto sem nome";

    const details = document.createElement("span");
    details.textContent = `Quantidade: ${item.quantity ?? 0}`;

    const actions = document.createElement("div");
    actions.className = "record-actions";

    if (canModify("company")) {
      const editButton = document.createElement("button");
      editButton.className = "ghost symbol-button";
      editButton.type = "button";
      editButton.textContent = "✎";
      editButton.title = "Editar produto";
      editButton.setAttribute("aria-label", "Editar produto");
      editButton.addEventListener("click", () => editCompanyStockItem(item.id));

      const deleteButton = document.createElement("button");
      deleteButton.className = "icon-danger";
      deleteButton.type = "button";
      deleteButton.textContent = "Excluir";
      deleteButton.title = "Excluir produto";
      deleteButton.setAttribute("aria-label", "Excluir produto");
      deleteButton.addEventListener("click", () => requestCompanyStockDelete(item.id));

      actions.append(editButton, deleteButton);
    }

    content.append(tag, title, details);
    card.append(content, actions);
    companyStockList.append(card);
  });
}

function editCompanyStockItem(itemId) {
  if (!requireModify("company")) {
    return;
  }

  const item = getCompanyStockItems().find((stockItem) => stockItem.id === itemId);

  if (!item) {
    return;
  }

  editingCompanyStockItemId = item.id;
  renderCompanyStockTypes(item.type);
  companyStockType.value = item.type;
  companyStockQuantity.value = item.quantity ?? 0;
  companyStockMessage.textContent = "Editando produto do estoque.";
  renderPermissions();
  companyStockQuantity.focus();
}

function requestCompanyStockDelete(itemId) {
  if (!requireModify("company")) {
    return;
  }

  const item = getCompanyStockItems().find((stockItem) => stockItem.id === itemId);

  if (!item) {
    return;
  }

  if (needsDeleteAuthorization()) {
    const sent = requestDeleteAuthorization("delete-company-stock", "Excluir item do estoque", `${item.type}: ${item.quantity ?? 0} unidade(s)`, { itemId });
    companyStockMessage.textContent = sent ? "solicitação de exclusão enviada" : "solicitação de exclusão já enviada";
    return;
  }

  deleteCompanyStockItem(itemId);
}

async function deleteCompanyStockItem(itemId, askConfirmation = true) {
  const item = getCompanyStockItems().find((stockItem) => stockItem.id === itemId);

  if (!item) {
    return;
  }

  if (askConfirmation && !window.confirm(`Excluir ${item.type || "este produto"} do estoque?`)) {
    return;
  }

  companyInfo = {
    ...emptyCompanyInfo,
    ...companyInfo,
    stockItems: getCompanyStockItems().filter((stockItem) => stockItem.id !== itemId),
    updatedAt: new Date().toISOString()
  };
  const saveResult = await persistCompanyInfo();

  if (editingCompanyStockItemId === itemId) {
    editingCompanyStockItemId = "";
    companyStockForm.reset();
    renderCompanyStockTypes();
  }

  companyStockMessage.textContent = getSaveResultMessage(saveResult, "Produto excluido.");
  logActivity("Estoque atualizado", `${item.type || "Produto"} foi excluido do estoque.`);
  renderCompanyStockItems();
  renderPermissions();
}

function toggleNewCompanyStockTypeField() {
  const isAdding = companyStockType.value === NEW_COMPANY_STOCK_TYPE_VALUE;
  newCompanyStockTypeLabel.classList.toggle("hidden", !isAdding);
  newCompanyStockType.required = isAdding;

  if (!isAdding) {
    newCompanyStockType.value = "";
  }
}

function renderPermissionList() {
  permissionList.innerHTML = "";
  const configurableUsers = users.filter((user) => !isMasterAdminUser(user));

  if (configurableUsers.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent = "Nenhum usuario para configurar";
    emptyState.querySelector("span").textContent = "Crie usuarios antes de ajustar permissoes.";
    permissionList.append(emptyState);
    return;
  }

  configurableUsers.forEach((user) => {
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

function isMasterAdminUser(user) {
  return user?.role === "admin" || normalize(user?.login) === normalize(ADMIN_USER);
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

    if (code.includes("internal")) {
      passwordMessage.textContent = "Erro interno na funcao do Firebase. Publique/atualize a Cloud Function updateUserPassword.";
      return false;
    }

    passwordMessage.textContent = `Nao foi possivel alterar a senha no Firebase. Codigo: ${code || "desconhecido"}.`;
    return false;
  }
}

async function saveCurrentUserPassword(event) {
  event.preventDefault();

  if (!currentUser) {
    currentPasswordMessage.textContent = "Faça login para alterar a senha.";
    return;
  }

  const data = Object.fromEntries(new FormData(currentPasswordForm).entries());

  if (data.password !== data.passwordConfirm) {
    currentPasswordMessage.textContent = "As senhas nao conferem.";
    return;
  }

  if (!firebaseAuth?.currentUser) {
    currentPasswordMessage.textContent = "Faça login novamente para alterar a senha.";
    return;
  }

  currentPasswordMessage.textContent = "Alterando senha...";

  try {
    await firebaseAuth.currentUser.updatePassword(data.password);
    currentPasswordForm.reset();
    currentPasswordMessage.textContent = "Senha alterada.";
    logActivity("Senha alterada", `Usuario ${currentUser.login} alterou a propria senha.`);
  } catch (error) {
    console.warn("Nao foi possivel alterar a senha do usuario logado.", error);
    const code = error?.code || "";

    if (code.includes("requires-recent-login")) {
      currentPasswordMessage.textContent = "Faça login novamente e tente alterar a senha.";
      return;
    }

    if (code.includes("weak-password")) {
      currentPasswordMessage.textContent = "A senha precisa ter pelo menos 6 caracteres.";
      return;
    }

    currentPasswordMessage.textContent = "Nao foi possivel alterar a senha.";
  }
}

async function deleteFirebaseUserAccount(user) {
  if (!user || !window.firebase?.functions || !firebaseAuth?.currentUser) {
    return false;
  }

  try {
    const deleteAccount = window.firebase.functions().httpsCallable("deleteUserAccount");
    await deleteAccount({
      uid: user.uid || user.id,
      email: user.email || getFirebaseLoginEmail(user.login)
    });
    return true;
  } catch (error) {
    console.warn("A conta foi removida do sistema, mas a exclusao no Firebase Auth nao foi concluida.", error);
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

    const statusButton = createAgendaStatusSelect(item);

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

    if (canApproveAuthorizationRequests()) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "icon-danger";
      deleteButton.type = "button";
      deleteButton.textContent = "Excluir";
      deleteButton.title = "Excluir agenda";
      deleteButton.setAttribute("aria-label", "Excluir agenda");
      deleteButton.addEventListener("click", () => deleteAgendaItem(item.id));
      actions.append(deleteButton);
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

function createAgendaStatusSelect(item) {
  const select = document.createElement("select");
  select.className = `service-order-status status-select ${getAgendaStatusClass(item.status)}`;
  select.title = canModify("agenda") ? "Selecionar status da agenda" : "Status da agenda";
  select.disabled = !canModify("agenda");

  agendaStatuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = getAgendaStatusLabel(status);
    select.append(option);
  });

  select.value = normalizeAgendaStatus(item.status);
  select.addEventListener("change", () => updateAgendaStatus(item.id, select.value));
  return select;
}

function updateAgendaStatus(itemId, nextStatus) {
  if (!requireModify("agenda")) {
    return;
  }

  const item = agendaItems.find((agendaItem) => agendaItem.id === itemId);

  if (!item) {
    return;
  }

  nextStatus = normalizeAgendaStatus(nextStatus);

  if (normalizeAgendaStatus(item.status) === nextStatus) {
    return;
  }

  agendaItems = agendaItems.map((agendaItem) => (agendaItem.id === itemId ? { ...agendaItem, status: nextStatus, updatedAt: new Date().toISOString() } : agendaItem));
  persistAgendaItems();
  logActivity("Status da agenda alterado", `${item.clientName || "Cliente"} alterado para ${nextStatus}.`);
  renderAgendaItems();
  renderSystemAlerts();
  renderNotifications();
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
  switchAgendaView("create");
}

function deleteAgendaItem(itemId) {
  if (!canApproveAuthorizationRequests()) {
    return;
  }

  const item = agendaItems.find((agendaItem) => agendaItem.id === itemId);

  if (!item) {
    return;
  }

  if (!window.confirm(`Excluir ${formatAgendaNumber(item)}?`)) {
    return;
  }

  agendaItems = agendaItems.filter((agendaItem) => agendaItem.id !== itemId);
  persistAgendaItems();
  logActivity("Agenda excluida", `${formatAgendaNumber(item)} - ${item.clientName || "Cliente sem nome"}.`);
  renderAgendaItems();
  updateDashboardTotals();
}

function renderInfrastructureAgendaClientOptions() {
  const selectedValue = infrastructureAgendaClient.value || selectedId;
  infrastructureAgendaClient.innerHTML = "";

  if (clients.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Nenhum cliente cadastrado";
    infrastructureAgendaClient.append(option);
    return;
  }

  clients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name || "Cliente sem nome";
    infrastructureAgendaClient.append(option);
  });

  if ([...infrastructureAgendaClient.options].some((option) => option.value === selectedValue)) {
    infrastructureAgendaClient.value = selectedValue;
  }
}

function renderInfrastructureAgendaItems() {
  infrastructureAgendaList.innerHTML = "";
  const visibleItems = infrastructureAgendaItems.filter((item) => matchesAgendaFilter(item, infrastructureAgendaStatusFilter.value) && matchesInfrastructureAgendaSearch(item));

  if (visibleItems.length === 0) {
    const emptyState = emptyRecordsTemplate.content.cloneNode(true);
    emptyState.querySelector("strong").textContent =
      infrastructureAgendaItems.length === 0 ? "Nenhuma ocorrencia de infraestrutura" : "Nenhum agendamento encontrado";
    emptyState.querySelector("span").textContent =
      infrastructureAgendaItems.length === 0 ? "Registre uma solicitacao para a equipe de infraestrutura." : "Altere a busca para encontrar outros chamados.";
    infrastructureAgendaList.append(emptyState);
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

    const statusButton = createInfrastructureAgendaStatusSelect(item);

    const title = document.createElement("strong");
    title.textContent = formatInfrastructureAgendaNumber(item);

    const clientName = document.createElement("span");
    clientName.textContent = item.clientName || "Cliente nao encontrado";

    const actions = document.createElement("div");
    actions.className = "service-order-card-actions";
    actions.append(statusButton);

    if (canModify("infrastructureAgenda")) {
      const editButton = document.createElement("button");
      editButton.className = "ghost symbol-button";
      editButton.type = "button";
      editButton.textContent = "✎";
      editButton.title = "Editar agendamento infraestrutura";
      editButton.setAttribute("aria-label", "Editar agendamento infraestrutura");
      editButton.addEventListener("click", () => editInfrastructureAgendaItem(item.id));
      actions.append(editButton);
    }

    if (canApproveAuthorizationRequests()) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "icon-danger";
      deleteButton.type = "button";
      deleteButton.textContent = "Excluir";
      deleteButton.title = "Excluir agendamento infraestrutura";
      deleteButton.setAttribute("aria-label", "Excluir agendamento infraestrutura");
      deleteButton.addEventListener("click", () => deleteInfrastructureAgendaItem(item.id));
      actions.append(deleteButton);
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
    infrastructureAgendaList.append(card);
  });
}

function createInfrastructureAgendaStatusSelect(item) {
  const select = document.createElement("select");
  select.className = `service-order-status status-select ${getAgendaStatusClass(item.status)}`;
  select.title = canModify("infrastructureAgenda") ? "Selecionar status do agendamento" : "Status do agendamento";
  select.disabled = !canModify("infrastructureAgenda");

  agendaStatuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = getAgendaStatusLabel(status);
    select.append(option);
  });

  select.value = normalizeAgendaStatus(item.status);
  select.addEventListener("change", () => updateInfrastructureAgendaStatus(item.id, select.value));
  return select;
}

function updateInfrastructureAgendaStatus(itemId, nextStatus) {
  if (!requireModify("infrastructureAgenda")) {
    return;
  }

  const item = infrastructureAgendaItems.find((agendaItem) => agendaItem.id === itemId);

  if (!item) {
    return;
  }

  nextStatus = normalizeAgendaStatus(nextStatus);

  if (normalizeAgendaStatus(item.status) === nextStatus) {
    return;
  }

  infrastructureAgendaItems = infrastructureAgendaItems.map((agendaItem) =>
    agendaItem.id === itemId ? { ...agendaItem, status: nextStatus, updatedAt: new Date().toISOString() } : agendaItem
  );
  persistInfrastructureAgendaItems();
  logActivity("Status da infraestrutura alterado", `${item.clientName || "Cliente"} alterado para ${nextStatus}.`);
  renderInfrastructureAgendaItems();
  renderSystemAlerts();
  renderNotifications();
}

function editInfrastructureAgendaItem(itemId) {
  if (!requireModify("infrastructureAgenda")) {
    return;
  }

  const item = infrastructureAgendaItems.find((agendaItem) => agendaItem.id === itemId);

  if (!item) {
    return;
  }

  editingInfrastructureAgendaId = itemId;
  infrastructureAgendaDialogMessage.textContent = "";
  infrastructureAgendaActionMessage.textContent = "";
  infrastructureAgendaDialogTitle.textContent = `Editar ${formatInfrastructureAgendaNumber(item)}`;
  infrastructureAgendaSubmitButton.textContent = "✓";
  infrastructureAgendaSubmitButton.title = "Salvar agendamento";
  infrastructureAgendaSubmitButton.setAttribute("aria-label", "Salvar agendamento");
  infrastructureAgendaSubmitButton.disabled = false;
  renderInfrastructureAgendaClientOptions();
  infrastructureAgendaForm.elements.clientId.value = item.clientId || "";
  infrastructureAgendaForm.elements.requester.value = item.requester || "";
  infrastructureAgendaForm.elements.date.value = item.date || "";
  infrastructureAgendaForm.elements.status.value = normalizeAgendaStatus(item.status);
  infrastructureAgendaForm.elements.occurrence.value = item.occurrence || "";
  switchInfrastructureAgendaView("create");
}

function deleteInfrastructureAgendaItem(itemId) {
  if (!canApproveAuthorizationRequests()) {
    return;
  }

  const item = infrastructureAgendaItems.find((agendaItem) => agendaItem.id === itemId);

  if (!item) {
    return;
  }

  if (!window.confirm(`Excluir ${formatInfrastructureAgendaNumber(item)}?`)) {
    return;
  }

  infrastructureAgendaItems = infrastructureAgendaItems.filter((agendaItem) => agendaItem.id !== itemId);
  persistInfrastructureAgendaItems();
  logActivity("Agendamento infraestrutura excluido", `${formatInfrastructureAgendaNumber(item)} - ${item.clientName || "Cliente sem nome"}.`);
  renderInfrastructureAgendaItems();
  updateDashboardTotals();
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

function matchesInfrastructureAgendaSearch(item) {
  const search = normalize(infrastructureAgendaSearchInput.value);

  if (!search) {
    return true;
  }

  const haystack = normalize(
    [
      formatInfrastructureAgendaNumber(item),
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

function formatInfrastructureAgendaNumber(item) {
  return item.number ? `AGI #${String(item.number).padStart(4, "0")}` : "AGI sem numero";
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

    const statusButton = createServiceOrderStatusSelect(order);

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

    if (canApproveAuthorizationRequests()) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "icon-danger";
      deleteButton.type = "button";
      deleteButton.textContent = "Excluir";
      deleteButton.title = "Excluir ordem de servico";
      deleteButton.setAttribute("aria-label", "Excluir ordem de servico");
      deleteButton.addEventListener("click", () => deleteServiceOrder(order.id));
      orderActions.append(deleteButton);
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

function deleteServiceOrder(orderId) {
  if (!canApproveAuthorizationRequests()) {
    return;
  }

  const order = serviceOrders.find((item) => item.id === orderId);

  if (!order) {
    return;
  }

  if (!window.confirm(`Excluir ${formatServiceOrderNumber(order)}?`)) {
    return;
  }

  serviceOrders = serviceOrders.filter((item) => item.id !== orderId);
  persistServiceOrders();
  logActivity("Ordem de servico excluida", `${formatServiceOrderNumber(order)} - ${order.clientName || "Cliente sem nome"}.`);
  renderServiceOrders();
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
  networkSettingsSummary.classList.add("compact-summary");

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
    networkSettingsSummary.append(createCompactSummaryItem(label, value));
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
  emailSettingsSummary.classList.add("compact-summary");

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
    emailSettingsSummary.append(createCompactSummaryItem(label, value));
  });
}

function createCompactSummaryItem(label, value) {
  const item = document.createElement("div");
  item.className = `summary-item compact-summary-item${value ? "" : " is-empty"}`;

  const labelElement = document.createElement("span");
  labelElement.textContent = label;

  const valueElement = document.createElement("strong");
  valueElement.textContent = value || "Nao informado";

  item.append(labelElement, valueElement);
  return item;
}

function renderRelatedRecords() {
  const selectedClient = getSelectedClient();
  renderEquipment(selectedClient.equipment);
  renderEmails(selectedClient.emails);
  renderDvrs(selectedClient.cftv);
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
    removeButton.className = "icon-danger";
    removeButton.type = "button";
    removeButton.textContent = "Excluir";
    removeButton.title = "Excluir e-mail";
    removeButton.setAttribute("aria-label", "Excluir e-mail");
    removeButton.addEventListener("click", () => removeRelatedRecord("emails", item.id));

    actions.append(editButton, removeButton);
    content.append(title, details, passwordRow);
    card.append(content, actions);
    emailList.append(card);
  });
}

function renderDvrs(dvrs) {
  dvrList.innerHTML = "";

  if (!selectedId || !Array.isArray(dvrs) || dvrs.length === 0) {
    dvrList.append(emptyRecordsTemplate.content.cloneNode(true));
    return;
  }

  dvrs.forEach((item) => {
    const card = document.createElement("article");
    card.className = "record-card";

    const content = document.createElement("div");
    content.className = "record-content";

    const tag = document.createElement("span");
    tag.className = "record-tag";
    tag.textContent = "DVR";

    const title = document.createElement("strong");
    title.textContent = item.brandModel || "DVR sem marca/modelo";

    const details = document.createElement("span");
    const network = item.networkType === "Estatico" ? `Estatico: ${item.ipAddress || "sem IP"}` : "DHCP";
    details.textContent = [`Serial: ${item.serial || "Nao informado"}`, `TCP: ${item.servicePort || "Nao informado"}`, `Rede: ${network}`, `Usuario: ${item.user || "Nao informado"}`].join(" | ");

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
    editButton.title = "Editar DVR";
    editButton.setAttribute("aria-label", "Editar DVR");
    editButton.disabled = !canModify("clients");
    editButton.addEventListener("click", () => openDvrDialog(item.id));

    const removeButton = document.createElement("button");
    removeButton.className = "icon-danger";
    removeButton.type = "button";
    removeButton.textContent = "Excluir";
    removeButton.title = "Excluir DVR";
    removeButton.setAttribute("aria-label", "Excluir DVR");
    removeButton.addEventListener("click", () => removeRelatedRecord("cftv", item.id));

    actions.append(editButton, removeButton);
    content.append(tag, title, details, passwordRow);
    card.append(content, actions);
    dvrList.append(card);
  });
}

function saveClient(event) {
  event.preventDefault();

  if (!requireModify("clients")) {
    return;
  }

  const draftKeyBeforeSave = getFormDraftKey(form);
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
  clearFormDraftByKey(draftKeyBeforeSave);
  saveWorkspaceState();
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

function openDvrDialog(dvrId = "") {
  if (!requireModify("clients")) {
    return;
  }

  const selectedClient = getSelectedClient();
  const dvr = selectedClient.cftv.find((item) => item.id === dvrId);
  editingDvrId = dvr?.id || "";
  dvrDialogTitle.textContent = editingDvrId ? "Editar DVR" : "Adicionar DVR";
  dvrActionMessage.textContent = "";
  dvrForm.reset();
  deleteDvrButton.classList.toggle("hidden", !editingDvrId);

  if (dvr) {
    dvrForm.elements.brandModel.value = dvr.brandModel || "";
    dvrForm.elements.serial.value = dvr.serial || "";
    dvrForm.elements.servicePort.value = dvr.servicePort || "";
    dvrForm.elements.networkType.value = dvr.networkType || "DHCP";
    dvrForm.elements.ipAddress.value = dvr.networkType === "Estatico" ? dvr.ipAddress || "" : "";
    dvrForm.elements.user.value = dvr.user || "";
    dvrForm.elements.password.value = dvr.password || "";
  }

  toggleEquipmentIpField(dvrNetworkType, dvrIpLabel, dvrIpAddress);
  dvrDialog.showModal();
}

function closeDvrDialog() {
  editingDvrId = "";
  dvrActionMessage.textContent = "";
  dvrForm.reset();
  toggleEquipmentIpField(dvrNetworkType, dvrIpLabel, dvrIpAddress);

  if (dvrDialog.open) {
    dvrDialog.close();
  }
}

function saveDvr(event) {
  event.preventDefault();

  if (!requireModify("clients") || !selectedId) {
    return;
  }

  const data = Object.fromEntries(new FormData(dvrForm).entries());
  const dvr = {
    id: editingDvrId || createId("DVR"),
    brandModel: data.brandModel.trim(),
    serial: data.serial.trim(),
    servicePort: data.servicePort.trim(),
    networkType: data.networkType || "DHCP",
    ipAddress: data.networkType === "Estatico" ? data.ipAddress.trim() : "",
    user: data.user.trim(),
    password: data.password,
    updatedAt: new Date().toISOString()
  };

  updateSelectedClient((client) => {
    const currentDvrs = Array.isArray(client.cftv) ? client.cftv : [];
    const nextDvrs = editingDvrId
      ? currentDvrs.map((item) => (item.id === editingDvrId ? { ...item, ...dvr, createdAt: item.createdAt || new Date().toISOString() } : item))
      : [{ ...dvr, createdAt: new Date().toISOString() }, ...currentDvrs];

    return {
      ...client,
      cftv: nextDvrs,
      updatedAt: new Date().toISOString()
    };
  });
  logActivity(editingDvrId ? "DVR atualizado" : "DVR adicionado", `${dvr.brandModel || "DVR"} em ${getSelectedClient().name || "cliente sem nome"}.`);
  closeDvrDialog();
}

function deleteEditingDvr() {
  if (!editingDvrId) {
    return;
  }

  removeRelatedRecord("cftv", editingDvrId);
  closeDvrDialog();
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
      `${getRelatedRecordDeleteLabel(collection, item)} de ${selectedClient.name || "cliente sem nome"}`,
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
  logActivity("Registro excluido", `${getRelatedRecordTypeLabel(collection)} removido de ${clientBeforeDelete?.name || "cliente sem nome"}.`);
  render();
}

function getRelatedRecordDeleteLabel(collection, item) {
  if (collection === "emails") {
    return item?.email || "E-mail";
  }

  if (collection === "cftv") {
    return item?.brandModel || "DVR";
  }

  return getEquipmentModel(item || {});
}

function getRelatedRecordTypeLabel(collection) {
  if (collection === "emails") {
    return "E-mail";
  }

  if (collection === "cftv") {
    return "DVR";
  }

  return "Equipamento";
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
  saveWorkspaceState();
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
  fields.clientType.value = "Mensalista";
  fields.status.value = "Ativo";
  clearFormDraft(form);
  saveWorkspaceState();
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
  saveWorkspaceState();
  logActivity("Cliente excluido", `Cliente ${selectedClient?.name || "sem nome"} foi excluido.`);
  render();
}

function executeAuthorizedRequest(request) {
  if (request.type === "create-agenda") {
    createAgendaFromPayload(request.payload);
    return;
  }

  if (request.type === "create-infrastructure-agenda") {
    createInfrastructureAgendaFromPayload(request.payload);
    return;
  }

  if (request.type === "delete-client") {
    deleteClientById(request.payload.clientId, false);
    return;
  }

  if (request.type === "delete-equipment" || request.type === "delete-email") {
    deleteRelatedRecord(request.payload.clientId, request.payload.collection, request.payload.itemId);
    return;
  }

  if (request.type === "delete-company-stock") {
    deleteCompanyStockItem(request.payload.itemId, false);
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
  saveWorkspaceState();
  logActivity("Cliente excluido", `Cliente ${client.name || "sem nome"} foi excluido.`);
  render();
}

function switchDashboardTab(tabName) {
  if (!canAccess(tabName)) {
    return;
  }

  editingAgendaId = "";
  editingInfrastructureAgendaId = "";
  activeDashboardTab = tabName;
  saveWorkspaceState();
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
  saveWorkspaceState();
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
  [...equipmentForm.elements, ...networkSettingsForm.elements, ...emailSettingsForm.elements, ...emailForm.elements, ...dvrForm.elements].forEach((element) => {
    element.disabled = disabled;
  });
  addDvrButton.disabled = disabled;
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

function shadeColor(color, percent) {
  const hex = String(color || "#256d85").replace("#", "");
  const number = parseInt(hex.length === 3 ? hex.split("").map((item) => item + item).join("") : hex, 16);
  const amount = Math.round(2.55 * percent);
  const red = Math.max(0, Math.min(255, (number >> 16) + amount));
  const green = Math.max(0, Math.min(255, ((number >> 8) & 0xff) + amount));
  const blue = Math.max(0, Math.min(255, (number & 0xff) + amount));
  return `#${(0x1000000 + red * 0x10000 + green * 0x100 + blue).toString(16).slice(1)}`;
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
