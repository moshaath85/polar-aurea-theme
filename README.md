# Aurea — ثيم سلة بريميوم

ثيم فخم عصري لمنصة سلة بمحرّك **Twilight**، يتميّز ببنر سينمائي متحرك، نظام تصميم إديتوريال (فحمي/عاجي + ذهبي)، ودعم كامل للعربية والإنجليزية.

| البند | القيمة |
|---|---|
| اسم الثيم | **Aurea** (كلمة واحدة، ٥ أحرف ✅) |
| القطاع | Fashion / أزياء |
| الإصدار | 1.0.0 |
| المحرّك | Salla Twilight |
| الحجم المبني | ~0.6MB (أقل من حد **1MB** للثيم العام) |
| RTL / LTR | مدعوم |
| يعمل بدون JS | نعم (Progressive enhancement) |

---

## ✅ قائمة متطلبات سلة (تحققنا منها)

| المتطلب (حسب وثائق سلة) | الحالة |
|---|---|
| `twilight.json` في الجذر بمفاتيح: `name`, `repository`, `author_email`, `features`, `settings`, `components` | ✅ مطابق تمامًا لمخطط ثيم Raed الرسمي |
| مكوّنات مخصّصة غنية بالحقول | ✅ 10 مكوّنات |
| مجلد `public/` مبني | ✅ (app.js/css · home.js · product.js/css · images) |
| تركيز قطاعي واضح | ✅ Fashion |
| مختلف جوهريًا عن Raed | ✅ تصميم/مكوّنات/نظام تصميم مستقل |
| الاسم كلمة واحدة < 14 حرف، بلا رموز | ✅ Aurea |
| حد الحجم: 1MB عام / 2MB خاص | ✅ ~0.6MB |
| Changelog | ✅ `CHANGELOG.md` |
| دعم RTL | ✅ |

**عند التقديم للنشر تأكد من:**
- بيانات الدعم (إيميل + موقع + جوال + شات + رابط توثيق) — الرد خلال **يومي عمل**.
- **٤ لقطات على الأقل** بمقاس **1366×768** (ديسكتوب + موبايل، بلا نصوص أو شعارات داخل الصور).
- **متجر معاينة** واحد على الأقل (حتى ٤)، بمحتوى حقيقي بلا Lorem Ipsum.
- السعر: **250 ر.س** كحد أدنى للعام، **1000 ر.س** للخاص.

---

## التثبيت والبناء

```bash
npm install
npm run production          # يبني src/ → public/
```

يتطلّب: Node ≥ 20، وحساب **Salla Partners** + **GitHub** + `@salla.sa/cli`.

---

## الرفع إلى سلة

### الطريقة أ — إمبورت من GitHub (الأسرع)
```bash
cd theme
git init
git add .
git commit -m "Aurea v1.0.0"
git branch -M main
git remote add origin <YOUR_PRIVATE_REPO_URL>
git push -u origin main
```
ثم: **Salla Partners → My Themes → Create theme → Import theme** واختر المستودع.

### الطريقة ب — Salla CLI
```bash
npm i -g @salla.sa/cli
salla login
salla theme create          # Create a new theme  (ينشئ مستودعًا خاصًا)
# ادفع ملفات هذا الثيم للمستودع
salla theme preview         # اختر متجرًا تجريبيًا
salla theme publish         # طلب النشر
```

> ⚠️ **لا يوجد رفع ZIP مباشر للثيمات في سلة** — الرفع يتم عبر ربط مستودع GitHub.
> حزمة الـ ZIP المرفقة هي محتوى المستودع جاهزًا للدفع.

### بعد النشر
1. أكمل **Listing Information**: لقطات، متجر معاينة، السعر، بيانات الدعم.
2. اضغط **Send publication request**.
3. مراجعة فريق سلة → الظهور في متجر الثيمات.
4. أي تحديث لاحق = **طلب نشر جديد** يمر بالمراجعة.

---

## البنية

```
theme/
├── twilight.json            # 10 مكوّنات + 11 إعدادًا + features
├── webpack.config.js        # entries: app / home / product
├── postcss.config.js
├── package.json
├── CHANGELOG.md
├── public/                  # الأصول المبنية (تُرفع مع الثيم)
│   ├── app.css · app.js · home.js · product.css · product.js
│   └── images/
└── src/
    ├── assets/{styles,js,images}
    ├── locales/{ar,en}.json
    └── views/
        ├── layouts/master.twig
        ├── components/header · footer · home
        └── pages/ index · cart · product(single/index) · page-single · thank-you · blog · brands
```

**مكوّنات الصفحة الرئيسية:** `hero` · `marquee` · `categories` · `featured` · `story` · `ticker` · `lookbook` · `editorial` · `features` · `testimonials` · `newsletter`

---

## إعدادات مهمة في `twilight.json`

- **hero**: الصور، النص التمهيدي/العنوان/الوصف/الزر لكل شريحة، النمط (full/object)، مدة العرض، تشغيل Ken Burns.
- **brand_wordmark**: شعار فاتح للخلفيات الداكنة.
- **header_is_sticky**, **show_announcement**, **product_sticky_bar**, **product_show_breadcrumbs**, **enable_add_product_toast**.

---

## قبل النشر العام
- استبدل `repository` و `author_email` في `twilight.json` ببياناتك.
- الصور الحالية أصول تجريبية؛ استبدلها بصورك لأي نشر عام (تأكد من ملكية الصور).
- جرّب الثيم على **متجر معاينة** في سلة قبل طلب النشر.
