# AICI Learning Management System - Installation Guide

## Prerequisites

- PHP 8.2+
- Node.js 18+
- SQLite (built-in with Laravel)
- Composer
- npm

## Installation Steps

### 1. Clone Repository

```bash
cd c:\laragon\www
git clone <repository-url> project_aici
cd project_aici
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Setup Environment

```bash
# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate
```

### 4. Database Setup

```bash
# Run migrations and seed database
php artisan migrate:fresh --seed
```

This will create:
- **Super Admin Account**: `admin@aici.id` / `admin123`
- **Tutor Accounts** (3):
  - `aiya@aici.id` / `password123`
  - `budi@aici.id` / `password123`
  - `siti@aici.id` / `password123`
- **Student Sample Data** (3 in StudentManagement)

### 5. Build Frontend

```bash
# Development mode (watch)
npm run dev

# Production build
npm run build
```

### 6. Start Development Server

```bash
# Laravel development server (port 8000)
php artisan serve

# In another terminal, run npm dev for Vite
npm run dev
```

### 7. Access Application

- **Landing Page**: http://localhost:8000
- **FAQ**: http://localhost:8000/faq
- **Login**: http://localhost:8000/login

## Gemini AI Chatbot Setup

### Optional: Enable Gemini API for Chatbot

1. **Get API Key**:
   - Go to [Google AI Studio](https://ai.google.dev/)
   - Create a new API key
   - Copy the API key

2. **Configure Environment**:
   - Open `.env` file
   - Add: `VITE_GEMINI_API_KEY=your_api_key_here`
   - Restart npm dev server

3. **Test Chatbot**:
   - Go to FAQ page (`/faq`)
   - Open chatbot widget (bottom-right)
   - Ask a question

**Without API Key**: Chatbot will use fallback responses (still functional)

## Project Structure

```
resources/
├── js/
│   ├── Pages/
│   │   ├── Landing.tsx           # Landing page
│   │   ├── FAQ.tsx               # FAQ + chatbot
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── User/                 # Student pages
│   │   │   ├── Beranda.tsx
│   │   │   ├── Tugas.tsx
│   │   │   ├── SessionDetail.tsx
│   │   │   ├── Profil.tsx
│   │   │   └── ProfilPDF.tsx
│   │   ├── Tutor/                # Tutor pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ModuleManagement.tsx
│   │   │   ├── CalendarManager.tsx
│   │   │   ├── GradesManager.tsx
│   │   │   └── CommentsManager.tsx
│   │   └── SuperAdmin/           # Admin pages
│   │       ├── Dashboard.tsx
│   │       ├── TutorManagement.tsx
│   │       ├── StudentManagement.tsx
│   │       └── ModuleManagement.tsx
│   └── lib/
│       └── gemini.ts             # Gemini API service
├── views/
└── css/
    └── app.css
```

## Routes Overview

### Public Routes
- `GET /` → Redirect to `/landing`
- `GET /landing` → Landing page
- `GET /faq` → FAQ page with chatbot
- `GET /login` → Login page
- `GET /register` → Register page

### User Routes
- `GET /beranda` → Dashboard
- `GET /tugas` → Task list
- `GET /tugas/{id}` → Task detail
- `GET /profil` → Profile
- `GET /profil/pdf` → PDF export

### Tutor Routes
- `GET /tutor` → Dashboard
- `GET /tutor/modules` → Module management
- `GET /tutor/calendar/{studentId}` → Calendar manager
- `GET /tutor/grades/{studentId}` → Grades manager
- `GET /tutor/comments/{studentId}` → Comments manager

### SuperAdmin Routes
- `GET /superadmin` → Dashboard
- `GET /superadmin/tutors` → Tutor management
- `GET /superadmin/students` → Student management
- `GET /superadmin/modules` → Module management

## Features

### User (Student)
✅ Beranda with dual calendars (month/year view)
✅ Task list with details
✅ Profile with PDF export
✅ Responsive mobile navbar

### Tutor
✅ Dashboard with student selector
✅ Module management (CRUD)
✅ Calendar manager with status marking
✅ Grades manager with 7+ pertemuan, 3 bar charts
✅ Comments manager with system templates + personal comments

### SuperAdmin
✅ Dashboard with stats
✅ Tutor management (CRUD)
✅ Student management (CRUD)
✅ Module management (CRUD)

### Public
✅ Landing page
✅ FAQ (15 questions)
✅ Chatbot with Gemini AI integration

## Database

### Tables
- `users` - All user accounts (role: user, tutor, superadmin)
- Auto-created from migrations

### Seed Data
Run `php artisan migrate:fresh --seed` to populate:
- 1 Super Admin
- 3 Tutors
- 3 Sample Students (for StudentManagement UI)

## Authentication

- **Login/Register**: Email + password based
- **Role-based redirect**: User → `/beranda`, Tutor → `/tutor`, Admin → `/superadmin`
- **Logout**: Available in navbar for authenticated users

## Technology Stack

- **Backend**: Laravel 13
- **Frontend**: React 18 + TypeScript
- **UI**: Tailwind CSS v3 + Bootstrap Icons
- **Database**: SQLite
- **API**: Inertia.js v2
- **AI**: Google Gemini API (optional)

## Troubleshooting

### Build Error
```bash
npm run build
```
If error, try:
```bash
npm install
npm run build
```

### Database Error
```bash
php artisan migrate:fresh --seed
```

### Port Already in Use
```bash
# Use different port
php artisan serve --port=8001
```

### Gemini API Not Working
- Check `.env` has `VITE_GEMINI_API_KEY`
- Verify API key is valid
- Chatbot will fallback to basic responses if API unavailable

## Support

For issues or questions:
1. Check FAQ page (`/faq`)
2. Use chatbot widget on FAQ page
3. Contact support@aici.id

## License

© 2025 AICI. All rights reserved.
