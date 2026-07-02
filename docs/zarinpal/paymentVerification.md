تأیید پرداخت (Payment Verification)
متد verify به شما امکان می‌دهد تا پس از بازگشت کاربر از درگاه پرداخت، وضعیت تراکنش را بررسی و تأیید کنید. با استفاده از این متد، شما می‌توانید صحت پرداخت و جزئیات تراکنش را بررسی کنید و در صورت موفقیت‌آمیز بودن پرداخت، آن را تأیید نمایید.

این متد معمولاً پس از بازگشت کاربر به آدرس callback_url که در درخواست پرداخت مشخص شده بود، استفاده می‌شود.

پارامترهای تأیید پرداخت
در جدول زیر پارامترهای ارسالی به متد verify و توضیحات مربوط به آن‌ها آورده شده است:

نام پارامتر	نوع	الزامی	توضیحات
authority	String	بله	کد authority که پس از درخواست پرداخت از درگاه دریافت می‌شود و در کوئری استرینگ بازگشت به callback_url وجود دارد.
amount	Integer	بله	مبلغ پرداختی که باید با مبلغ اصلی تراکنش مطابقت داشته باشد. این مقدار باید از دیتابیس استخراج شود.
نمونه کد Node.js
در ادامه، نمونه کدی ارائه شده است که ابتدا کد authority از کوئری استرینگ دریافت می‌شود، سپس مبلغ مربوط به این authority از دیتابیس استخراج شده و برای تأیید به زرین‌پال ارسال می‌شود:

import { ZarinPal } from 'zarinpal-node-sdk';

const zarinpal = new ZarinPal({
  merchantId: 'your-merchant-id',
  sandbox: true,
});

async function verifyPayment(authority, status) {
  if (status === 'OK') {
    const amount = await getAmountFromDatabase(authority); // Implement this function

    if (amount) {
      try {
        const response = await zarinpal.verifications.verify({
          amount: amount,
          authority: authority,
        });

        if (response.data.code === 100) {
          console.log('Payment Verified:');
          console.log('Reference ID:', response.data.ref_id);
          console.log('Card PAN:', response.data.card_pan);
          console.log('Fee:', response.data.fee);
        } else if (response.data.code === 101) {
          console.log('Payment already verified.');
        } else {
          console.log('Transaction failed with code:', response.data.code);
        }
      } catch (error) {
        console.error('Payment Verification Failed:', error);
      }
    } else {
      console.log('No Matching Transaction Found For This Authority Code.');
    }
  } else {
    console.log('Transaction was cancelled or failed.');
  }
}

// Example usage:
const authority = 'A000000000000000000000000000000000';
const status = 'OK';

verifyPayment(authority, status);
