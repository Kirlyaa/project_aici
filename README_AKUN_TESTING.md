# AICI - Akun Testing & Dokumentasi

## 📋 Akun Tutor (Sudah Tersedia)

Semua akun tutor sudah dibuat otomatis melalui seeder. Password untuk semua akun adalah: `password123`

### Akun Tutor 1
- **Nama**: Aiya Putri
- **Email**: aiya@aici.id
- **Password**: password123
- **Role**: Tutor
- **Murid**: 5 orang

### Akun Tutor 2
- **Nama**: Budi Santoso
- **Email**: budi@aici.id
- **Password**: password123
- **Role**: Tutor
- **Murid**: 4 orang

### Akun Tutor 3
- **Nama**: Siti Nurhaliza
- **Email**: siti@aici.id
- **Password**: password123
- **Role**: Tutor
- **Murid**: 6 orang

---

## 🔧 Cara Menjalankan Aplikasi

### 1. Setup Database
```bash
php artisan migrate:refresh --seed
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Jalankan Aplikasi
- Pastikan server Laravel sudah berjalan di Laragon
- Akses aplikasi di: `http://localhost/project_aici`
- Login ke halaman: `http://localhost/project_aici/login`

---

## 📱 Pages & Fitur

### **User Pages** (Murid)
- `/beranda` - Tampilan kalender + daftar sesi (bulanan & tahunan)
- `/tugas` - Daftar tugas/session dengan filter
- `/tugas/{id}` - Detail session (bisa edit jika belum dimulai)
- `/profil` - Profil murid + riwayat + export PDF

### **Tutor Pages**
- `/tutor` - Dashboard tutor dengan student selector
- `/tutor/calendar/{id}` - Kelola kalender murid (libur/absen/reschedule/akan-datang)
- `/tutor/grades/{id}` - Input nilai per modul (type 4 atau 5)
- `/tutor/comments/{id}` - Kelola komentar per semester

### **Super Admin Pages**
- `/superadmin` - Dashboard dengan statistik
- `/superadmin/tutors` - Kelola data tutor (CRUD)

### **Auth Pages**
- `/login` - Halaman login
- `/register` - Halaman registrasi

---

## 🎨 Tema & Design

- **Primary Color**: Teal (#0d9488)
- **Secondary Colors**: Blue, Orange, Green, Red
- **Icon Library**: Bootstrap Icons (bi-*)
- **Framework**: Tailwind CSS v3
- **Component Library**: React 18 + TypeScript

---

## 💾 Struktur Database

### Users Table
- `id` - Primary Key
- `name` - Nama pengguna
- `email` - Email unik
- `password` - Password (hashed)
- `role` - Enum: 'user', 'tutor', 'superadmin'
- `created_at`, `updated_at`

---

## 🚀 Perintah Artisan

```bash
# Reset database & jalankan seeder
php artisan migrate:refresh --seed

# Hanya jalankan seeder
php artisan db:seed --class=TutorSeeder

# Build frontend
npm run build

# Dev mode frontend
npm run dev
```

---

## ✅ Test Checklist

- [x] Seeder tutor berjalan otomatis
- [x] Login page dengan validasi
- [x] Register page dengan validasi
- [x] Dashboard tutor dengan student selector
- [x] Calendar manager dengan status marking
- [x] Grades manager dengan type 4 dan 5
- [x] Comments manager per semester
- [x] Super Admin dashboard & tutor management
- [x] Responsive design (mobile, tablet, desktop)
- [x] Bootstrap Icons terintegrasi

---

## 📝 Catatan

- Semua form sudah menggunakan validasi client & server-side
- Styling menggunakan Tailwind CSS utility classes
- Icons menggunakan Bootstrap Icons (CDN)
- Database session untuk tracking user login
- CSRF protection aktif di semua form

---

Selamat testing! 🎉
