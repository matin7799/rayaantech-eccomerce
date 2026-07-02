برای دریافت اعتبار پیامکی خود از این متد استفاده کنید

 آدرس API
GET
https://console.melipayamak.com/api/receive/credit/f2610549d0e844fabadf4151dc11bd8c
پارامترهای ارسالی
{ }
این متد فاقد پارامتر ارسالی است

پاسخ دریافتی
{
  "amount": 37414,
  "status": "شرح خطا در صورت بروز"
}
مقدار amount بر حسب ريال محاسبه شده

راهنمای استفاده
آدرس API را توسط متد GET فراخوانی کنید

در صورتی که امکان اتصال مطابق دستورالعمل ندارید، از بخش زیر، کد آماده مختص خودتان دریافت کنید. این کد بدون هیچ تغییری در پروژه شما قابل کپی بوده و اتصال برقرار می‌کند

کد آماده مختص شما
Node.js:
const https = require('https');
  
  const options = {
      hostname: 'console.melipayamak.com',
      port: 443,
      path: '/api/receive/credit/f2610549d0e844fabadf4151dc11bd8c',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
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
  
  req.end();