import React, { useContext, useState, useEffect } from "react";
import firebase from "../firebase";
import axios from "axios";

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
  //const domain = "https://wash-and-go.herokuapp.com/";
  const domain = "http://localhost:4000/";

  const addNewProfile = async (authID, custID) => {
    console.log("add new profile function");
    const user_profileRef = data.ref("user_profile");
    const user_profile = {
      authID,
      custID,
    };
    const result = await user_profileRef.push(user_profile);
    return result;
  };

  const readProfile = async (uid) => {
    // Find all dinosaurs whose names come before Pterodactyl lexicographically.
    // Include Pterodactyl in the result.
    var ref = firebase.database().ref("user_profile");
    const result = await ref
      .orderByChild("authID")
      .equalTo(uid)
      .on("child_added", (snapshot) => {
        console.log("uid from db: " + snapshot.child("authID").val());
        console.log("stripe id from db: " + snapshot.child("custID").val());
        //setCurrentStripeUser(snapshot.child("custID").val());
        getCustomer(snapshot.child("custID").val());
      });
  };

  const signup = async (email, password, stripeUser) => {
    const authObj = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        throw new Error(error.message);
      })
      .then((result) => {
        console.log(result.user.uid);
        const uid = result.user.uid;
        createCustomer(uid, stripeUser);
      });
    return authObj;
  };

  const createCustomer = async (uid, stripeUser) => {
    try {
      console.log("creating customer");
      const response = await axios.post(`${domain}create`, {
        firstName: stripeUser.firstName,
        lastName: stripeUser.lastName,
        email: stripeUser.email,
        phone: stripeUser.phone,
      });

      if (response.data.success) {
        console.log(response.data.success);
        console.log("created stripe id" + response.data.stripeCust.id);
        //setCurrentStripeUser(response.data.stripeCust.id);
        setCurrentStripeInstance(response.data.stripeCust);
        sessionStorage.setItem(
          "stripeInstance",
          JSON.stringify(response.data.stripeCust)
        );
        console.log(response.data.stripeCust);
        addNewProfile(uid, response.data.stripeCust.id);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  //////////////////////////////////////////////////////////////////
  const customerPortal = async (userData) => {
    const response = await axios
      .post(`${domain}create-customer-portal-session`, {
        cid: userData,
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    if (response.data.success) {
      console.log(response.data.success);
      //console.log(response.data.portalURL);
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
      console.log(response.data.result);
      sessionStorage.setItem(
        "stripeInstance",
        JSON.stringify(response.data.result)
      );
      //console.log(response.data.success);
      //console.log(response.data.portalURL);
    }
    return response.data.portalURL;
  };
  //////////////////////////////////////////////////////////////////

  const login = async (email, password) => {
    console.log(`${domain}get-customer`);
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
  ///////////////////////////////////////////////////////////////////
  const getCustomer = async (cst) => {
    console.log(cst);

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
      console.log(response.data.result);
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
        console.log(response.data.result);
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
        console.log("Successfully created invoice");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  ///////////////////////////////////////////////////////////////////

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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
