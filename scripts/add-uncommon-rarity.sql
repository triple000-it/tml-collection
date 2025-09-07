-- Add UNCOMMON rarity to the database constraint
-- This script updates the rarity check constraint to include UNCOMMON as a valid value

-- First, drop the existing constraint
ALTER TABLE djs DROP CONSTRAINT IF EXISTS djs_rarity_check;

-- Add the new constraint with UNCOMMON included
ALTER TABLE djs ADD CONSTRAINT djs_rarity_check 
CHECK (rarity IN ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'));

-- Verify the constraint was added correctly
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'djs'::regclass 
AND conname = 'djs_rarity_check';
