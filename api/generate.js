export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "GEMINI_API_KEY is not configured"
        });
    }

    const { topic } = req.body || {};

    if (!topic || typeof topic !== "string") {
        return res.status(400).json({
            error: "يرجى إدخال اسم العمل أو الموضوع."
        });
    }

    const systemPrompt = `
نظام معرفي دعوي–تربوي يحوّل الأعمال والأحوال إلى عبادة بالنية الصحيحة المنضبطة بالنص.

الاسم: سلسلة النيات مع بدري – أن تحيا بنيّة.

قواعد صارمة للإخراج:
أخرج بالترتيب:
خلاصة النيات بصيغة بطاقة أو قائمة
ثم مقدمة ثابتة
ثم حكم العمل
ثم من 7 إلى 12 نية بنص ومرجع من القرآن أو السنة الصحيحة
ثم التطبيق العملي
ثم الأسئلة الختامية
ثم الخاتمة الثابتة.

ممنوع الحديث الضعيف.
اذكر السورة ورقم الآية.
لا تذكر رقم الحديث إلا عند التأكد منه.
ممنوع استخدام: نويت أو قل في قلبك.
استخدم: استحضر بقلبك نية.
`;

    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${systemPrompt}\n\nالمطلوب استخراج النيات لهذا العمل بالتفصيل الكامل: ${topic}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            return res.status(geminiResponse.status).json({
                error:
                    data?.error?.message ||
                    "حدث خطأ أثناء الاتصال بخدمة Gemini."
            });
        }

        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(500).json({
                error: "لم يتم استلام نتيجة صالحة من Gemini."
            });
        }

        return res.status(200).json({ text });
    } catch (error) {
        return res.status(500).json({
            error: "حدث خطأ في الاتصال بالخادم."
        });
    }
}
