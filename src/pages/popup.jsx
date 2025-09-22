import Nav from "@/components/Nav";
import SearchAccordion from "@/components/search-accordion";
import React from "react";
import { useState } from "react";

const Popup = ({ word }) => {
  const [searchResults, setSearchResults] = useState(null);

  return (
    <div>
      <Nav onWordSearch={setSearchResults} />
      <SearchAccordion result={searchResults} />
    </div>
  );
};

export default Popup;
