محاسبه کارمزد تراکنش (FeeCalculation)
متد feeCalculation به شما امکان می‌دهد تا قبل از ایجاد درخواست پرداخت، میزان کارمزد یک تراکنش را محاسبه و دریافت کنید. این متد زمانی مفید است که بخواهید کارمزد تراکنش را پیش از شروع فرآیند پرداخت به کاربر نمایش دهید یا در محاسبات خود لحاظ کنید.

پارامترهای ارسالی به متد FeeCalculation
نام پارامتر	نوع	الزامی	توضیحات
merchant_id	String	بله	کد Merchant شما که توسط زرین‌پال اختصاص داده شده است.
amount	Number	بله	مبلغ تراکنش به ریال که باید بیشتر از 1000 ریال باشد.
currency	String	خیر	نوع ارز تراکنش (پیش‌فرض: IRR). مقادیر مجاز: IRR, IRT
مقادیر بازگشتی از متد FeeCalculation
نام پارامتر	نوع	توضیحات
code	Number	کد وضعیت درخواست: کد 100 برای درخواست موفق.
message	String	پیام وضعیت درخواست، مانند موفقیت‌آمیز بودن محاسبه کارمزد.
amount	Number	مبلغ اصلی تراکنش به ریال.
fee	Number	میزان کارمزد محاسبه شده به ریال.
fee_type	String	نوع پرداخت کننده کارمزد: Merchant (پذیرنده) یا Payer (پرداخت کننده).
suggested_amount	String	مبلغ پیشنهادی برای تسویه حساب
نمونه کد (Node.js)
const { ZarinPal } = require('zarinpal-node-sdk');

const zarinpal = new ZarinPal({
  merchant_id: 'Your merchant code',
});

async function calculateFee() {
  try {
    const response = await zarinpal.payments.feeCalculation({
      merchant_id: 'Your merchant code',
      amount: 100000, // ۱۰۰,۰۰۰ ریال
      currency: 'IRR', // اختیاری
    });
    console.log('نتیجه محاسبه کارمزد:');
    console.log('کد:', response.data.code);
    console.log('پیام:', response.data.message);
    console.log('مبلغ:', response.data.amount, 'ریال');
    console.log('کارمزد:', response.data.fee, 'ریال');
    console.log('نوع کارمزد:', response.data.fee_type);
  } catch (error) {
    console.error('خطا در محاسبه کارمزد:', error.message);
  }
}

calculateFee();
نکات مهم
مبلغ تراکنش باید حداقل ۱۰۰۰ ریال باشد.
کارمزد محاسبه شده بر اساس تنظیمات ترمینال شما و نوع تراکنش متفاوت خواهد بود.
نوع پرداخت کننده کارمزد (fee_type) می‌تواند Merchant (پذیرنده می‌پردازد) یا Payer (مشتری می‌پردازد) باشد.
این متد صرفاً برای محاسبه کارمزد است و هیچ تراکنشی ایجاد نمی‌کند.
