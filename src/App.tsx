import React from 'react';
import './App.css';
import {Counter} from "./features/counter/Counter";
import {Login} from "./features/login/Login";
import {useSelector} from "react-redux";
import {selectUser} from "./features/login/loginSlice";

function App() {

    const loggedInUser = useSelector(selectUser);
      return (
          <div>
              {loggedInUser ? <Counter/> : <Login/>}
          </div>

      );
}

export default App;
