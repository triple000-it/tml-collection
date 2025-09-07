# Adding Category Column to DJs Table

## Overview
To ensure all 25 DJs have the category "mainstage", we need to add a `category` column to the `djs` table in the Supabase database.

## Manual Steps Required

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the **Table Editor**
3. Find and select the **`djs`** table

### 2. Add Category Column
1. Click the **"Add Column"** button (usually at the top right of the table)
2. Fill in the column details:
   - **Column name**: `category`
   - **Column type**: `text`
   - **Default value**: `mainstage`
   - **Allow nullable**: No (unchecked)
3. Click **"Save"** to create the column

### 3. Verify the Column
After adding the column, all existing DJs should automatically have the category set to "mainstage" due to the default value.

### 4. Run the Update Script
Once the column is added, run the update script to ensure all DJs have the correct category:

```bash
node scripts/update-dj-categories.js
```

## Alternative: SQL Command
If you have access to the Supabase SQL editor, you can run this command directly:

```sql
ALTER TABLE djs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'mainstage';
```

## What This Accomplishes
- Adds a `category` field to all DJ records
- Sets the default category to "mainstage" for all existing DJs
- Allows future DJs to be categorized (mainstage, secondstage, underground, special)
- Enables filtering and organization by category in the admin panel

## Next Steps
After adding the column:
1. The admin panel will show the category field in DJ forms
2. All 25 existing DJs will have category "mainstage"
3. New DJs can be assigned different categories as needed
4. The application will be able to filter and display DJs by category
