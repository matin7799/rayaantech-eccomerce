ریورس تراکنش
متد ریورس تراکنش به شما امکان می‌دهد تا تراکنش‌های موفقی که از زمان پرداخت آن‌ها حداکثر ۳۰ دقیقه گذشته است را بدون کارمزد به حساب خریدار استرداد کنید.

این متد برای تراکنش‌هایی استفاده می‌شود که موفق بوده‌اند اما لازم است مبلغ آن‌ها به خریدار بازگردانده شود. توجه داشته باشید که امکان ریورس تنها در ۳۰ دقیقه ابتدایی پس از انجام تراکنش وجود دارد.

نکات مهم:
برای استفاده از این سرویس، باید حتماً آی‌پی سرور شما برای درگاه تنظیم شده باشد. در غیر این صورت با خطای 62- مواجه خواهید شد.
پارامترهای ورودی
در این متد، پارامترهای زیر به API ارسال می‌شود:

نام	نوع	اجباری	شرح
merchant_id	String	بله	کد ۳۶ کاراکتری اختصاصی پذیرنده
authority	String	بله	آتوریتی تراکنش مورد نظر برای ریورس کردن
نمونه کد Node.js
در ادامه نمونه‌ای از پیاده‌سازی متد ریورس تراکنش در Node.js آمده است:

import { ZarinPal } from 'zarinpal-node-sdk';

const zarinpal = new ZarinPal({
  merchantId: 'your-merchant-id',
  sandbox: true,
});

async function reverseTransaction() {
  try {
    const response = await zarinpal.reversals.reverse({
      authority: 'A000000000000000000000000000000000',
    });
    console.log('Transaction Reversed:', response);
  } catch (error) {
    console.error('Error reversing transaction:', error);
  }
}

reverseTransaction();
