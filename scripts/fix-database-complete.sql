-- Script completo para corrigir e criar todas as tabelas necessárias

-- Dropar tabelas existentes se houver conflitos
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS stock_notifications CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabela de usuários
CREATE TABLE users (
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
CREATE TABLE categories (
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
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    images TEXT[],
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
CREATE TABLE orders (
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
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cupons
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

-- Tabela de banners
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image TEXT NOT NULL,
    link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de conteúdo editável
CREATE TABLE site_content (
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
CREATE TABLE stock_notifications (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens de contato
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (name, email, password, is_admin) 
VALUES ('Admin Vlar', 'admin@vlar.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Inserir categorias padrão
INSERT INTO categories (name, slug, sort_order) VALUES
('Vaporizadores', 'vaporizadores', 1),
('Líquidos', 'liquidos', 2),
('Reposição', 'reposicao', 3),
('Eletrônicos', 'eletronicos', 4),
('Informática', 'informatica', 5);

-- Inserir subcategorias
INSERT INTO categories (name, slug, parent_id, sort_order) VALUES
('Descartáveis', 'descartaveis', 1, 1),
('Recarregáveis', 'recarregaveis', 1, 2),
('Nic Salt', 'nic-salt', 2, 1),
('Freebase', 'freebase', 2, 2),
('Coils', 'coils', 3, 1),
('Baterias', 'baterias', 3, 2),
('Capas', 'capas', 3, 3),
('Carregadores', 'carregadores', 3, 4),
('SSDs', 'ssds', 5, 1),
('Periféricos', 'perifericos', 5, 2),
('Memória RAM', 'memoria-ram', 5, 3),
('HDs', 'hds', 5, 4),
('Fontes', 'fontes', 5, 5),
('Coolers', 'coolers', 5, 6),
('Gabinetes', 'gabinetes', 5, 7);

-- Inserir conteúdo padrão do site
INSERT INTO site_content (key, value, type, label, description) VALUES
('site_title', 'Vlar', 'text', 'Título do Site', 'Nome da loja exibido no cabeçalho'),
('hero_title', 'Bem-vindo à Vlar', 'text', 'Título Principal', 'Título exibido na página inicial'),
('hero_subtitle', 'Os melhores produtos de tecnologia para você', 'text', 'Subtítulo Principal', 'Subtítulo da página inicial'),
('featured_title', 'Produtos em Destaque', 'text', 'Título Produtos Destaque', 'Título da seção de produtos em destaque'),
('all_products_title', 'Todos os Produtos', 'text', 'Título Todos Produtos', 'Título da seção de todos os produtos'),
('free_shipping_text', 'Frete grátis para compras acima de R$ 299', 'text', 'Texto Frete Grátis', 'Texto exibido no cabeçalho sobre frete grátis');

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, category, stock, image, sku) VALUES
('Vape Pod Descartável 2000 Puffs', 'Pod descartável com 2000 puffs, sabor menta', 29.90, 'Vaporizadores', 50, '/placeholder.svg?height=300&width=300', 'VAPE001'),
('Líquido Nic Salt 30ml', 'Líquido para vape com nicotina salt, sabor frutas vermelhas', 39.90, 'Líquidos', 30, '/placeholder.svg?height=300&width=300', 'LIQ001'),
('Coil 0.8ohm', 'Resistência para vaporizador, 0.8 ohm', 15.90, 'Reposição', 100, '/placeholder.svg?height=300&width=300', 'COIL001'),
('SSD 1TB NVMe', 'SSD de alta velocidade 1TB NVMe', 299.90, 'Informática', 15, '/placeholder.svg?height=300&width=300', 'SSD001'),
('Mouse Gamer RGB', 'Mouse gamer com iluminação RGB', 89.90, 'Informática', 25, '/placeholder.svg?height=300&width=300', 'MOUSE001');
