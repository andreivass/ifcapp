export default function userId() {
    let user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.userId) {
      return user.userId;
    } else {
      return "";
    }
}