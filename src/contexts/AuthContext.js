import React, { useContext, useState, useEffect } from "react";
import firebase from "../firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  setId,
  setName,
  setPhone,
  setShipping,
  setContact,
} from "../redux/user";

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
  const [currentStripeInstance, setCurrentStripeInstance] = useState();

  const { additional, detergentScent } = useSelector(
    (state) => state.preference
  );

  const { pickupDate, pickupTime } = useSelector((state) => state.pickup);

  const [detergent, setDetergent] = useState();

  const domain = process.env.REACT_APP_DOMAIN;
  const dispatch = useDispatch();

  const addNewProfile = async (authID, custID, phoneNumber) => {
    const user_profileRef = data.ref("user_profile");
    const user_profile = {
      authID,
      custID,
      phoneNumber,
    };
    const result = await user_profileRef.push(user_profile);
    return result;
  };

  const readProfile = async (uid) => {
    var ref = firebase.database().ref("user_profile");
    ref
      .orderByChild("authID")
      .equalTo(uid)
      .on("child_added", (snapshot) => {
        getCustomer(snapshot.child("custID").val());
      });
  };

  const passPhoneVal = async (phoneVal) => {
    return phoneVal;
  }

  const checkPhoneNum = async (phone) => {
    var ref = firebase.database().ref("user_profile");
    const result =
    await ref
      .orderByChild("phoneNumber")
      .equalTo(phone)
      .once("value",snapshot => {
        const val = snapshot.exists()
        return val
    }).then((val) => {
      return passPhoneVal(val);
    });
    return result.exists();
  };

  const signup = async (email, password, stripeUser, phoneNumber) => {
    const authObj = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        throw new Error(error.message);
      })
      .then((result) => {
        const uid = result.user.uid;
        createCustomer(uid, stripeUser, phoneNumber);
      });
    return authObj;
  };

  const createCustomer = async (uid, stripeUser, phoneNumber) => {
    try {
      const response = await axios.post(`${domain}create`, {
        firstName: stripeUser.firstName,
        lastName: stripeUser.lastName,
        email: stripeUser.email,
        phone: stripeUser.phone,
      });
      if (response.data.success) {
        const res = response.data.stripeCust;
        setCurrentStripeInstance(res.stripeCust);
        addNewProfile(uid, response.data.stripeCust.id, phoneNumber);
        dispatch(setId(res.id));
        dispatch(setName(res.name));
        dispatch(setShipping(res.shipping));
        dispatch(setPhone(res.phone));
        dispatch(setEmail(res.email));
        dispatch(setContact(res.metadata.contact));
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const addAddress = async (
    stripeID,
    address,
    city,
    state,
    address2,
    full_name,
    options,
    phone,
    zip
  ) => {
    const response = await axios
      .post(`${domain}add-address`, {
        cid: stripeID,
        address,
        address2,
        city,
        state,
        full_name,
        options,
        phone,
        zip,
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    if (response.data.success) {
      const res = response.data.result;
      dispatch(setShipping(res.shipping));
    }
    return response.data.portalURL;
  };

  const login = async (email, password) => {
    const authObj = await auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        readProfile(result.user.uid);
      })
      .catch((error) => {
        throw new Error(error);
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
      const res = response.data.result;
      dispatch(setId(res.id));
      dispatch(setName(res.name));
      dispatch(setShipping(res.shipping));
      dispatch(setPhone(res.phone));
      dispatch(setEmail(res.email));
      dispatch(setContact(res.metadata.contact));

      setCurrentStripeInstance(response.data.result);
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

  const checkoutSession = async (cidP, line_items) => {
    const response = await axios
      .post(`${domain}create-checkout-session`, {
        cid: cidP,
        line_items,
        md: {
          day: pickupDate,
          time: pickupTime,
          detergent: detergentScent,
          additional: additional,
        },
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    if (response.data.success) {
    }
    return response.data.result;
  };

  function logout() {
    setCurrentStripeInstance(null);
    dispatch(setId(null));
    dispatch(setName(null));
    dispatch(setShipping(null));
    dispatch(setPhone(null));
    dispatch(setEmail(null));
    dispatch(setContact(null));
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

  async function getZipCode(placesID) {
    const response = await axios
      .post(`${domain}getZipCode`, {
        placesID,
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    if (response.data.success) {
      const zipArr = response.data.result.result.address_components;
      const zipCode = zipArr.filter((obj) => obj.types[0] === "postal_code");
      try {
        if (zipCode[0].long_name) return zipCode[0].long_name;
      } catch {
        return "zip code not found";
      }
    }
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
    sendMessage,
    checkoutSession,
    getZipCode,
    checkPhoneNum,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
