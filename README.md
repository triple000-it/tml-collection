# TML Collect - Tomorrowland DJ Card Collection App

A premium, modern collectible card app focused on DJs who have played at Tomorrowland. Built with Next.js 15, Supabase, and Capacitor.js for a seamless cross-platform experience with a stunning dark Tomorrowland aesthetic.

## 🎵 Features

- **Universal Compatibility**: Works on Web, iOS, and Android from a single codebase
- **Dynamic Card Generation**: Interactive DJ cards with flip animations
- **Rarity System**: 4-tier rarity system (Common, Rare, Epic, Legendary)
- **Admin Interface**: Upload and manage DJ images
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Tomorrowland Branding**: Authentic visual identity and color scheme

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS + Modern Animations
- **Database**: Supabase (PostgreSQL) with real-time features
- **Authentication**: Supabase Auth
- **Native**: Capacitor.js for iOS/Android packaging
- **Scraping**: Python (Scrapy/BeautifulSoup/Playwright)
- **Styling**: Custom Tomorrowland dark theme with premium animations

## 📁 Project Structure

```
tml-collection/
├── app/                    # Next.js App Router
├── components/             # React components
├── backend/               # Express.js API server
├── scraper/               # Python scraping system
├── database/              # PostgreSQL schema
├── public/                # Static assets
└── capacitor.config.ts    # Capacitor configuration
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Install all dependencies
npm run setup

# Or install manually:
npm install
cd backend && npm install
cd ../scraper && pip install -r requirements.txt
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Run the SQL schema from `database/schema.sql` in the Supabase SQL editor

### 3. Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ngquunzrscytljlzufpu.supabase.co:5432/postgres
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Application

```bash
# Start Next.js frontend
npm run dev

# Start backend API (in another terminal)
npm run backend

# Run scraper (optional)
npm run scraper
```

## 📱 Native App Development

### iOS Setup
```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

### Android Setup
```bash
npx cap add android
npx cap sync android
npx cap open android
```

## 🎯 Rarity System

DJs are categorized by rarity based on their Tomorrowland performance history:

- **Legendary** (3%): 10+ appearances, major recognition
- **Epic** (12%): 5-9 appearances, established artists
- **Rare** (25%): 2-4 appearances, rising talents
- **Common** (60%): 1 appearance, newcomers

## 🔧 API Endpoints

### DJs
- `GET /api/djs` - Get all DJs
- `GET /api/djs/:id` - Get specific DJ
- `POST /api/djs` - Create new DJ (admin)

### Admin
- `POST /api/admin/upload-dj-image` - Upload DJ image
- `DELETE /api/admin/dj-image/:id` - Delete DJ image
- `GET /api/admin/stats` - Get admin statistics

### Users
- `GET /api/users/:id/collection` - Get user's collection
- `POST /api/users/:id/card` - Add card to collection

## 🎨 Customization

### Colors
The app uses Tomorrowland's official color palette defined in `tailwind.config.js`:
- Primary: `tml-purple`, `tml-magenta`
- Accents: `tml-blue`, `tml-teal`, `tml-gold`
- Dark theme: `tml-dark-*` variants

### Components
- `DjCard.tsx` - Main card component with flip animation
- `RarityBadge.tsx` - Rarity indicator
- `CollectionGrid.tsx` - Collection display

## 📊 Scraping System

The Python scraper extracts DJ data from:
- Tomorrowland.com official website
- Beatstats.com performance data
- 1001tracklists.com set information

Features:
- Automatic image downloading
- Rarity calculation
- Performance history tracking
- Data validation and cleaning

## 🚀 Deployment

### Web Deployment
```bash
npm run build
npm run start
```

### Native App Store
1. Build the web app: `npm run build`
2. Sync with Capacitor: `npx cap sync`
3. Build native apps in Xcode/Android Studio
4. Submit to App Store/Google Play

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email support@tmlcollect.com or create an issue on GitHub.

---

**Note**: This is a fan-made project and is not affiliated with Tomorrowland or ID&T.