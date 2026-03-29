import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { LayoutDashboard, Users, FileText, CreditCard, Palette, Settings, LogOut, Sun, Moon, ExternalLink } from 'lucide-react';
import { getTenant } from '@/lib/storage';
import { LOGO_FLIXPAY } from '@/lib/constants';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Assinantes', url: '/admin/assinantes', icon: Users },
  { title: 'Faturas', url: '/admin/faturas', icon: FileText },
  { title: 'Planos', url: '/admin/planos', icon: CreditCard },
  { title: 'Landing Page', url: '/admin/landing', icon: Palette },
  { title: 'Configurações', url: '/admin/configuracoes', icon: Settings },
];

function SidebarInner() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user } = useAuth();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <div className="p-4 flex items-center justify-center">
        {tenant?.logoUrl ? (
          <img src={tenant.logoUrl} alt={tenant.name} className={collapsed ? 'h-8 w-8 object-contain' : 'h-8 object-contain'} />
        ) : (
          <div className={`font-black text-primary ${collapsed ? 'text-lg' : 'text-xl'}`}>
            {collapsed ? (tenant?.name?.charAt(0) || 'T') : (tenant?.name || 'Tenant')}
          </div>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/admin'}
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

export default function TenantAdminLayout() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarInner />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary rounded">Admin</span>
              <span className="text-sm text-muted-foreground hidden md:inline">{tenant?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {tenant?.dominio?.streamingPortalUrl && (
                <a href={tenant.dominio.streamingPortalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <ExternalLink size={14} /> Streaming
                </a>
              )}
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
          <footer className="border-t border-border py-3 px-6 flex items-center justify-center gap-2 opacity-40">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Powered by</span>
            <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-4" />
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
