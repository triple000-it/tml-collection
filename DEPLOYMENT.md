# 🚀 TML Collect - Vercel Deployment Guide

## 📋 Deployment Overview

This guide will help you deploy TML Collect to Vercel through GitHub with automated CI/CD.

## 🔧 Prerequisites

1. **GitHub Repository** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project** - Set up your Supabase project
4. **Environment Variables** - Prepare your environment variables

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your repository contains:
- ✅ `package.json` with all dependencies
- ✅ `next.config.ts` (already configured)
- ✅ `vercel.json` (already created)
- ✅ `.github/workflows/deploy.yml` (already created)
- ✅ All source code and components

### 2. Set Up Supabase

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Import Database Schema:**
   - Go to SQL Editor in Supabase
   - Import `database/complete_schema.sql`
   - Import `database/admin_setup.sql`

3. **Configure Authentication:**
   - Go to Authentication > Settings
   - Add your domain to "Site URL"
   - Configure email templates if needed

### 3. Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)

1. **Connect GitHub to Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `out` (for static export)
   - **Install Command:** `npm install`

3. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_APP_NAME=TML Collect
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option B: Manual Deployment with GitHub Actions

1. **Set up GitHub Secrets:**
   - Go to your GitHub repository
   - Settings > Secrets and variables > Actions
   - Add these secrets:
     ```
     VERCEL_TOKEN=your-vercel-token
     VERCEL_ORG_ID=your-org-id
     VERCEL_PROJECT_ID=your-project-id
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
     ```

2. **Get Vercel Credentials:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel login`
   - Run `vercel link` in your project
   - Get your org ID and project ID from `.vercel/project.json`

3. **Push to GitHub:**
   - Push your code to the main branch
   - GitHub Actions will automatically deploy to Vercel

### 4. Configure Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings > Domains
   - Add your custom domain
   - Configure DNS records

2. **Update Supabase:**
   - Add your custom domain to Supabase Auth settings
   - Update environment variables with new domain

## 🔐 Environment Variables

### Required Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### Optional Variables:
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=TML Collect
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

## 🛡️ Security Configuration

### Vercel Security Headers:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### Supabase Security:
- ✅ Row Level Security (RLS) enabled
- ✅ Authentication configured
- ✅ CORS settings configured

## 📊 Monitoring & Analytics

### Vercel Analytics:
- Built-in performance monitoring
- Real-time analytics
- Error tracking

### Supabase Monitoring:
- Database performance metrics
- Authentication logs
- API usage statistics

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically:
1. ✅ Checks out code
2. ✅ Installs dependencies
3. ✅ Runs linting
4. ✅ Builds the application
5. ✅ Deploys to Vercel

## 🚨 Troubleshooting

### Common Issues:

**Build Failures:**
- Check environment variables are set
- Verify Supabase connection
- Check for TypeScript errors

**Authentication Issues:**
- Verify Supabase URL and keys
- Check domain configuration in Supabase
- Ensure RLS policies are correct

**Deployment Issues:**
- Check Vercel logs
- Verify GitHub Actions secrets
- Check build command and output directory

### Debug Commands:
```bash
# Test build locally
npm run build

# Check environment variables
vercel env ls

# View deployment logs
vercel logs
```

## 📈 Performance Optimization

### Vercel Optimizations:
- ✅ Static export for fast loading
- ✅ Image optimization
- ✅ Automatic CDN distribution
- ✅ Edge functions support

### Next.js Optimizations:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Bundle optimization
- ✅ Font optimization

## 🎯 Post-Deployment Checklist

- [ ] Verify app loads correctly
- [ ] Test authentication flow
- [ ] Check all pages work
- [ ] Verify database connection
- [ ] Test user registration/login
- [ ] Check mobile responsiveness
- [ ] Verify security headers
- [ ] Test performance
- [ ] Set up monitoring
- [ ] Configure backups

## 🆘 Support

If you encounter issues:

1. **Check Vercel Logs:** Dashboard > Functions > View Function Logs
2. **Check Supabase Logs:** Dashboard > Logs
3. **GitHub Actions:** Check workflow runs for errors
4. **Environment Variables:** Verify all are set correctly

---

## 🎉 Deployment Complete!

Your TML Collect app is now live on Vercel with:
- ✅ Automated deployments from GitHub
- ✅ Production-ready configuration
- ✅ Security headers and policies
- ✅ Performance optimizations
- ✅ Monitoring and analytics

**Your app URL:** `https://your-project.vercel.app`

Happy collecting! 🎵✨
