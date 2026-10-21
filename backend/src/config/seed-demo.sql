-- Données de démonstration : 3 mois de transactions (août → octobre 2026)
-- Prérequis : la base existe (schema.sql) et le compte ci-dessous a été créé via la page d'inscription.
-- Windows (depuis le dossier backend) :
--   C:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 -e "source src/config/seed-demo.sql"
-- Attention : relancer le script ajoute les transactions une seconde fois.

SET NAMES utf8mb4;
USE budget_manager;

-- Email du compte qui recevra les données
SET @email = 'zack@gmail.com';

START TRANSACTION;
SET @uid = (SELECT id FROM users WHERE email = @email COLLATE utf8mb4_unicode_ci);
INSERT INTO transactions (user_id, category_id, amount, type, description, date) VALUES
-- Août 2026
(@uid, 1, 1450.00, 'income',  'Salaire alternance', '2026-08-01'),
(@uid, 5,  520.00, 'expense', 'Loyer', '2026-08-03'),
(@uid, 6,   34.70, 'expense', 'Abonnement TAM', '2026-08-04'),
(@uid, 4,   68.40, 'expense', 'Courses Carrefour', '2026-08-06'),
(@uid, 8,   12.99, 'expense', 'Netflix', '2026-08-08'),
(@uid, 4,   23.50, 'expense', 'Restaurant', '2026-08-12'),
(@uid, 2,  250.00, 'income',  'Site vitrine client', '2026-08-15'),
(@uid, 4,   54.80, 'expense', 'Courses Lidl', '2026-08-19'),
(@uid, 7,   25.00, 'expense', 'Médecin généraliste', '2026-08-22'),
(@uid, 8,   45.00, 'expense', 'Concert', '2026-08-27'),
-- Septembre 2026
(@uid, 1, 1450.00, 'income',  'Salaire alternance', '2026-09-01'),
(@uid, 5,  520.00, 'expense', 'Loyer', '2026-09-03'),
(@uid, 6,   34.70, 'expense', 'Abonnement TAM', '2026-09-04'),
(@uid, 4,   72.15, 'expense', 'Courses Carrefour', '2026-09-07'),
(@uid, 5,   45.90, 'expense', 'Électricité EDF', '2026-09-10'),
(@uid, 8,   12.99, 'expense', 'Netflix', '2026-09-08'),
(@uid, 3,   38.20, 'income',  'Dividendes ETF', '2026-09-15'),
(@uid, 4,   61.30, 'expense', 'Courses Lidl', '2026-09-18'),
(@uid, 6,   58.00, 'expense', 'Plein d''essence', '2026-09-21'),
(@uid, 8,   29.99, 'expense', 'Jeu vidéo', '2026-09-26'),
-- Octobre 2026
(@uid, 1, 1450.00, 'income',  'Salaire alternance', '2026-10-01'),
(@uid, 5,  520.00, 'expense', 'Loyer', '2026-10-03'),
(@uid, 6,   34.70, 'expense', 'Abonnement TAM', '2026-10-04'),
(@uid, 4,   66.75, 'expense', 'Courses Carrefour', '2026-10-05'),
(@uid, 8,   12.99, 'expense', 'Netflix', '2026-10-08'),
(@uid, 2,  180.00, 'income',  'Maintenance site client', '2026-10-10'),
(@uid, 7,   18.40, 'expense', 'Pharmacie', '2026-10-13'),
(@uid, 4,   49.90, 'expense', 'Courses Lidl', '2026-10-16'),
(@uid, 8,   35.00, 'expense', 'Sortie cinéma + resto', '2026-10-18');
COMMIT;
