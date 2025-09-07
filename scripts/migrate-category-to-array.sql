-- SQL script to migrate category field to support multiple categories
-- Run this in your Supabase SQL Editor

-- Step 1: Add new categories column as text array
ALTER TABLE djs ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT ARRAY['mainstage'];

-- Step 2: Migrate existing category data to categories array
UPDATE djs 
SET categories = ARRAY[category] 
WHERE category IS NOT NULL AND categories IS NULL;

-- Step 3: Set default for any null categories
UPDATE djs 
SET categories = ARRAY['mainstage'] 
WHERE categories IS NULL;

-- Step 4: Make categories column NOT NULL
ALTER TABLE djs ALTER COLUMN categories SET NOT NULL;

-- Step 5: (Optional) Drop the old category column after verification
-- ALTER TABLE djs DROP COLUMN IF EXISTS category;
