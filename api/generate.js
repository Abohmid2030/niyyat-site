const SYSTEM_PROMPT = `
أنت نظام معرفي دعوي وتربوي باسم:
"سلسلة النيات مع بدري – أن تحيا بنيّة".

مهمتك تحويل الأعمال والأحوال المباحة والمشروعة إلى فرص للأجر باستحضار النيات الصحيحة المنضبطة بالقرآن والسنة الصحيحة.

قواعد الإخراج:

1. ابدأ بعنوان واضح مرتبط بالعمل المطلوب.
2. اذكر حكم العمل بإيجاز.
3. لا تجعل العمل المحرم أو المشتبه فيه عبادة بمجرد النية.
4. قدّم من 7 إلى 12 نية صحيحة وقابلة للتطبيق.
5. اكتب كل نية بصيغة: "استحضر بقلبك نية..."
6. لا تستخدم: "نويت" أو "قل في قلبك".
7. اربط النيات بأدلة صحيحة من القرآن أو السنة الصحيحة فقط.
8. عند الاستشهاد بالقرآن اذكر اسم السورة ورقم الآية.
9. عند الاستشهاد بالسنة لا تذكر حديثًا ضعيفًا أو غير ثابت.
10. لا تذكر رقم الحديث إلا إذا كنت متأكدًا منه.
11. لا تكرر النيات بصيغ متشابهة.
12. اختم بتطبيق عملي مختصر.
13. اختم بالتذكير بأن قبول العمل يحتاج إلى الإخلاص لله وموافقة سنة النبي ﷺ.
14. اجعل النص عربيًا واضحًا ومنظمًا ومناسبًا لعامة الناس.
`;

export default {
    async fetch(request) {

        if (request.method !== 'POST') {
            return Response.json(
                { error: 'الطريقة غير مسموح بها.' },
                {
                    status: 405,
                    headers: { Allow: 'POST' }
                }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return Response.json(
                { error: 'لم يتم إعداد مفتاح Gemini داخل Vercel.' },
                { status: 500 }
            );
        }

        let body;

        try {
            body = await request.json();
        } catch {
            return Response.json(
                { error: 'بيانات الطلب غير صالحة.' },
                { status: 400 }
            );
        }

        const topic =
            typeof body?.topic === 'string'
                ? body.topic.trim()
                : '';

        if (!topic) {
            return Response.json(
                { error: 'يرجى إدخال اسم العمل أو الموضوع.' },
                { status: 400 }
            );
        }

        if (topic.length > 300) {
            return Response.json(
                { error: 'النص طويل جدًا. اكتب اسم العمل أو الموضوع باختصار.' },
                { status: 400 }
            );
        }

        try {
            const geminiResponse = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': apiKey
                    },

                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [
                                {
                                    text: SYSTEM_PROMPT
                                }
                            ]
                        },

                        contents: [
                            {
                                role: 'user',
                                parts: [
                                    {
                                        text:
                                            'استخرج النيات الصالحة لهذا العمل أو الموضوع: ' +
                                            topic
                                    }
                                ]
                            }
                        ],

                        generationConfig: {
                            maxOutputTokens: 3000
                        }
                    })
                }
            );

            const data = await geminiResponse.json();

            if (!geminiResponse.ok) {
                const message =
                    data?.error?.message ||
                    'حدث خطأ أثناء الاتصال بخدمة Gemini.';

                return Response.json(
                    { error: message },
                    { status: geminiResponse.status }
                );
            }

            const text =
                data?.candidates?.[0]?.content?.parts
                    ?.map(function (part) {
                        return part?.text || '';
                    })
                    .join('')
                    .trim();

            if (!text) {
                return Response.json(
                    { error: 'لم تصل نتيجة نصية صالحة من Gemini.' },
                    { status: 502 }
                );
            }

            return Response.json(
                { text: text },
                {
                    status: 200,
                    headers: {
                        'Cache-Control': 'no-store'
                    }
                }
            );

        } catch (error) {
            console.error('Gemini request failed:', error);

            return Response.json(
                { error: 'تعذر الاتصال بخدمة الذكاء الاصطناعي حاليًا.' },
                { status: 500 }
            );
        }
    }
};
