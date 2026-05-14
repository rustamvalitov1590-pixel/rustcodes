export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    name, phone, email, message, _gotcha,
    typeLabel, goalLabel, platformLabel, scaleLabel, sectionsLabel, featuresLabel, contentLabel, urgencyLabel,
    formattedPrice 
  } = req.body;

  // Функция для экранирования спецсимволов HTML для Telegram
  const escapeHTML = (str) => {
    if (!str) return "";
    return str.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };
  
  const safeName = escapeHTML(name);
  const safePhone = escapeHTML(phone);
  const safeEmail = escapeHTML(email);
  const safeMessage = escapeHTML(message);
  const safeType = escapeHTML(typeLabel);
  const safeGoal = escapeHTML(goalLabel);
  const safePlatform = escapeHTML(platformLabel);
  const safeScale = escapeHTML(scaleLabel);
  const safeSections = escapeHTML(sectionsLabel);
  const safeFeatures = escapeHTML(featuresLabel);
  const safeContent = escapeHTML(contentLabel);
  const safeUrgency = escapeHTML(urgencyLabel);
  const safePrice = escapeHTML(formattedPrice);
  
  // Security: Honeypot check for bots
  if (_gotcha && _gotcha !== "") {
    return res.status(400).json({ error: "Bot detected" });
  }

  // Security: No hardcoded secrets.
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const FORMSPREE_ID = process.env.FORMSPREE_ID || "xpqbndjo";
  
  let text = `🚀 <b>НОВАЯ ЗАЯВКА С САЙТА</b>\n\n`;

  if (safeName && safeName !== 'Не указано') text += `👤 <b>Имя:</b> ${safeName}\n`;
  if (safePhone) text += `📞 <b>Телефон:</b> ${safePhone}\n`;
  if (safeEmail) text += `📧 <b>Email:</b> ${safeEmail}\n`;
  if (safeMessage && !safeType) text += `📝 <b>Сообщение:</b> ${safeMessage}\n`;
  
  // Данные из Elite Квиза
  if (safeType) {
    text += `\n--- 🚀 ELITE QUIZ BRIEF ---\n`;
    text += `🛠 <b>Услуга:</b> ${safeType}\n`;
    if (safeGoal) text += `🎯 <b>Цель:</b> ${safeGoal}\n`;
    if (safePlatform) text += `💻 <b>Платформа:</b> ${safePlatform}\n`;
    if (safeScale) text += `📏 <b>Объем:</b> ${safeScale}\n`;
    if (safeSections && safeSections !== 'Нет') text += `📑 <b>Разделы:</b> ${safeSections}\n`;
    if (safeFeatures && safeFeatures !== 'Нет') text += `➕ <b>Фичи:</b> ${safeFeatures}\n`;
    if (safeContent) text += `🎨 <b>Контент:</b> ${safeContent}\n`;
    if (safeUrgency) text += `⏱ <b>Срок:</b> ${safeUrgency}\n`;
    text += `\n💰 <b>Оценка:</b> ${safePrice} ₸\n`;
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

      const tgResult = await tgResponse.json();
      
      if (!tgResponse.ok) {
        console.error('Telegram Error:', tgResult);
        throw new Error(`Telegram API Error: ${tgResult.description || tgResponse.statusText}`);
      }
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

