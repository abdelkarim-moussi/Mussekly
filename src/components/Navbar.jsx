import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export const Navbar = () => {
  const [nav, setNav] = useState(false);

  return (
    <div className="bg-[#181B21] w-[200px] h-[100vh] rounded-3xl">
      <h1 className="text-[#E87629] text-center font-semibold text-md pt-2 mb-10">
        Museekly
      </h1>

      <nav>
        <ul className="text-white flex flex-col gap-5 px-3">
          <li className="bg-[#303236] py-1.5 rounded-xl text-white">
            <Link to="/home" className="mx-4 text-sm">Home</Link>
          </li>
          <li className="py-1.5 rounded-xl text-gray-200 hover:bg-[#303236] hover:text-white">
            <Link to="/categorie" className="mx-4 text-sm">Categories</Link>
          </li>
          <li className="py-1.5 rounded-xl hover:bg-[#303236] hover:text-white">
            <Link to="/artists" className="mx-4 text-sm">Artists</Link>
          </li>
          <li className="py-1.5 rounded-xl text-gray-200 hover:bg-[#303236] hover:text-white">
            <Link to="/playlists" className="mx-4 text-sm">Playlists</Link>
          </li>
        </ul>
        <Outlet />
      </nav>
    </div>
  );
};
