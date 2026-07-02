برای ارسال پیامک رمز یکبار مصرف به یک گیرنده از این متد استفاده کنید.

 آدرس API
POST
https://console.melipayamak.com/api/send/otp/f2610549d0e844fabadf4151dc11bd8c
پارامترهای ارسالی
{
  "to": "09123456789"
}
پاسخ دریافتی
{
  "code": "3741437414",
  "status": "شرح خطا در صورت بروز"
}
محتوای code را در سامانه خود جهت ارزیابی کاربر ذخیره کنید

راهنمای استفاده
پارامترهای ارسالی را توسط POST به آدرس API ارسال کنید تا متد اجرا شود

در صورتی که امکان اتصال مطابق دستورالعمل ندارید، از بخش زیر، کد آماده مختص خودتان دریافت کنید. این کد بدون هیچ تغییری در پروژه شما قابل کپی بوده و اتصال برقرار می‌کند

کد آماده مختص شما
Node.js:
const https = require('https');

const data = JSON.stringify({
    'to': '09123456789'
});

const options = {
    hostname: 'console.melipayamak.com',
    port: 443,
    path: '/api/send/otp/f2610549d0e844fabadf4151dc11bd8c',
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