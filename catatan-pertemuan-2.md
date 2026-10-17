# Catatan Perkuliahan Pertemuan 2: Model dan Taksonomi Kolaborasi
**Dosen Pengampu**: M. Amran Hakim Siregar, S.Tr.Kom., M.Kom  
**Mata Kuliah**: Komputasi Kolaboratif  

Berikut adalah 5 poin ringkasan materi dari bahan ajar Pertemuan 2:

1. **Matriks Waktu-Ruang (*Time-Space Matrix*)**  
   Sistem kolaborasi diklasifikasikan ke dalam matriks empat kuadran berdasarkan dimensi waktu dan tempat:
   - **Waktu Sama, Tempat Sama (Tatap Muka)**: Kolaborasi langsung di satu lokasi (contoh: rapat ruang kerja, papan tulis fisik).
   - **Waktu Sama, Tempat Berbeda (Sinkron Jarak Jauh)**: Interaksi langsung waktu-nyata via jaringan (contoh: video conference di Zoom/Meet, obrolan daring, real-time co-editing).
   - **Waktu Berbeda, Tempat Sama (Asinkron Setempat)**: Berbagi informasi di lokasi fisik yang sama pada waktu berlainan (contoh: papan pengumuman kantor, sistem kerja giliran/shift).
   - **Waktu Berbeda, Tempat Berbeda (Asinkron Jarak Jauh)**: Kolaborasi terdistribusi penuh tanpa ikatan waktu dan lokasi (contoh: email, forum LMS, wiki, serta Git & GitHub).

2. **Perbandingan Komunikasi Sinkron vs Asinkron**  
   - **Komunikasi Sinkron**: Menyediakan umpan balik seketika (*instant feedback*) yang sangat ideal untuk sesi curah pendapat (*brainstorming*) dan perumusan keputusan cepat, tetapi menuntut ketersediaan jadwal serentak dan koneksi stabil.
   - **Komunikasi Asinkron**: Memberi keleluasaan peserta merespons sesuai ritme kerja masing-masing (*deep work*) dan sangat cocok untuk tim lintas zona waktu dengan keunggulan jejak dokumentasi tertulis yang runtut.
   - **Praktik Terbaik**: Mengombinasikan keduanya—gunakan komunikasi sinkron untuk bersepakat/mengambil keputusan, dan komunikasi asinkron untuk mendokumentasikan hasil pekerjaan.

3. **Klasifikasi dan Kategori Groupware**  
   Perangkat lunak kolaboratif (*groupware*) dikelompokkan ke dalam 6 kategori fungsional: media komunikasi (pesan/surel), alat konferensi (audio/video/berbagi layar), penyuntingan bersama (co-authoring berkas), manajemen proyek (papan Kanban & issue tracker), sistem pengontrol versi (*version control system* seperti Git & GitHub), serta pendukung keputusan (*polling*, voting, papan tulis digital).

4. **Empat Fitur Kunci Sistem Kolaboratif**  
   Sistem kolaborasi yang efektif harus menyediakan empat kapabilitas inti:
   - **Ruang Kerja Bersama (*Shared Workspace*)**: Wadah bersama tempat artefak data dapat diakses dan disunting oleh anggota yang berwenang.
   - **Kesadaran Tim (*Awareness*)**: Visibilitas terhadap keberadaan rekan tim dan apa yang sedang mereka kerjakan (misal kursor aktif, indikator kehadiran daring).
   - **Kontrol Akses (*Access Control*)**: Pengaturan hak akses bertingkat (peran baca, tulis, admin) guna menjamin tata kelola dan keamanan data.
   - **Notifikasi dan Riwayat Perubahan**: Sistem pemberitahuan pembaruan serta rekaman riwayat versi untuk melacak dan memulihkan pekerjaan sebelumnya.

5. **Arsitektur Sistem: Terpusat (*Client-Server*) vs Terdistribusi (*Peer-to-Peer*)**  
   - **Arsitektur Terpusat**: Mengandalkan server pusat sebagai sumber kebenaran tunggal (*single source of truth*). Model ini mempermudah kontrol dan pengelolaan data, namun rentan mengalami kelumpuhan jika server pusat padam (*single point of failure*).
   - **Arsitektur Terdistribusi (*Peer-to-Peer*)**: Setiap pengguna menyimpan salinan repositori secara utuh dan saling bertukar revisi (sebagaimana prinsip dasar Git). Model ini sangat tangguh dan mandiri dari ketergantungan server tunggal, kendati sinkronisasi dan rekonsiliasi data membutuhkan mekanisme penanganan konflik yang lebih cermat.
