import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Popup from "./pages/popup";
import SignupForm from "./components/signup-form";

function App() {
  return (
    <div className="w-lg rounded-b-md h-full ">
      <Router>
        <Routes>
          <Route path="/" element={<Popup />} />
          <Route path="/signin" element={<SignupForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
