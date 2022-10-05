import http from "../http-common";
import authHeader from './authHeader';

class ProjectDataService {
  // TODO: get projects for user
  getAll() {
    return http.get("/projects", { headers: authHeader()});
  }
  get(id) {
    return http.get(`/projects/${id}`);
  }
  create(data) {
    return http.post("/projects", data);
  }
  update(id, data) {
    return http.put(`/projects/${id}`, data);
  }
  delete(id) {
    return http.delete(`/projects/${id}`);
  }
}
export default new ProjectDataService();