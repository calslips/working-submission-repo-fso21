import React from "react";

const Filter = ({ search, handleFilter }) => (
  <div>
    filter shown with <input value={search} onChange={handleFilter} />
  </div>
);

export default Filter;
