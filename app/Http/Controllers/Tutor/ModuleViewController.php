<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Inertia\Inertia;
use Inertia\Response;

class ModuleViewController extends Controller
{
    public function index(): Response
    {
        $modules = Module::orderBy('name')
            ->get()
            ->map(fn(Module $m) => [
                'id'          => $m->id,
                'name'        => $m->name,
                'description' => $m->description,
                'image'       => $m->image,
                'type'        => $m->module_type,
                'typeLabel'   => $m->getTypeLabel(),
                'tools'       => $m->tools ?? [],
            ]);

        $stats = [
            'total'  => Module::count(),
            'robot'  => Module::where('module_type', 'robot')->count(),
            'coding' => Module::where('module_type', 'coding')->count(),
        ];

        return Inertia::render('Tutor/ModulesViewer', [
            'modules' => $modules,
            'stats'   => $stats,
        ]);
    }
}
