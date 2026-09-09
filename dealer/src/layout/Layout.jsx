import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <main>

      <Sidebar />
      <div className="ct_right_panel">
        <Header />
        {children}
      </div>
    </main>
  );
};

export default Layout;
