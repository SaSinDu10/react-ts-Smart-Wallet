import React, {useEffect} from "react";
import {useNavigate } from "react-router-dom";


function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("AccessToken")) {
      navigate ("/Dashboard");
    } else {
      navigate ("/Login");
    }
  });
  return <div className="App"></div>;
}

export default App;

