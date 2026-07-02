پیکربندی Node.js SDK
پس از نصب Node.js SDK زرین‌پال، نیاز به پیکربندی تنظیمات مربوط به merchantId و حالت sandbox دارید. این مستندات به شما نحوه انجام این تنظیمات و استفاده از ویژگی‌های پیشرفته‌تر را توضیح می‌دهد.

پیکربندی اولیه
برای شروع استفاده از SDK، باید تنظیمات مربوط به merchantId و sandbox را انجام دهید. این تنظیمات به شما امکان می‌دهند که در حالت آزمایشی (sandbox) یا واقعی از SDK استفاده کنید. در برخی موارد خاص، مانند استردادوجه یا مدیریت تراکنش‌ها، ممکن است به accessToken نیز نیاز داشته باشید.

تنظیمات با Merchant ID و Access Token
برای عملیات‌هایی مانند ایجاد درخواست پرداخت و تأیید پرداخت، از merchantId استفاده می‌شود. در حالی که برای متدهایی مانند refund یا transaction، باید از accessToken استفاده کنید.

import { ZarinPal } from 'zarinpal-node-sdk';

const zarinpal = new ZarinPal({
  merchantId: 'your-merchant-id',
  sandbox: true,
  accessToken: 'your-access-token',
});
نکته
برای دریافت اکسس توکن خود از بخش نشست های فعال (opens new window)اقدام نمایید.
