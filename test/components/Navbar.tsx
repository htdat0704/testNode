import React from "react";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="nav justify-content-center">
      <a className="nav-link active" href="#">
        Active link
      </a>
      <Link href="/">
        <a className="nav-link">Home</a>
      </Link>
      <Link href="/about">
        <a className="nav-link">ABOUT</a>
      </Link>

      <Link href="/coders">
        <a className="nav-link">coders</a>
      </Link>
    </nav>
  );
};

export default Navbar;
