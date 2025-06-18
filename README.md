# 🚀 TechStore - E-commerce de Tecnologia

Site de e-commerce moderno para produtos de tecnologia com design futurista e funcionalidades avançadas.

## ✨ Funcionalidades

- 🛍️ Catálogo de produtos com hover effects 3D
- 🔐 Sistema de autenticação seguro com JWT
- 🛒 Carrinho avançado com múltiplos métodos de pagamento
- 👨‍💼 Painel administrativo completo
- 📧 Notificações automáticas por email
- 🎫 Sistema de cupons de desconto
- 📱 Design responsivo e moderno
- 💬 Integração com WhatsApp

## 🚀 Deploy Rápido na Vercel

### 1. Preparar o Banco de Dados

1. Acesse [Neon.tech](https://neon.tech) (PostgreSQL gratuito)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a URL de conexão (DATABASE_URL)

### 2. Deploy na Vercel

1. Faça fork/clone deste repositório
2. Conecte com sua conta Vercel
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`: URL do seu banco Neon
   - `JWT_SECRET`: Uma chave secreta forte (ex: `minha-chave-super-secreta-2024`)
   - `EMAIL_USER`: Seu email Gmail (opcional)
   - `EMAIL_PASS`: Senha de app do Gmail (opcional)

### 3. Inicializar o Banco

Após o deploy, acesse: `https://seu-site.vercel.app/api/init`

Isso criará todas as tabelas e dados iniciais.

### 4. Fazer Login

- **Email**: luccasavelar@gmail.com
- **Senha**: luccasavelar@gmail.com

## 🛠️ Desenvolvimento Local

\`\`\`bash
# Instalar dependências
npm install

# Configurar .env.local
cp .env.example .env.local

# Executar em desenvolvimento
npm run dev
\`\`\`

## 📧 Configuração de Email (Opcional)

Para receber notificações de pedidos:

1. Ative a verificação em 2 etapas no Gmail
2. Gere uma "Senha de app"
3. Configure EMAIL_USER e EMAIL_PASS

## 🎯 Próximos Passos

- [ ] Personalizar produtos
- [ ] Configurar WhatsApp
- [ ] Adicionar domínio personalizado
- [ ] Configurar emails
- [ ] Testar funcionalidades

## 🔧 Tecnologias

- Next.js 14 + TypeScript
- PostgreSQL (Neon)
- Tailwind CSS + Framer Motion
- JWT + bcrypt
- Nodemailer
