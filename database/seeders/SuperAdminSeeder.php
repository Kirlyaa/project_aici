<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@aici.id'],
            [
                'name' => 'Super Admin AICI',
                'email' => 'admin@aici.id',
                'password' => Hash::make('admin123'),
                'role' => 'superadmin',
                'status' => 'aktif',
            ]
        );
    }
}
