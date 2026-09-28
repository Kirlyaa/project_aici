<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class BookModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buku Cover 1: Robot Building
        $robotBook = Module::updateOrCreate(
            ['name' => 'Buku Robotika: Robotic Engineering & Automation'],
            [
                'book_title' => 'Buku Robotika: Robotic Engineering & Automation',
                'parent_id' => null,
                'order_index' => 1,
                'module_type' => 'robot',
                'description' => 'Koleksi kurikulum lengkap robotika, sensor, aktuator, sistem kendali cerdas, dan rancang bangun mekatronika AICI.',
                'image' => '/images/modules/book-robotics.png',
                'format' => 'Buku Panduan',
                'size' => '11 Sub Modul',
                'tools' => ['Arduino Kit', 'Ultrasonic Sensor', 'Servo SG90', 'Motor Driver', 'Battery Pack'],
            ]
        );

        // 2. Buku Cover 2: AI & Coding
        $codingBook = Module::updateOrCreate(
            ['name' => 'Buku AI & Coding: Computational Thinking & AI'],
            [
                'book_title' => 'Buku AI & Coding: Computational Thinking & AI',
                'parent_id' => null,
                'order_index' => 2,
                'module_type' => 'coding',
                'description' => 'Koleksi kurikulum komprehensif logika komputasi, algoritma pemrograman, visual Scratch, Python, dan dasar kecerdasan buatan.',
                'image' => '/images/modules/book-coding.png',
                'format' => 'Buku Panduan',
                'size' => '9 Sub Modul',
                'tools' => ['Laptop', 'Scratch IDE', 'Python 3', 'OpenCV', 'Blockly'],
            ]
        );

        // Map robot modules to robotBook as sub-modules
        $robotModules = Module::where('module_type', 'robot')
            ->where('id', '!=', $robotBook->id)
            ->where('id', '!=', $codingBook->id)
            ->orderBy('name')
            ->get();

        foreach ($robotModules as $index => $mod) {
            $mod->update([
                'parent_id' => $robotBook->id,
                'book_title' => $robotBook->name,
                'order_index' => $index + 1,
            ]);
        }

        // Map coding modules to codingBook as sub-modules
        $codingModules = Module::where('module_type', 'coding')
            ->where('id', '!=', $robotBook->id)
            ->where('id', '!=', $codingBook->id)
            ->orderBy('name')
            ->get();

        foreach ($codingModules as $index => $mod) {
            $mod->update([
                'parent_id' => $codingBook->id,
                'book_title' => $codingBook->name,
                'order_index' => $index + 1,
            ]);
        }
    }
}
