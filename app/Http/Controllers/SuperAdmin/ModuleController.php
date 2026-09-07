<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

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
                ->orWhere('description', 'like', "%{$s}%");
        })
            ->when($type, fn($q) => $q->where('module_type', $type))
            ->with(['creator', 'learningSessions'])
            ->orderBy($sortBy)
            ->paginate(15)
            ->through(function (Module $m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'description' => $m->description,
                    'image' => $m->image,
                    'type' => $m->module_type,
                    'typeLabel' => $m->getTypeLabel(),
                    'tools' => $m->tools ?? [],
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

        return Inertia::render('SuperAdmin/ModuleManagement', [
            'modules' => $modules,
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
            'description' => 'nullable|string',
            'image' => 'nullable|url',
            'type' => 'required|in:robot,coding,general',
            'tools' => 'nullable|array',
            'tools.*' => 'string|max:100',
        ]);

        Module::create([
            'name' => $validated['name'],
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
            'name' => "required|string|max:255|unique:modules,name,{$module->id}",
            'description' => 'nullable|string',
            'image' => 'nullable|url',
            'type' => 'required|in:robot,coding,general',
            'tools' => 'nullable|array',
            'tools.*' => 'string|max:100',
        ]);

        $module->update([
            'name' => $validated['name'],
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
        // Check if module is being used
        if ($module->learningSessions()->count() > 0) {
            return back()->with('error', 'Tidak bisa menghapus modul yang masih digunakan. Hubungi support jika diperlukan.');
        }

        $module->delete();

        return back()->with('success', 'Modul berhasil dihapus.');
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
