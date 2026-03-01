import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext(null);

// Funções de autenticação local
const getLocalUser = () => {
  try {
    const stored = localStorage.getItem('quineus_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setLocalUser = (user) => {
  if (user) {
    localStorage.setItem('quineus_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('quineus_user');
  }
};

export const PERMISSIONS = {
  aluno: {
    canViewGrades: true,
    canViewTeachers: true,
    canViewFeed: true,
    canEditGrades: false,
    canManageStudents: false,
    canManagePayments: false,
    canPostToFeed: false,
  },
  professor: {
    canViewGrades: true,
    canViewTeachers: true,
    canViewFeed: true,
    canEditGrades: true,
    canManageStudents: false,
    canManagePayments: false,
    canPostToFeed: true,
  },
  secretario: {
    canViewGrades: true,
    canViewTeachers: true,
    canViewFeed: true,
    canEditGrades: false,
    canManageStudents: true,
    canManagePayments: true,
    canPostToFeed: true,
  },
  encarregado: {
    canViewGrades: true,
    canViewTeachers: true,
    canViewFeed: true,
    canEditGrades: false,
    canManageStudents: false,
    canManagePayments: false,
    canPostToFeed: false,
  },
};

export const COURSES = [
  "Técnico de Informática",
  "Gestão de Informática", 
  "Gestão Empresarial",
  "Recursos Humanos",
  "Contabilidade",
  "Gestão de Sistemas Informáticos"
];

export const CLASS_YEARS = ["10ª", "11ª", "12ª", "13ª"];
export const PERIODS = ["Manhã", "Tarde"];
export const TRIMESTERS = ["1º Trimestre", "2º Trimestre", "3º Trimestre"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Primeiro verificar se há utilizador local
      const localUser = getLocalUser();
      
      if (localUser && localUser.is_active !== false) {
        setUser(localUser);
        if (localUser.user_type) {
          setPermissions(PERMISSIONS[localUser.user_type] || {});
          await loadUserProfile(localUser);
        }
      } else {
        setUser(null);
        setPermissions(null);
      }
    } catch (error) {
      setUser(null);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLocalUser(null);
    setUser(null);
    setUserProfile(null);
    setPermissions(null);
    window.location.href = '/Dashboard';
  };

  const login = (userData) => {
    setLocalUser(userData);
    setUser(userData);
    if (userData.user_type) {
      setPermissions(PERMISSIONS[userData.user_type] || {});
    }
    window.location.href = '/Dashboard';
  };

  const loadUserProfile = async (currentUser) => {
    try {
      let profile = null;
      
      switch (currentUser.user_type) {
        case 'aluno':
          if (currentUser.student_code) {
            const codes = await base44.entities.StudentCode.filter({ code: currentUser.student_code });
            profile = codes[0] || null;
          }
          break;
        case 'professor':
          const teachers = await base44.entities.Teacher.filter({ phone: currentUser.phone });
          profile = teachers[0] || null;
          break;
        case 'secretario':
          const secretaries = await base44.entities.Secretary.filter({ phone: currentUser.phone });
          profile = secretaries[0] || null;
          break;
        case 'encarregado':
          const guardians = await base44.entities.Guardian.filter({ phone: currentUser.phone });
          profile = guardians[0] || null;
          break;
      }
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const hasPermission = (permission) => {
    return permissions?.[permission] || false;
  };

  const isAuthor = (authorEmail) => {
    return user?.email === authorEmail;
  };

  const canAccessStudentData = (studentCode) => {
    if (!user) return false;
    
    if (user.user_type === 'secretario') return true;
    if (user.user_type === 'aluno' && user.student_code === studentCode) return true;
    if (user.user_type === 'encarregado' && userProfile?.child_code === studentCode) return true;
    if (user.user_type === 'professor') return true;
    
    return false;
  };

  const value = {
    user,
    userProfile,
    loading,
    permissions,
    hasPermission,
    isAuthor,
    canAccessStudentData,
    refreshUser: loadUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;