-- =============================================
-- ÁREA FINANCEIRA EMPODHERA - FASE 1A: ENUMS
-- =============================================

-- 1. ADICIONAR NOVOS ROLES AO ENUM EXISTENTE
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'financeiro';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'viewer';