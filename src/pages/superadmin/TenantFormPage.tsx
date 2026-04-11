import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTenant, saveTenant } from '@/lib/storage';
import { Tenant, PlanType, LicenseStatus } from '@/lib/types';
import { PLAN_PRICES, PLAN_NAMES } from '@/lib/plan-features';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, EyeOff, CheckCircle, XCircle, X } from 'lucide-react';

const emptyTenant = (): Tenant => ({
  id: crypto.randomUUID(),
  name: '', razaoSocial: '', cpfCnpj: '', logoUrl: '', faviconUrl: '', logoHomeUrl: '', logoFooterUrl: '', logoLoginUrl: '', logoSystemUrl: '',
  address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
  email: '', phone: '', website: '',
  responsavel: { nome: '', cpf: '', email: '', phone: '', cargo: '' },
  financeiro: { implantacaoValor: 1500, licencaValorMensal: 220, licencaVencimentoDia: 10, licencaStatus: 'ativo', contratoInicio: new Date().toISOString().split('T')[0], observacoes: '' },
  dominio: { slug: '', subdomain: '', customDomain: '', minhaConta: '', dnsStatus: 'pendente', streamingPortalUrl: '' },
  streamingApi: { baseUrl: '', authType: 'youcast', login: '', secret: '', credential: '', endpoints: { createUser: { method: 'POST', path: 'api/integration/createMotvCustomer' }, authenticateUser: { method: 'POST', path: 'api/devices/motv/apiLoginV2' }, findUser: { method: 'POST', path: 'api/customer/getDataV2' }, searchUser: { method: 'POST', path: 'api/customer/findCustomerForSales' }, updateUser: { method: 'POST', path: 'api/integration/updateMotvCustomer' }, enablePlan: { method: 'POST', path: 'api/integration/subscribe' }, disablePlan: { method: 'POST', path: 'api/integration/cancel' }, checkStatus: { method: 'POST', path: 'api/subscription/getCustomerSubscriptionInfo' }, listPlans: { method: 'POST', path: 'api/sales/getAllowedProductsForCustomer' }, getVendors: { method: 'POST', path: 'api/devices/motv/getVendors' } } },
  asaas: { apiKey: '', environment: 'sandbox', webhookUrl: '', webhookToken: '', status: 'pendente' },
  plano: 'start',
  theme: { template: 'cinema-dark', mode: 'dark', primaryColor: '#E50914', accentColor: '#FF4D4D', heroTitle: '', heroSubtitle: '', heroImage: '', heroCtaText: 'Assine agora' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function InputField({ label, value, onChange, type = 'text', placeholder = '', required = false, readOnly = false }: any) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly}
        className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all disabled:opacity-50" />
    </div>
  );
}

