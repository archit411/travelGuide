import React from "react";
import { Outlet } from "react-router-dom";
// import BottomNav from "../BottomNav";

export default function Layout() {
  return (
    <div style={{ position: "relative" }}>      
      <Outlet />
      {/* <BottomNav /> */}
    </div>
  );
}
