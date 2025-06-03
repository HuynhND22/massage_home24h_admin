import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import { Categories } from './pages/categories/Categories';
import { Blogs } from './pages/blogs/Blogs';
import { CreateBlog } from './pages/blogs/CreateBlog';
import { EditBlog } from './pages/blogs/EditBlog';
import NotFound from './pages/NotFound';
import { Services } from './pages/services/Services';
import Slides from './pages/slides/Slides';
import WebSettings from './pages/web-settings/WebSettings';

// Auth context and hooks
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : (
          <AuthLayout>
            <Login />
          </AuthLayout>
        )
      } />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      

      
      <Route path="/categories" element={
        <ProtectedRoute>
          <MainLayout>
            <Categories />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/blogs" element={
        <ProtectedRoute>
          <MainLayout>
            <Blogs />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/blogs/create" element={
        <ProtectedRoute>
          <MainLayout>
            <CreateBlog />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/blogs/:id/edit" element={
        <ProtectedRoute>
          <MainLayout>
            <EditBlog />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/services" element={
        <ProtectedRoute>
          <MainLayout>
            <Services />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/slides" element={
        <ProtectedRoute>
          <MainLayout>
            <Slides />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/web-settings" element={
        <ProtectedRoute>
          <MainLayout>
            <WebSettings />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
