import React, { useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function ProfileEdit() {
    const { auth, mustVerifyEmail, status } = usePage().props as any;
    const [preview, setPreview] = useState<string | null>(auth.user.avatar_url || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        avatar: null as File | null,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);

            // Preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }
        formData.append('_method', 'PATCH');

        // Post dengan FormData
        post(route('profile.update'), {
            forceFormData: true,
        });
    };

    return (
        <UserLayout>
            <Head title="Edit Profil" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Profil</h1>
                        <p className="text-gray-600">Update informasi pribadi dan foto profil Anda</p>
                    </div>

                    {/* Success Message */}
                    {status && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-4">
                                    Foto Profil
                                </label>
                                <div className="flex items-center gap-6">
                                    {/* Avatar Preview */}
                                    <div className="flex-shrink-0">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Avatar preview"
                                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border-4 border-blue-200">
                                                <span className="text-white text-5xl font-bold">
                                                    {data.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Button */}
                                    <div className="flex-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium mb-2"
                                        >
                                            Pilih Foto
                                        </button>
                                        <p className="text-sm text-gray-600">
                                            JPG, PNG, atau GIF (Max 2MB)
                                        </p>
                                        {errors.avatar && (
                                            <p className="text-red-600 text-sm mt-2">{errors.avatar}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <hr className="my-6" />

                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Email Verification Notice */}
                            {mustVerifyEmail && !auth.user.email_verified_at && (
                                <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                                    Email Anda belum diverifikasi. Silakan cek email untuk link verifikasi.
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <a
                                    href={route('profile.edit')}
                                    className="px-8 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    Batal
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
