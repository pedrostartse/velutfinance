# Velut Finance 💎

**Velut Finance** é uma aplicação moderna e minimalista para gestão de finanças pessoais, focada em simplicidade, visualização de dados premium e controle total sobre o seu patrimônio.

## 🚀 Funcionalidades

- **Dashboard Premium**: Visão geral de saldo, receitas, despesas e fluxo de caixa com gráficos interativos e design glassmorphism.
- **Investimentos**: Acompanhamento de patrimônio em tempo real com suporte a Ações, FIIs e Renda Fixa.
- **Transações Inteligentes**: CRUD completo de movimentações com categorias, filtros avançados e buscas rápidas.
- **Controle de Fatura de Cartão**: Ciclo de fechamento de fatura personalizável para gestão precisa de gastos no crédito.
- **Metas Financeiras**: Definição e acompanhamento de objetivos de economia com barra de progresso visual.
- **Perfil Personalizado**: Gestão de informações pessoais e configurações de conta.
- **Autenticação Segura**: Sistema robusto de login e cadastro via Supabase.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Design & UI**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Visualização de Dados**: [Recharts](https://recharts.org/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Dados Financeiros**: [Brapi API](https://brapi.dev/) (Integração para cotações)

## ⚙️ Configuração Local

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/pedrostartse/fincontrol.git
    cd fincontrol
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Variáveis de Ambiente**:
    Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais do Supabase:
    ```env
    VITE_SUPABASE_URL=sua_url_do_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
    ```

4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

## 🌐 Deploy

O projeto está otimizado para deploy na [Vercel](https://vercel.com/). Basta conectar seu repositório e configurar as variáveis de ambiente.

---
Desenvolvido com foco em **UX Premium** e **Performance**.
