-- Script completo para criar todas as tabelas necessárias para a Vlar

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    avatar TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias/departamentos
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES categories(id),
    image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    images TEXT[], -- Array de imagens
    category VARCHAR(255),
    category_id INTEGER REFERENCES categories(id),
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    weight DECIMAL(8,3),
    dimensions VARCHAR(100),
    brand VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    products JSONB,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    installments VARCHAR(10),
    address TEXT,
    coupon_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    tracking_code VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cupons
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(5,2) NOT NULL,
    type VARCHAR(20) DEFAULT 'percentage',
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de banners
CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image TEXT NOT NULL,
    link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de conteúdo editável
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text',
    label VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações de estoque
CREATE TABLE IF NOT EXISTS stock_notifications (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens de contato
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário admin padrão
INSERT INTO users (name, email, password, is_admin) 
VALUES ('Admin Vlar', 'vlartech@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Inserir categorias padrão
INSERT INTO categories (name, slug, sort_order) VALUES
('Hardware', 'hardware', 1),
('Notebooks', 'notebooks', 2),
('Monitores', 'monitores', 3),
('Periféricos', 'perifericos', 4),
('Componentes', 'componentes', 5)
ON CONFLICT (slug) DO NOTHING;

-- Inserir conteúdo padrão do site
INSERT INTO site_content (key, value, type, label, description) VALUES
('site_title', 'Vlar', 'text', 'Título do Site', 'Nome da loja exibido no cabeçalho'),
('hero_title', 'Bem-vindo à Vlar', 'text', 'Título Principal', 'Título exibido na página inicial'),
('hero_subtitle', 'Os melhores produtos de tecnologia para você', 'text', 'Subtítulo Principal', 'Subtítulo da página inicial'),
('featured_title', 'Produtos em Destaque', 'text', 'Título Produtos Destaque', 'Título da seção de produtos em destaque'),
('all_products_title', 'Todos os Produtos', 'text', 'Título Todos Produtos', 'Título da seção de todos os produtos'),
('free_shipping_text', 'Frete grátis para compras acima de R$ 299', 'text', 'Texto Frete Grátis', 'Texto exibido no cabeçalho sobre frete grátis')
ON CONFLICT (key) DO NOTHING;

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, category, stock, image) VALUES
('Notebook Gamer', 'Notebook para jogos com alta performance', 2999.99, 'Notebooks', 10, '/placeholder.svg?height=300&width=300'),
('Monitor 24"', 'Monitor Full HD de 24 polegadas', 599.99, 'Monitores', 15, '/placeholder.svg?height=300&width=300'),
('Teclado Mecânico', 'Teclado mecânico RGB para gamers', 299.99, 'Periféricos', 25, '/placeholder.svg?height=300&width=300'),
('Mouse Gamer', 'Mouse óptico de alta precisão', 149.99, 'Periféricos', 30, '/placeholder.svg?height=300&width=300'),
('Placa de Vídeo', 'GPU de última geração para jogos', 1899.99, 'Hardware', 5, '/placeholder.svg?height=300&width=300')
ON CONFLICT (sku) DO NOTHING;
