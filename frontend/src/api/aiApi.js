import api from "./axios";

export const getCancelSuggestions = () =>
  api.post("/ai/cancel-suggestions").then((r) => r.data);
