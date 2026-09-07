<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Get all notifications for authenticated user
     */
    public function index(): Response
    {
        $user = Auth::user();

        $notifications = Notification::where('user_id', $user->id)
            ->with(['learningSession'])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->through(function (Notification $n) {
                return [
                    'id' => $n->id,
                    'type' => $n->type,
                    'title' => $n->title,
                    'message' => $n->message,
                    'data' => $n->data,
                    'isRead' => $n->is_read,
                    'createdAt' => $n->created_at?->diffForHumans(),
                    'createdAtFull' => $n->created_at?->toDateTimeString(),
                ];
            });

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadCount()
    {
        $user = Auth::user();

        return response()->json([
            'unread_count' => Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->count(),
        ]);
    }

    /**
     * Get recent unread notifications (for sidebar/bell icon)
     */
    public function getRecent()
    {
        $user = Auth::user();

        $notifications = Notification::where('user_id', $user->id)
            ->with(['learningSession'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function (Notification $n) {
                return [
                    'id' => $n->id,
                    'type' => $n->type,
                    'title' => $n->title,
                    'message' => $n->message,
                    'isRead' => $n->is_read,
                    'createdAt' => $n->created_at?->diffForHumans(),
                ];
            });

        return response()->json($notifications);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Notification $notification): RedirectResponse
    {
        $this->authorize('view', $notification);
        $notification->markAsRead();

        return back()->with('success', 'Notifikasi ditandai sebagai sudah dibaca.');
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(): RedirectResponse
    {
        $user = Auth::user();

        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return back()->with('success', 'Semua notifikasi ditandai sebagai sudah dibaca.');
    }

    /**
     * Delete a notification
     */
    public function destroy(Notification $notification): RedirectResponse
    {
        $this->authorize('delete', $notification);
        $notification->delete();

        return back()->with('success', 'Notifikasi berhasil dihapus.');
    }

    /**
     * Delete all read notifications
     */
    public function deleteAllRead(): RedirectResponse
    {
        $user = Auth::user();

        Notification::where('user_id', $user->id)
            ->where('is_read', true)
            ->delete();

        return back()->with('success', 'Notifikasi yang sudah dibaca berhasil dihapus.');
    }
}
