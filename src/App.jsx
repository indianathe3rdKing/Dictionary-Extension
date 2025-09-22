import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Popup from "./pages/popup";

function App() {
  return (
    <div className="w-lg rounded-b-md h-full ">
      <Router>
        <Routes>
          <Route path="/" element={<Popup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
