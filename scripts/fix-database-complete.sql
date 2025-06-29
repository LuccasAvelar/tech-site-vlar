-- Criar banco completo com todas as tabelas necessárias
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;

-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(500),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    image_url VARCHAR(500),
    images TEXT[], -- Array de URLs de imagens
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    sku VARCHAR(100) UNIQUE,
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    tracking_code VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens do pedido
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de banners
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de conteúdo do site
CREATE TABLE site_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir categorias
INSERT INTO categories (name, slug, description) VALUES
('Vaporizadores', 'vaporizadores', 'Vaporizadores e dispositivos eletrônicos'),
('Líquidos', 'liquidos', 'Líquidos para vaporização'),
('Reposição', 'reposicao', 'Peças de reposição e acessórios'),
('Eletrônicos', 'eletronicos', 'Produtos eletrônicos diversos'),
('Informática', 'informatica', 'Produtos de informática e tecnologia');

-- Inserir subcategorias
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Descartáveis', 'descartaveis', 'Vaporizadores descartáveis', 1),
('Recarregáveis', 'recarregaveis', 'Vaporizadores recarregáveis', 1),
('Nic Salt', 'nic-salt', 'Líquidos com nicotina salt', 2),
('Freebase', 'freebase', 'Líquidos freebase', 2),
('Coils', 'coils', 'Resistências e coils', 3),
('Baterias', 'baterias', 'Baterias para vaporizadores', 3),
('SSD''s', 'ssds', 'Discos SSD', 5),
('Periféricos', 'perifericos', 'Periféricos de computador', 5);

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, stock, category_id, image_url, featured, sku) VALUES
('Vape Pod Descartável 2500 Puffs', 'Vaporizador descartável com 2500 puffs, sabor menta', 29.90, 50, 6, '/placeholder.svg?height=300&width=300', true, 'VPD2500-MENTA'),
('Líquido Nic Salt 30ml', 'Líquido premium com nicotina salt, diversos sabores', 24.90, 100, 8, '/placeholder.svg?height=300&width=300', true, 'LNS30-FRUTAS'),
('Kit Vape Recarregável', 'Kit completo com vaporizador recarregável e acessórios', 89.90, 25, 7, '/placeholder.svg?height=300&width=300', true, 'KVR-COMPLETO'),
('Coil 0.6ohm Pack 5un', 'Pack com 5 resistências 0.6ohm compatíveis', 19.90, 75, 10, '/placeholder.svg?height=300&width=300', false, 'COIL-06-5UN'),
('SSD 480GB SATA', 'SSD SATA 480GB para upgrade de performance', 159.90, 30, 12, '/placeholder.svg?height=300&width=300', true, 'SSD480-SATA'),
('Mouse Gamer RGB', 'Mouse gamer com iluminação RGB e alta precisão', 79.90, 40, 13, '/placeholder.svg?height=300&width=300', false, 'MOUSE-RGB-GAMER');

-- Inserir banners
INSERT INTO banners (title, image_url, link_url, active, order_index) VALUES
('Bem-vindo à Vlar', '/placeholder.svg?height=400&width=1200', '/', true, 1),
('Promoção Vaporizadores', '/placeholder.svg?height=400&width=1200', '/categoria/vaporizadores', true, 2),
('Novos Líquidos', '/placeholder.svg?height=400&width=1200', '/categoria/liquidos', true, 3);

-- Inserir conteúdo do site
INSERT INTO site_content (key, value, description) VALUES
('site_name', 'Vlar', 'Nome do site'),
('site_description', 'Os melhores vaporizadores e produtos tech', 'Descrição do site'),
('whatsapp_number', '5533998343132', 'Número do WhatsApp'),
('free_shipping_min', '299', 'Valor mínimo para frete grátis'),
('company_cnpj', '61.249.131/0001-00', 'CNPJ da empresa'),
('company_name', 'Vlar Tecnologia Ltda', 'Nome da empresa');

-- Criar usuários admin
INSERT INTO users (name, email, password, is_admin) VALUES
('Admin Vlar', 'admin@vlar.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true),
('Contato Vlar', 'contato@vlar.com', '$2a$10$EixZxYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', true);

-- Criar índices para performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_name ON products(name);
