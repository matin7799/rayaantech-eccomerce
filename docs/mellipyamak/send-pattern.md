این متد برای ارسال پیامک با متن پیشفرض از خط خدماتی اشتراکی استفاده می‌کند.

 آدرس API
POST
https://console.melipayamak.com/api/send/shared/f2610549d0e844fabadf4151dc11bd8c
پارامترهای ارسالی
{ 
  "bodyId": 524, 
  "to": "09123456789", 
  "args": ["arg1", "arg2"]
}
آرایۀ args حاوی متغیرهای موجود در متن پیشفرض شماست که به ترتیب جایگذاری خواهند شد

پاسخ دریافتی
{
  "recId": 3741437414,
  "status": "شرح خطا در صورت بروز"
}
از recId برای دریافت وضعیت ارسال می‌توانید استفاده کنید

راهنمای استفاده
قبل از اجرای این متد باید آیدی متن پیشفرض شما یا bodyId در ملی پیامک به تأیید رسیده باشد. سپس پارامترهای ارسالی را توسط POST به آدرس API ارسال کنید تا متد اجرا شود

در صورتی که امکان اتصال مطابق دستورالعمل ندارید، از بخش زیر، کد آماده مختص خودتان دریافت کنید. این کد بدون هیچ تغییری در پروژه شما قابل کپی بوده و اتصال برقرار می‌کند

کد آماده مختص شما

Node.js:
const https = require('https');
  
  const data = JSON.stringify({
      'bodyId': 524,
      'to': '09123456789',
      'args': ['arg1', 'arg2']
  });
  
  const options = {
      hostname: 'console.melipayamak.com',
      port: 443,
      path: '/api/send/shared/f2610549d0e844fabadf4151dc11bd8c',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
      }
  };
  
  const req = https.request(options, res => {
      console.log('statusCode: ' + res.statusCode);
  
      res.on('data', d => {
          process.stdout.write(d)
      });
  });
  
  req.on('error', error => {
      console.error(error);
  });
  
  req.write(data);
  req.end();