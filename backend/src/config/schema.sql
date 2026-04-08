CREATE DATABASE IF NOT EXISTS budget_manager;
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE budget_manager;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT ,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('income', 'expense') NOT NULL,
    icon VARCHAR(10),
    user_id INT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
),

INSERT INTO categories (name, type, icon) VALUES
('Salaire','income','<U+1F4B0>'),
('Freelance','income','<U+1F4BB>'),
('Investissement','income','<U+1F4C8>'),
('Alimentation','expense','<U+1F6D2>'),
('Logement','expense','<U+1F3E0>'),
('Transport','expense','<U+1F697>'),
('Sante','expense','<U+1F3E5>'),
('Loisirs','expense','<U+1F3AE>');

CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    description VARCHAR(255),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);