-- SQL script to migrate DJs to new Tomorrowland stage categories
-- Run this in your Supabase SQL Editor

-- Step 1: Add new categories column as text array (if not exists)
ALTER TABLE djs ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT ARRAY['mainstage'];

-- Step 2: Migrate existing category data to categories array (if old category column exists)
UPDATE djs 
SET categories = ARRAY[category] 
WHERE category IS NOT NULL AND categories IS NULL;

-- Step 3: Set default for any null categories
UPDATE djs 
SET categories = ARRAY['mainstage'] 
WHERE categories IS NULL;

-- Step 4: Make categories column NOT NULL
ALTER TABLE djs ALTER COLUMN categories SET NOT NULL;

-- Step 5: Update DJs to new Tomorrowland stage categories based on their genres and style
-- Mainstage DJs (Big Room, Progressive House, Electro House, Future Rave)
UPDATE djs 
SET categories = ARRAY['mainstage']
WHERE genres && ARRAY['Big Room', 'Progressive House', 'Electro House', 'Future Rave', 'Big Room House']
   OR stage_name ILIKE '%Martin Garrix%'
   OR stage_name ILIKE '%Dimitri Vegas%'
   OR stage_name ILIKE '%Hardwell%'
   OR stage_name ILIKE '%Afrojack%'
   OR stage_name ILIKE '%David Guetta%'
   OR stage_name ILIKE '%Tiësto%'
   OR stage_name ILIKE '%Steve Aoki%'
   OR stage_name ILIKE '%The Chainsmokers%'
   OR stage_name ILIKE '%Alesso%'
   OR stage_name ILIKE '%Nicky Romero%'
   OR stage_name ILIKE '%W&W%'
   OR stage_name ILIKE '%KSHMR%'
   OR stage_name ILIKE '%Quintino%'
   OR stage_name ILIKE '%DVBBS%'
   OR stage_name ILIKE '%Danny Avila%'
   OR stage_name ILIKE '%Axwell%'
   OR stage_name ILIKE '%Swedish House Mafia%'
   OR stage_name ILIKE '%Timmy Trumpet%'
   OR stage_name ILIKE '%Steve Angello%'
   OR stage_name ILIKE '%Sebastian Ingrosso%';

-- ASOT (Trance) DJs - Add trance category to existing mainstage DJs
UPDATE djs 
SET categories = ARRAY['mainstage', 'asot']
WHERE (genres && ARRAY['Trance', 'Uplifting Trance', 'Psytrance', 'Progressive Trance', 'Vocal Trance']
   OR stage_name ILIKE '%Armin van Buuren%'
   OR stage_name ILIKE '%Above & Beyond%'
   OR stage_name ILIKE '%Paul van Dyk%'
   OR stage_name ILIKE '%Ferry Corsten%'
   OR stage_name ILIKE '%Gareth Emery%'
   OR stage_name ILIKE '%Aly & Fila%'
   OR stage_name ILIKE '%John O''Callaghan%'
   OR stage_name ILIKE '%Markus Schulz%'
   OR stage_name ILIKE '%Cosmic Gate%'
   OR stage_name ILIKE '%ATB%'
   OR stage_name ILIKE '%Rank 1%'
   OR stage_name ILIKE '%Dash Berlin%'
   OR stage_name ILIKE '%Andrew Rayel%'
   OR stage_name ILIKE '%Giuseppe Ottaviani%'
   OR stage_name ILIKE '%Solarstone%'
   OR stage_name ILIKE '%Roger Shah%'
   OR stage_name ILIKE '%Jorn van Deynhoven%')
   AND 'mainstage' = ANY(categories);

-- Core (Techno) DJs
UPDATE djs 
SET categories = ARRAY['core']
WHERE genres && ARRAY['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno', 'Minimal Techno', 'Deep Techno']
   OR stage_name ILIKE '%Charlotte de Witte%'
   OR stage_name ILIKE '%Amelie Lens%'
   OR stage_name ILIKE '%Nina Kraviz%'
   OR stage_name ILIKE '%Adam Beyer%'
   OR stage_name ILIKE '%Carl Cox%'
   OR stage_name ILIKE '%Richie Hawtin%'
   OR stage_name ILIKE '%Maceo Plex%'
   OR stage_name ILIKE '%Pan-Pot%'
   OR stage_name ILIKE '%Charlotte de Witte%'
   OR stage_name ILIKE '%Amelie Lens%'
   OR stage_name ILIKE '%Nina Kraviz%'
   OR stage_name ILIKE '%Adam Beyer%'
   OR stage_name ILIKE '%Carl Cox%'
   OR stage_name ILIKE '%Richie Hawtin%'
   OR stage_name ILIKE '%Maceo Plex%'
   OR stage_name ILIKE '%Pan-Pot%';

