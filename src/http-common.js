import axios from "axios";
export default axios.create({
  // Use for prod build:
  baseURL: "http://193.40.231.167:5208",
  // baseURL: "/api",
  // headers: {
  //   "Content-type": "application/json",
  //   "Access-Control-Allow-Origin": "*"
  // }
});