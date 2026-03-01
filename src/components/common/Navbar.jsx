import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '../auth/AuthContext';
import { Button } from '@/components/ui/button';
import LoginModal from '@/components/auth/LoginModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  GraduationCap,
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  CreditCard,
  Newspaper,
  Settings,
  LogOut,
  User,
  ChevronDown,
  FileText,
  ClipboardList,
  Calendar,
} from 'lucide-react';

const NAV_ITEMS = {
  aluno: [
    { label: 'Início', icon: Home, page: 'Dashboard' },
    { label: 'Notas', icon: BookOpen, page: 'MyGrades' },
    { label: 'Presenças', icon: Calendar, page: 'MyAttendance' },
    { label: 'Horários', icon: Calendar, page: 'Schedules' },
    { label: 'Calendário', icon: Calendar, page: 'SchoolCalendar' },
    { label: 'Pagamentos', icon: CreditCard, page: 'MyPayments' },
    { label: 'Pagar Online', icon: CreditCard, page: 'OnlinePayment' },
    { label: 'Pautas', icon: ClipboardList, page: 'ReportCardsView' },
    { label: 'Regulamentos', icon: FileText, page: 'Regulations' },
    { label: 'Feed', icon: Newspaper, page: 'NewsFeed' },
  ],
  professor: [
    { label: 'Início', icon: Home, page: 'Dashboard' },
    { label: 'Marcar Presença', icon: Calendar, page: 'TeacherPresence' },
    { label: 'Notas', icon: BookOpen, page: 'GradeManagement' },
    { label: 'Presenças Alunos', icon: Users, page: 'AttendanceManagement' },
    { label: 'Horários', icon: Calendar, page: 'Schedules' },
    { label: 'Calendário', icon: Calendar, page: 'SchoolCalendar' },
    { label: 'Pautas', icon: ClipboardList, page: 'ReportCardsView' },
    { label: 'Regulamentos', icon: FileText, page: 'Regulations' },
    { label: 'Feed', icon: Newspaper, page: 'NewsFeed' },
  ],
  secretario: [
    { label: 'Início', icon: Home, page: 'Dashboard' },
    { label: 'Alunos', icon: Users, page: 'StudentManagement' },
    { label: 'Professores', icon: BookOpen, page: 'Teachers' },
    { label: 'Encarregados', icon: Users, page: 'Guardians' },
    { label: 'Presenças', icon: Calendar, page: 'AttendanceOverview' },
    { label: 'Pagamentos', icon: CreditCard, page: 'PaymentManagement' },
    { label: 'Horários', icon: Calendar, page: 'Schedules' },
    { label: 'Calendário', icon: Calendar, page: 'SchoolCalendar' },
    { label: 'Pautas', icon: ClipboardList, page: 'ReportCardsView' },
    { label: 'Boletins', icon: FileText, page: 'Bulletins' },
    { label: 'Regulamentos', icon: FileText, page: 'Regulations' },
    { label: 'Feed', icon: Newspaper, page: 'NewsFeed' },
  ],
  encarregado: [
    { label: 'Início', icon: Home, page: 'Dashboard' },
    { label: 'Notas', icon: BookOpen, page: 'ChildGrades' },
    { label: 'Presenças', icon: Calendar, page: 'MyAttendance' },
    { label: 'Horários', icon: Calendar, page: 'Schedules' },
    { label: 'Calendário', icon: Calendar, page: 'SchoolCalendar' },
    { label: 'Pagamentos', icon: CreditCard, page: 'MyPayments' },
    { label: 'Pautas', icon: ClipboardList, page: 'ReportCardsView' },
    { label: 'Regulamentos', icon: FileText, page: 'Regulations' },
    { label: 'Feed', icon: Newspaper, page: 'NewsFeed' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navItems = user?.user_type ? NAV_ITEMS[user.user_type] || [] : [];

  const getUserTypeLabel = (type) => {
    const labels = {
      aluno: 'Aluno',
      professor: 'Professor',
      secretario: 'Secretário',
      encarregado: 'Encarregado',
    };
    return labels[type] || type;
  };

  return (
    <nav className="bg-[#1a365d] border-b border-[#1a365d] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6984e924d86b58e63efcd1f8/4b78bcc54_image.png" 
                alt="IMGQ Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold text-xl text-white hidden sm:block">Quineus</span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center ml-10 space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-[#2c4a7c] hover:text-white transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-[#2c4a7c]">
                      <div className="h-8 w-8 rounded-full bg-[#f6c344] flex items-center justify-center">
                        <User className="h-4 w-4 text-[#1a365d]" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-white">{user.full_name}</p>
                        <p className="text-xs text-slate-300">{getUserTypeLabel(user.user_type)}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-slate-500">{user.credential}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Profile')} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Terminar Sessão
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setLoginModalOpen(true)}
                  className="bg-[#f6c344] hover:bg-[#e5b33d] text-[#1a365d] font-semibold"
                >
                  Entrar
                </Button>
                <LoginModal 
                  open={loginModalOpen} 
                  onOpenChange={setLoginModalOpen}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && user && (
        <div className="md:hidden border-t border-[#2c4a7c] bg-[#1a365d]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-[#2c4a7c] hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