-- Q-Dance (Hardstyle) DJs
UPDATE djs 
SET categories = ARRAY['qdance']
WHERE genres && ARRAY['Hardstyle', 'Hardcore', 'Rawstyle', 'Euphoric Hardstyle', 'Frenchcore', 'Jumpstyle']
   OR stage_name ILIKE '%Headhunterz%'
   OR stage_name ILIKE '%Wildstylez%'
   OR stage_name ILIKE '%Brennan Heart%'
   OR stage_name ILIKE '%Coone%'
   OR stage_name ILIKE '%Da Tweekaz%'
   OR stage_name ILIKE '%Sub Zero Project%'
   OR stage_name ILIKE '%D-Block & S-te-Fan%'
   OR stage_name ILIKE '%Noisecontrollers%'
   OR stage_name ILIKE '%Frontliner%'
   OR stage_name ILIKE '%Wildstylez%'
   OR stage_name ILIKE '%Brennan Heart%'
   OR stage_name ILIKE '%Coone%'
   OR stage_name ILIKE '%Da Tweekaz%'
   OR stage_name ILIKE '%Sub Zero Project%'
   OR stage_name ILIKE '%D-Block & S-te-Fan%'
   OR stage_name ILIKE '%Noisecontrollers%'
   OR stage_name ILIKE '%Frontliner%';

-- Elixir (House) DJs
UPDATE djs 
SET categories = ARRAY['elixir']
WHERE genres && ARRAY['House', 'Deep House', 'Tech House', 'Future House', 'Progressive House', 'Minimal House', 'Disco House']
   OR stage_name ILIKE '%Don Diablo%'
   OR stage_name ILIKE '%Oliver Heldens%'
   OR stage_name ILIKE '%Tchami%'
   OR stage_name ILIKE '%Malaa%'
   OR stage_name ILIKE '%Fisher%'
   OR stage_name ILIKE '%Chris Lake%'
   OR stage_name ILIKE '%Claude VonStroke%'
   OR stage_name ILIKE '%Green Velvet%'
   OR stage_name ILIKE '%Hot Since 82%'
   OR stage_name ILIKE '%Pete Tong%'
   OR stage_name ILIKE '%Eats Everything%'
   OR stage_name ILIKE '%Honey Dijon%'
   OR stage_name ILIKE '%The Martinez Brothers%'
   OR stage_name ILIKE '%Solomun%'
   OR stage_name ILIKE '%Dixon%'
   OR stage_name ILIKE '%Ame%';

-- Live Act DJs (Special performances, live instruments, unique shows)
UPDATE djs 
SET categories = ARRAY['liveact']
WHERE stage_name ILIKE '%Pendulum%'
   OR stage_name ILIKE '%Netsky%'
   OR stage_name ILIKE '%Rudimental%'
   OR stage_name ILIKE '%Chase & Status%'
   OR stage_name ILIKE '%Sub Focus%'
   OR stage_name ILIKE '%Dimension%'
   OR stage_name ILIKE '%Culture Shock%'
   OR stage_name ILIKE '%Metrik%'
   OR stage_name ILIKE '%Wilkinson%'
   OR stage_name ILIKE '%High Contrast%'
   OR stage_name ILIKE '%London Elektricity%'
   OR stage_name ILIKE '%Netsky%'
   OR stage_name ILIKE '%Rudimental%'
   OR stage_name ILIKE '%Chase & Status%'
   OR stage_name ILIKE '%Sub Focus%'
   OR stage_name ILIKE '%Dimension%'
   OR stage_name ILIKE '%Culture Shock%'
   OR stage_name ILIKE '%Metrik%'
   OR stage_name ILIKE '%Wilkinson%'
   OR stage_name ILIKE '%High Contrast%'
   OR stage_name ILIKE '%London Elektricity%';

-- Step 6: (Optional) Drop the old category column after verification
-- ALTER TABLE djs DROP COLUMN IF EXISTS category;

-- Step 7: Verify the migration
SELECT 
  stage_name,
  categories,
  genres
FROM djs 
WHERE is_active = true
ORDER BY stage_name;
