import axios from "axios";
export default axios.create({
  // Use for prod build:
  baseURL: "http://dreifc.live:5208",
  // Use for local dev run:
  // baseURL: "/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});