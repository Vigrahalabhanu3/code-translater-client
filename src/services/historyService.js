// Write your code here
import API from "./api.js";

const getHistory = async (page = 1, limit = 10) => {
    const response = await API.get(`/history?page=${page}&limit=${limit}`);
    return response.data.data;
};

const deleteHistoryItem = async (id) => {
    const response = await API.delete(`/history/${id}`);
    return response.data;
};

const clearHistory = async () => {
    const response = await API.delete("/history/clear");
    return response.data.data;
};

export { getHistory, deleteHistoryItem, clearHistory };