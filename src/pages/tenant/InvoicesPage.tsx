import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTenant, getInvoices, getSubscribers, setInvoices as saveInvoices } from '@/lib/storage';
import { Invoice, InvoiceStatus, PlanType } from '@/lib/types';
import { PLAN_FEATURES } from '@/lib/plan-features';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { UpsellLock } from '@/components/UpsellLock';

export default function InvoicesPage() {
  const { user } = useAuth();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;
  if (!tenant) return null;

  const plan = tenant.plano as PlanType;
  const features = PLAN_FEATURES[plan];

  const [invoices, setInvoices] = useState(getInvoices(tenant.id));
  const subscribers = getSubscribers(tenant.id);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');

  const filtered = invoices.filter(i => !statusFilter || i.status === statusFilter)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const updateStatus = (inv: Invoice, newStatus: InvoiceStatus) => {
    const updated = invoices.map(i => i.id === inv.id ? { ...i, status: newStatus, paidAt: newStatus === 'paid' ? new Date().toISOString() : i.paidAt } : i);
    saveInvoices(tenant.id, updated);
    setInvoices(updated);
    toast.success(`Fatura ${newStatus === 'paid' ? 'marcada como paga' : newStatus === 'cancelled' ? 'cancelada' : 'atualizada'}`);
  };

  const statusBadge = (s: InvoiceStatus) => {
    const map: Record<InvoiceStatus, string> = {
      paid: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      overdue: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-gray-500/20 text-gray-400',
      refunded: 'bg-purple-500/20 text-purple-400',
    };
    return map[s] || '';
  };

  const statusLabel: Record<InvoiceStatus, string> = {
    paid: 'Pago', pending: 'Pendente', overdue: 'Vencido', cancelled: 'Cancelado', refunded: 'Estornado',
  };

  const methodLabel: Record<string, string> = {
    credit_card: 'Cartão', boleto: 'Boleto', pix: 'PIX',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">Faturas</h1>
        <p className="text-muted-foreground text-sm">{invoices.length} faturas registradas</p>
      </div>

      <div className="flex gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
          <option value="">Todos os status</option>
          <option value="paid">Pago</option>
          <option value="pending">Pendente</option>
          <option value="overdue">Vencido</option>
          <option value="cancelled">Cancelado</option>
          <option value="refunded">Estornado</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Assinante</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Valor</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Vencimento</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pagamento</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((inv, i) => {
                const sub = subscribers.find(s => s.id === inv.subscriberId);
                return (
                  <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-semibold">{sub?.name || '-'}</td>
                    <td className="p-4">R$ {inv.amount.toFixed(2)}</td>
                    <td className="p-4 text-muted-foreground">{inv.dueDate}</td>
                    <td className="p-4 text-muted-foreground">{methodLabel[inv.paymentMethod] || inv.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${statusBadge(inv.status)}`}>
                        {statusLabel[inv.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                          <button onClick={() => updateStatus(inv, 'paid')} className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors">Pagar</button>
                        )}
                        {inv.status !== 'cancelled' && inv.status !== 'refunded' && (
                          <button onClick={() => updateStatus(inv, 'cancelled')} className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors">Cancelar</button>
                        )}
                        {features.adminExportCSV && inv.status === 'paid' && (
                          <button onClick={() => updateStatus(inv, 'refunded')} className="px-2 py-1 text-xs bg-purple-500/10 text-purple-400 rounded hover:bg-purple-500/20 transition-colors">Estornar</button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhuma fatura encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
