import http from "../http-common";
class WorkPackageDataService {
  getAll() {
    return http.get("/workpackages");
  }
  get(id) {
    return http.get(`/workpackages/${id}`);
  }
  getByProject(id) {
    return http.get(`/workpackages/byproject/?id=${id}`);
  }
  create(data) {
    return http.post("/workpackages", data);
  }
  update(id, data) {
    return http.put(`/workpackages/${id}`, data);
  }
  delete(id) {
    return http.delete(`/workpackages/${id}`);
  }
}
export default new WorkPackageDataService();