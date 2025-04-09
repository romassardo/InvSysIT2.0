import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Páginas de autenticación
import Login from './pages/auth/Login';

// Páginas principales
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/inventory/InventoryList';
import AssignedItems from './pages/inventory/AssignedItems';
import RepairItems from './pages/inventory/RepairItems';
import LowStock from './pages/inventory/LowStock';
import AssetDetail from './pages/inventory/AssetDetail';
import AssetForm from './pages/inventory/AssetForm';
import RepairForm from './pages/inventory/RepairForm';
import AssignForm from './pages/inventory/AssignForm';
import ConsumableForm from './pages/inventory/ConsumableForm';
import InventoryEntryForm from './pages/inventory/InventoryEntryForm';
import InventoryOutForm from './pages/inventory/InventoryOutForm';
import InventoryMovements from './pages/inventory/InventoryMovements';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import Reports from './pages/reports/Reports';
import UserProfile from './pages/user/Profile';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  const { theme } = useTheme();
  const { isAuthenticated, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar autenticación cuando carga la aplicación
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    
    initAuth();
  }, [checkAuth]);
  
  if (loading) {
    return <div>Cargando aplicación...</div>;
  }
  
  return (
    <Router>
      <NotificationProvider>
        <AppContainer className={`theme-${theme}`}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          
          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory" element={
            <ProtectedRoute>
              <MainLayout>
                <InventoryList />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/assigned" element={
            <ProtectedRoute>
              <MainLayout>
                <AssignedItems />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/in-repair" element={
            <ProtectedRoute>
              <MainLayout>
                <RepairItems />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/low-stock" element={
            <ProtectedRoute>
              <MainLayout>
                <LowStock />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/movements" element={
            <ProtectedRoute>
              <MainLayout>
                <InventoryMovements />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/asset/new" element={
            <ProtectedRoute>
              <MainLayout>
                <AssetForm />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/asset/edit/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <AssetForm />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/asset/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <AssetDetail />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/inventory/entry/new" element={
            <ProtectedRoute>
              <MainLayout>
                <InventoryEntryForm />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/inventory/out/new" element={
            <ProtectedRoute>
              <MainLayout>
                <InventoryOutForm />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/inventory/repair/new" element={
            <ProtectedRoute>
              <MainLayout>
                <RepairForm />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/repair/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <RepairForm />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/assign/new" element={
            <ProtectedRoute>
              <MainLayout>
                <AssignForm />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/assign/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <AssignForm />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/consumable/new" element={
            <ProtectedRoute>
              <MainLayout>
                <ConsumableForm />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory/consumable/edit/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <ConsumableForm />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <MainLayout>
                <CategoryManagement />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <MainLayout>
                <Reports />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <UserProfile />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Redirección por defecto al dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AppContainer>
      </NotificationProvider>
    </Router>
  );
}

export default App;
