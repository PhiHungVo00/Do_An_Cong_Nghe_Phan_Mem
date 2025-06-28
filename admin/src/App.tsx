import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import theme from './theme';
import store from './store';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Employees from './pages/Employees';
import SalesCalendar from './pages/SalesCalendar';
import Challenges from './pages/Challenges';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import RevenueDetails from './pages/RevenueDetails';
import AccessDetails from './pages/AccessDetails';
import TransactionDetails from './pages/TransactionDetails';
import Chat from './pages/Chat';

// Auth Guard
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="employees" element={<Employees />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
              <Route path="calendar" element={<SalesCalendar />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<HelpCenter />} />
              <Route path="revenue-details" element={<RevenueDetails />} />
              <Route path="access-details" element={<AccessDetails />} />
              <Route path="transaction-details" element={<TransactionDetails />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Routes>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 