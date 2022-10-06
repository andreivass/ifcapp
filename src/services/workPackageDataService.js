import http from "../http-common";
import authHeader from './authHeader';

class WorkPackageDataService {
  getAll() {
    return http.get("/workpackages", { headers: authHeader()});
  }
  get(id) {
    return http.get(`/workpackages/${id}`, { headers: authHeader()});
  }
  getByProject(id) {
    return http.get(`/workpackages/byproject/?id=${id}`, { headers: authHeader()});
  }
  create(data) {
    return http.post("/workpackages", data, { headers: authHeader()});
  }
  update(id, data) {
    return http.put(`/workpackages/${id}`, data, { headers: authHeader()});
  }
  delete(id) {
    return http.delete(`/workpackages/${id}`, { headers: authHeader()});
  }
}
export default new WorkPackageDataService();