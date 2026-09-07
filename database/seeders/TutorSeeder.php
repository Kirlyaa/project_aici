<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TutorSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        User::firstOrCreate(
            ['email' => 'admin@aici.id'],
            [
                'name' => 'Faris Sukirman',
                'email' => 'admin@aici.id',
                'password' => Hash::make('admin123'),
                'role' => 'superadmin',
                'status' => 'aktif',
            ]
        );

        // Create tutors
        $tutors = [
            [
                'name' => 'Aiya Putri',
                'email' => 'aiya@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'tutor',
                'status' => 'aktif',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'tutor',
                'status' => 'aktif',
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'tutor',
                'status' => 'aktif',
            ],
        ];

        foreach ($tutors as $tutor) {
            User::firstOrCreate(
                ['email' => $tutor['email']],
                $tutor
            );
        }

        // Create a student (Aira)
        User::firstOrCreate(
            ['email' => 'aira@aici.id'],
            [
                'name' => 'Aira Student',
                'email' => 'aira@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'status' => 'aktif',
            ]
        );

        // Create another student (Faris)
        User::firstOrCreate(
            ['email' => 'student@aici.id'],
            [
                'name' => 'Faris Student',
                'email' => 'student@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'status' => 'aktif',
            ]
        );

        // Assign students to Aiya tutor
        $aiya = User::where('email', 'aiya@aici.id')->first();
        if ($aiya) {
            $aira = User::where('email', 'aira@aici.id')->first();
            if ($aira) {
                $aira->update(['tutor_id' => $aiya->id]);
            }
            
            $faris = User::where('email', 'student@aici.id')->first();
            if ($faris) {
                $faris->update(['tutor_id' => $aiya->id]);
            }
        }
    }
}
