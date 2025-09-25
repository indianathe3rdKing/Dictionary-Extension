import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Popup from "./pages/popup";
import SignupForm from "./pages/signup-form";
import Login from "./pages/login";

function App() {
  return (
    <div className="w-lg rounded-b-md overflow-hidden ">
      <Router>
        <Routes>
          <Route path="/" element={<Popup />} />
          <Route path="/signin" element={<SignupForm />} />
          <Route path="/signin/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
