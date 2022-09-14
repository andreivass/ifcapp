import http from "../http-common";
class ClassificatorDataService {
  getAll() {
    return http.get("/ccieepps");
  }
  get(id) {
    return http.get(`/ccieepps/${id}`);
  }
  create(data) {
    return http.post("/ccieepps", data);
  }
  update(id, data) {
    return http.put(`/ccieepps/${id}`, data);
  }
  delete(id) {
    return http.delete(`/ccieepps/${id}`);
  }
}
export default new ClassificatorDataService();