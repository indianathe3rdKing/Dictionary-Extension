import { useState } from "react";

import "./App.css";
import { Button } from "./components/ui/button";
import Nav from "./components/Nav";
import SearchAccordion from "./components/search-accordion";
import SearchBar from "./components/search-bar";

function App() {
  const [searchResults, setSearchResults] = useState(null);
  return (
    <div className="w-lg rounded-b-md h-full ">
      <Nav onWordSearch={setSearchResults} />

      <SearchAccordion result={searchResults} />
    </div>
  );
}

export default App;
