import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Contacts from "@/components/pages/Contacts";
import Deals from "@/components/pages/Deals";
import Companies from "@/components/pages/Companies";
import Activities from "@/components/pages/Activities";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        
        <div className="lg:pl-64">
          <Header onMenuClick={handleMenuClick} />
          
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/activities" element={<Activities />} />
            </Routes>
          </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;