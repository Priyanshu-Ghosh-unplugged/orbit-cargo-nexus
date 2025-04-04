
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import CargoCategorization from '@/pages/CargoCategorization';
import StorageEfficiency from '@/pages/StorageEfficiency';
import ModuleDetails from '@/pages/ModuleDetails';
import WasteManagement from '@/pages/WasteManagement';
import Logs from '@/pages/Logs';
import ImportExport from '@/pages/ImportExport';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFound from '@/pages/NotFound';
import RequireAuth from '@/components/auth/RequireAuth';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
              path="/" 
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="cargo" element={<CargoCategorization />} />
              <Route path="storage" element={<StorageEfficiency />} />
              <Route path="module/:moduleId" element={<ModuleDetails />} />
              <Route path="waste" element={<WasteManagement />} />
              <Route path="logs" element={<Logs />} />
              <Route path="import-export" element={<ImportExport />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
