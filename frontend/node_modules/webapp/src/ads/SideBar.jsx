import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-full md:w-64 mb-6 md:mb-0">
      <div className="bg-gray-200 rounded shadow p-4">
        <h2 className="text-base md:text-lg font-bold mb-4 text-center">Sponsored Ads</h2>
        <div className="space-y-4">
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-xs md:text-sm text-gray-700">Ad Space 1</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-xs md:text-sm text-gray-700">Ad Space 2</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-xs md:text-sm text-gray-700">Ad Space 3</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
