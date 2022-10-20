import React, { useContext, useState, useEffect } from "react";
import firebase from "../firebase";
import axios from "axios";
require("dotenv").config();

const AuthContext = React.createContext();
const auth = firebase.auth();
const data = firebase.database();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentStripeUser, setCurrentStripeUser] = useState();
  const [loading, setLoading] = useState(true);
  const [currentAddress, setCurrentAddress] = useState();
  const [currentStripeInstance, setCurrentStripeInstance] = useState();
  const [additional, setAdditional] = useState();

  const [detergent, setDetergent] = useState();

  const [doorman, setDoorman] = useState(false);
  const [hotel, setHotel] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState(false);
  const domain = process.env.REACT_APP_DOMAIN;

  const addNewProfile = async (authID, custID,phoneNumber) => {
    const user_profileRef = data.ref("user_profile");
    const user_profile = {
      authID,
      custID,
      phoneNumber
    };
    const result = await user_profileRef.push(user_profile);
    return result;
  };

  const readProfile = async (uid) => {
    var ref = firebase.database().ref("user_profile");
    //const result = 
    await ref
      .orderByChild("authID")
      .equalTo(uid)
      .on("child_added", (snapshot) => {
        getCustomer(snapshot.child("custID").val());
      });
  };

  const checkPhoneNumber = async (uid,) => {
    var ref = firebase.database().ref("user_profile");
    const result = await ref
      .orderByChild("authID")
      .equalTo(uid)
      .on("child_added", (snapshot) => {
        getCustomer(snapshot.child("phoneNumber").val());
      });
      console.log(result);
  };

  const signup = async (email, password, stripeUser,phoneNumber) => {
    const authObj = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        throw new Error(error.message);
      })
      .then((result) => {
        const uid = result.user.uid;
        createCustomer(uid, stripeUser,phoneNumber);
      });
    return authObj;
  };

  const createCustomer = async (uid, stripeUser,phoneNumber) => {
    try {
      const response = await axios.post(`${domain}create`, {
        firstName: stripeUser.firstName,
        lastName: stripeUser.lastName,
        email: stripeUser.email,
        phone: stripeUser.phone,
      });

      if (response.data.success) {
        setCurrentStripeInstance(response.data.stripeCust);
        sessionStorage.setItem(
          "stripeInstance",
          JSON.stringify(response.data.stripeCust)
        );
        addNewProfile(uid, response.data.stripeCust.id,phoneNumber);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const addAddress = async (
    stripeID,
    addr,
    cty,
    st_zi,
    apt,
    full_name,
    opt
  ) => {
    const response = await axios
      .post(`${domain}add-address`, {
        cid: stripeID,
        address: addr,
        address2: apt,
        city: cty,
        state: st_zi,
        full_name,
        options: opt,
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    if (response.data.success) {
      sessionStorage.setItem(
        "stripeInstance",
        JSON.stringify(response.data.result)
      );
    }
    return response.data.portalURL;
  };

  const login = async (email, password) => {
    const authObj = await auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        throw new Error(error.message);
      })
      .then((result) => {
        readProfile(result.user.uid);
      });
    return authObj;
  };

  const getCustomer = async (cst) => {
    const response = await axios
      .post(`${domain}get-customer`, {
        custID: cst,
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    if (response.data.success) {
      setCurrentStripeInstance(response.data.result);
      sessionStorage.setItem(
        "stripeInstance",
        JSON.stringify(response.data.result)
      );
    }
    return response.data.result;
  };

  const sendMessage = async (message, number, boolSend) => {

    if (boolSend) {
      const response = await axios
        .post(`${domain}twilio-message`, {
          Message: message,
          SendTo: number,
        })
        .catch((error) => {
          throw new Error(error.message);
        });

      if (response.data.success) {
      }
      return response.data.result;
    }
  };

  const checkoutSession = async (cidP,line_items) => {
    const response = await axios
      .post(`${domain}create-checkout-session`, {
        cid: cidP,
        line_items,
        md: {
          day: JSON.parse(sessionStorage.getItem("pickupDay")),
          time: JSON.parse(sessionStorage.getItem("pickupTime")),
          // dryer: JSON.parse(sessionStorage.getItem("dryer")),
          detergent: JSON.parse(sessionStorage.getItem("detergent")),
          // whites: JSON.parse(sessionStorage.getItem("whites")),
          // softener: JSON.parse(sessionStorage.getItem("softener")),
          additional: JSON.parse(sessionStorage.getItem("additional")),
        },
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error.message);
      });

    if (response.data.success) {
    }
    return response.data.result;
  };

  function logout() {
    setCurrentStripeInstance(null);
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser((prevuser) => user);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, currentStripeUser, currentStripeInstance]);

  const value = {
    currentUser,
    currentStripeInstance,
    setCurrentStripeInstance,
    currentStripeUser,
    setCurrentAddress,
    currentAddress,
    getCustomer,
    addAddress,
    createCustomer,
    setCurrentStripeUser,
    readProfile,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    addNewProfile,
    detergent,
    setDetergent,
    additional,
    setAdditional,
    doorman,
    setDoorman,
    hotel,
    setHotel,
    code,
    setCode,
    email,
    setEmail,
    sendMessage,
    checkoutSession
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
