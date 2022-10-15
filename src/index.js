import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";
import ErrorBoundary from "./components/ErrorBoundary";
import store from "./redux/store"
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react";
import {PersistStore} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";

let persistor = persistStore(store)
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate persistor={persistor}>      <App />
</PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
