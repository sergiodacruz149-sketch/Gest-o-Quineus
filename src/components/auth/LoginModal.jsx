import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/components/auth/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle, User, Lock, Phone, GraduationCap, BookOpen, Briefcase, Users } from 'lucide-react';

export default function LoginModal({ open, onOpenChange, onLoginSuccess }) {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('aluno');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!credential.trim() || !password.trim()) {
      setError('Por favor, preencha ambos os campos para iniciar sessão.');
      return;
    }

    setLoading(true);

    try {
      // Buscar conta com as credenciais
      const accounts = await base44.entities.UserAccount.filter({
        credential: credential.trim(),
        user_type: activeTab
      });

      if (accounts.length === 0) {
        setError('As credenciais inseridas não correspondem a nenhuma conta registada.');
        setLoading(false);
        return;
      }

      const account = accounts[0];

      // Verificar senha
      if (account.password !== password) {
        setError('Senha incorreta. Por favor, verifique a sua senha.');
        setLoading(false);
        return;
      }

      // Login bem sucedido
      login(account);
      
      if (onLoginSuccess) {
        onLoginSuccess(account);
      }
      
      onOpenChange(false);

    } catch (err) {
      setError('Erro ao iniciar sessão. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCredential('');
    setPassword('');
    setError('');
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    resetForm();
  };

  const accountTypes = [
    { value: 'aluno', label: 'Aluno', icon: GraduationCap, credentialLabel: 'Código de Estudante', credentialPlaceholder: 'Ex: EST2025001' },
    { value: 'professor', label: 'Professor', icon: BookOpen, credentialLabel: 'Número de Telefone', credentialPlaceholder: 'Ex: 923456789' },
    { value: 'secretario', label: 'Secretário', icon: Briefcase, credentialLabel: 'Número de Telefone', credentialPlaceholder: 'Ex: 923456789' },
    { value: 'encarregado', label: 'Encarregado', icon: Users, credentialLabel: 'Número de Telefone', credentialPlaceholder: 'Ex: 923456789' },
  ];

  const currentType = accountTypes.find(t => t.value === activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6984e924d86b58e63efcd1f8/4b78bcc54_image.png" 
              alt="IMGQ Logo" 
              className="h-16 w-16 object-contain mb-2"
            />
            <DialogTitle className="text-xl text-[#1a365d]">Iniciar Sessão</DialogTitle>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {accountTypes.map((type) => (
              <TabsTrigger 
                key={type.value} 
                value={type.value}
                className="text-xs data-[state=active]:bg-[#1a365d] data-[state=active]:text-white"
              >
                <type.icon className="h-4 w-4 mr-1 hidden sm:inline" />
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {accountTypes.map((type) => (
            <TabsContent key={type.value} value={type.value}>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="credential" className="text-slate-700 font-medium">
                    {type.credentialLabel}
                  </Label>
                  <div className="relative">
                    {type.value === 'aluno' ? (
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    ) : (
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    )}
                    <Input 
                      id="credential"
                      type="text"
                      placeholder={type.credentialPlaceholder}
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#1a365d] hover:bg-[#2c4a7c] text-white font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      A processar...
                    </>
                  ) : (
                    'Iniciar Sessão'
                  )}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}