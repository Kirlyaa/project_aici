<?php

namespace Database\Seeders;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClassroomSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat 3 Kelas dengan foto & deskripsi
        $classA = Classroom::updateOrCreate(
            ['name' => 'Robotics Explorer A'],
            [
                'photo' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
                'description' => 'Kelas pengenalan mekanika robotika dan sensorik dasar untuk pemula.',
            ]
        );

        $classB = Classroom::updateOrCreate(
            ['name' => 'Coding Master B'],
            [
                'photo' => 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60',
                'description' => 'Kelas algoritma logika pemrograman dan visual block coding interaktif.',
            ]
        );

        $classC = Classroom::updateOrCreate(
            ['name' => 'AI Innovator C'],
            [
                'photo' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
                'description' => 'Kelas eksperimen kecerdasan buatan, IoT, dan otomatisasi robot terintegrasi.',
            ]
        );

        // Ambil tutor spesifik
        $tutorAiya = User::where('email', 'aiya@aici.id')->first();
        $tutorBudi = User::where('email', 'budi@aici.id')->first();
        $tutorSiti = User::where('email', 'siti@aici.id')->first();

        $tutorAiyaId = $tutorAiya?->id;
        $tutorBudiId = $tutorBudi?->id ?? $tutorAiyaId;
        $tutorSitiId = $tutorSiti?->id ?? $tutorAiyaId;

        // Hubungkan Aira ke Kelas A (Tutor Aiya)
        User::where('email', 'aira@aici.id')->update([
            'classroom_id' => $classA->id,
            'class' => $classA->name,
            'tutor_id' => $tutorAiyaId,
        ]);

        // Hubungkan Faris ke Kelas B (Tutor Budi)
        User::where('email', 'student@aici.id')->update([
            'classroom_id' => $classB->id,
            'class' => $classB->name,
            'tutor_id' => $tutorBudiId,
        ]);

        // Data 3 murid untuk Kelas A
        $studentsClassA = [
            ['name' => 'Aditya Pratama', 'email' => 'aditya.a@aici.id'],
            ['name' => 'Bella Safitri', 'email' => 'bella.a@aici.id'],
            ['name' => 'Cahya Ramadhan', 'email' => 'cahya.a@aici.id'],
        ];

        foreach ($studentsClassA as $s) {
            User::updateOrCreate(
                ['email' => $s['email']],
                [
                    'name' => $s['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'user',
                    'status' => 'aktif',
                    'classroom_id' => $classA->id,
                    'class' => $classA->name,
                    'tutor_id' => $tutorAiyaId,
                ]
            );
        }

        // Data 3 murid untuk Kelas B
        $studentsClassB = [
            ['name' => 'Dimas Anggara', 'email' => 'dimas.b@aici.id'],
            ['name' => 'Evelyn Wijaya', 'email' => 'evelyn.b@aici.id'],
            ['name' => 'Fajar Santoso', 'email' => 'fajar.b@aici.id'],
        ];

        foreach ($studentsClassB as $s) {
            User::updateOrCreate(
                ['email' => $s['email']],
                [
                    'name' => $s['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'user',
                    'status' => 'aktif',
                    'classroom_id' => $classB->id,
                    'class' => $classB->name,
                    'tutor_id' => $tutorBudiId,
                ]
            );
        }

        // Data 3 murid untuk Kelas C
        $studentsClassC = [
            ['name' => 'Gilang Perkasa', 'email' => 'gilang.c@aici.id'],
            ['name' => 'Hana Kirana', 'email' => 'hana.c@aici.id'],
            ['name' => 'Indra Gunawan', 'email' => 'indra.c@aici.id'],
        ];

        foreach ($studentsClassC as $s) {
            User::updateOrCreate(
                ['email' => $s['email']],
                [
                    'name' => $s['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'user',
                    'status' => 'aktif',
                    'classroom_id' => $classC->id,
                    'class' => $classC->name,
                    'tutor_id' => $tutorSitiId,
                ]
            );
        }

        // Data 2 murid tanpa kelas
        $studentsWithoutClass = [
            ['name' => 'Kevin Alamsyah', 'email' => 'kevin.unassigned@aici.id'],
            ['name' => 'Lestari Putri', 'email' => 'lestari.unassigned@aici.id'],
        ];

        foreach ($studentsWithoutClass as $s) {
            User::updateOrCreate(
                ['email' => $s['email']],
                [
                    'name' => $s['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'user',
                    'status' => 'aktif',
                    'classroom_id' => null,
                    'class' => null,
                    'tutor_id' => $tutorAiyaId,
                ]
            );
        }
    }
}
