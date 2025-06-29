-- Limpar e recriar todas as tabelas
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Criar tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  avatar TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  needs_password_change BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de categorias
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  parent_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  installments INTEGER DEFAULT 1,
  address TEXT,
  coupon_code VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de itens do pedido
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de cupons
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount DECIMAL(5,2) NOT NULL,
  type VARCHAR(20) DEFAULT 'percentage',
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de banners
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário admin
INSERT INTO users (name, email, password, phone, birth_date, is_admin, needs_password_change)
VALUES (
  'Administrador Vlar',
  'contato@vlar.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', -- admin123#
  '(11) 99999-9999',
  '1990-01-01',
  TRUE,
  FALSE
);

-- Inserir categorias
INSERT INTO categories (name, slug, parent_id) VALUES
('Vaporizadores', 'vaporizadores', NULL),
('Líquidos', 'liquidos', NULL),
('Reposição', 'reposicao', NULL),
('Eletrônicos', 'eletronicos', NULL),
('Informática', 'informatica', NULL);

-- Inserir subcategorias
INSERT INTO categories (name, slug, parent_id) VALUES
('Descartáveis', 'descartaveis', 1),
('Recarregáveis', 'recarregaveis', 1),
('Nic Salt', 'nic-salt', 2),
('Freebase', 'freebase', 2),
('Coils', 'coils', 3),
('Baterias', 'baterias', 3),
('Capas', 'capas', 3),
('Carregadores', 'carregadores', 3),
('SSDs', 'ssds', 5),
('Periféricos', 'perifericos', 5),
('Memória RAM', 'memoria-ram', 5),
('Baterias Info', 'baterias-info', 5),
('Cabos', 'cabos', 5),
('HDs', 'hds', 5),
('Fontes', 'fontes', 5),
('Coolers', 'coolers', 5),
('Gabinetes', 'gabinetes', 5);

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, category, stock, sku) VALUES
('Vape Pod Descartável 2000 Puffs', 'Vaporizador descartável com 2000 puffs, sabor menta gelada', 29.90, 'vaporizadores', 50, 'VAPE001'),
('Líquido Nic Salt 30ml - Morango', 'Líquido para vape com nicotina salt, sabor morango', 39.90, 'liquidos', 30, 'LIQ001'),
('Coil 0.8ohm Mesh', 'Resistência mesh 0.8ohm para vaporizadores', 15.90, 'reposicao', 100, 'COIL001'),
('SSD NVMe 1TB Samsung', 'SSD de alta performance para computadores', 299.90, 'informatica', 15, 'SSD001'),
('Teclado Mecânico RGB', 'Teclado mecânico com iluminação RGB', 199.90, 'informatica', 25, 'TEC001'),
('Vape Recarregável Kit Completo', 'Kit completo com vaporizador recarregável e acessórios', 89.90, 'vaporizadores', 20, 'VAPE002'),
('Líquido Freebase 60ml - Tabaco', 'Líquido tradicional sabor tabaco', 24.90, 'liquidos', 40, 'LIQ002'),
('Bateria 18650 3000mAh', 'Bateria recarregável para vaporizadores', 35.90, 'reposicao', 60, 'BAT001');

-- Inserir banners de exemplo
INSERT INTO banners (title, image_url, link_url, is_active, order_position) VALUES
('Banner Principal - Vapes', '/placeholder.svg?height=400&width=1200', '/categoria/vaporizadores', TRUE, 1),
('Promoção Líquidos', '/placeholder.svg?height=400&width=1200', '/categoria/liquidos', TRUE, 2),
('Lançamentos Tech', '/placeholder.svg?height=400&width=1200', '/categoria/informatica', TRUE, 3);

-- Inserir cupons de exemplo
INSERT INTO coupons (code, discount, type, is_active) VALUES
('VLAR10', 10.00, 'percentage', TRUE),
('BEMVINDO', 15.00, 'percentage', TRUE),
('FRETE50', 50.00, 'fixed', TRUE);
