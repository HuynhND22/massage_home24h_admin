import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';

// Services Pages
import Services from './pages/services/index';
import CreateService from './pages/services/create/index';
import EditService from './pages/services/edit/[id]';

// Blog Pages
import Posts from './pages/blog/index';
import CreatePost from './pages/blog/create/index';
import EditPost from './pages/blog/edit/[id]';

// Other Pages
import Reviews from './pages/reviews/Reviews';
import Messages from './pages/messages/Messages';
import Settings from './pages/settings/Settings';
import NotFound from './pages/NotFound';

// Auth context and hooks
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
      
      <Route path="/services" element={
        <ProtectedRoute>
          <MainLayout>
            <Services />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/services/create" element={
        <ProtectedRoute>
          <MainLayout>
            <CreateService />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/services/edit/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <EditService />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/blog" element={
        <ProtectedRoute>
          <MainLayout>
            <Posts />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/blog/create" element={
        <ProtectedRoute>
          <MainLayout>
            <CreatePost />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/blog/edit/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <EditPost />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reviews" element={
        <ProtectedRoute>
          <MainLayout>
            <Reviews />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/messages" element={
        <ProtectedRoute>
          <MainLayout>
            <Messages />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <Settings />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
