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
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
        .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-box strong {
            color: #b45309;
        }
        .cta-button {
            display: inline-block;
            background-color: #dc2626;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #b91c1c;
        }
        .alternative-text {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 13px;
            word-break: break-all;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .notice {
            background-color: #e0f2fe;
            border-left: 4px solid #0284c7;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
        }
        .notice strong {
            color: #0369a1;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Reset Password</h1>
        </div>

        <div class="content">
            <p class="greeting">
                Halo <strong>{{ $userName }}</strong>,
            </p>

            <p>
                Kami menerima permintaan untuk mereset password akun Anda di AICI Platform. Jika Anda tidak membuat permintaan ini, silakan abaikan email ini.
            </p>

            <div class="warning-box">
                <strong>⚠️ Penting:</strong> Link reset password ini hanya berlaku selama 60 menit. Jangan bagikan link ini kepada orang lain.
            </div>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ $resetUrl }}" class="cta-button">
                    Reset Password Saya
                </a>
            </p>

            <p>
                Atau salin dan tempel URL berikut di browser Anda:
            </p>

            <div class="alternative-text">
                {{ $resetUrl }}
            </div>

            <div class="notice">
                <strong>💡 Tips Keamanan:</strong> Setelah reset password, gunakan password yang kuat dengan kombinasi huruf besar, huruf kecil, angka, dan simbol. Jangan gunakan informasi pribadi seperti nama atau tanggal lahir.
            </div>

            <p>
                Jika Anda mengalami kesulitan atau memiliki pertanyaan, hubungi tim support kami.
            </p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} AICI - Platform Pembelajaran Robotika. Semua hak dilindungi.</p>
            <p>Email ini dikirim ke {{ auth()->user()->email ?? 'alamat email Anda' }} karena permintaan reset password.</p>
        </div>
    </div>
</body>
</html>
