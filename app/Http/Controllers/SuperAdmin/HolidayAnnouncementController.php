<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\HolidayAnnouncementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HolidayAnnouncementController extends Controller
{
    public function __construct(
        protected HolidayAnnouncementService $service
    ) {}

    public function index()
    {
        $announcement = $this->service->getAnnouncement();

        return Inertia::render('SuperAdmin/HolidayAnnouncement', [
            'announcement' => $announcement,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'letter_number' => 'nullable|string|max:100',
            'holiday_date' => 'required|string|max:100',
            'content' => 'required|string',
            'target_role' => 'required|in:all,user,tutor',
            'is_active' => 'required|boolean',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240', // max 10MB
        ]);

        $fileUrl = null;
        $fileName = null;

        if ($request->hasFile('file')) {
            $uploaded = $request->file('file');
            $path = $uploaded->store('holiday_letters', 'public');
            $fileUrl = '/storage/' . $path;
            $fileName = $uploaded->getClientOriginalName();
        }

        $saveData = [
            // If regenerating ID when new announcement is created
            'id' => 'holiday_' . date('Ymd_His'),
            'title' => $validated['title'],
            'letter_number' => $validated['letter_number'] ?? null,
            'holiday_date' => $validated['holiday_date'],
            'content' => $validated['content'],
            'target_role' => $validated['target_role'],
            'is_active' => $validated['is_active'],
        ];

        if ($fileUrl) {
            $saveData['file_url'] = $fileUrl;
            $saveData['file_name'] = $fileName;
        }

        $this->service->saveAnnouncement($saveData);

        return redirect()->back()->with('success', 'Pengumuman surat libur berhasil disimpan & diperbarui!');
    }

    public function toggle(Request $request)
    {
        $announcement = $this->service->getAnnouncement();
        if (!$announcement) {
            return redirect()->back()->with('error', 'Belum ada surat pengumuman libur yang dibuat.');
        }

        $announcement['is_active'] = !$announcement['is_active'];
        $this->service->saveAnnouncement($announcement);

        return redirect()->back()->with(
            'success',
            $announcement['is_active'] ? 'Pengumuman libur diaktifkan!' : 'Pengumuman libur dinonaktifkan.'
        );
    }

    public function destroy()
    {
        $this->service->clearAnnouncement();
        return redirect()->back()->with('success', 'Pengumuman surat libur berhasil dihapus.');
    }
}
