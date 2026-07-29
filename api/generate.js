<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سلسلة النيات مع بدري – أن تحيا بنيّة</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Tajawal', sans-serif; background-color: #f8fafc; }
        .custom-card {
            background: linear-gradient(to bottom right, #f0fdf4, #ffffff);
            border: 1px solid #bbf7d0;
        }
    </style>
</head>
<body class="text-slate-800 min-h-screen flex flex-col justify-between">

    <!-- الهيدر -->
    <header class="bg-emerald-800 text-white py-8 shadow-md">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-3xl md:text-4xl font-black mb-2">سلسلة النيات مع بدري</h1>
            <p class="text-emerald-100 text-lg">أن تحيا بنيّة.. تحويل الأعمال والأحوال إلى عبادة</p>
        </div>
    </header>

    <!-- المحتوى الرئيسي -->
    <main class="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        
        <!-- صندوق البحث -->
        <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-slate-100">
            <label for="topicInput" class="block text-lg font-bold text-slate-700 mb-3">ما هو العمل أو الموضوع الذي تريد استخراج نياته؟</label>
            <div class="flex flex-col sm:flex-row gap-3">
                <input type="text" id="topicInput" placeholder="مثال: صلة الرحم، طلب العلم، التجارة، الصيام..." 
                    class="flex-grow px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-lg">
                <button id="generateBtn" onclick="generateNiyyat()" 
                    class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2">
                    <span>استخراج النيات</span>
                </button>
            </div>
        </div>

        <!-- صندوق النتيجة -->
        <div id="resultContainer" class="hidden bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100">
            <div id="loadingDiv" class="text-center py-16 hidden">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mb-4"></div>
                <p class="text-lg font-medium text-emerald-800">⏳ جاري استخراج النيات بعمق ودقة شرعية مطابقة تماماً للـ Custom GPT...</p>
            </div>
            <div id="outputContent" class="text-slate-700 leading-relaxed space-y-6">
                <!-- هنا ستظهر النتيجة بالتنسيق الاحترافي المميز -->
            </div>
        </div>

    </main>

    <!-- الفوتر -->
    <footer class="bg-slate-800 text-slate-300 py-6 text-center text-sm border-t border-slate-700">
        <p>جميع الحقوق محفوظة © سلسلة النيات مع بدري</p>
    </footer>

    <!-- سكربت الاتصال والتنسيق الجذاب -->
    <script>
        async function generateNiyyat() {
            const topic = document.getElementById('topicInput').value.trim();
            const resultContainer = document.getElementById('resultContainer');
            const loadingDiv = document.getElementById('loadingDiv');
            const outputContent = document.getElementById('outputContent');
            const generateBtn = document.getElementById('generateBtn');

            if (!topic) {
                alert('الرجاء إدخال اسم العمل أو الموضوع أولاً.');
                return;
            }

            resultContainer.classList.remove('hidden');
            loadingDiv.classList.remove('hidden');
            outputContent.innerHTML = '';
            generateBtn.disabled = true;
            generateBtn.classList.add('opacity-50');

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic })
                });

                const data = await response.json();
                loadingDiv.classList.add('hidden');

                if (response.ok && data.reply) {
                    outputContent.innerHTML = formatBeautifulResult(data.reply);
                } else {
                    outputContent.innerHTML = `<div class="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">خطأ: ${data.error || 'حدث خطأ غير متوقع أثناء المعالجة.'}</div>`;
                }

            } catch (err) {
                loadingDiv.classList.add('hidden');
                outputContent.innerHTML = `<div class="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">فشل الاتصال بالخادم. تأكد من إعدادات الشبكة.</div>`;
            } finally {
                generateBtn.disabled = false;
                generateBtn.classList.remove('opacity-50');
            }
        }

        // دالة لتنسيق النصوص وإعطاء مظهر بطاقات وأيقونات مميزة للعين
        function formatBeautifulResult(text) {
            let html = text
                // العناوين الرئيسية الكبيرة
                .replace(/### (.*?)\n/g, '<h3 class="text-xl md:text-2xl font-black text-emerald-900 mt-8 mb-4 border-r-4 border-emerald-600 pr-3">$1</h3>')
                .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold text-emerald-900 mt-10 mb-6">$1</h2>')
                // الكلمات البارزة
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-emerald-800">$1</strong>')
                // النقاط مع إضافة أيقونات جمالية
                .replace(/\* (.*?)\n/g, '<li class="mb-3 flex items-start gap-2 text-slate-700"><span class="text-emerald-600 font-bold mt-1">✦</span><span>$1</span></li>')
                .replace(/\n/g, '<br>');

            return `<div class="custom-card p-6 rounded-2xl shadow-sm mb-6">${html}</div>`;
        }
    </script>
</body>
</html>
