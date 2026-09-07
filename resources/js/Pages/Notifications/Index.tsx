import React from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    data: any;
    isRead: boolean;
    createdAt: string;
    createdAtFull: string;
}

interface Props {
    notifications: {
        data: Notification[];
        links: any;
        meta: any;
    };
    unreadCount: number;
}

export default function NotificationsIndex() {
    const { notifications, unreadCount } = usePage().props as unknown as Props;

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            schedule_reminder: '📅',
            grade_posted: '📊',
            comment_posted: '💬',
            session_cancelled: '❌',
            default: '🔔',
        };
        return icons[type] || icons.default;
    };

    const handleMarkAsRead = (id: number) => {
        router.patch(`/notifications/${id}/read`);
    };

    const handleMarkAllAsRead = () => {
        router.patch('/notifications/mark-all/read');
    };

    const handleDelete = (id: number) => {
        router.delete(`/notifications/${id}`);
    };

    const handleDeleteAllRead = () => {
        if (confirm('Hapus semua notifikasi yang sudah dibaca?')) {
            router.delete('/notifications/delete-all/read');
        }
    };

    return (
        <UserLayout currentPage="notifications">
            <Head title="Notifikasi" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifikasi</h1>
                            <p className="text-gray-600">
                                {unreadCount > 0 ? (
                                    <>
                                        Anda memiliki <span className="font-bold text-blue-600">{unreadCount}</span> notifikasi baru
                                    </>
                                ) : (
                                    'Tidak ada notifikasi baru'
                                )}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Tandai Semua Dibaca
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {notifications.data.length > 0 ? (
                            <div>
                                {notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`border-b border-gray-100 p-6 hover:bg-gray-50 transition ${
                                            !notification.isRead ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex gap-4">
                                            {/* Icon */}
                                            <div className="text-4xl flex-shrink-0">
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <h3
                                                            className={`text-lg font-bold mb-1 ${
                                                                !notification.isRead
                                                                    ? 'text-blue-900'
                                                                    : 'text-gray-900'
                                                            }`}
                                                        >
                                                            {notification.title}
                                                            {!notification.isRead && (
                                                                <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                                            )}
                                                        </h3>
                                                        <p className="text-gray-700 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {notification.createdAt}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() =>
                                                                    handleMarkAsRead(notification.id)
                                                                }
                                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded hover:bg-blue-100 transition"
                                                                title="Tandai sebagai dibaca"
                                                            >
                                                                ✓ Baca
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification.id)}
                                                            className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded hover:bg-red-100 transition"
                                                            title="Hapus notifikasi"
                                                        >
                                                            🗑 Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Delete read notifications button */}
                                {notifications.data.some((n) => n.isRead) && (
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                                        <button
                                            onClick={handleDeleteAllRead}
                                            className="text-sm text-gray-600 hover:text-red-600 transition"
                                        >
                                            Hapus semua notifikasi yang sudah dibaca
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Tidak Ada Notifikasi
                                </h3>
                                <p className="text-gray-600">
                                    Anda sudah membaca semua notifikasi. Tunggu update terbaru!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {notifications.links && (
                        <div className="mt-6 flex justify-center gap-2">
                            {notifications.links.map((link: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 rounded ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
