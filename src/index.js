import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import "./i18n";

// Add a request interceptor
axios.interceptors.request.use(
  (request) => {
    console.log("INTERCEPTOR GETTING EXECUTED");
    const token = localStorage.getItem("token");
    const language = localStorage.getItem("i18nextLng").slice(0, 2);

    // console.log("Token: " + token);
    if (token) {
      request.headers["Authorization"] = "Bearer " + token;
      request.headers["Accept-Language"] = language;
    }
    // request.headers['Content-Type'] = 'application/json';
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);
// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    console.log("SUCCEDEED Response interceptor");
    return response;
  },
  (error) => {
    console.log("REJECTED Response interceptor");
    console.log(error);
    if (error.response.data.errorMessage === "jwt expired") {
      throw Error("JWT EXPIRED ERROR");
      // Promise.reject(error.message);
    }
    return error;
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
