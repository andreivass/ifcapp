import axios from "axios";
export default axios.create({
  // Use for prod build:
  // baseURL: "http://madli.me:5208",
  baseURL: "/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});