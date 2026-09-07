<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModuleApiController extends Controller
{
    /**
     * Get all modules with optional filtering
     */
    public function index(Request $request): JsonResponse
    {
        $modules = Module::when($request->input('search'), function ($q, $search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        })
            ->when($request->input('type'), function ($q, $type) {
                $q->where('module_type', $type);
            })
            ->orderBy('name')
            ->get()
            ->map(function (Module $m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'description' => $m->description,
                    'image' => $m->image,
                    'type' => $m->module_type,
                    'type_label' => $m->getTypeLabel(),
                    'tools' => $m->tools ?? [],
                    'created_by' => $m->creator?->name ?? null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $modules,
            'total' => $modules->count(),
        ]);
    }

    /**
     * Get single module detail
     */
    public function show(int $moduleId): JsonResponse
    {
        $module = Module::findOrFail($moduleId);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $module->id,
                'name' => $module->name,
                'description' => $module->description,
                'image' => $module->image,
                'type' => $module->module_type,
                'type_label' => $module->getTypeLabel(),
                'tools' => $module->tools ?? [],
                'created_by' => $module->creator?->name ?? null,
                'created_at' => $module->created_at?->toDateTimeString(),
                'sessions_count' => $module->learningSessions()->count(),
            ],
        ]);
    }

    /**
     * Create new module (SuperAdmin/Tutor)
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        abort_if($user->role !== 'superadmin' && $user->role !== 'tutor', 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|url',
            'type' => 'required|in:robot,coding,general',
            'tools' => 'nullable|array',
        ]);

        $module = Module::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
            'module_type' => $validated['type'],
            'tools' => $validated['tools'] ?? null,
            'created_by' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Modul berhasil dibuat',
            'data' => $module,
        ], 201);
    }

    /**
     * Update module
     */
    public function update(Request $request, int $moduleId): JsonResponse
    {
        $user = Auth::user();
        $module = Module::findOrFail($moduleId);

        // SuperAdmin can update any module, Tutor can only update their own
        $isAuthorized = $user->role === 'superadmin' || ($user->role === 'tutor' && $module->created_by === $user->id);
        abort_if(!$isAuthorized, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|url',
            'type' => 'required|in:robot,coding,general',
            'tools' => 'nullable|array',
        ]);

        $module->update($validated + ['module_type' => $validated['type']]);
        unset($module['module_type']);

        return response()->json([
            'success' => true,
            'message' => 'Modul berhasil diperbarui',
            'data' => $module,
        ]);
    }

    /**
     * Delete module (soft delete)
     */
    public function destroy(int $moduleId): JsonResponse
    {
        $user = Auth::user();
        abort_if($user->role !== 'superadmin', 403);

        $module = Module::findOrFail($moduleId);
        $module->delete();

        return response()->json([
            'success' => true,
            'message' => 'Modul berhasil dihapus',
        ]);
    }
}
