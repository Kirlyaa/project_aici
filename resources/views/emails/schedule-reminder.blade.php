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
        .session-info {
            background-color: #f0fdfa;
            border-left: 4px solid #14b8a6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .session-info h3 {
            margin: 0 0 10px 0;
            color: #0d9488;
            font-size: 18px;
        }
        .session-detail {
            margin: 8px 0;
            font-size: 14px;
        }
        .session-detail strong {
            color: #0d9488;
            display: inline-block;
            width: 120px;
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
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .tips {
            background-color: #fffbeb;
            border-left: 4px solid #fbbf24;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
        }
        .tips strong {
            color: #b45309;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Reminder Sesi Pembelajaran</h1>
        </div>

        <div class="content">
            <p class="greeting">
                Halo <strong>{{ $user->name }}</strong>,
            </p>

            <p>
                Kami ingin mengingatkan Anda bahwa sesi pembelajaran Anda akan dimulai dalam <strong>{{ $hoursUntil }} jam</strong>.
            </p>

            <div class="session-info">
                <h3>📖 Detail Sesi</h3>
                <div class="session-detail">
                    <strong>Judul:</strong> {{ $session->title }}
                </div>
                <div class="session-detail">
                    <strong>Tanggal:</strong> {{ $session->date_string }}
                </div>
                <div class="session-detail">
                    <strong>Jam:</strong> {{ $session->date->format('H:i') ?? 'Belum ditentukan' }}
                </div>
                @if($session->description)
                    <div class="session-detail">
                        <strong>Deskripsi:</strong> {{ $session->description }}
                    </div>
                @endif
                @if($session->modules && count($session->modules) > 0)
                    <div class="session-detail">
                        <strong>Modul:</strong> {{ $session->modules->pluck('name')->join(', ') }}
                    </div>
                @endif
            </div>

            <div class="tips">
                <strong>💡 Tips:</strong> Pastikan Anda sudah menyiapkan semua alat dan bahan yang diperlukan. Jika Anda memiliki pertanyaan atau perlu bantuan, hubungi tutor Anda lebih awal.
            </div>

            <div style="text-align: center;">
                <a href="{{ $sessionUrl }}" class="cta-button">
                    Lihat Detail Sesi
                </a>
            </div>

            <p>
                Terima kasih telah menjadi bagian dari platform pembelajaran kami. Kami berkomitmen untuk memberikan pengalaman terbaik!
            </p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} AICI - Platform Pembelajaran Robotika. Semua hak dilindungi.</p>
            <p>Email ini dikirim ke {{ $user->email }} karena Anda terdaftar di platform kami.</p>
        </div>
    </div>
</body>
</html>
