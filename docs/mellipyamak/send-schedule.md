برای ارسال پیامک در زمان دلخواه به یک گیرنده از این متد استفاده کنید.

 آدرس API
POST
https://console.melipayamak.com/api/send/schedule/f2610549d0e844fabadf4151dc11bd8c
پارامترهای ارسالی
{
  "message": "پیامک زماندار",
  "from": "5000xxx",
  "to": "09123456789",
  "date": "1/20/2023 15:22",
  "period": 365
}
پارامتر period اختیاری و واحد آن روز است. در صورتی که نیاز به تکرار ارسال در فواصل زمانی مشخص دارید آن را مقدار دهی کنید. در صورت عدم استفاده، پیامک موردنظر فقط و فقط یکبار در زمان مقرر ارسال خواهد شد.

پاسخ دریافتی
{
  "id": 2244,
  "status": "شرح خطا در صورت بروز"
}
از id در حذف پیامک زماندار می‌توانید استفاده کنید.

راهنمای استفاده
پارامترهای ارسالی را توسط POST به آدرس API ارسال کنید تا متد اجرا شود

در صورتی که امکان اتصال مطابق دستورالعمل ندارید، از بخش زیر، کد آماده مختص خودتان دریافت کنید. این کد بدون هیچ تغییری در پروژه شما قابل کپی بوده و اتصال برقرار می‌کند

کد آماده مختص شما
Node.js:
const https = require('https');

const data = JSON.stringify({
    message: 'test sms',
    from: '5000xxx',
    to: '09123456789',
    date: '1/20/2023 15:22',
    period: 365
});

const options = {
    hostname: 'console.melipayamak.com',
    port: 443,
    path: '/api/send/schedule/f2610549d0e844fabadf4151dc11bd8c',
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