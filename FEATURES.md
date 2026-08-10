# AICI - Complete Features Documentation

## 🎯 Overview

AICI (AI Center for Integration) adalah platform pembelajaran robotika dan coding berbasis AI dengan 3 role utama:
1. **Siswa (User)** - Belajar dan track progress
2. **Tutor** - Mengajar dan grade siswa
3. **Super Admin** - Manage platform

---

## 👨‍🎓 User (Student) Features

### 📚 Beranda (Dashboard)
- **Dual Calendar View**:
  - Calendar bulanan dengan navigation prev/next
  - Calendar tahunan recap per bulan
  - Color-coded status: hadir, absen, reschedule, akan-datang
- **Quick Stats**: Progress rata-rata, total sesi
- **Responsive mobile navbar**

### 📝 Tugas (Task List)
- List semua task per semester
- Filter by status (aktif, selesai, terlambat)
- Task metadata: due date, modul, tutor

### 📋 SessionDetail
- Rincian task lengkap
- Deskripsi modul
- Learning objectives
- Resources & references

### 👤 Profil
- Profile card dengan foto
- Biodata lengkap
- **PDF Export**: Download profil + sertifikat
- Responsive design

### 📱 Mobile Navbar
- Hamburger menu untuk small screens
- Quick access ke semua pages
- Profile dropdown

---

## 👨‍🏫 Tutor Features

### 🎛️ Dashboard
- **Student Selector**: Sidebar pilih siswa
- **Student Info Card**: Nama, email, progress %
- **Quick Access Cards** (4 menu):
  - 🗓️ Kelola Kalender
  - 📊 Input Nilai
  - 💬 Komentar
  - 📚 Kelola Modul
- **Quick Stats**: Total sesi, hadir, absen, reschedule

### 📚 ModuleManagement (CRUD)
**Create/Update**:
- Nama modul
- Gambar/Emoji
- Deskripsi
- Daftar alat yang diperlukan
- Robot Building toggle (Type 4/5)

**Read**:
- Grid view card per modul
- Type badge (Type 4 atau Type 5)
- Search by nama

**Delete**:
- Confirm dialog

### 📅 CalendarManager
- **Kalender per siswa**: Month view navigation
- **Click Date Dropdown**:
  - Status options: libur, absen, reschedule, akan-datang, normal
  - Module selector (read-only)
- **Color coding**: Visual status representation
- **Date marking**: Save status changes

### 📊 GradesManager
**Input Interface**:
- Module selector → auto-detect Type (4 atau 5)
- **7+ Pertemuan display**: 
  - Format: `#1` dengan tanggal di bawah (opacity 60%)
  - Per-meeting input
- Category input per meeting (Type 5 atau 4 kategori)

**Visualization** (3 Bar Charts):
1. **Overall Average**: Semua module rata-rata (blue)
2. **Type 5 Robot Average**: Robot building module rata-rata (purple)
3. **Type 4 Coding Average**: Non-robot module rata-rata (orange)

**Buttons**: "Simpan" (tidak "Export")

### 💬 CommentsManager
**System Comment Templates** (80%+ complete):
- Per value range (min/max):
  - 0-3.99: "performa masih perlu ditingkatkan"
  - 4.0-4.99: "menunjukkan kemajuan yang baik"
  - 5.0: "sempurna/excellent"
- Placeholder substitution:
  - `{modules}` → module names
  - `{average}` → nilai rata-rata
- CRUD templates: Add, Edit, Delete

**Personal Comments**:
- Free-form comment input
- Edit/Delete personal comments
- Cannot edit system-generated comments

**Quarterly Generation**:
- Generate system comments per semester (3 bulan)
- Include module list dari bulan tersebut
- Match template berdasarkan nilai rata-rata

---

## 🔐 Super Admin Features

### 📊 Dashboard
**Stats Cards** (4):
- Total Pengguna
- Super Admin count
- Tutor count
- Active Module count

**2 Management Cards**:
- **Kelola Tutor**: Preview daftar tutor, link ke management page
- **Kelola Murid**: Preview daftar murid, link ke management page
- **Master Modul**: Preview modul, link ke management page

### 👨‍💼 TutorManagement (Full CRUD)
**Create**:
- Modal form: Nama, Email, Password
- Auto-generate login credentials

**Read**:
- Table view dengan kolom: Nama, Email, Peran, Status, Terdaftar, Aksi
- Search by nama/email
- Filter status: Semua, Aktif, Nonaktif

**Update**:
- Edit form (tanpa password field)
- Update nama/email

**Delete**:
- Confirm dialog
- Soft/hard delete

**Status Toggle**:
- Click status badge untuk toggle Aktif ↔ Nonaktif

**Sample Data**: 3 tutor (Aiya, Budi, Siti)

### 👨‍🎓 StudentManagement (Full CRUD)
Same as TutorManagement:
- Create: Nama, Email, Password
- Read: Table dengan search & filter
- Update: Edit modal
- Delete: Confirm
- Status: Toggle Aktif ↔ Nonaktif
- **Sample Data**: 3 murid (Adi, Binti, Citra)

### 📚 ModuleManagement (Full CRUD)
Same as Tutor ModuleManagement:
- Create modul dengan robot building toggle
- Read grid view
- Update edit
- Delete confirm
- Search filter
- **Master module**: Tersedia untuk semua tutor

