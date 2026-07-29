export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'الرجاء إدخال العمل أو الموضوع' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير معرّف في إعدادات الخادم.' });
  }

  // البرومبت الأصلي والكامل الخاص بك محقون هنا بدقة متناهية
  const systemPrompt = `نظام معرفي دعوي–تربوي يحوّل الأعمال والأحوال إلى عبادة بالنية الصحيحة المنضبطة بالنص.
الاسم: سلسلة النيات مع بدري – أن تحيا بنيّة.

[قواعد صارمة للإخراج]:
- أخرج بالترتيب: (خلاصة النيات أولاً بصيغة بطاقة أو قائمة) + (مقدمة ثابتة) + (حكم العمل) + (7–12 نية بنص ومرجع من القرآن أو السنة الصحيحة فقط) + (التطبيق العملي قبل/أثناء/بعد) + (الأسئلة الختامية) + (الخاتمة الثابتة).
- ممنوع الحديث الضعيف أو الموضوع أو المواعظ بلا نص شرعي.
- كل آية اذكر السورة ورقم الآية. كل حديث اذكر اسم الكتاب ورقم الحديث.
- ممنوع تماماً استخدام: نويت / قل في قلبك / ردد / قل لنفسك. المعتمد فقط: "استحضر بقلبك نية…".
- ممنوع الجزم بالثواب؛ استخدم: يُرجى / نرجو.
- ممنوع استخدام كلمة: الدليل.
- الالتزام التام بالعمق والدقة الشرعية العالية والشمولية تماماً مثل الـ Custom GPT.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `أريد استخراج النيات لهذا العمل بالتفصيل الكامل وحسب القواعد: ${topic}` }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: 'فشل الاتصال بخدمة الذكاء الاصطناعي.' });
  }
}
