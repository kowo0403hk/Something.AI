import React, { useState, useEffect } from "react";
import useNavigation from "../hooks/useNavigation";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Nav({
  setShowLogin,
  setShowSignUp,
  loggedUser,
  setLoggedUser,
}) {
  const { homePage } = useNavigation();
  const [showComp, setShowComp] = useState(true);
  const { pathname } = useLocation();

  // It only happened once, need to make it call everytime path change
  useEffect(() => {
    buttonCheck();
  }, [pathname, loggedUser]);

  const buttonCheck = () => {
    if (pathname === "/login" || pathname === "/signup") {
      setShowComp(false);
    } else if (loggedUser) {
      setShowComp(false);
    } else {
      setShowComp(true);
    }
  };

  const submitLogout = function (e) {
    e.preventDefault();
    return axios({
      method: "POST",
      url: "/user/logout",
      // data: { ...login },
      contentType: { "Content-Type": "application/json" },
    }).then((res) => {
      setLoggedUser();
    });
  };

  return (
    <header>
      <div className="container">
        <div className="logo" onClick={homePage}>
          <h1 className="main">something</h1>
          <span className="sub">.AI</span>
        </div>
        <nav>
          {/* If path is login and signup, Don't show button and force user only choice home or finish task */}
          {showComp && (
            <>
              <button
                className="btn"
                onClick={() => {
                  setShowLogin(true);
                }}
              >
                Login
              </button>

              <button
                className="btn btn2"
                onClick={() => {
                  setShowSignUp(true);
                }}
              >
                Sign Up
              </button>
            </>
          )}
          {loggedUser && (
            <>
              <h3>{loggedUser}</h3>
              <button
                className="btn"
                onClick={(e) => {
                  submitLogout(e);
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
