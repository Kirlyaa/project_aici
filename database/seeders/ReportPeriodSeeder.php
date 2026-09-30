<?php

namespace Database\Seeders;

use App\Models\ReportPeriod;
use Illuminate\Database\Seeder;

class ReportPeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultPeriods = [
            [
                'name' => 'Periode 1',
                'start_meeting' => 1,
                'end_meeting' => 4,
                'order_index' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Periode 2',
                'start_meeting' => 5,
                'end_meeting' => 8,
                'order_index' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Periode 3',
                'start_meeting' => 9,
                'end_meeting' => 12,
                'order_index' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($defaultPeriods as $period) {
            ReportPeriod::firstOrCreate(
                [
                    'start_meeting' => $period['start_meeting'],
                    'end_meeting' => $period['end_meeting'],
                ],
                $period
            );
        }
    }
}
