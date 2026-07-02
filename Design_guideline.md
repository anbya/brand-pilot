Design Guideline

Goal

Buat aplikasi terlihat clean, modern, minimalist, premium, dan mudah digunakan. Hindari tampilan yang terlalu ramai, terlalu banyak warna, atau komponen yang tidak perlu.

Design Principles

1. Minimalist
   
   - Gunakan elemen seperlunya.
   - Hindari border berlebihan.
   - Hindari shadow yang terlalu kuat.
   - Fokus pada konten dan aksi utama.

2. Clean Layout
   
   - Gunakan spacing yang lega.
   - Setiap section harus punya jarak yang konsisten.
   - Jangan menumpuk terlalu banyak informasi dalam satu layar.

3. Modern SaaS Style
   
   - Gunakan card-based layout.
   - Gunakan rounded corner.
   - Gunakan typography yang rapi.
   - Gunakan empty state, loading state, dan error state yang jelas.

4. Consistency
   
   - Semua button, input, card, modal, dan table harus mengikuti style yang sama.
   - Jangan membuat style berbeda-beda antar halaman.

---

Visual Style

Color Palette

Gunakan warna netral sebagai dasar.

colors: {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626"
}

Background

- App background: "#F8FAFC"
- Card/container: "#FFFFFF"
- Jangan gunakan background terlalu gelap kecuali mode dark dibuat khusus.

Border

- Gunakan border tipis: "1px solid #E2E8F0"
- Hindari border hitam tebal.
- Gunakan border-radius:
  - Small component: "8px"
  - Card: "12px"
  - Modal/dialog: "16px"

Shadow

Gunakan shadow sangat soft.

box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);

Hindari shadow besar yang membuat UI terlihat berat.

---

Typography

Gunakan font modern seperti:

font-family: Inter, Geist, system-ui, sans-serif;

Font Size

text: {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px"
}

Rules

- Heading harus bold tapi tidak terlalu besar.
- Body text gunakan warna "textSecondary".
- Jangan gunakan terlalu banyak variasi ukuran font.
- Maksimal gunakan 3 level typography dalam satu halaman.

---

Spacing

Gunakan spacing konsisten:

spacing: {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px"
}

Layout Rules

- Padding card: "24px"
- Gap antar komponen: "16px"
- Gap antar section: "32px"
- Page padding desktop: "32px"
- Page padding mobile: "16px"

---

Component Guidelines

Button

Primary button:

background: #2563EB;
color: white;
border-radius: 10px;
padding: 10px 16px;
font-weight: 500;

Rules:

- Satu halaman maksimal punya 1 primary action utama.
- Secondary action gunakan outline atau ghost button.
- Danger action harus jelas tapi tidak dominan.

Input

background: white;
border: 1px solid #E2E8F0;
border-radius: 10px;
padding: 10px 12px;
font-size: 14px;

Focus state:

border-color: #2563EB;
box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);

Card

background: white;
border: 1px solid #E2E8F0;
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);

Rules:

- Card harus punya title yang jelas.
- Jangan isi card terlalu padat.
- Gunakan icon kecil hanya jika membantu pemahaman.

Table

Rules:

- Header table menggunakan background soft.
- Row height minimal "48px".
- Gunakan hover state yang subtle.
- Action button di table jangan terlalu mencolok.

Modal

Rules:

- Modal max-width "480px" atau "640px".
- Gunakan title, description, content, dan footer action.
- Primary action di kanan bawah.
- Cancel action di kiri primary action.

---

Layout

Dashboard Page

Struktur ideal:

Page Header
- Title
- Description
- Primary Action

Stats Cards
Main Content
Secondary Content

Form Page

Struktur ideal:

Page Header
Form Card
Action Footer

Empty State

Setiap halaman kosong harus punya:

- Icon sederhana
- Title
- Description
- Primary action

Contoh:

No posts yet
Create your first social media post to start managing your content.
[Create Post]

---

Responsive Design

Desktop

- Gunakan max-width container bila konten terlalu lebar.
- Sidebar boleh fixed.
- Table boleh full width.

Mobile

- Sidebar berubah menjadi drawer.
- Grid card menjadi 1 kolom.
- Button full width jika berada dalam form penting.
- Jangan membuat horizontal scroll kecuali untuk table.

---

Interaction

Hover

- Button hover sedikit lebih gelap.
- Card hover boleh menggunakan border primary soft atau shadow ringan.
- Jangan gunakan animasi berlebihan.

Animation

Gunakan animasi singkat:

transition: all 150ms ease;

Rules:

- Hindari animasi lambat.
- Hindari bounce animation.
- Gunakan motion hanya untuk feedback UI.

---

Icons

Gunakan icon yang simple dan konsisten, misalnya:

- Lucide React
- Heroicons
- Phosphor Icons

Rules:

- Ukuran icon umum: "16px" atau "20px"
- Jangan mencampur banyak style icon.
- Icon tidak boleh menggantikan label pada action penting.

---

UX Rules

1. Semua action penting harus jelas.
2. Jangan membuat user menebak.
3. Selalu tampilkan loading state.
4. Selalu tampilkan error message yang manusiawi.
5. Selalu tampilkan confirmation untuk delete.
6. Form harus punya validation yang jelas.
7. Gunakan bahasa yang singkat dan mudah dipahami.

---

Tailwind Implementation Rules

Gunakan class Tailwind yang konsisten:

<div className="min-h-screen bg-slate-50 text-slate-900">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      Content
    </div>
  </div>
</div>

Common Classes

Page:

"min-h-screen bg-slate-50 text-slate-900"

Container:

"mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"

Card:

"rounded-xl border border-slate-200 bg-white p-6 shadow-sm"

Button primary:

"inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"

Button secondary:

"inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"

Input:

"w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"

Label:

"mb-2 block text-sm font-medium text-slate-700"

Description:

"text-sm text-slate-500"

---

Do

- Gunakan banyak whitespace.
- Gunakan warna netral.
- Gunakan komponen reusable.
- Gunakan hierarchy visual yang jelas.
- Gunakan UI yang terasa ringan dan cepat.

Don't

- Jangan gunakan terlalu banyak warna.
- Jangan gunakan shadow tebal.
- Jangan gunakan border hitam.
- Jangan membuat layout terlalu padat.
- Jangan membuat button primary terlalu banyak.
- Jangan membuat animasi berlebihan.
- Jangan mencampur banyak style icon.
