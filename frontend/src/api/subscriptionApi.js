import api from "./axios";

export const getSubscriptions = () => api.get("/subscriptions").then((r) => r.data);
export const createSubscription = (data) => api.post("/subscriptions", data).then((r) => r.data);
export const updateSubscription = (id, data) =>
  api.put(`/subscriptions/${id}`, data).then((r) => r.data);
export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}`).then((r) => r.data);

export const getSummary = () => api.get("/summary").then((r) => r.data);

export const sendTestReminder = () => api.post("/reminders/run").then((r) => r.data);
