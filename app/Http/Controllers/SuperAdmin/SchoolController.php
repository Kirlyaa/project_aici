<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SchoolController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('filter_status', 'Semua');
        $city = $request->input('filter_city', '');

        $schools = School::when($search, function ($q, $s) {
            $q->where(function ($inner) use ($s) {
                $inner->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%")
                    ->orWhere('city', 'like', "%{$s}%");
            });
        })
            ->when($status !== 'Semua', fn($q) => $q->where('status', $status))
            ->when($city, fn($q) => $q->where('city', $city))
            ->withCount(['students', 'tutors'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(function (School $s) {
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'email' => $s->email,
                    'phone' => $s->phone,
                    'city' => $s->city,
                    'province' => $s->province,
                    'status' => $s->status,
                    'studentCount' => $s->students_count,
                    'tutorCount' => $s->tutors_count,
                    'contactPerson' => $s->contact_person,
                    'contactPhone' => $s->contact_phone,
                    'createdAt' => $s->created_at?->toDateString(),
                ];
            })
            ->withQueryString();

        // Get unique cities for filter
        $cities = School::distinct('city')
            ->whereNotNull('city')
            ->orderBy('city')
            ->pluck('city');

        return Inertia::render('SuperAdmin/SchoolManagement', [
            'schools' => $schools,
            'search' => $search,
            'filterStatus' => $status,
            'filterCity' => $city,
            'cities' => $cities,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'status' => ['required', 'in:aktif,nonaktif,pending'],
            'notes' => ['nullable', 'string'],
        ]);

        School::create($validated);

        return back()->with('success', 'Sekolah berhasil ditambahkan.');
    }

    public function update(Request $request, School $school): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'status' => ['required', 'in:aktif,nonaktif,pending'],
            'notes' => ['nullable', 'string'],
        ]);

        $school->update($validated);

        return back()->with('success', 'Sekolah berhasil diperbarui.');
    }

    public function destroy(School $school): RedirectResponse
    {
        $school->delete();
        return back()->with('success', 'Sekolah berhasil dihapus.');
    }

    public function toggleStatus(School $school): RedirectResponse
    {
        $next = $school->status === 'aktif' ? 'nonaktif' : 'aktif';
        $school->update(['status' => $next]);
        return back()->with('success', "Status sekolah diubah menjadi {$next}.");
    }
}
