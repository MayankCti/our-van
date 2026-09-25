import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);
  const closeSidebar = () => setShowSidebar(false);
  const openSidebar = () => setShowSidebar(true);

  return (
    <SidebarContext.Provider value={{ showSidebar, setShowSidebar, toggleSidebar, closeSidebar, openSidebar }}>
      <main className={showSidebar ? 'ct_show' : ''}>
        <Sidebar />
        <div className="ct_right_panel">
          <Header />
          {children}
        </div>
      </main>
    </SidebarContext.Provider>
  );
};

export default Layout;
