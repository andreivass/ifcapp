import http from "../http-common";
import authHeader from './authHeader';
import userId from "./userId";

class ProjectDataService {
  getAll() {
    return http.get(`/projects/${userId()}`, { headers: authHeader()});
  }
  get(id) {
    return http.get(`/projects/${id}/${userId()}`, { headers: authHeader()});
  }
  create(data) {
    return http.post(`/projects/${userId()}`, data, { headers: authHeader()});
  }
  update(id, data) {
    return http.put(`/projects/${id}`, data, { headers: authHeader()});
  }
  delete(id) {
    return http.delete(`/projects/${id}`, { headers: authHeader()});
  }
}
export default new ProjectDataService();