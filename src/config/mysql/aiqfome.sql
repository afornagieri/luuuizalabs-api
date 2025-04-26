-- Cria o database e seleciona
CREATE DATABASE IF NOT EXISTS aiqfome;
USE aiqfome;

-- Cria a tabela customers
CREATE TABLE IF NOT EXISTS customers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  favorite_products JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insere clientes de exemplo
INSERT INTO customers (name, email, favorite_products) VALUES
  ('Artur Silva', 'artur.silva@example.com', '[]'),
  ('Maria Oliveira', 'maria.oliveira@example.com', '[1,2,3,4,5,6]');

-- Retorna os dados adicionados na tabela
SELECT
  id,
  name,
  email,
  favorite_products
FROM customers;
