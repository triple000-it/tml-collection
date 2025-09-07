# Multiple Categories Setup for DJs

## Overview
This guide will help you set up multiple categories for DJs, allowing the same DJ to appear in different categories (e.g., Armin van Buuren in both "mainstage" and "trance").

## Database Migration Required

### Step 1: Run SQL Migration
Execute this SQL in your Supabase SQL Editor:

```sql
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
```

### Step 2: Add Trance Category to Existing DJs
After running the SQL migration, run this script to add "trance" category to existing DJs:

```bash
node scripts/add-trance-category.js
```

## What This Accomplishes

### 1. **Multiple Categories per DJ**
- DJs can now have multiple categories (e.g., ["mainstage", "trance"])
- No duplicate DJ records needed
- Same DJ can appear in different category filters

### 2. **Available Categories**
- **mainstage**: Main stage DJs
- **trance**: Trance music DJs  
- **secondstage**: Second stage DJs
- **underground**: Underground DJs
- **special**: Special event DJs

### 3. **Admin Panel Features**
- Multi-select checkboxes for categories
- Easy to add/remove categories from DJs
- Visual display of all categories per DJ

### 4. **Example Use Cases**
- Armin van Buuren: ["mainstage", "trance"]
- Charlotte de Witte: ["mainstage", "underground"]
- Tiësto: ["mainstage", "trance", "special"]

## Next Steps After Migration

1. **Verify the migration worked** by checking a few DJ records
2. **Run the trance category script** to add trance to existing DJs
3. **Test the admin panel** to ensure category management works
4. **Update any existing DJs** that should have multiple categories

## Troubleshooting

If you encounter issues:
1. Check that the `categories` column exists and is of type `TEXT[]`
2. Verify that existing DJs have `categories` as an array, not a string
3. Ensure the admin panel shows checkboxes for category selection
4. Test adding/removing categories in the admin panel
