import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { LayoutDashboard, Building2, FileText, Users, BarChart3, Settings, LogOut, Sun, Moon, CreditCard, Shield, Users2 } from 'lucide-react';
import { LOGO_FLIXPAY_ICON, LOGO_FLIXPAY, LOGO_RSG, LOGO_CHROMOTECH } from '@/lib/constants';

const menuItems = [
  { title: 'Dashboard', url: '/superadmin', icon: LayoutDashboard },
  { title: 'Tenants', url: '/superadmin/tenants', icon: Building2 },
  { title: 'Propostas', url: '/superadmin/propostas', icon: FileText },
  { title: 'Assinaturas', url: '/superadmin/assinaturas', icon: Users },
  { title: 'Planos', url: '/superadmin/planos', icon: CreditCard },
  { title: 'Relatórios', url: '/superadmin/relatorios', icon: BarChart3 },
  { title: 'Perfis', url: '/superadmin/perfis', icon: Shield },
  { title: 'Usuários', url: '/superadmin/usuarios', icon: Users2 },
  { title: 'Configurações', url: '/superadmin/configuracoes', icon: Settings },
];

function SidebarInner() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <div className="p-4 flex items-center justify-center">
        {collapsed ? (
          <img src={LOGO_FLIXPAY_ICON} alt="FlixPay" className="h-8 w-8 object-contain" />
        ) : (
          <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-8 object-contain" />
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/superadmin'}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold border-l-2 border-primary">
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function SuperAdminLayout() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout({ type: 'superadmin' }); navigate('/'); };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarInner />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary rounded">SuperAdmin</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span className="text-sm text-muted-foreground hidden md:inline">{user?.name}</span>
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto"><Outlet /></main>
          <footer className="border-t border-border py-4 px-6 flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-3 opacity-50 hover:opacity-80 transition-opacity">
              <img src={LOGO_RSG} alt="RSG Group" className="h-5 grayscale hover:grayscale-0 transition-all" />
              <span className="text-muted-foreground text-xs">×</span>
              <img src={LOGO_CHROMOTECH} alt="Chromotech" className="h-5 grayscale hover:grayscale-0 transition-all" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">FlixPay é uma tecnologia provida por RSG Group & Chromotech</span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
