import http from "../http-common";
import authHeader from './authHeader';

class ClassificatorDataService {
  getAll() {
    return http.get("/ccieepps", { headers: authHeader()});
  }
}
export default new ClassificatorDataService();