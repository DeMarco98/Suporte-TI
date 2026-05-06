export const SERVICE_ORDER_STORAGE_KEY = "cadastros-ordens-servico";
export const SERVICE_ORDER_COUNTER_STORAGE_KEY = "cadastros-ordens-servico-contador";
export const SERVICE_ORDER_EQUIPMENT_TYPE_STORAGE_KEY = "cadastros-tipos-equipamento-os";
export const EXTERNAL_REPAIR_LOCATION_STORAGE_KEY = "cadastros-locais-conserto-externo";
export const NEW_SERVICE_ORDER_EQUIPMENT_TYPE_VALUE = "__new_service_order_equipment_type__";

export const serviceOrderStatuses = ["Aberta", "Em analise", "Aguardando orcamento", "Em conserto", "Fechada", "Concluida", "Cancelada"];
export const defaultServiceOrderEquipmentTypes = ["Notebook", "Computador", "All-In-One", "Impressora"];

export function isComputerServiceOrderType(equipmentType) {
  return equipmentType === "Notebook" || equipmentType === "Computador" || equipmentType === "All-In-One";
}

export function isPrinterServiceOrderType(equipmentType) {
  return equipmentType === "Impressora";
}

export function isNewServiceOrderEquipmentType(value) {
  return value === NEW_SERVICE_ORDER_EQUIPMENT_TYPE_VALUE || value === "Outro";
}

export function getServiceOrderStatusGroup(status) {
  if (["Aberta", "Aberto"].includes(status)) {
    return "open";
  }

  if (["Concluida", "Cancelada", "Fechada"].includes(status)) {
    return "closed";
  }

  return "inProgress";
}

export function getNextServiceOrderStatus(status) {
  const currentIndex = serviceOrderStatuses.indexOf(status);

  if (currentIndex === -1 || currentIndex === serviceOrderStatuses.length - 1) {
    return serviceOrderStatuses[0];
  }

  return serviceOrderStatuses[currentIndex + 1];
}

export function formatServiceOrderNumber(order) {
  return order.number ? `OS #${String(order.number).padStart(4, "0")}` : "OS sem numero";
}

export async function createServiceOrder({ state, persistServiceOrders, getNextServiceOrderNumber, createId, order }) {
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

export async function updateServiceOrder({ state, persistServiceOrders, orderId, data }) {
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

export async function listServiceOrders({ state }) {
  return state.serviceOrders;
}
