import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

export const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-[#303236] w-[400px] h-[50px] rounded-3xl flex items-center px-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-transparent w-full h-full px-4 text-sm outline-none text-white"
        placeholder="search a song.."
      />
      <CiSearch className="text-white" />
    </div>
  );
};
