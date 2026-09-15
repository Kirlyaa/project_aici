<?php

namespace Database\Seeders;

use App\Models\CommentTemplate;
use Illuminate\Database\Seeder;

class CommentTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            // Range: 5 (Sempurna)
            [
                'grade_range' => '5',
                'category'    => 'umum',
                'template'    => '{student} menunjukkan performa luar biasa dengan rata-rata nilai {average}. Pemahaman konsep {modules} sangat baik dan konsisten.',
            ],
            [
                'grade_range' => '5',
                'category'    => 'fokus',
                'template'    => '{student} memiliki fokus dan konsentrasi yang sangat baik selama sesi pembelajaran.',
            ],
            [
                'grade_range' => '5',
                'category'    => 'interaksi',
                'template'    => '{student} aktif berpartisipasi dan berkolaborasi dengan baik dalam setiap sesi.',
            ],

            // Range: 4 - 4.99 (Baik)
            [
                'grade_range' => '4-4.99',
                'category'    => 'umum',
                'template'    => '{student} menunjukkan perkembangan yang baik dengan rata-rata nilai {average}. Pemahaman konsep {modules} sudah cukup baik, perlu sedikit peningkatan di beberapa area.',
            ],
            [
                'grade_range' => '4-4.99',
                'category'    => 'fokus',
                'template'    => '{student} menunjukkan fokus yang cukup baik, namun masih perlu latihan untuk mempertahankan konsentrasi lebih lama.',
            ],
            [
                'grade_range' => '4-4.99',
                'category'    => 'interaksi',
                'template'    => '{student} cukup aktif dalam sesi pembelajaran dan menunjukkan kemampuan berkolaborasi yang baik.',
            ],

            // Range: <4 (Perlu Perbaikan)
            [
                'grade_range' => '<4',
                'category'    => 'umum',
                'template'    => '{student} masih dalam tahap pengembangan dengan rata-rata nilai {average}. Diperlukan pendampingan lebih intensif pada materi {modules}.',
            ],
            [
                'grade_range' => '<4',
                'category'    => 'fokus',
                'template'    => '{student} perlu bimbingan tambahan untuk meningkatkan fokus dan konsentrasi selama sesi pembelajaran.',
            ],
            [
                'grade_range' => '<4',
                'category'    => 'interaksi',
                'template'    => '{student} perlu didorong untuk lebih aktif berpartisipasi dan bertanya dalam sesi pembelajaran.',
            ],
        ];

        foreach ($templates as $data) {
            CommentTemplate::firstOrCreate(
                [
                    'grade_range' => $data['grade_range'],
                    'category'    => $data['category'],
                ],
                [
                    'template'    => $data['template'],
                    'is_active'   => true,
                ]
            );
        }
    }
}
