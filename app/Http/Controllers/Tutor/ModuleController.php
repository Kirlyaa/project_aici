<?php

namespace App\Http\Controllers\Tutor;

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
     * Display module list
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $type = $request->input('type', '');

        $modules = Module::when($search, function ($q, $s) {
            $q->where('name', 'like', "%{$s}%")
                ->orWhere('description', 'like', "%{$s}%");
        })
            ->when($type, fn($q) => $q->where('module_type', $type))
            ->with('creator')
            ->orderBy('name')
            ->paginate(12)
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
                ];
            })
            ->withQueryString();

        return Inertia::render('Tutor/ModuleManagement', [
            'modules' => $modules,
            'search' => $search,
            'selectedType' => $type,
        ]);
    }

    /**
     * Store new module
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
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
            'name' => 'required|string|max:255',
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
     * Delete module
     */
    public function destroy(Module $module): RedirectResponse
    {
        $module->delete();

        return back()->with('success', 'Modul berhasil dihapus.');
    }
}
