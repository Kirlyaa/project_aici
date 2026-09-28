<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModuleViewController extends Controller
{
    public function index(Request $request): Response
    {
        $studentId = $request->query('student');
        $classroomId = $request->query('classroom_id');

        $activeStudent = null;
        $activeClassroom = null;
        $filterContext = null;

        if ($studentId) {
            $activeStudent = User::with('classroom')->find($studentId);
            if ($activeStudent) {
                $className = $activeStudent->classroom?->name ?? ($activeStudent->class ?? null);
                $filterContext = [
                    'studentId'     => $activeStudent->id,
                    'studentName'   => $activeStudent->name,
                    'className'     => $className,
                    'classroomId'   => $activeStudent->classroom_id,
                ];
            }
        } elseif ($classroomId) {
            $activeClassroom = Classroom::find($classroomId);
            if ($activeClassroom) {
                $filterContext = [
                    'studentId'     => null,
                    'studentName'   => null,
                    'className'     => $activeClassroom->name,
                    'classroomId'   => $activeClassroom->id,
                ];
            }
        }

        // Ambil Buku Utama (parent_id = null) beserta seluruh sub modulnya
        $booksQuery = Module::whereNull('parent_id')
            ->with(['subModules'])
            ->orderBy('order_index')
            ->orderBy('name');

        $allBooksCollection = (clone $booksQuery)->get();

        // Terapkan filter jika ada context murid atau kelas
        if ($filterContext && !empty($filterContext['className'])) {
            $targetClass = strtolower($filterContext['className']);

            // 1. Cek apakah ada modul yang secara eksplisit terkait pada sesi belajar murid atau kelas ini
            $sessionModuleParentIds = collect();
            if ($activeStudent) {
                $studentSessionModules = LearningSession::where('user_id', $activeStudent->id)
                    ->with('modules')
                    ->get()
                    ->pluck('modules')
                    ->flatten();

                $sessionModuleParentIds = $studentSessionModules->map(function ($m) {
                    return $m->parent_id ?? $m->id;
                })->filter()->unique();
            }

            // 2. Tentukan kecocokan semantik berdasarkan nama kelas
            // Contoh kata kunci:
            // "ai engginer", "ai engineer", "ai innovator", "coding" -> Buku AI & Coding / module_type = 'coding'
            // "robotics", "robot", "mekanika", "automation" -> Buku Robotika / module_type = 'robot'
            $isRobotClass = (bool) preg_match('/robot|mekanika|automation|hardware|elektronika/i', $targetClass);
            $isCodingClass = (bool) preg_match('/ai|coding|engineer|innovator|program|algoritma|computational|software/i', $targetClass);

            $filtered = $allBooksCollection->filter(function (Module $book) use ($targetClass, $sessionModuleParentIds, $isRobotClass, $isCodingClass) {
                // Jika modul ini atau induknya ada di sesi belajar murid
                if ($sessionModuleParentIds->isNotEmpty() && $sessionModuleParentIds->contains($book->id)) {
                    return true;
                }

                $bookNameLower = strtolower($book->name . ' ' . ($book->book_title ?? ''));
                $bookType = strtolower($book->module_type ?? '');

                // Jika kelas secara spesifik adalah robotika
                if ($isRobotClass && !$isCodingClass) {
                    return $bookType === 'robot' || str_contains($bookNameLower, 'robot');
                }

                // Jika kelas secara spesifik adalah AI / Coding / Software
                if ($isCodingClass && !$isRobotClass) {
                    return $bookType === 'coding' || str_contains($bookNameLower, 'coding') || str_contains($bookNameLower, 'ai');
                }

                // Jika kelas memadukan keduanya (misal: "Robotics & AI" atau umum)
                if ($isCodingClass && ($bookType === 'coding' || str_contains($bookNameLower, 'coding') || str_contains($bookNameLower, 'ai'))) {
                    return true;
                }

                if ($isRobotClass && ($bookType === 'robot' || str_contains($bookNameLower, 'robot'))) {
                    return true;
                }

                // Fallback: pencocokan kata nama kelas pada judul buku
                $cleanWords = array_filter(explode(' ', preg_replace('/[^a-z0-9\s]/i', '', $targetClass)));
                foreach ($cleanWords as $word) {
                    if (strlen($word) >= 3 && str_contains($bookNameLower, $word)) {
                        return true;
                    }
                }

                return false;
            });

            // Hanya gunakan hasil filter jika ditemukan buku yang cocok; jika tidak, tetap tampilkan buku agar tidak kosong
            if ($filtered->isNotEmpty()) {
                $booksList = $filtered->values();
            } else {
                $booksList = $allBooksCollection;
            }
        } else {
            $booksList = $allBooksCollection;
        }

        $books = $booksList->map(fn(Module $book) => [
            'id'              => $book->id,
            'name'            => $book->name,
            'bookTitle'       => $book->book_title ?? $book->name,
            'description'     => $book->description,
            'image'           => $book->image,
            'type'            => $book->module_type,
            'typeLabel'       => $book->getTypeLabel(),
            'tools'           => $book->tools ?? [],
            'format'          => $book->format ?? 'Buku Panduan',
            'size'            => $book->size ?? ($book->subModules->count() . ' Sub Modul'),
            'subModulesCount' => $book->subModules->count(),
            'subModules'      => $book->subModules->map(fn(Module $sm) => [
                'id'          => $sm->id,
                'name'        => $sm->name,
                'orderIndex'  => $sm->order_index,
                'description' => $sm->description,
                'image'       => $sm->image,
                'type'        => $sm->module_type,
                'typeLabel'   => $sm->getTypeLabel(),
                'tools'       => $sm->tools ?? [],
                'format'      => $sm->format ?? 'PDF',
                'size'        => $sm->size ?? 'Materi Sesi',
            ]),
        ]);

        // Fallback jika belum memiliki buku induk (parent_id is null): kelompokkan berdasarkan module_type
        if ($books->isEmpty()) {
            $allModules = Module::orderBy('name')->get();
            $grouped = $allModules->groupBy('module_type');

            $books = $grouped->map(function ($mods, $type) {
                $typeLabel = match ($type) {
                    'robot' => 'Robot Building',
                    'coding' => 'Coding',
                    default => ucfirst($type),
                };
                return [
                    'id'              => $mods->first()->id,
                    'name'            => "Buku Kurikulum {$typeLabel}",
                    'bookTitle'       => "Buku Kurikulum {$typeLabel}",
                    'description'     => "Koleksi kurikulum pembelajaran {$typeLabel} AICI.",
                    'image'           => $type === 'robot' ? '/images/modules/book-robotics.png' : '/images/modules/book-coding.png',
                    'type'            => $type,
                    'typeLabel'       => $typeLabel,
                    'tools'           => [],
                    'format'          => 'Buku Panduan',
                    'size'            => $mods->count() . ' Sub Modul',
                    'subModulesCount' => $mods->count(),
                    'subModules'      => $mods->map(fn($sm, $i) => [
                        'id'          => $sm->id,
                        'name'        => $sm->name,
                        'orderIndex'  => $sm->order_index ?: ($i + 1),
                        'description' => $sm->description,
                        'image'       => $sm->image,
                        'type'        => $sm->module_type,
                        'typeLabel'   => $sm->getTypeLabel(),
                        'tools'       => $sm->tools ?? [],
                        'format'      => $sm->format ?? 'PDF',
                        'size'        => $sm->size ?? 'Materi Sesi',
                    ]),
                ];
            })->values();
        }

        $stats = [
            'totalBooks'      => $books->count(),
            'totalSubModules' => Module::whereNotNull('parent_id')->count() ?: Module::count(),
            'robot'           => Module::where('module_type', 'robot')->whereNotNull('parent_id')->count() ?: Module::where('module_type', 'robot')->count(),
            'coding'          => Module::where('module_type', 'coding')->whereNotNull('parent_id')->count() ?: Module::where('module_type', 'coding')->count(),
        ];

        return Inertia::render('Tutor/ModulesViewer', [
            'books'         => $books,
            'stats'         => $stats,
            'filterContext' => $filterContext,
        ]);
    }
}
