استرداد وجه
متد استرداد وجه به شما این امکان را می‌دهد که در صورت تغییر یا لغو سفارش مشتریان، واریزی‌های اشتباه یا هرگونه الزامی جهت بازگرداندن وجه به خریدار، تمام مبلغ واریز شده یا حتی بخشی از آن را به صورت آنی یا در سیکل‌های پایا، به حساب آن‌ها واریز نمایید.

پارامترهای ورودی
در این متد، پارامترهای زیر به API ارسال می‌شود:

نام	نوع	اجباری	شرح
session_id	String	بله	شماره تراکنش
amount	Integer	بله	مبلغ ریال (حداقل مبلغ قابل استرداد ۲۰۰۰۰ ریال)
description	String	بله	توضیح علت استرداد وجه
method	String	بله	متد استرداد وجه (CARD یا PAYA)
reason	String	بله	دلیل استرداد (CUSTOMER_REQUEST و غیره)
اطلاعات خروجی
در صورت موفقیت، اطلاعات زیر از API دریافت می‌شود:

نام	نوع	شرح
id	String	شماره تراکنش
terminal_id	String	شماره ترمینال درگاه
amount	Integer	مبلغ پرداخت شده به ریال
timeline	Object	تاریخچه تراکنش
refund_amount	Integer	مبلغ استرداد
refund_time	String	تاریخ ثبت استرداد
refund_status	String	وضعیت استرداد
نمونه کد Node.js
در ادامه نمونه‌ای از پیاده‌سازی متد استرداد وجه در Node.js آمده است:

import { ZarinPal } from 'zarinpal-node-sdk';

const zarinpal = new ZarinPal({
  accessToken: 'your-access-token',
  sandbox: true,
});

async function processRefund() {
  try {
    const refundResponse = await zarinpal.refunds.create({
      sessionId: 'session-id-to-refund',
      amount: 5000,
      description: 'Refund for order #1234',
      method: 'CARD',
      reason: 'CUSTOMER_REQUEST',
    });
    console.log('Refund Created:', refundResponse);

    const refundDetails = await zarinpal.refunds.retrieve(refundResponse.id);
    console.log('Refund Details:', refundDetails);

    const refundsList = await zarinpal.refunds.list({
      terminalId: 'your-terminal-id',
      limit: 10,
      offset: 0,
    });
    console.log('Refunds List:', refundsList);
  } catch (error) {
    console.error('Error processing refund:', error);
  }
}

processRefund();
