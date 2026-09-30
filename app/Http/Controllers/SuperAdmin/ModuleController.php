<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Services\ModuleBulkImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ModuleController extends Controller
{
    /**
     * Display module list with advanced filtering
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $type = $request->input('type', '');
        $sortBy = $request->input('sort', 'name');

        $modules = Module::when($search, function ($q, $s) {
            $q->where('name', 'like', "%{$s}%")
                ->orWhere('description', 'like', "%{$s}%")
                ->orWhere('book_title', 'like', "%{$s}%");
        })
            ->when($type, fn($q) => $q->where('module_type', $type))
            ->with(['creator', 'learningSessions', 'subModules'])
            ->orderBy($sortBy)
            ->paginate(15)
            ->through(function (Module $m) {
                return [
                    'id' => $m->id,
                    'parentId' => $m->parent_id,
                    'name' => $m->name,
                    'bookTitle' => $m->book_title,
                    'orderIndex' => $m->order_index,
                    'description' => $m->description,
                    'image' => $m->image,
                    'type' => $m->module_type,
                    'typeLabel' => $m->getTypeLabel(),
                    'tools' => $m->tools ?? [],
                    'subModulesCount' => $m->subModules->count(),
                    'subModules' => $m->subModules->map(fn($sm) => [
                        'id' => $sm->id,
                        'name' => $sm->name,
                        'orderIndex' => $sm->order_index,
                        'type' => $sm->module_type,
                    ]),
                    'createdBy' => $m->creator?->name ?? 'System',
                    'createdAt' => $m->created_at?->toDateString(),
                    'sessionsCount' => $m->learning_sessions_count,
                ];
            })
            ->withQueryString();

        $stats = [
            'total' => Module::count(),
            'robot' => Module::where('module_type', 'robot')->count(),
            'coding' => Module::where('module_type', 'coding')->count(),
            'general' => Module::where('module_type', 'general')->count(),
        ];

        $parentModules = Module::whereNull('parent_id')
            ->orderBy('name')
            ->get(['id', 'name', 'book_title']);

        // Ambil parent books beserta subModul untuk tampilan katalog buku digital
        $books = Module::whereNull('parent_id')
            ->with(['subModules.creator', 'subModules.learningSessions'])
            ->orderBy('order_index')
            ->orderBy('name')
            ->get()
            ->map(function (Module $book) {
                return [
                    'id' => $book->id,
                    'name' => $book->name,
                    'bookTitle' => $book->book_title ?? $book->name,
                    'description' => $book->description,
                    'image' => $book->image,
                    'type' => $book->module_type,
                    'typeLabel' => $book->getTypeLabel(),
                    'tools' => $book->tools ?? [],
                    'format' => $book->format ?? 'Buku Panduan',
                    'subModulesCount' => $book->subModules->count(),
                    'subModules' => $book->subModules->sortBy('order_index')->values()->map(fn($sm) => [
                        'id' => $sm->id,
                        'parentId' => $sm->parent_id,
                        'name' => $sm->name,
                        'bookTitle' => $sm->book_title,
                        'orderIndex' => $sm->order_index,
                        'description' => $sm->description,
                        'image' => $sm->image,
                        'type' => $sm->module_type,
                        'typeLabel' => $sm->getTypeLabel(),
                        'tools' => $sm->tools ?? [],
                        'createdBy' => $sm->creator?->name ?? 'System',
                        'createdAt' => $sm->created_at?->toDateString(),
                        'sessionsCount' => $sm->learning_sessions_count ?? $sm->learningSessions()->count(),
                    ]),
                ];
            });

        return Inertia::render('SuperAdmin/ModuleManagement', [
            'modules' => $modules,
            'books' => $books,
            'parentModules' => $parentModules,
            'search' => $search,
            'selectedType' => $type,
            'sortBy' => $sortBy,
            'stats' => $stats,
        ]);
    }

    /**
     * Store new module
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:modules,name',
            'book_title' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:modules,id',
            'order_index' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'type' => 'required|in:robot,coding,general',
            'tools' => 'nullable|array',
            'tools.*' => 'string|max:100',
        ]);

        Module::create([
            'name' => $validated['name'],
            'book_title' => $validated['book_title'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'order_index' => $validated['order_index'] ?? 0,
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
            'module_type' => $validated['type'],
            'tools' => $validated['tools'] ?? null,
            'created_by' => Auth::user()->id,
        ]);

        return back()->with('success', 'Modul berhasil ditambahkan.');
    }

    /**
     * Update module
     */
    public function update(Request $request, Module $module): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('modules', 'name')
                    ->where(fn ($q) => $q->whereNull('deleted_at'))
                    ->ignore($module->id),
            ],
            'book_title' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:modules,id',
            'order_index' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'type' => 'required|in:robot,coding,general',
            'tools' => 'nullable|array',
            'tools.*' => 'string|max:100',
        ]);

        $module->update([
            'name' => $validated['name'],
            'book_title' => $validated['book_title'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'order_index' => $validated['order_index'] ?? 0,
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
            'module_type' => $validated['type'],
            'tools' => $validated['tools'] ?? null,
        ]);

        return back()->with('success', 'Modul berhasil diperbarui.');
    }

    /**
     * Delete module (soft delete)
     */
    public function destroy(Module $module): RedirectResponse
    {
        // 1. Cek relasi dengan learning sessions (baik langsung maupun via sub modul jika ini buku induk)
        if ($module->learningSessions()->count() > 0) {
            return back()->with('error', 'Tidak bisa menghapus modul yang masih terhubung dengan sesi pembelajaran.');
        }

        // 2. Cek relasi dengan nilai rapor (gradeEntries)
        if ($module->gradeEntries()->count() > 0) {
            return back()->with('error', 'Tidak bisa menghapus modul yang telah memiliki riwayat nilai siswa.');
        }

        // 3. Jika ini buku induk (parent_id = null) dan memiliki sub modul
        $subModules = $module->subModules;
        if ($subModules->isNotEmpty()) {
            foreach ($subModules as $sub) {
                if ($sub->learningSessions()->count() > 0) {
                    return back()->with('error', "Tidak bisa menghapus buku karena sub modul '{$sub->name}' masih digunakan di sesi pembelajaran.");
                }
                if ($sub->gradeEntries()->count() > 0) {
                    return back()->with('error', "Tidak bisa menghapus buku karena sub modul '{$sub->name}' telah memiliki riwayat penilaian siswa.");
                }
            }
            // Soft delete seluruh sub modul di dalam buku ini agar konsisten
            foreach ($subModules as $sub) {
                $sub->delete();
            }
        }

        $module->delete();

        return back()->with('success', 'Modul / Buku berhasil dihapus.');
    }

    /**
     * Download CSV template for modules import
     */
    public function downloadTemplate(ModuleBulkImportService $importService): StreamedResponse
    {
        return $importService->downloadTemplate();
    }

    /**
     * Bulk import modules from CSV
     */
    public function importCsv(Request $request, ModuleBulkImportService $importService): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ], [
            'file.required' => 'Pilih file CSV modul terlebih dahulu.',
            'file.file' => 'File yang diunggah tidak valid.',
            'file.mimes' => 'Format file harus berupa CSV (.csv).',
            'file.max' => 'Ukuran file CSV maksimal 10MB.',
        ]);

        $result = $importService->import($request->file('file'), Auth::id());

        if (! $result['success']) {
            return back()->with('csv_errors', $result['errors']);
        }

        $message = "Berhasil mengimpor {$result['imported_count']} modul baru";
        if ($result['updated_count'] > 0) {
            $message .= " dan memperbarui {$result['updated_count']} modul";
        }
        $message .= '.';

        return back()->with('success', $message);
    }

    /**
     * Restore soft-deleted module
     */
    public function restore(int $moduleId): RedirectResponse
    {
        $module = Module::onlyTrashed()->findOrFail($moduleId);
        $module->restore();

        return back()->with('success', 'Modul berhasil dipulihkan.');
    }

    /**
     * Permanently delete module
     */
    public function forceDelete(int $moduleId): RedirectResponse
    {
        $module = Module::onlyTrashed()->findOrFail($moduleId);
        $module->forceDelete();

        return back()->with('success', 'Modul berhasil dihapus permanen.');
    }
}
