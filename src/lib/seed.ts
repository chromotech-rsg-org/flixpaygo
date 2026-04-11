import { User, Tenant, Subscriber, Invoice, SubscriptionPlan } from './types';
import { setUsers, setTenants, setPlans, setSubscribers, setInvoices, markSeeded, isSeeded, setProposals } from './storage';

const uid = () => crypto.randomUUID();

function randomDate(monthsBack: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - Math.floor(Math.random() * monthsBack));
  d.setDate(Math.floor(Math.random() * 28) + 1);
  return d.toISOString();
}

function futureDate(daysAhead: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export function seedData() {
  if (isSeeded()) return;

  // Users
  const users: User[] = [
    { id: '1', role: 'superadmin', email: 'admin@flixpay.app', password: 'flixpay2024', name: 'SuperAdmin FlixPay' },
    { id: '2', role: 'tenant_admin', email: 'admin@darkflix.com.br', password: 'darkflix123', name: 'Admin Darkflix', tenantId: 'darkflix' },
    { id: '3', role: 'subscriber', email: 'joao@email.com', password: '123456', name: 'João Silva', tenantId: 'darkflix' },
  ];
  setUsers(users);

  const tenants: Tenant[] = [
    {
      id: 'darkflix',
      name: 'Darkflix',
      razaoSocial: 'Darkflix Entretenimento LTDA',
      cpfCnpj: '12.345.678/0001-90',
      logoUrl: '',
      faviconUrl: '',
      address: { cep: '01310-100', street: 'Av. Paulista', number: '1000', complement: 'Sala 501', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP' },
      email: 'contato@darkflix.com.br',
      phone: '(11) 99999-9999',
      website: 'https://darkflix.com.br',
      responsavel: { nome: 'Carlos Mendes', cpf: '123.456.789-00', email: 'admin@darkflix.com.br', phone: '(11) 99999-9999', cargo: 'CEO' },
      financeiro: { implantacaoValor: 2900, licencaValorMensal: 380, licencaVencimentoDia: 10, licencaStatus: 'ativo', contratoInicio: '2024-01-15', observacoes: '' },
      dominio: { slug: 'darkflix', subdomain: 'darkflix.flixpay.app', customDomain: 'darkflix.com.br', minhaConta: 'conta.darkflix.com.br', dnsStatus: 'ativo', streamingPortalUrl: 'https://play.darkflix.com.br' },
      streamingApi: { baseUrl: 'https://sms.yplay.com.br/', authType: 'youcast', login: 'darkflix.api', secret: 'yzckoil0kyj6mlvxy2r26s4c7ddz7qpyvdgqufo0', credential: '', endpoints: { createUser: { method: 'POST', path: 'api/integration/createMotvCustomer' }, authenticateUser: { method: 'POST', path: 'api/devices/motv/apiLoginV2' }, findUser: { method: 'POST', path: 'api/customer/getDataV2' }, searchUser: { method: 'POST', path: 'api/customer/findCustomerForSales' }, updateUser: { method: 'POST', path: 'api/integration/updateMotvCustomer' }, enablePlan: { method: 'POST', path: 'api/integration/subscribe' }, disablePlan: { method: 'POST', path: 'api/integration/cancel' }, checkStatus: { method: 'POST', path: 'api/subscription/getCustomerSubscriptionInfo' }, listPlans: { method: 'POST', path: 'api/sales/getAllowedProductsForCustomer' }, getVendors: { method: 'POST', path: 'api/devices/motv/getVendors' } } },
      asaas: { apiKey: 'aak_darkflix_xxx', environment: 'production', webhookUrl: 'https://api.flixpay.app/webhooks/asaas/darkflix', webhookToken: 'whk_darkflix_token_xxx', status: 'conectado' },
      plano: 'pro',
      theme: {
        template: 'darkflix-editorial', mode: 'dark', primaryColor: '#CC272E', accentColor: '#FF4D4D',
        heroTitle: 'você não chegou\naqui por acaso.', heroSubtitle: 'Mas veio parar aqui.',
        heroImage: '/darkflix/hero-gradient.png', heroCtaText: 'Acessar agora',
        loginSideImage: '/darkflix/experience-bg.png',
        editorialSections: [
          { type: 'manifesto', heading: 'A Darkflix não é um streaming tradicional.', body: 'você ainda pode fechar esta página. a maioria faz isso. os outros continuam… e raramente se arrependem. raramente.', image: '/darkflix/posters.png', quote: 'Aviso: este não é um lugar confortável.' },
          { type: 'experience', heading: 'A Darkflix não é um streaming tradicional.', body: 'É um espaço onde filmes fora do circuito comercial voltam a circular — obras atmosféricas, cultuadas e difíceis de encontrar. Filmes que não foram feitos para agradar. Foram feitos para permanecer.', image: '/darkflix/expressionism.png' },
          { type: 'whyRare', heading: 'UMA EXPERIÊNCIA DIFERENTE', body: 'Aqui, o silêncio não é vazio. É parte da narrativa. Sem fórmulas reconfortantes. Sem trilhas que avisam o susto. Sem resoluções fáceis. A tensão não explode. Ela se instala.', image: '/darkflix/zombie-full.png', quote: '"não recomendamos assistir sozinho. nem acompanhado."' },
          { type: 'filmTypes', heading: 'TIPOS DE FILMES QUE VOCÊ ENCONTRA', body: '', image: '/darkflix/film-types.png', bulletPoints: ['• terror psicológico e atmosférico', '• cults europeus dos anos 60, 70 e 80', '• horror asiático inquietante', '• produções independentes difíceis de localizar', '• obras restauradas e redescobertas', '• filmes estranhos demais para o circuito comercial'] },
          { type: 'catalog', heading: 'POR QUE VOCÊ NÃO ENCONTRA ESSES FILMES FACILMENTE', body: '', image: '/darkflix/demon-clown.png' },
          { type: 'audience', heading: 'UM CATÁLOGO EM MOVIMENTO', body: 'Outros saem. Raridades retornam. Novas descobertas entram. Você nunca verá exatamente o mesmo catálogo duas vezes.', image: '/darkflix/catalog.png' },
        ],
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-06-01T14:32:00Z',
      showOnHomepage: true,
    },
    {
      id: 'cinemaflix',
      name: 'CinemaFlix',
      razaoSocial: 'CinemaFlix Digital LTDA',
      cpfCnpj: '98.765.432/0001-10',
      logoUrl: '',
      faviconUrl: '',
      address: { cep: '22041-080', street: 'Rua Barata Ribeiro', number: '500', complement: '', neighborhood: 'Copacabana', city: 'Rio de Janeiro', state: 'RJ' },
      email: 'contato@cinemaflix.com.br',
      phone: '(21) 98888-7777',
      website: 'https://cinemaflix.com.br',
      responsavel: { nome: 'Ana Oliveira', cpf: '987.654.321-00', email: 'ana@cinemaflix.com.br', phone: '(21) 98888-7777', cargo: 'Diretora' },
      financeiro: { implantacaoValor: 4900, licencaValorMensal: 580, licencaVencimentoDia: 5, licencaStatus: 'ativo', contratoInicio: '2023-08-01', observacoes: 'Cliente premium' },
      dominio: { slug: 'cinemaflix', subdomain: 'cinemaflix.flixpay.app', customDomain: 'cinemaflix.com.br', minhaConta: 'conta.cinemaflix.com.br', dnsStatus: 'ativo', streamingPortalUrl: 'https://play.cinemaflix.com.br' },
      streamingApi: { baseUrl: '', authType: 'youcast', login: 'cinemaflix.api', secret: 'cinema_secret_placeholder', credential: '', endpoints: { createUser: { method: 'POST', path: 'api/integration/createMotvCustomer' }, authenticateUser: { method: 'POST', path: 'api/devices/motv/apiLoginV2' }, findUser: { method: 'POST', path: 'api/customer/getDataV2' }, searchUser: { method: 'POST', path: 'api/customer/findCustomerForSales' }, updateUser: { method: 'POST', path: 'api/integration/updateMotvCustomer' }, enablePlan: { method: 'POST', path: 'api/integration/subscribe' }, disablePlan: { method: 'POST', path: 'api/integration/cancel' }, checkStatus: { method: 'POST', path: 'api/subscription/getCustomerSubscriptionInfo' }, listPlans: { method: 'POST', path: 'api/sales/getAllowedProductsForCustomer' }, getVendors: { method: 'POST', path: 'api/devices/motv/getVendors' } } },
      asaas: { apiKey: 'aak_cinema_xxx', environment: 'production', webhookUrl: 'https://api.flixpay.app/webhooks/asaas/cinemaflix', webhookToken: 'whk_cinema_token_xxx', status: 'conectado' },
      plano: 'ultra',
      theme: { template: 'gradient-flow', mode: 'dark', primaryColor: '#8B5CF6', accentColor: '#F59E0B', heroTitle: 'O melhor do cinema na sua tela', heroSubtitle: 'Blockbusters, clássicos e exclusivos.', heroImage: '', heroCtaText: 'Comece agora' },
      createdAt: '2023-08-01T08:00:00Z',
      updatedAt: '2024-05-20T11:15:00Z',
      showOnHomepage: true,
    },
    {
      id: 'seriesplay',
      name: 'SeriesPlay',
      razaoSocial: 'SeriesPlay Mídia ME',
      cpfCnpj: '55.666.777/0001-30',
      logoUrl: '',
      faviconUrl: '',
      address: { cep: '30130-000', street: 'Rua da Bahia', number: '200', complement: 'Sala 3', neighborhood: 'Centro', city: 'Belo Horizonte', state: 'MG' },
      email: 'contato@seriesplay.com.br',
      phone: '(31) 97777-6666',
      website: 'https://seriesplay.com.br',
      responsavel: { nome: 'Pedro Santos', cpf: '555.666.777-00', email: 'pedro@seriesplay.com.br', phone: '(31) 97777-6666', cargo: 'Fundador' },
      financeiro: { implantacaoValor: 1500, licencaValorMensal: 220, licencaVencimentoDia: 15, licencaStatus: 'ativo', contratoInicio: '2024-06-01', observacoes: '' },
      dominio: { slug: 'seriesplay', subdomain: 'seriesplay.flixpay.app', customDomain: '', minhaConta: '', dnsStatus: 'pendente', streamingPortalUrl: 'https://play.seriesplay.com.br' },
      streamingApi: { baseUrl: '', authType: 'youcast', login: 'seriesplay.api', secret: 'series_secret_placeholder', credential: '', endpoints: { createUser: { method: 'POST', path: 'api/integration/createMotvCustomer' }, authenticateUser: { method: 'POST', path: 'api/devices/motv/apiLoginV2' }, findUser: { method: 'POST', path: 'api/customer/getDataV2' }, searchUser: { method: 'POST', path: 'api/customer/findCustomerForSales' }, updateUser: { method: 'POST', path: 'api/integration/updateMotvCustomer' }, enablePlan: { method: 'POST', path: 'api/integration/subscribe' }, disablePlan: { method: 'POST', path: 'api/integration/cancel' }, checkStatus: { method: 'POST', path: 'api/subscription/getCustomerSubscriptionInfo' }, listPlans: { method: 'POST', path: 'api/sales/getAllowedProductsForCustomer' }, getVendors: { method: 'POST', path: 'api/devices/motv/getVendors' } } },
      asaas: { apiKey: 'aak_series_xxx', environment: 'sandbox', webhookUrl: 'https://api.flixpay.app/webhooks/asaas/seriesplay', webhookToken: '', status: 'conectado' },
      plano: 'start',
      theme: { template: 'minimal-premium', mode: 'light', primaryColor: '#3B82F6', accentColor: '#06B6D4', heroTitle: 'Suas séries favoritas', heroSubtitle: 'Assista onde quiser, quando quiser.', heroImage: '', heroCtaText: 'Assinar' },
      createdAt: '2024-06-01T09:00:00Z',
      updatedAt: '2024-06-01T09:00:00Z',
      showOnHomepage: false,
    },
  ];
  setTenants(tenants);

  // Plans & subscribers for each tenant
  const planNames = ['Básico', 'Padrão', 'Premium'];
  const planPrices = [29.90, 49.90, 79.90];
  const planFeatures = [
    ['Catálogo completo', 'Qualidade SD', '1 tela'],
    ['Catálogo completo', 'Qualidade HD', '2 telas', 'Download offline'],
    ['Catálogo completo', 'Qualidade 4K', '4 telas', 'Download offline', 'Conteúdo exclusivo'],
  ];

  const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Carla', 'Rafael', 'Julia', 'Bruno', 'Fernanda'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Costa', 'Pereira', 'Souza', 'Ferreira', 'Almeida', 'Lima', 'Rocha'];
  const statuses: Array<'active' | 'inactive' | 'overdue' | 'cancelled'> = ['active', 'active', 'active', 'active', 'active', 'active', 'inactive', 'overdue', 'cancelled', 'active'];
  const invoiceStatuses: Array<'paid' | 'pending' | 'overdue' | 'cancelled'> = ['paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'overdue', 'paid', 'paid', 'cancelled'];
  const payMethods: Array<'credit_card' | 'boleto' | 'pix'> = ['credit_card', 'boleto', 'pix', 'credit_card', 'credit_card'];

  const subscriberCounts: Record<string, number> = { darkflix: 8, cinemaflix: 10, seriesplay: 5 };

  tenants.forEach(tenant => {
    const plans: SubscriptionPlan[] = planNames.map((name, i) => ({
      id: `${tenant.id}-plan-${i}`,
      tenantId: tenant.id,
      name,
      description: `Plano ${name}`,
      price: planPrices[i],
      interval: 'monthly',
      asaasPlanId: `sub_${tenant.id}_${i}`,
      streamingPlanId: `plan_${tenant.id}_${i}`,
      active: true,
      highlight: i === 1,
      features: planFeatures[i],
    }));
    setPlans(tenant.id, plans);

    const count = subscriberCounts[tenant.id] || 5;
    const subs: Subscriber[] = [];
    const invs: Invoice[] = [];

    for (let i = 0; i < count; i++) {
      const subId = uid();
      const plan = plans[i % plans.length];
      const created = randomDate(12);
      subs.push({
        id: subId,
        tenantId: tenant.id,
        name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        email: `${firstNames[i % firstNames.length].toLowerCase()}${i}@email.com`,
        cpf: `${String(100+i).slice(-3)}.${String(200+i).slice(-3)}.${String(300+i).slice(-3)}-${String(10+i).slice(-2)}`,
        phone: `(11) 9${String(8000+i*111).slice(-4)}-${String(1000+i*222).slice(-4)}`,
        asaasCustomerId: `cus_${uid().slice(0,8)}`,
        streamingUserId: `user_${uid().slice(0,8)}`,
        planId: plan.id,
        subscriptionStatus: statuses[i % statuses.length],
        subscriptionId: uid(),
        nextBillingDate: futureDate(Math.floor(Math.random() * 30) + 1),
        createdAt: created,
      });

      // 3 invoices per subscriber
      for (let j = 0; j < 3; j++) {
        const dueD = new Date();
        dueD.setMonth(dueD.getMonth() - j);
        dueD.setDate(10);
        const invStatus = j === 0 ? invoiceStatuses[i % invoiceStatuses.length] : 'paid';
        invs.push({
          id: uid(),
          subscriberId: subId,
          tenantId: tenant.id,
          amount: plan.price,
          status: invStatus,
          dueDate: dueD.toISOString().split('T')[0],
          paidAt: invStatus === 'paid' ? dueD.toISOString() : null,
          asaasPaymentId: `pay_${uid().slice(0,8)}`,
          paymentMethod: payMethods[Math.floor(Math.random() * payMethods.length)],
        });
      }
    }
    setSubscribers(tenant.id, subs);
    setInvoices(tenant.id, invs);
  });

  setProposals([]);
  markSeeded();
}
