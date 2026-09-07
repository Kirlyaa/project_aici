<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            margin-bottom: 20px;
            font-size: 16px;
        }
        .info-box {
            background-color: #f0fdfa;
            border-left: 4px solid #14b8a6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box strong {
            color: #0d9488;
        }
        .cta-button {
            display: inline-block;
            background-color: #14b8a6;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #0d9488;
        }
        .code-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            text-align: center;
            font-family: monospace;
            font-size: 18px;
            letter-spacing: 2px;
            font-weight: bold;
            color: #14b8a6;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .step-list {
            margin: 20px 0;
        }
        .step-list ol {
            margin: 0;
            padding-left: 20px;
        }
        .step-list li {
            margin-bottom: 10px;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✉️ Verifikasi Email Anda</h1>
        </div>

        <div class="content">
            <p class="greeting">
                Selamat datang di <strong>AICI - Platform Pembelajaran Robotika</strong>! 🎉
            </p>

            <p>
                Terima kasih telah mendaftar. Untuk menyelesaikan setup akun Anda, silakan verifikasi alamat email Anda.
            </p>

            <div class="info-box">
                <strong>ℹ️ Informasi:</strong> Verifikasi email hanya membutuhkan waktu beberapa detik. Klik tombol di bawah untuk memulai.
            </div>

            <p style="text-align: center;">
                <a href="{{ $verifyUrl }}" class="cta-button">
                    Verifikasi Email Saya
                </a>
            </p>

            <p style="text-align: center; color: #6b7280; font-size: 14px;">
                Atau copy-paste kode ini di browser:
            </p>

            <div class="code-box">
                {{ $code }}
            </div>

            <div class="step-list">
                <strong>Langkah Selanjutnya:</strong>
                <ol>
                    <li>Klik tombol "Verifikasi Email Saya" di atas</li>
                    <li>Akun Anda akan segera aktif</li>
                    <li>Login dan mulai belajar robotika!</li>
                </ol>
            </div>

            <p>
                Jika tombol tidak bekerja, copy dan tempel URL berikut ke browser Anda:
            </p>

            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all;">
                {{ $verifyUrl }}
            </div>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} AICI - Platform Pembelajaran Robotika. Semua hak dilindungi.</p>
            <p>Email ini dikirim ke {{ $email }} karena pendaftaran akun baru.</p>
            <p>Jika ini bukan Anda, silakan abaikan email ini.</p>
        </div>
    </div>
</body>
</html>
