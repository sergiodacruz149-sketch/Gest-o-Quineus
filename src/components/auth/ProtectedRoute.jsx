import React from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ProtectedRoute({ 
  children, 
  requiredPermission = null,
  allowedUserTypes = null,
  fallback = null 
}) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#1a365d] mx-auto mb-4" />
          <p className="text-slate-600">A carregar...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to dashboard (home page with login option)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Home className="h-16 w-16 text-[#1a365d] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo ao Quineus</h2>
            <p className="text-slate-600 mb-6">
              Inicie sessão para aceder ao sistema.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-[#1a365d] hover:bg-[#2c4a7c]">
                Ir para Início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user type not allowed, redirect to their dashboard
  if (allowedUserTypes && !allowedUserTypes.includes(user.user_type)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Home className="h-16 w-16 text-[#1a365d] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Página não disponível</h2>
            <p className="text-slate-600 mb-6">
              Esta página não está disponível para o seu tipo de conta.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-[#1a365d] hover:bg-[#2c4a7c]">
                Voltar ao Início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Home className="h-16 w-16 text-[#1a365d] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Permissão necessária</h2>
            <p className="text-slate-600 mb-6">
              Não tem autorização para esta funcionalidade.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-[#1a365d] hover:bg-[#2c4a7c]">
                Voltar ao Início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}