export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    name, phone, email, message, _gotcha,
    typeLabel, goalLabel, platformLabel, scaleLabel, sectionsLabel, featuresLabel, contentLabel, urgencyLabel,
    formattedPrice 
  } = req.body;
  
  // Security: Honeypot check for bots
  if (_gotcha && _gotcha !== "") {
    return res.status(400).json({ error: "Bot detected" });
  }

  // Security: No hardcoded secrets.
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const FORMSPREE_ID = process.env.FORMSPREE_ID || "xpqbndjo";
  
  let text = `🚀 <b>НОВАЯ ЗАЯВКА С САЙТА</b>\n\n`;

  if (name && name !== 'Не указано') text += `👤 <b>Имя:</b> ${name}\n`;
  if (phone) text += `📞 <b>Телефон:</b> ${phone}\n`;
  if (email) text += `📧 <b>Email:</b> ${email}\n`;
  if (message && !typeLabel) text += `📝 <b>Сообщение:</b> ${message}\n`;
  
  // Данные из Elite Квиза
  if (typeLabel) {
    text += `\n--- 🚀 ELITE QUIZ BRIEF ---\n`;
    text += `🛠 <b>Услуга:</b> ${typeLabel}\n`;
    if (goalLabel) text += `🎯 <b>Цель:</b> ${goalLabel}\n`;
    if (platformLabel) text += `💻 <b>Платформа:</b> ${platformLabel}\n`;
    if (scaleLabel) text += `📏 <b>Объем:</b> ${scaleLabel}\n`;
    if (sectionsLabel && sectionsLabel !== 'Нет') text += `📑 <b>Разделы:</b> ${sectionsLabel}\n`;
    if (featuresLabel && featuresLabel !== 'Нет') text += `➕ <b>Фичи:</b> ${featuresLabel}\n`;
    if (contentLabel) text += `🎨 <b>Контент:</b> ${contentLabel}\n`;
    if (urgencyLabel) text += `⏱ <b>Срок:</b> ${urgencyLabel}\n`;
    text += `\n💰 <b>Оценка:</b> ${formattedPrice} ₸\n`;
  }


  let tgSuccess = false;
  let formspreeSuccess = false;

  try {
    // 1. Отправка в Telegram (только если есть токены)
    if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
      const tgResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'HTML'
        })
      });
      tgSuccess = tgResponse.ok;
    } else {
      console.warn('Telegram tokens missing');
    }

    // 2. Дублирование на Formspree (Email)
    const fsResponse = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    formspreeSuccess = fsResponse.ok;

    if (formspreeSuccess || tgSuccess) {
      return res.status(200).json({ 
        success: true, 
        delivered: { telegram: tgSuccess, email: formspreeSuccess } 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to deliver to all services' 
      });
    }
  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

