از این متد برای بررسی پیامک‌های ارسالی یا دریافتی استفاده کنید

 آدرس API
POST
https://console.melipayamak.com/api/receive/messages/f2610549d0e844fabadf4151dc11bd8c
پارامترهای ارسالی
{ 
  "type": "in", 
  "number": "5000xxx", 
  "index": 0,
  "count": 100
}
پارامتر type تعیین کنندۀ نوع پیام (دریافتی، ارسالی یا هردو) بوده و می‌توانید با مقادیر in ,out و all جایگزین کنید

پاسخ دریافتی
{
  "messages": [{}],
  "status": "شرح خطا در صورت بروز"
}
پارامتر messages آرایه‌ای از پیامک‌ با جزئیات کامل است که در اینجا از درج آن صرف نظر کردیم

راهنمای استفاده
پارامترهای ارسالی را توسط POST به آدرس API ارسال کنید تا متد اجرا شود

در صورتی که امکان اتصال مطابق دستورالعمل ندارید، از بخش زیر، کد آماده مختص خودتان دریافت کنید. این کد بدون هیچ تغییری در پروژه شما قابل کپی بوده و اتصال برقرار می‌کند

کد آماده مختص شما
Node.js:
const https = require('https');
  
  const data = JSON.stringify({
      'type': 'in',
      'number': '5000xxx',
      'index': 0,
      'count': 100
  });
  
  const options = {
      hostname: 'console.melipayamak.com',
      port: 443,
      path: '/api/receive/messages/f2610549d0e844fabadf4151dc11bd8c',
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