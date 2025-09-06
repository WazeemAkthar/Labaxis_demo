# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LabLite LIMS is a Next.js-based Laboratory Information Management System built with:
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS v4.1.9 with shadcn/ui components
- **State Management**: localStorage-based persistence via DataManager singleton
- **Package Manager**: pnpm (evidenced by pnpm-lock.yaml)

## Common Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build production bundle
pnpm start        # Start production server
pnpm lint         # Run ESLint (currently configured to ignore errors during builds)
```

## Architecture Overview

### Core Structure
- **App Router**: Uses Next.js 13+ app directory structure
- **Data Management**: Centralized through `lib/data-manager.ts` - a singleton class managing localStorage persistence
- **UI Components**: Built on Radix UI primitives with shadcn/ui styling in `components/ui/`
- **Layout**: Responsive dashboard layout with mobile sidebar in `components/dashboard-layout.tsx`

### Data Models
The application manages four main entities through the DataManager:
- **Patients**: Patient records with demographic and medical info
- **Invoices**: Billing with line items and tax calculations  
- **Reports**: Lab test results linked to patients and invoices
- **Test Catalog**: Available lab tests with pricing and reference ranges

### Key Files
- `lib/data-manager.ts`: Central data management singleton with localStorage persistence
- `components/dashboard-layout.tsx`: Main dashboard layout with navigation
- `app/*/page.tsx`: Route pages following Next.js App Router conventions
- `data/mockData.json` & `data/testCatalog.json`: Sample data files

### Navigation Structure
- Dashboard (`/dashboard`) - Overview and metrics
- Patients (`/patients`) - Patient management with CRUD operations
- Invoices (`/invoices`) - Billing and invoice generation  
- Reports (`/reports`) - Lab test results and reporting
- Finance (`/finance`) - Financial overview
- Settings (`/settings`) - Application configuration

## Build Configuration

- ESLint and TypeScript errors are ignored during builds (configured in `next.config.mjs`)
- Images are unoptimized for static deployment
- Path aliases configured: `@/*` maps to project root
- Uses pnpm for dependency management

## Development Notes

- All data persists to localStorage through the DataManager singleton
- UI follows shadcn/ui component patterns with Radix primitives
- Authentication is basic localStorage-based (`lablite_auth` key)
- Generated IDs follow pattern: `{PREFIX}-{YYYYMMDD}-{sequence}`
- The app initializes with sample data if localStorage is empty