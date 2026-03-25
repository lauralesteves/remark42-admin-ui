import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";
import { initConfig } from "./config";

const store = configureStore({ reducer: rootReducer, devTools: true });

const root = ReactDOM.createRoot(document.getElementById("root"));

initConfig().then(() => {
  root.render(
    <Provider store={store}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </Provider>
  );
});
