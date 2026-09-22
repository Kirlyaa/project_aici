<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\TutorChat;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TutorChatController extends Controller
{
    /**
     * Get recent chats for a tutor or between superadmin and specific tutor.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $cutoff = now()->subHours(120);

        if ($user->role === 'superadmin') {
            $tutorId = $request->integer('tutor_id');
            if (! $tutorId) {
                return response()->json(['messages' => []]);
            }

            $messages = TutorChat::where('created_at', '>=', $cutoff)
                ->where(function ($q) use ($user, $tutorId) {
                    $q->where(function ($sub) use ($user, $tutorId) {
                        $sub->where('sender_id', $user->id)->where('receiver_id', $tutorId);
                    })->orWhere(function ($sub) use ($user, $tutorId) {
                        $sub->where('sender_id', $tutorId)->where('receiver_id', $user->id);
                    });
                })
                ->with(['sender:id,name,role', 'learningSession:id,title,date_string'])
                ->orderBy('created_at', 'asc')
                ->take(50)
                ->get()
                ->map(fn($m) => [
                'id' => $m->id,
                'sender_id' => $m->sender_id,
                'sender_name' => $m->sender->name,
                'sender_role' => $m->sender->role,
                'receiver_id' => $m->receiver_id,
                'message' => $m->message,
                'is_read' => $m->is_read,
                'session_title' => $m->learningSession?->title,
                'created_at' => $m->created_at->format('H:i, d M Y'),
                'time_ago' => $m->created_at->diffForHumans(),
            ]);

            return response()->json(['messages' => $messages]);
        }

        // Jika Tutor login, ambil chat dari Super Admin untuk dirinya
        $messages = TutorChat::where('created_at', '>=', $cutoff)
            ->where(function ($q) use ($user) {
                $q->where('receiver_id', $user->id)
                  ->orWhere('sender_id', $user->id);
            })
            ->with(['sender:id,name,role', 'learningSession:id,title,date_string'])
            ->orderBy('created_at', 'asc')
            ->take(50)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'sender_id' => $m->sender_id,
                'sender_name' => $m->sender->name,
                'sender_role' => $m->sender->role,
                'receiver_id' => $m->receiver_id,
                'message' => $m->message,
                'is_read' => $m->is_read,
                'session_title' => $m->learningSession?->title,
                'created_at' => $m->created_at->format('H:i, d M Y'),
                'time_ago' => $m->created_at->diffForHumans(),
            ]);

        return response()->json(['messages' => $messages]);
    }

    /**
     * Send chat from SuperAdmin to Tutor or vice versa.
     */
    public function store(Request $request): JsonResponse
    {
        $sender = Auth::user();

        $validated = $request->validate([
            'receiver_id' => ['required', 'integer', 'exists:users,id'],
            'learning_session_id' => ['nullable', 'integer', 'exists:learning_sessions,id'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $chat = TutorChat::create([
            'sender_id' => $sender->id,
            'receiver_id' => $validated['receiver_id'],
            'learning_session_id' => $validated['learning_session_id'] ?? null,
            'message' => $validated['message'],
        ]);

        // Buat notification otomatis untuk penerima
        Notification::create([
            'user_id' => $validated['receiver_id'],
            'learning_session_id' => $validated['learning_session_id'] ?? null,
            'type' => 'chat_message',
            'title' => "Pesan Baru dari {$sender->name}",
            'message' => $validated['message'],
            'is_read' => false,
            'sent_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dikirim.',
            'chat' => [
                'id' => $chat->id,
                'sender_id' => $sender->id,
                'sender_name' => $sender->name,
                'sender_role' => $sender->role,
                'receiver_id' => $chat->receiver_id,
                'message' => $chat->message,
                'is_read' => $chat->is_read,
                'created_at' => $chat->created_at->format('H:i, d M Y'),
                'time_ago' => $chat->created_at->diffForHumans(),
            ],
        ]);
    }

    /**
     * Mark chats as read.
     */
    public function markAsRead(Request $request): JsonResponse
    {
        $user = Auth::user();

        TutorChat::where('receiver_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['success' => true]);
    }

    /**
     * Update chat message (SuperAdmin only).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $chat = TutorChat::findOrFail($id);

        // Hanya pembuat chat yang berhak mengedit
        if ($chat->sender_id !== $user->id && $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $chat->update([
            'message' => $validated['message'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil diubah.',
            'chat' => [
                'id' => $chat->id,
                'message' => $chat->message,
            ],
        ]);
    }

    /**
     * Delete chat message (SuperAdmin only).
     */
    public function destroy(int $id): JsonResponse
    {
        $user = Auth::user();
        $chat = TutorChat::findOrFail($id);

        if ($chat->sender_id !== $user->id && $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $chat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dihapus.',
        ]);
    }

    /**
     * Get read chats history for Tutor dashboard.
     */
    public function getReadHistory(): JsonResponse
    {
        $user = Auth::user();
        $cutoff = now()->subHours(120);

        $readChats = TutorChat::where('created_at', '>=', $cutoff)
            ->where('receiver_id', $user->id)
            ->where('is_read', true)
            ->with(['sender:id,name', 'learningSession:id,title'])
            ->orderByDesc('read_at')
            ->take(30)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'sender_name' => $c->sender->name,
                'session_title' => $c->learningSession?->title,
                'message' => $c->message,
                'read_at' => $c->read_at ? $c->read_at->format('d M Y, H:i') : null,
                'created_at' => $c->created_at->format('d M Y, H:i'),
            ]);

        return response()->json([
            'chats' => $readChats,
        ]);
    }

    /**
     * Get active unread chats for Tutor dashboard header alert.
     */
    public function getActiveAlerts(): JsonResponse
    {
        $user = Auth::user();
        $cutoff = now()->subHours(120);

        $unreadChats = TutorChat::where('created_at', '>=', $cutoff)
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->with(['sender:id,name', 'learningSession:id,title'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'sender_name' => $c->sender->name,
                'session_title' => $c->learningSession?->title,
                'message' => $c->message,
                'created_at' => $c->created_at->diffForHumans(),
            ]);

        return response()->json([
            'count' => $unreadChats->count(),
            'chats' => $unreadChats,
        ]);
    }
}
