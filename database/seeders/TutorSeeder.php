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
            ]
        );

        // Create tutors
        $tutors = [
            [
                'name' => 'Aiya Putri',
                'email' => 'aiya@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'tutor',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'tutor',
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'tutor',
            ],
        ];

        foreach ($tutors as $tutor) {
            User::firstOrCreate(
                ['email' => $tutor['email']],
                $tutor
            );
        }
    }
}
