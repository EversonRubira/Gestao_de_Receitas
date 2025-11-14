-- Script para adicionar imagens às receitas existentes
-- Projeto PIS 2025/2026
-- IMAGENS GRATUITAS de Unsplash/Pexels (sem copyright)

USE gestao_receitas;

-- Atualizar Arroz de Tomate (ID 1)
UPDATE receitas
SET imagem = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800'
WHERE id = 1;

-- Atualizar Frango Assado com Batatas (ID 2)
UPDATE receitas
SET imagem = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800'
WHERE id = 2;

-- Atualizar Mousse de Chocolate (ID 3)
UPDATE receitas
SET imagem = 'https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=800'
WHERE id = 3;

-- Atualizar Sopa de Legumes (ID 4)
UPDATE receitas
SET imagem = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'
WHERE id = 4;

-- Verificar as atualizações
SELECT id, nome, imagem FROM receitas WHERE id IN (1,2,3,4);
