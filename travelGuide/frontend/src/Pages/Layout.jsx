import React from "react";
import { Outlet } from "react-router-dom";
// import BottomNav from "../BottomNav";

export default function Layout() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", paddingBottom: "70px" }}>      
      <Outlet />
      {/* <BottomNav /> */}
    </div>
  );
}
