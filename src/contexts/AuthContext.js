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
  const [pickupDate, setPickupDate] = useState();
  const [pickupTime, setPickupTime] = useState();
  const [currentStripeInstance, setCurrentStripeInstance] = useState();
  const [additional, setAdditional] = useState();

  const [detergent, setDetergent] = useState();
  const [whites, setWhites] = useState();
  const [softener, setSoftener] = useState();
  const [dryer, setDryer] = useState();

  const [bags, setBags] = useState();
  const [pieces, setPieces] = useState();

  const [doorman, setDoorman] = useState(false);
  const [hotel, setHotel] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState(false);
  const [phone, setPhone] = useState(false);
  const [text, setText] = useState(false);
  const domain = process.env.REACT_APP_DOMAIN;

  const addNewProfile = async (authID, custID) => {
    const user_profileRef = data.ref("user_profile");
    const user_profile = {
      authID,
      custID,
    };
    const result = await user_profileRef.push(user_profile);
    return result;
  };

  const readProfile = async (uid) => {
    var ref = firebase.database().ref("user_profile");
    const result = await ref
      .orderByChild("authID")
      .equalTo(uid)
      .on("child_added", (snapshot) => {
        getCustomer(snapshot.child("custID").val());
      });
      console.log(result);
  };

  const signup = async (email, password, stripeUser) => {
    const authObj = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        throw new Error(error.message);
      })
      .then((result) => {
        const uid = result.user.uid;
        createCustomer(uid, stripeUser);
      });
    return authObj;
  };

  const createCustomer = async (uid, stripeUser) => {
    try {
      const response = await axios.post(`${domain}create`, {
        firstName: stripeUser.firstName,
        lastName: stripeUser.lastName,
        email: stripeUser.email,
        phone: stripeUser.phone,
      });

      if (response.data.success) {
        //setCurrentStripeUser(response.data.stripeCust.id);
        setCurrentStripeInstance(response.data.stripeCust);
        sessionStorage.setItem(
          "stripeInstance",
          JSON.stringify(response.data.stripeCust)
        );
        addNewProfile(uid, response.data.stripeCust.id);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  //////////////////////////////////////////////////////////////////
  const customerPortal = async (userData,path) => {
    const response = await axios
      .post(`${domain}create-customer-portal-session`, {
        cid: userData,
        pth:path
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error.message);
      });

    if (response.data.success) {
    }
    return response.data.portalURL;
  };
  //////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////
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
      //setCurrentStripeInstance(response.data.result);
      sessionStorage.setItem(
        "stripeInstance",
        JSON.stringify(response.data.result)
      );
    }
    return response.data.portalURL;
  };
  //////////////////////////////////////////////////////////////////

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

  const getProducts = async () => {
    const response = await axios
    .post(`${domain}listProducts`, {})
    .catch((error) => {
      throw new Error(error.message);
    });
    console.log(response);
  }

  const getPrices = async () => {
    const response = await axios
    .post(`${domain}listPrices`, {})
    .catch((error) => {
      throw new Error(error.message);
    });
    console.log(response);
  }


  ///////////////////////////////////////////////////////////////////
  const getCustomer = async (cst) => {
    //setCurrentStripeUser((prevuser) => cst);
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
  ///////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////
  const getCardList = async (cst) => {
    const response = await axios
      .post(`${domain}get-cards`, {
        custID: cst,
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    if (response.data.success) {
    }
    return response.data.result;
  };
  ///////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////
  const sendMessage = async (message, number, boolSend) => {
    var isTrueSet = boolSend === "true";

    if (isTrueSet) {
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
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  const handleInvoice = async (cid) => {
    try {
      const response = await axios.post(`${domain}create-invoice`, {
        custID: cid,
        promoID: JSON.parse(sessionStorage.getItem("promoCode")),
        md: {
          day: JSON.parse(sessionStorage.getItem("pickupDay")),
          time: JSON.parse(sessionStorage.getItem("pickupTime")),
          bags: JSON.parse(sessionStorage.getItem("bags")),
          pieces: JSON.parse(sessionStorage.getItem("pieces")),

          dryer: JSON.parse(sessionStorage.getItem("dryer")),
          detergent: JSON.parse(sessionStorage.getItem("detergent")),
          whites: JSON.parse(sessionStorage.getItem("whites")),
          softener: JSON.parse(sessionStorage.getItem("softener")),
          additional: JSON.parse(sessionStorage.getItem("additional")),
        },
      });

      if (response.data.success) {
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  ///////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////
  const getPromos = async (promo) => {
    try {
      const response = await axios.post(`${domain}get-promos`, {
        pCode: promo,
      });

      if (response.data.success) {
        sessionStorage.setItem(
          "promoCode",
          JSON.stringify(response.data.result)
        );
        return true;
      } else {
        sessionStorage.setItem("promoCode", JSON.stringify("null"));
        return false;
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  ///////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////
  const checkoutSession = async (cidP,line_items) => {
    const response = await axios
      .post(`${domain}create-checkout-session`, {
        cid: cidP,
        line_items,
        md: {
          day: JSON.parse(sessionStorage.getItem("pickupDay")),
          time: JSON.parse(sessionStorage.getItem("pickupTime")),
          dryer: JSON.parse(sessionStorage.getItem("dryer")),
          detergent: JSON.parse(sessionStorage.getItem("detergent")),
          whites: JSON.parse(sessionStorage.getItem("whites")),
          softener: JSON.parse(sessionStorage.getItem("softener")),
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
  //////////////////////////////////////////////////////////////////

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
    bags,
    setBags,
    pieces,
    setPieces,
    currentStripeInstance,
    setCurrentStripeInstance,
    getCardList,
    currentStripeUser,
    pickupDate,
    pickupTime,
    setPickupTime,
    setPickupDate,
    setCurrentAddress,
    currentAddress,
    getCustomer,
    addAddress,
    customerPortal,
    createCustomer,
    setCurrentStripeUser,
    readProfile,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    getPromos,
    addNewProfile,
    detergent,
    setDetergent,
    whites,
    setWhites,
    softener,
    setSoftener,
    dryer,
    setDryer,
    phone,
    setPhone,
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
    text,
    setText,
    sendMessage,
    handleInvoice,
    checkoutSession,
    getProducts,
    getPrices
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
