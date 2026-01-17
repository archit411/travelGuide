import React, { useState } from "react";
import ExploreTab from "./Exploretab";


const Tabs = () => {
  const [activeTab, setActiveTab] = useState("");

  return (
    <>
      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab("explore")}>
          Explore
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "explore" && <ExploreTab/>}
    </>
  );
};

export default Tabs;
