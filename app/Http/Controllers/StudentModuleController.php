<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Inertia\Inertia;
use Inertia\Response;

class StudentModuleController extends Controller
{
    /**
     * Display a listing of learning modules for student.
     */
    public function index(): Response
    {
        // Ambil Buku Utama (parent_id = null) beserta seluruh sub modulnya
        $books = Module::whereNull('parent_id')
            ->with(['subModules'])
            ->orderBy('order_index')
            ->orderBy('name')
            ->get()
            ->map(fn(Module $book) => [
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

        return Inertia::render('User/ModulesViewer', [
            'books' => $books,
            'stats' => $stats,
        ]);
    }
}
