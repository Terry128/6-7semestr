import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateAnnouncement from './pages/CreateAnnouncement';
import MyAnnouncements from './pages/MyAnnouncements';
import AdminPanel from './pages/AdminPanel';

function AppRoutes() {
    return (
        <Routes>
            {/* Публичные роуты */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />

            {/* Защищённые роуты */}
            <Route
                path="/create"
                element={
                    <ProtectedRoute>
                        <Layout><CreateAnnouncement /></Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my"
                element={
                    <ProtectedRoute>
                        <Layout><MyAnnouncements /></Layout>
                    </ProtectedRoute>
                }
            />

            {/* Админка */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Layout><AdminPanel /></Layout>
                    </ProtectedRoute>
                }
            />

            {/* Редирект для неизвестных URL */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;