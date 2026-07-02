برای ارسال پیامک با متن واحد به یک یا چند گیرنده از این متد استفاده کنید.

 آدرس API
POST
https://console.melipayamak.com/api/send/advanced/f2610549d0e844fabadf4151dc11bd8c
پارامترهای ارسالی
{ 
  "from": "5000xxx", 
  "to": ["09123456789", "09123456789"], 
  "text": "پیامک آزمایشی",
  "udh": ""
}
پارامتر udh برای ارسال پیامک روی پورت خاص استفاده می‌شود و اختیاری است

پاسخ دریافتی
{
  "recIds": [3741437414, 3741437415],
  "status": "شرح خطا در صورت بروز"
}
از recId برای دریافت وضعیت ارسال می‌توانید استفاده کنید.

راهنمای استفاده
پارامترهای ارسالی را توسط POST به آدرس API ارسال کنید تا متد اجرا شود

در صورتی که امکان اتصال مطابق دستورالعمل ندارید، از بخش زیر، کد آماده مختص خودتان دریافت کنید. این کد بدون هیچ تغییری در پروژه شما قابل کپی بوده و اتصال برقرار می‌کند

کد آماده مختص شما
Node.js:
const https = require('https');

const data = JSON.stringify({
    from: '5000xxx',
    to: ['09123456789', '09123456789'],
    text: 'test sms',
    udh: ''
});
  
const options = {
    hostname: 'console.melipayamak.com',
    port: 443,
    path: '/api/send/advanced/f2610549d0e844fabadf4151dc11bd8c',
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