درخواست پرداخت (Payment Request)
متد request به شما امکان می‌دهد تا یک درخواست پرداخت جدید ایجاد کنید و کاربر را به درگاه پرداخت هدایت کنید. این متد برای ارسال اطلاعات مربوط به پرداخت و دریافت authority جهت هدایت کاربر به صفحه پرداخت استفاده می‌شود.

پارامترهای درخواست
در جدول زیر توضیحات مربوط به هر پارامتر را مشاهده می‌کنید:

نام پارامتر	نوع	الزامی	توضیحات
amount	Integer	بله	مبلغ پرداختی به ریال. حداقل مقدار پرداخت 10000 ریال است.
description	String	بله	توضیحات مربوط به تراکنش مانند شماره سفارش یا نام محصول.
callback_url	String	بله	آدرس بازگشت پس از تکمیل یا عدم موفقیت پرداخت.
mobile	String	خیر	شماره موبایل کاربر. (اختیاری)
email	String	خیر	ایمیل کاربر. (اختیاری)
referrer_id	String	خیر	کد معرف. (اختیاری)
currency	String	خیر	واحد پولی تراکنش. مقدار پیش‌فرض IRR (ریال) و مقدار دیگر IRT (تومان) است.
cardPan	String	خیر	شماره کارت بانکی که کاربر با آن پرداخت می‌کند. (اختیاری)
wages	Array	خیر	آرایه‌ای شامل اطلاعات تسهیم سود. هر عنصر شامل iban (شبا)، amount (مبلغ) و description (توضیح) است.
دریافت URL پرداخت
پس از ارسال موفقیت‌آمیز درخواست پرداخت، یک authority از زرین‌پال دریافت می‌شود. سپس با استفاده از این authority می‌توانید URL نهایی پرداخت را با متد getRedirectUrl دریافت کرده و کاربر را به درگاه پرداخت هدایت کنید.

نمونه کد
در ادامه نمونه کدی که نحوه ارسال درخواست پرداخت و هدایت کاربر به درگاه پرداخت را نشان می‌دهد، آورده شده است:


import { ZarinPal } from 'zarinpal-node-sdk';


const zarinpal = new ZarinPal({
  merchantId: 'your-merchant-id',
  sandbox: true,
});

async function initiatePayment() {
  try {
    const response = await zarinpal.payments.create({
      amount: 10000,
      callback_url: 'https://yourwebsite.com/callback',
      description: 'Payment for order #1234',
      mobile: '09123456789',
      email: 'customer@example.com',
      cardPan: ['6219861034529007', '5022291073776543'],
      referrer_id: 'affiliate123',
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

initiatePayment();
