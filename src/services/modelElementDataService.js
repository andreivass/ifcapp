import http from "../http-common";
class ModelElementDataService {
  getAll() {
    return http.get("/modelelements");
  }
  get(id) {
    return http.get(`/modelelements/${id}`);
  }
  create(data) {
    return http.post("/modelelements", data);
  }
  update(id, data) {
    return http.put(`/modelelements/${id}`, data);
  }
  delete(id) {
    return http.delete(`/modelelements/${id}`);
  }
}
export default new ModelElementDataService();