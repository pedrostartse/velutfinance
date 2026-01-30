# FinControl - Controle Financeiro Pessoal 💰

FinControl é uma aplicação moderna e minimalista para gestão de finanças pessoais, focada em simplicidade e visualização de dados. 

## 🚀 Funcionalidades

- **Dashboard**: Visão geral de saldo, receitas e despesas com gráficos dinâmicos.
- **Transações**: CRUD completo (Criação, Leitura, Edição e Exclusão) de movimentações financeiras.
- **Metas**: Definição e acompanhamento de objetivos de economia com barra de progresso.
- **Categorias**: Sistema de categorias inteligentes separadas por tipo (Entrada/Saída).
- **Autenticação**: Sistema seguro de login e cadastro via Supabase.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/)

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

## 🌐 Deploy (Vercel)

Para realizar o deploy na Vercel, conecte seu repositório do GitHub e lembre-se de configurar as mesmas Variáveis de Ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) no painel de configurações do projeto na Vercel.

---
Desenvolvido com ❤️ por Pedro.
