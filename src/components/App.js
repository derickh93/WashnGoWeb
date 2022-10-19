import React from "react";
import Signup from "./Signup";
// import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import Address from "./Address";
import Time from "./Time";
import Products from "./Products";
import logo from "../Assets/logo.PNG";


import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Preferences from "./Preferences";
import Confirmation from "./Confirmation";
import ThankYou from "./ThankYou";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faCheckSquare,
  faCoffee,
  faChevronCircleLeft,
  faChevronCircleRight,
  faPlusCircle,
  faMinusCircle,
  faCartArrowDown
} from "@fortawesome/free-solid-svg-icons";

function App() {
  library.add(
    fab,
    faCheckSquare,
    faCoffee,
    faChevronCircleLeft,
    faChevronCircleRight,
    faPlusCircle,
    faMinusCircle,faCartArrowDown
  );

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "97vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
      <div className="homepage">
        <img className="logo" src={logo} alt="washngo" />
      </div>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Time} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              {/* <PrivateRoute path="/dashboard" component={Dashboard} /> */}
              <PrivateRoute path="/address" component={Address} />
              <PrivateRoute path="/time" component={Time} />
              <PrivateRoute path="/products" component={Products} />
              <PrivateRoute path="/preferences" component={Preferences} />
              <PrivateRoute path="/confirmation" component={Confirmation} />
              <PrivateRoute path="/thankyou" component={ThankYou} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
