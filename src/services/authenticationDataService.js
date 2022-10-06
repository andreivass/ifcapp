import http from "../http-common";

class AuthenticationDataService {
  login(loginUser) {
    return http
      .post('/login', {
        email: loginUser.email,
        password: loginUser.password
      })
      .then(response => {
        if (response.status == 200) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(registerUser) {
    return http.post('/register', {
      firstName: registerUser.firstName,
      lastName: registerUser.lastName,
      email: registerUser.email,
      password: registerUser.password
    })
    .then(response => {
        if (response.status == 200) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }
}

export default new AuthenticationDataService();