import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Add from './pages/Add/Add.jsx';
import ExpenseList from './pages/ExpenseList/ExpenseList.jsx';

import AddSale from './pages/AddSale/AddSale.jsx';
import SaleList from './pages/SaleList/SaleList.jsx';
import UpdateCar from './pages/UpdateCar/UpdateCar.jsx';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import OneSale from './pages/OneSale/OneSale.jsx';
import Home from './pages/Home/Home.jsx';
import LoginPopup from "./pages/loginPopup/LoginPopup.jsx"
import { useEffect, useState } from 'react';
import OneCar from './pages/OneCar/OneCar.jsx';
import OneExpense from'./pages/OneExpense/OneExpense.jsx'
import AddExpense from "./pages/AddExpense/AddExpense.jsx"
import CarFromData from './pages/carFromData/CarFromData.jsx';
import ExpenseFromData from './pages/ExpenseFromData/ExpenseFromData.jsx';
import ReviewList from './pages/ReviewList/ReviewList.jsx';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const ProtectedRoute = ({ children, token }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    setShowLogin(false);
  };

  return (
    <div>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} setToken={handleLoginSuccess} />}
      <Navbar setShowLogin={setShowLogin} token={token} setToken={setToken} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes> 
              <Route path="/admin-car-delux" element={<Home />} />
              <Route path="/admin-car-delux/list-expense" element={<ProtectedRoute token={token}><ExpenseList  /></ProtectedRoute>} />
              <Route path="/admin-car-delux/one-expense/:id" element={<ProtectedRoute token={token}><OneExpense  /></ProtectedRoute>} />
              <Route path="/admin-car-delux/add-expense" element={<ProtectedRoute token={token}><AddExpense /></ProtectedRoute>} />

              
              <Route path="/admin-car-delux/add" element={<ProtectedRoute token={token}><Add /></ProtectedRoute>} />
              <Route path="/update-car/:id" element={<ProtectedRoute token={token}><UpdateCar  /></ProtectedRoute>} />
              <Route path="/admin-car-delux/one-car/:id" element={<ProtectedRoute token={token}><OneCar  /></ProtectedRoute>} />
              <Route path="/admin-car-delux/car-by-date" element={<ProtectedRoute token={token}><CarFromData  /></ProtectedRoute>} />
              <Route path="/admin-car-delux/expense-by-date" element={<ProtectedRoute token={token}><ExpenseFromData  /></ProtectedRoute>} />


              <Route path="/admin-car-delux/list-sale" element={<ProtectedRoute token={token}><SaleList  /></ProtectedRoute>} />
              <Route path="/admin-car-delux/one-sale/:id" element={<ProtectedRoute token={token}><OneSale  /></ProtectedRoute>} />
              <Route path="/admin-car-delux/add-sale" element={<ProtectedRoute token={token}><AddSale /></ProtectedRoute>} />

              <Route path="/admin-car-delux/list-comment" element={<ProtectedRoute token={token}><ReviewList  /></ProtectedRoute>} />


              <Route path="*" element={<Navigate to="/admin-car-delux"  />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
