<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ReportPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportPeriodController extends Controller
{
    /**
     * Tampilkan halaman pengelolaan periode rapor PDF.
     */
    public function index(): Response
    {
        $periods = ReportPeriod::orderBy('order_index')
            ->orderBy('start_meeting')
            ->get();

        return Inertia::render('SuperAdmin/ReportPeriodManagement', [
            'periods' => $periods,
        ]);
    }

    /**
     * Simpan periode baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:100'],
            'start_meeting' => ['required', 'integer', 'min:1', 'max:200'],
            'end_meeting' => ['required', 'integer', 'min:1', 'max:200', 'gte:start_meeting'],
            'order_index' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'end_meeting.gte' => 'Pertemuan akhir harus lebih besar atau sama dengan pertemuan awal.',
        ]);

        $orderIndex = $validated['order_index'] ?? (ReportPeriod::max('order_index') + 1);

        ReportPeriod::create([
            'name' => $validated['name'] ?? null,
            'start_meeting' => $validated['start_meeting'],
            'end_meeting' => $validated['end_meeting'],
            'order_index' => $orderIndex,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->back()->with('success', 'Periode rapor berhasil ditambahkan.');
    }

    /**
     * Perbarui periode rapor.
     */
    public function update(Request $request, ReportPeriod $period): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:100'],
            'start_meeting' => ['required', 'integer', 'min:1', 'max:200'],
            'end_meeting' => ['required', 'integer', 'min:1', 'max:200', 'gte:start_meeting'],
            'order_index' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'end_meeting.gte' => 'Pertemuan akhir harus lebih besar atau sama dengan pertemuan awal.',
        ]);

        $period->update([
            'name' => $validated['name'] ?? null,
            'start_meeting' => $validated['start_meeting'],
            'end_meeting' => $validated['end_meeting'],
            'order_index' => $validated['order_index'] ?? $period->order_index,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->back()->with('success', 'Periode rapor berhasil diperbarui.');
    }

    /**
     * Hapus periode rapor.
     */
    public function destroy(ReportPeriod $period): RedirectResponse
    {
        $period->delete();

        return redirect()->back()->with('success', 'Periode rapor berhasil dihapus.');
    }

    /**
     * Toggle status aktif periode.
     */
    public function toggleStatus(ReportPeriod $period): RedirectResponse
    {
        $period->update([
            'is_active' => !$period->is_active,
        ]);

        return redirect()->back()->with('success', 'Status periode berhasil diubah.');
    }
}
