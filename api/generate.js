<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سلسلة النيات مع بدري – أن تحيا بنيّة</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Tajawal', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col justify-between">

    <!-- الهيدر -->
    <header class="bg-emerald-800 text-white py-6 shadow-md">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-3xl font-black mb-2">سلسلة النيات مع بدري</h1>
            <p class="text-emerald-100 text-lg">أن تحيا بنيّة.. تحويل الأعمال والأحوال إلى عبادة</p>
        </div>
    </header>

    <!-- المحتوى الرئيسي -->
    <main class="container mx-auto px-4 py-8 max-w-3xl flex-grow">
        
        <!-- صندوق البحث -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-100">
            <label for="topicInput" class="block text-lg font-bold text-slate-700 mb-3">ما هو العمل أو الموضوع الذي تريد استخراج نياته؟</label>
            <div class="flex flex-col sm:flex-row gap-3">
                <input type="text" id="topicInput" placeholder="مثال: طلب العلم، صلة الرحم، العمل اليومي..." 
                    class="flex-grow px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-lg">
                <button id="generateBtn" onclick="generateNiyyat()" 
                    class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3 rounded-xl transition duration-200 shadow-md">
                    استخراج النيات
                </button>
            </div>
        </div>

        <!-- صندوق النتيجة -->
        <div id="resultContainer" class="hidden bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-100">
            <div id="loadingDiv" class="text-center py-12 hidden">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mb-4"></div>
                <p class="text-lg font-medium text-slate-600">⏳ جاري استخراج النيات بعمق ودقة شرعية مطابقة تماماً للـ Custom GPT...</p>
            </div>
            <div id="outputContent" class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <!-- هنا ستظهر النتيجة بالتنسيق الشرعي الكامل -->
            </div>
        </div>

    </main>

    <!-- الفوتر -->
    <footer class="bg-slate-800 text-slate-300 py-4 text-center text-sm">
        <p>جميع الحقوق محفوظة © سلسلة النيات مع بدري</p>
    </footer>

    <!-- سكود الاتصال بالـ API -->
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

            // إظهار حاوية النتيجة وشاشة التحميل
            resultContainer.classList.remove('hidden');
            loadingDiv.classList.remove('hidden');
            outputContent.innerHTML = '';
            generateBtn.disabled = true;
            generateBtn.classList.add('opacity-50');

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ topic })
                });

                const data = await response.json();

                loadingDiv.classList.add('hidden');

                if (response.ok && data.reply) {
                    // عرض النتيجة مع معالجة الرموز والفقرات بشكل جميل
                    outputContent.innerHTML = formatMarkdown(data.reply);
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

        // دالة بسيطة لتحويل النص العادي إلى تنسيق HTML نظيف ومرتب
        function formatMarkdown(text) {
            return text
                .replace(/### (.*?)\n/g, '<h3 class="text-xl font-bold text-emerald-800 mt-6 mb-3 border-b pb-2">$1</h3>')
                .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold text-emerald-900 mt-8 mb-4">$1</h2>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                .replace(/\* (.*?)\n/g, '<li class="mb-2 list-disc list-inside">$1</li>')
                .replace(/\n/g, '<br>');
        }
    </script>
</body>
</html>
