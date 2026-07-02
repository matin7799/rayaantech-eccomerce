این متد وضعیت تحویل پیامک (ارسال شده یا ناموفق) را مشخص می‌کند.

 آدرس API
POST
https://console.melipayamak.com/api/receive/status/f2610549d0e844fabadf4151dc11bd8c
پارامترهای ارسالی
{
  "recIds": [3741437414, 3741537415]
}
پارامتر recIds آرایه‌ای از آیدی(‌های) دریافتی پس از ارسال پیامک است

پاسخ دریافتی
{
  "results": ['ارسال شده' ,'ارسال نشده'],
  "resultsAsCode": [-1, 200],
  "status": "شرح خطا در صورت بروز"
}
مقادیر results و resultsAsCode معادل نظیر به نظیر یکدیگر هستند

راهنمای استفاده
پارامترهای ارسالی را توسط POST به آدرس API ارسال کنید تا متد اجرا شود

در صورتی که امکان اتصال مطابق دستورالعمل ندارید، از بخش زیر، کد آماده مختص خودتان دریافت کنید. این کد بدون هیچ تغییری در پروژه شما قابل کپی بوده و اتصال برقرار می‌کند

کد آماده مختص شما
Node.js:
const https = require('https');

const data = JSON.stringify({
    'recIds': [3741437414, 3741537415]
});

const options = {
    hostname: 'console.melipayamak.com',
    port: 443,
    path: '/api/receive/status/f2610549d0e844fabadf4151dc11bd8c',
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