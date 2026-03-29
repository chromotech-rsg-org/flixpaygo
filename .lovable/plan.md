

# FlixPay — Fase 1: Login + SuperAdmin Dashboard + Propostas

## Identidade Visual
- Tema dark premium com paleta FlixPay (#E50914 vermelho, #050505 fundo, #121212 cards)
- Efeitos glassmorphism, hover 3D, glow vermelho nos cards e botões
- Fonte Inter (300-900), toggle dark/light persistido em localStorage
- Logos FlixPay, RSG Group e Chromotech nos locais indicados

## Autenticação (localStorage)
- Página `/login` com design premium FlixPay (glassmorphism card, logo, campos estilizados)
- Usuários pré-cadastrados (superadmin, tenant_admin, subscriber) inicializados no primeiro acesso
- Redirecionamento por role: superadmin → `/superadmin`, tenant_admin → `/admin`, subscriber → `/minha-conta`
- Guard de rotas protegidas por role

## Dados de Demonstração
- Auto-seed no primeiro acesso: 3 tenants (Darkflix/Pro, CinemaFlix/Ultra, SeriesPlay/Start)
- 5-10 assinantes por tenant com faturas variadas nos últimos 12 meses
- Feature flags por plano (start/pro/ultra) controlando recursos disponíveis

## SuperAdmin Dashboard — Layout
- Sidebar fixa com logo FlixPay, menu: Dashboard, Tenants, Propostas, Assinaturas (global), Relatórios, Configurações
- Header com badge "SuperAdmin", nome do usuário, toggle dark/light
- Footer com logos RSG Group × Chromotech (grayscale → color no hover)

## SuperAdmin — Dashboard Global
- 4 cards de métricas: tenants ativos, receita FlixPay/mês, total assinantes global, tenants inadimplentes
- Gráfico de receita FlixPay (12 meses) usando Recharts
- Tabela de tenants com licença vencendo em 7 dias
- Lista dos últimos 5 tenants cadastrados

## SuperAdmin — Gestão de Tenants (CRUD)
- Listagem com logo, nome, plano (badge), status licença, qtd assinantes, vencimento, ações
- Filtros por plano, status, data de cadastro
- Formulário completo em 6 abas: Empresa/Responsável, Plano/Financeiro, Domínio/Streaming, API Streaming, Asaas, Personalização Visual
- Ações: editar, duplicar (copia config, zera dados pessoais), excluir, "Acessar como tenant" (impersonation)
- Upload de logo/favicon via FileReader → base64 em localStorage

## SuperAdmin — Propostas Comerciais
- Menu dedicado "Propostas" na sidebar
- Criar proposta independente OU vinculada a um tenant existente
- Ao cadastrar tenant, aba "Proposta" permite gerar proposta com dados pré-preenchidos
- Editor de proposta:
  - Selecionar plano base (Start/Pro/Ultra) com valores pré-preenchidos editáveis
  - Checklist de todos os itens/features — marcar o que está incluso ou não
  - Adicionar itens extras personalizados (LP customizada, APIs adicionais, etc.) com valores
  - Nome/razão social do cliente na proposta
  - Valor total calculado automaticamente
- Gerar proposta visual (página pública estilizada no padrão FlixPay dark/premium, baseada no HTML anexado)
- Link compartilhável `/proposta/:id` com a proposta formatada
- Listar, editar, duplicar e excluir propostas

## Página Pública — Comparativo de Planos (`/planos`)
- Acessível sem login, identidade visual FlixPay completa
- 3 planos lado a lado com todos os recursos listados e checkmarks
- Preços de implantação e mensalidade
- Badge "Mais Popular" no Pro
- Botão "Contratar" → WhatsApp

## Rotas
- `/login` — Autenticação
- `/superadmin` — Dashboard global
- `/superadmin/tenants` — Listagem de tenants
- `/superadmin/tenants/novo` — Cadastro de tenant
- `/superadmin/tenants/:id` — Edição de tenant (com aba Proposta)
- `/superadmin/propostas` — Listagem de propostas
- `/superadmin/propostas/nova` — Criar proposta
- `/superadmin/propostas/:id` — Editar proposta
- `/proposta/:id` — Proposta pública compartilhável
- `/planos` — Comparativo público de planos
- `/admin` — Placeholder para Tenant Admin (fase 2)
- `/minha-conta` — Placeholder para Área do Assinante (fase 3)