export default function TenantFormPage() {
  const { id } = useParams();
  const isNew = id === 'novo';
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant>(emptyTenant());
  const [showCred, setShowCred] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<null | 'success' | 'error'>(null);

  useEffect(() => {
    if (!isNew && id) {
      const t = getTenant(id);
      if (t) setTenant(t);
      else navigate('/superadmin/tenants');
    }
  }, [id]);

  const update = (path: string, value: any) => {
    setTenant(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handlePlanChange = (plano: PlanType) => {
    update('plano', plano);
    update('financeiro.implantacaoValor', PLAN_PRICES[plano].implantacao);
    update('financeiro.licencaValorMensal', PLAN_PRICES[plano].mensal);
  };

  const handleSlugChange = (slug: string) => {
    const s = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    update('dominio.slug', s);
    update('dominio.subdomain', `${s}.flixpay.app`);
  };

  const handleSave = () => {
    if (!tenant.name || !tenant.razaoSocial || !tenant.cpfCnpj) {
      toast.error('Preencha os campos obrigatórios'); return;
    }
    tenant.updatedAt = new Date().toISOString();
    if (!tenant.asaas.webhookUrl && tenant.dominio.slug) {
      tenant.asaas.webhookUrl = `https://api.flixpay.app/webhooks/asaas/${tenant.dominio.slug}`;
    }
    saveTenant(tenant);
    toast.success(isNew ? 'Tenant criado!' : 'Tenant atualizado!');
    navigate('/superadmin/tenants');
  };

  const handleTestConnection = () => {
    setTestResult(null);
    setTimeout(() => {
      setTestResult(Math.random() > 0.1 ? 'success' : 'error');
    }, 800);
  };

  const compressImage = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ratio = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (field: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      update(field, compressed);
    } catch {
      toast.error('Erro ao processar imagem');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/superadmin/tenants')} className="p-2 rounded-lg hover:bg-accent transition-colors"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">{isNew ? 'Novo Tenant' : `Editar — ${tenant.name}`}</h1>
          <p className="text-muted-foreground text-sm">{isNew ? 'Cadastre uma nova empresa' : 'Atualize os dados da empresa'}</p>
        </div>
      </div>

      <Tabs defaultValue="empresa" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-secondary/30 p-1 rounded-xl">
          <TabsTrigger value="empresa" className="text-xs">Empresa</TabsTrigger>
          <TabsTrigger value="plano" className="text-xs">Plano & Financeiro</TabsTrigger>
          <TabsTrigger value="dominio" className="text-xs">Domínio & Streaming</TabsTrigger>
          <TabsTrigger value="api" className="text-xs">API Streaming</TabsTrigger>
          <TabsTrigger value="asaas" className="text-xs">Asaas</TabsTrigger>
          <TabsTrigger value="visual" className="text-xs">Personalização</TabsTrigger>
        </TabsList>

        {/* Tab 1 - Empresa */}
        <TabsContent value="empresa" className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-bold">Dados da Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Nome da empresa" value={tenant.name} onChange={(v: string) => update('name', v)} required />
            <InputField label="Razão Social" value={tenant.razaoSocial} onChange={(v: string) => update('razaoSocial', v)} required />
            <InputField label="CPF/CNPJ" value={tenant.cpfCnpj} onChange={(v: string) => update('cpfCnpj', v)} required placeholder="00.000.000/0000-00" />
            <InputField label="E-mail comercial" value={tenant.email} onChange={(v: string) => update('email', v)} required type="email" />
            <InputField label="Telefone" value={tenant.phone} onChange={(v: string) => update('phone', v)} />
            <InputField label="Website" value={tenant.website} onChange={(v: string) => update('website', v)} />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/20">
            <input type="checkbox" id="showOnHomepage" checked={!!tenant.showOnHomepage} onChange={e => update('showOnHomepage', e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="showOnHomepage" className="text-sm font-semibold">Exibir na página inicial do FlixPay</label>
            <span className="text-xs text-muted-foreground">(Logo/nome aparecerá na seção de clientes)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { field: 'logoUrl', label: 'Logo Principal', height: 'h-12' },
              { field: 'faviconUrl', label: 'Favicon', height: 'h-8' },
              { field: 'logoHomeUrl', label: 'Logo Home (Topo)', height: 'h-12' },
              { field: 'logoFooterUrl', label: 'Logo Rodapé', height: 'h-12' },
              { field: 'logoLoginUrl', label: 'Logo Tela de Login', height: 'h-12' },
              { field: 'logoSystemUrl', label: 'Logo do Sistema (Painel)', height: 'h-10' },
            ].map(logo => (
              <div key={logo.field}>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">{logo.label}</label>
                <input type="file" accept="image/*" onChange={handleImageUpload(logo.field)} className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:cursor-pointer" />
                {(tenant as any)[logo.field] && (
                  <div className="relative inline-block mt-2">
                    <img src={(tenant as any)[logo.field]} alt={logo.label} className={`${logo.height} rounded`} />
                    <button type="button" onClick={() => update(logo.field, '')} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80"><X size={12} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold pt-4">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="CEP" value={tenant.address.cep} onChange={(v: string) => update('address.cep', v)} required />
            <InputField label="Logradouro" value={tenant.address.street} onChange={(v: string) => update('address.street', v)} />
            <InputField label="Número" value={tenant.address.number} onChange={(v: string) => update('address.number', v)} />
            <InputField label="Complemento" value={tenant.address.complement} onChange={(v: string) => update('address.complement', v)} />
            <InputField label="Bairro" value={tenant.address.neighborhood} onChange={(v: string) => update('address.neighborhood', v)} />
            <InputField label="Cidade" value={tenant.address.city} onChange={(v: string) => update('address.city', v)} />
            <InputField label="Estado" value={tenant.address.state} onChange={(v: string) => update('address.state', v)} />
          </div>

          <h2 className="text-lg font-bold pt-4">Responsável</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Nome" value={tenant.responsavel.nome} onChange={(v: string) => update('responsavel.nome', v)} required />
            <InputField label="CPF" value={tenant.responsavel.cpf} onChange={(v: string) => update('responsavel.cpf', v)} required />
            <InputField label="E-mail (login admin)" value={tenant.responsavel.email} onChange={(v: string) => update('responsavel.email', v)} required type="email" />
            <InputField label="Telefone" value={tenant.responsavel.phone} onChange={(v: string) => update('responsavel.phone', v)} />
            <InputField label="Cargo" value={tenant.responsavel.cargo} onChange={(v: string) => update('responsavel.cargo', v)} />
          </div>
        </TabsContent>

        {/* Tab 2 - Plano & Financeiro */}
        <TabsContent value="plano" className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-bold">Plano Contratado</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['start', 'pro', 'ultra'] as PlanType[]).map(p => (
              <button key={p} onClick={() => handlePlanChange(p)}
                className={`p-5 rounded-xl border-2 transition-all text-left ${tenant.plano === p ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
                <span className="text-lg font-black uppercase">{PLAN_NAMES[p]}</span>
                {p === 'pro' && <span className="ml-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded font-bold uppercase">Popular</span>}
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Implantação: R$ {PLAN_PRICES[p].implantacao.toLocaleString('pt-BR')}</p>
                  <p>Mensal: R$ {PLAN_PRICES[p].mensal}/mês</p>
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Valor de implantação" value={tenant.financeiro.implantacaoValor} onChange={(v: string) => update('financeiro.implantacaoValor', Number(v))} type="number" required />
            <InputField label="Mensalidade" value={tenant.financeiro.licencaValorMensal} onChange={(v: string) => update('financeiro.licencaValorMensal', Number(v))} type="number" required />
            <InputField label="Dia de vencimento" value={tenant.financeiro.licencaVencimentoDia} onChange={(v: string) => update('financeiro.licencaVencimentoDia', Number(v))} type="number" required />
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Status da licença *</label>
              <select value={tenant.financeiro.licencaStatus} onChange={e => update('financeiro.licencaStatus', e.target.value)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                <option value="ativo">Ativo</option>
                <option value="trial">Trial</option>
                <option value="inadimplente">Inadimplente</option>
                <option value="suspenso">Suspenso</option>
              </select>
            </div>
            <InputField label="Início do contrato" value={tenant.financeiro.contratoInicio} onChange={(v: string) => update('financeiro.contratoInicio', v)} type="date" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Observações financeiras</label>
            <textarea value={tenant.financeiro.observacoes} onChange={e => update('financeiro.observacoes', e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary min-h-[80px]" />
          </div>
        </TabsContent>

        {/* Tab 3 - Domínio */}
        <TabsContent value="dominio" className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-bold">Domínio & Streaming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField label="Slug" value={tenant.dominio.slug} onChange={handleSlugChange} required placeholder="meustreaming" />
              {tenant.dominio.slug && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Subdomínio: <span className="text-primary">{tenant.dominio.slug}.flixpay.app</span></p>
                  <p className="text-xs text-muted-foreground">URL Admin provisória: <span className="text-primary font-medium">/{tenant.dominio.slug}/admin</span></p>
                  <p className="text-xs text-muted-foreground">URL Login tenant: <span className="text-primary font-medium">/{tenant.dominio.slug}/login</span></p>
                  <p className="text-xs text-muted-foreground">URL Minha Conta: <span className="text-primary font-medium">/{tenant.dominio.slug}/minha-conta</span></p>
                  <p className="text-xs text-muted-foreground">Landing pública: <span className="text-primary font-medium">/{tenant.dominio.slug}</span></p>
                </div>
              )}
            </div>
            <InputField label="Subdomínio" value={tenant.dominio.subdomain} onChange={(v: string) => update('dominio.subdomain', v)} readOnly />
            <InputField label="Domínio customizado (LP)" value={tenant.dominio.customDomain} onChange={(v: string) => update('dominio.customDomain', v)} placeholder="meuclient.com.br" />
            <InputField label="Domínio Minha Conta" value={tenant.dominio.minhaConta} onChange={(v: string) => update('dominio.minhaConta', v)} placeholder="conta.meuclient.com.br" />
            <InputField label="Portal de Streaming" value={tenant.dominio.streamingPortalUrl} onChange={(v: string) => update('dominio.streamingPortalUrl', v)} required placeholder="https://play.meuclient.com.br" />
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Status DNS</label>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  tenant.dominio.dnsStatus === 'ativo' ? 'bg-green-500/20 text-green-400' :
                  tenant.dominio.dnsStatus === 'erro' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{tenant.dominio.dnsStatus}</span>
                <button onClick={() => update('dominio.dnsStatus', 'ativo')} className="text-xs text-primary hover:underline">Verificar</button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4 - API */}
        <TabsContent value="api" className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-bold">API de Streaming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="URL Base" value={tenant.streamingApi.baseUrl} onChange={(v: string) => update('streamingApi.baseUrl', v)} required placeholder="https://api.exemplo.com.br/" />
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Tipo de autenticação *</label>
              <select value={tenant.streamingApi.authType} onChange={e => update('streamingApi.authType', e.target.value)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                <option value="youcast">HMAC (login:timestamp:SHA1)</option>
                <option value="bearer">Bearer Token</option>
                <option value="apikey">API Key</option>
                <option value="basic">Basic Auth</option>
              </select>
            </div>
            {tenant.streamingApi.authType === 'youcast' ? (
              <>
                <InputField label="Login da API" value={tenant.streamingApi.login} onChange={(v: string) => update('streamingApi.login', v)} required placeholder="meutenant.api" />
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Secret *</label>
                  <div className="relative">
                    <input type={showCred ? 'text' : 'password'} value={tenant.streamingApi.secret}
                      onChange={e => update('streamingApi.secret', e.target.value)}
                      className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary pr-10" />
                    <button type="button" onClick={() => setShowCred(!showCred)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showCred ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Token gerado: login:timestamp:SHA1(timestamp+login+secret)</p>
                </div>
              </>
            ) : (
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Credencial *</label>
                <div className="relative">
                  <input type={showCred ? 'text' : 'password'} value={tenant.streamingApi.credential}
                    onChange={e => update('streamingApi.credential', e.target.value)}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary pr-10" />
                  <button type="button" onClick={() => setShowCred(!showCred)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showCred ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
          <h3 className="text-sm font-bold pt-2">Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(tenant.streamingApi.endpoints).map(([key, ep]) => (
              <div key={key} className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs font-bold uppercase mb-2">{key.replace(/([A-Z])/g, ' $1')}</p>
                <div className="flex gap-2">
                  <select value={ep.method} onChange={e => update(`streamingApi.endpoints.${key}.method`, e.target.value)}
                    className="px-2 py-1.5 bg-secondary/50 border border-border rounded text-xs w-24">
                    <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
                  </select>
                  <input value={ep.path} onChange={e => update(`streamingApi.endpoints.${key}.path`, e.target.value)}
                    className="flex-1 px-2 py-1.5 bg-secondary/50 border border-border rounded text-xs" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleTestConnection} className="btn-brand text-sm flex items-center gap-2">
            Testar Conexão
          </button>
          {testResult && (
            <div className={`flex items-center gap-2 text-sm ${testResult === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {testResult === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {testResult === 'success' ? 'Conexão bem-sucedida!' : 'Falha na conexão. Verifique as credenciais.'}
            </div>
          )}
        </TabsContent>

        {/* Tab 5 - Asaas */}
        <TabsContent value="asaas" className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-bold">Integração Asaas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">API Key *</label>
              <div className="relative">
                <input type={showApiKey ? 'text' : 'password'} value={tenant.asaas.apiKey}
                  onChange={e => update('asaas.apiKey', e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary pr-10" />
                <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Ambiente</label>
              <div className="flex gap-3">
                {(['sandbox', 'production'] as const).map(env => (
                  <button key={env} onClick={() => update('asaas.environment', env)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tenant.asaas.environment === env ? 'bg-primary text-white' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>
                    {env === 'sandbox' ? 'Sandbox' : 'Produção'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Webhook URL</label>
              <div className="flex gap-2">
                <input readOnly value={tenant.asaas.webhookUrl || `https://api.flixpay.app/webhooks/asaas/${tenant.dominio.slug || 'slug'}`}
                  className="flex-1 px-3 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm text-muted-foreground" />
                <button onClick={() => { navigator.clipboard.writeText(tenant.asaas.webhookUrl); toast.success('Copiado!'); }}
                  className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-xs hover:bg-secondary transition-colors">Copiar</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Webhook Token (Autenticação)</label>
              <div className="relative">
                <input type={showApiKey ? 'text' : 'password'} value={tenant.asaas.webhookToken || ''}
                  onChange={e => update('asaas.webhookToken', e.target.value)}
                  placeholder="Token para validar webhooks recebidos"
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary pr-10" />
                <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Configure no painel Asaas → Webhooks → Token de autenticação</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Status</label>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                tenant.asaas.status === 'conectado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>{tenant.asaas.status}</span>
            </div>
          </div>
        </TabsContent>

        {/* Tab 6 - Visual */}
        <TabsContent value="visual" className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-bold">Personalização Visual</h2>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">Template</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'cinema-dark' as const, name: 'Cinema Dark', desc: 'Hero fullscreen, glassmorphism, carrossel' },
                { id: 'gradient-flow' as const, name: 'Gradient Flow', desc: 'Gradientes fluidos, split hero, toggle mensal/anual' },
                { id: 'minimal-premium' as const, name: 'Minimal Premium', desc: 'Tipografia bold, tabela comparativa, clean' },
                { id: 'darkflix-editorial' as const, name: 'Darkflix Editorial', desc: 'Editorial dark, tipografia premium, seções imersivas' },
              ].map(tmpl => (
                <button key={tmpl.id} onClick={() => update('theme.template', tmpl.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${tenant.theme.template === tmpl.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
                  <p className="font-bold text-sm">{tmpl.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tmpl.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Modo padrão</label>
              <div className="flex gap-3">
                {(['dark', 'light'] as const).map(m => (
                  <button key={m} onClick={() => update('theme.mode', m)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tenant.theme.mode === m ? 'bg-primary text-white' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>
                    {m === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Cor primária</label>
                <input type="color" value={tenant.theme.primaryColor} onChange={e => update('theme.primaryColor', e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Cor de acento</label>
                <input type="color" value={tenant.theme.accentColor} onChange={e => update('theme.accentColor', e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Título Hero" value={tenant.theme.heroTitle} onChange={(v: string) => update('theme.heroTitle', v)} />
            <InputField label="Subtítulo Hero" value={tenant.theme.heroSubtitle} onChange={(v: string) => update('theme.heroSubtitle', v)} />
            <InputField label="Texto CTA" value={tenant.theme.heroCtaText} onChange={(v: string) => update('theme.heroCtaText', v)} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Imagem Hero</label>
            <input type="file" accept="image/*" onChange={handleImageUpload('theme.heroImage')} className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:cursor-pointer" />
            {tenant.theme.heroImage && (
              <div className="relative inline-block mt-2">
                <img src={tenant.theme.heroImage} alt="Hero" className="h-32 rounded-lg object-cover" />
                <button type="button" onClick={() => update('theme.heroImage', '')} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80"><X size={12} /></button>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Imagem Login (lado esquerdo)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload('theme.loginSideImage')} className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:cursor-pointer" />
            {tenant.theme.loginSideImage && (
              <div className="relative inline-block mt-2">
                <img src={tenant.theme.loginSideImage} alt="Login Side" className="h-32 rounded-lg object-cover" />
                <button type="button" onClick={() => update('theme.loginSideImage', '')} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80"><X size={12} /></button>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Fundo Seção 2 (Manifesto)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload('theme.section2BgImage')} className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:cursor-pointer" />
            {tenant.theme.section2BgImage && (
              <div className="relative inline-block mt-2">
                <img src={tenant.theme.section2BgImage} alt="Seção 2" className="h-32 rounded-lg object-cover" />
                <button type="button" onClick={() => update('theme.section2BgImage', '')} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80"><X size={12} /></button>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Fundo Seção 3 (Experiência)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload('theme.section3BgImage')} className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:cursor-pointer" />
            {tenant.theme.section3BgImage && (
              <div className="relative inline-block mt-2">
                <img src={tenant.theme.section3BgImage} alt="Seção 3" className="h-32 rounded-lg object-cover" />
                <button type="button" onClick={() => update('theme.section3BgImage', '')} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80"><X size={12} /></button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button onClick={() => navigate('/superadmin/tenants')} className="px-6 py-3 bg-secondary/50 border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors">
          Cancelar
        </button>
        <button onClick={handleSave} className="btn-brand flex items-center gap-2 text-sm">
          <Save size={16} /> {isNew ? 'Criar Tenant' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}
