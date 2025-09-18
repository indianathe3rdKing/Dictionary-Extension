import { useState } from "react";

import "./App.css";
import { Button } from "./components/ui/button";
import Nav from "./components/Nav";
import SearchAccordion from "./components/search-accordion";

function App() {
  return (
    <div className="w-2xl rounded-b-md h-full ">
      <Nav />
      <SearchAccordion />
    </div>
  );
}

export default App;
