import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
 
import Chat from "./components/Chat";
//import FacebookLogin from "./components/FacebookLogin";
import Login from "./components/Login";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Login/>}/>
          <Route path="/chat" exact element={<Chat/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
