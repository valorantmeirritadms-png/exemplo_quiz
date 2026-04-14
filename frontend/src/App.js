/**
 * App.js - Componente principal da aplicação
 * 
 * ALTERAÇÕES:
 * - Adicionada rota para página de Ranking
 * - Todos os imports comentados
 */

import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contextos de autenticação e idioma
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Componente de proteção de rotas
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas da aplicação
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import Ranking from "./pages/Ranking"; // ALTERAÇÃO: Nova página de ranking

/**
 * Componente principal que define a estrutura da aplicação
 * Envolve tudo com providers de autenticação e idioma
 */
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Página inicial - pública */}
            <Route path="/" element={<Home />} />
            
            {/* Páginas de autenticação - públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* ALTERAÇÃO: Página de ranking - pública */}
            <Route path="/ranking" element={<Ranking />} />
            
            {/* Página do quiz - protegida (requer login) */}
            <Route 
              path="/quiz/:levelId" 
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