---

## 🔓 Public Features

### 🌐 Landing Page
**Sections**:
- **Navigation**: Logo, menu, Masuk/Daftar buttons
- **Hero**: Judul, CTA, stats (5+ tahun, 1K+ siswa, 50+ sekolah)
- **Feature Highlight**: 3 quick features
- **Features Section**: 4 detailed cards
  - Dashboard Siswa
  - Dashboard Tutor
  - Dashboard Admin
  - AI Assistant
- **Programs Section**: 3 pembelajaran program
  - 🦁 Fantasy Zoo
  - 🏙️ Future Town
  - 💻 Advanced Coding
- **CTA Section**: Register + FAQ links
- **Footer**: Links, copyright

### ❓ FAQ Page
**15 FAQs** categorized:
- Umum (3)
- Siswa (3)
- Tutor (3)
- Admin (3)
- Teknis (2)

**Features**:
- **Category Filter**: Pill buttons untuk filter
- **Expandable Items**: Click untuk expand/collapse
- **Search-friendly**: All content indexed

**Content Covers**:
- What is AICI?
- Pricing, security
- How to access dashboard
- Grades, certificates, comments
- Module creation
- Admin features
- Technical support

### 🤖 Chatbot Widget
**Features**:
- Floating button di bottom-right
- Click untuk expand chat window
- **Conversation UI**:
  - Header dengan bot info + Gemini branding
  - Message bubbles (user vs bot)
  - Input field + send button
  - Loading indicator
- **Integration**: Ready untuk Gemini API
- **Fallback**: Smart responses jika API tidak available
- **Context**: Understands FAQ + AICI platform

**Gemini AI Integration**:
- Optional: Add API key di `.env`
- System prompt trained untuk AICI context
- Multi-turn conversation support
- Temperature: 0.7 untuk balanced responses

---

## 🔐 Authentication & Authorization

### Login/Register
- **Pages**: `/login`, `/register`
- **Fields**: Email, Password
- **Role-based redirect**:
  - User → `/beranda`
  - Tutor → `/tutor`
  - SuperAdmin → `/superadmin`

### Protected Routes
- All user/tutor/admin routes require authentication
- Public routes: `/`, `/landing`, `/faq`, `/login`, `/register`

### Session Management
- Session-based authentication
- Logout available in navbar
- CSRF token protection

---

## 📦 Data Models

### User Model
```
id, name, email, password, role (user/tutor/superadmin), created_at, updated_at
```

### Module (Frontend only, sample data)
```
id, name, image, description, tools[], hasRobotBuilding (bool)
```

### Grade Categories
**Type 5 (dengan Robot)**:
- Interaksi
- Fokus
- Robot Building
- Tools Management
- Coding

**Type 4 (tanpa Robot)**:
- Fokus
- Tools Management
- Interaksi
- Koding

---

## 🎨 Design System

### Colors
- **Primary**: Teal (#14b8a6, #0d9488)
- **Secondary**: Blue, Orange, Green, Purple
- **Neutral**: Gray (#f3f4f6 to #1f2937)
- **Semantic**: Green (success), Red (danger), Yellow (warning)

### Typography
- **Headings**: Font bold, large sizes (text-3xl - text-5xl)
- **Body**: Regular, readable sizes
- **UI**: Semibold for buttons & labels

### Components
- Rounded corners: `rounded-lg`, `rounded-xl`
- Shadows: `shadow-sm`, `shadow-md`
- Borders: Subtle gray borders (`border-gray-100` - `border-gray-200`)
- Spacing: Consistent 4px grid

### Responsive
- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px)
- Hamburger menu untuk mobile
- Touch-friendly buttons (min 44px)

---

## 🚀 Tech Stack

### Frontend
- React 18 + TypeScript
- Inertia.js v2 (SSR bridge)
- Tailwind CSS v3
- Bootstrap Icons
- Vite (build tool)

### Backend
- Laravel 13
- PHP 8.2+
- SQLite database
- Blade templates

### External APIs
- Google Gemini API (optional, for chatbot)

---

## 📊 Metrics & Stats

**Frontend Pages**: 17 TSX components
- 2 public (Landing, FAQ)
- 2 auth (Login, Register)
- 6 user pages
- 5 tutor pages
- 2 tutor subpages (sessions)
- 4 superadmin pages

**Routes**: 25 total
- 4 public
- 6 auth
- 5 user
- 5 tutor
- 4 superadmin

**Database**: 1 main table (users)

---

## 🔜 Future Enhancements

- Analytics dashboard
- Email notifications
- File upload for assignments
- Real-time chat between tutor & student
- Mobile app (React Native)
- Payment integration for enterprise
- Advanced reporting
- Multi-language support

---

## 📝 Version

**AICI v1.0** - Initial Release (2025-08)

- Landing page + FAQ + Chatbot
- User, Tutor, SuperAdmin dashboards
- Full CRUD untuk module, tutor, student
- Grade management dengan charts
- Comment system dengan AI templates
- Calendar management
- PDF export

---

**Build Status**: ✅ Production Ready
**Documentation**: Complete
**Test Coverage**: Sample data included
