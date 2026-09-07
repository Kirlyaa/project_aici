<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'created_by',
    'grade_range',
    'category',
    'template',
    'is_active',
])]
class CommentTemplate extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function getTemplateForAverage(float $average, string $category = 'umum'): ?string
    {
        $range = $average >= 5 ? '5' : ($average >= 4 ? '4-4.99' : '<4');

        /** @var self|null $template */
        $template = self::query()
            ->where('grade_range', $range)
            ->where('category', $category)
            ->where('is_active', true)
            ->inRandomOrder()
            ->first();

        return $template?->template;
    }

    public static function substitute(string $template, array $replacements): string
    {
        foreach ($replacements as $key => $value) {
            $placeholder = '{' . $key . '}';
            if (is_array($value)) {
                $value = implode(', ', $value);
            }
            $template = str_replace($placeholder, (string) $value, $template);
        }
        return $template;
    }
}
