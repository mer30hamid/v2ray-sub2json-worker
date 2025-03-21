# V2Ray Sub2JSON Worker

## مبدل اشتراک (ساب) V2Ray به جیسون در ورکر کلادفر

این اسکریپت، از طریق بستر ورکر کلادفلر، اشتراک‌ (ساب) V2Ray را به یک اشتراک با قالب JSON تبدیل می‌کند که در کلاینت‌های مبتنی بر هسته XRAY مانند **[V2RayN](https://github.com/2dust/v2rayN)** (برای دسکتاپ) و **[V2RayNG](https://github.com/2dust/v2rayNG)** (برای اندروید) قابل استفاده است. این کار باعث بهبود اتصال و قابلیت‌های بهتر در اشتراک می‌شود.

## دمو

برای دیدن عملکرد این اسکریپت می توانید آدرس زیر را باز کنید و نتیجه را ببینید و تست کنید:

https://v2ray-sub2json.mer30repl.workers.dev/convert

## نصب سریع

برای نصب سریع، روی دکمه زیر کلیک کنید و مراحل را از طریق خود کلادفلر دنبال کنید:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mer30hamid/v2ray-sub2json-worker)
## نصب بصورت دستی

1. ابتدا فایل `_worker.js` را از پوشه src دانلود کنید
2. وارد حساب کاربری کلادفر شده و یک ورکر بسازید و از فایل دانلود شده استفاده کنید

## نحوه استفاده

پس از ساختن ورکر، در انتهای آدرس آن عبارت زیر را قرار دهید:
```
/convert
```

### مثال: 

اگر <آدرس ورکر شما> بصورت زیر باشد:

`https://your-worker.address.workers.dev/`


با اضافه کردن `/convert` به انتهای آن، آدرس `https://your-worker.address.workers.dev/convert` را در مرورگر، باز کنید تا فرم زیر ظاهر شود:


![Screen Shot 2025-03-21 at 14 21 59](https://github.com/user-attachments/assets/819f3862-d0be-41a0-a2f3-ebc36349b255)





و اگر <آدرس ساب شما> نیز بصورت زیر باشد:


`https://your-sub-url.com/v2ray.txt`

آن را در قسمت گفته شده یعنی "لینک اشتراک V2Ray خود را وارد کنید:" وارد نمایید.

اگر روی دکمه "تبدیل و کپی" کلیک کنید، آدرس تبدیل شده در حافظه کپی شده و می توانید در نرم افزارهای V2ray وارد کنید. یعنی آدرس نهایی شما برای استفاده در برنامه های V2Ray بعنوان ساب جایگزین بصورت زیر خواهد بود:


`https://your-worker.address.workers.dev/Sub2JSON?sub=https://your-sub-url.com/v2ray.txt`


برای اطمینان می توانید روی دکمه "باز کردن" کلیک کنید تا صفحه تبدیل باز شود. اگر نتیجه خروجی JSON باشد، نشان می دهد ساب شما سالم است و اسکریپت هم بخوبی کار می کند.


## تنظمیات (اختیاری)

در حال حاضر تنظیمات خاصی خارج از ساختار کد در نظر گرفته نشده، می توانید این سه خط در فایل `_worker.js` را بنا به نیاز خود تغییر دهید:

```javascript
  const basePath = "/Sub2JSON"; // Define your custom base path here
  const homePath = "/convert"; // Define home path here
  const sub = url.searchParams.get("sub") || 'https://example.com/sub'; // subscription URL
```

   - خط اول برای تغییر مسیر پایه برای تبدیل در آدرس است
   - خط دوم برای صفحه آغازین (صفحه خانه که فرم تبدیل را نشان می دهد) است
   - خط سوم هم برای این است که اگر آدرس بدون مشخص کردن پارامتر sub باز شود، از یک آدرس پیش‌فرض استفاده ‎‌کند

## پروتکل های پشتیبانی شده

از آنجایی که JSON مناسب هسته XRAY تولید می شود، پروتکل های زیر پشتیبانی می‌شوند:

- VLESS+GRPC
- VLESS+GRPC+TLS
- VLESS+TCP
- VLESS+TCP+HTTP
- VLESS+TCP+TLS
- VLESS+TCP+TLS+HTTP
- VLESS+TCP+REALITY
- VLESS+GRPC+REALITY
- VLESS+WS
- VLESS+WS+TLS
- VLESS+WS+HTTP
- VLESS+WS+HTTP+TLS
- VMESS+GRPC
- VMESS+GRPC+TLS
- VMESS+TCP
- VMESS+TCP+HTTP
- VMESS+TCP+TLS
- VMESS+TCP+TLS+HTTP
- VMESS+WS
- VMESS+WS+TLS
- VMESS+WS+HTTP
- VMESS+WS+HTTP+TLS
- TROJAN+TCP
- TROJAN+TCP+HTTP
- TROJAN+TCP+TLS
- TROJAN+TCP+TLS+HTTP
- TROJAN+TCP+REALITY
- TROJAN+GRPC+REALITY
- TROJAN+GRPC+TLS
- TROJAN+WS
- TROJAN+WS+TLS
- TROJAN+WS+HTTP
- TROJAN+WS+HTTP+TLS


## مزایا

**امکان باز کردن اشتراک‌های از دسترس خارج شده**:  
   اشتراک‌های مسدود شده را با دریافت و پردازش آن‌ها دوباره فعال می‌کند. (حتی در صورت فیلتر شدن ورکر، با در نظر گرفتن این که آدرس ورکر در کلادفلر قابلیت اختصاص دامنه اختیاری دارد)

**بهینه‌سازی برای سایت های ایرانی**:  
   سایت های داخلی بدون واسطه و بصورت مستقیم در دسترس قرار می گیرند و هنگام استفاده از این مبدل اشتراک، دیگر نیازی به غیرفعال کردن کلاینت V2Ray ندارید.

**پیکربندی ایمن**:  
   موارد ناامن (مثلاً مسدود کردن ترافیک تورنت) را تضمین می‌کند (در حال توسعه)

**سرور ساختگی و فرگمنت برای سایت‌های مسدود شده**:  
   از یک سرور جعلی برای دور زدن سانسور در سایت‌هایی مانند YouTube ،Facebook و Instagram بدون نیاز به سرور پروکسی واقعی استفاده می‌کند. (با الهام از [GFW-knocker](https://github.com/GFW-knocker/gfw_resist_HTTPS_proxy))

**تعادل بار برای پروکسی‌ها**:  
   تمام پروکسی‌های اشتراک اصلی را  به یک اتصال ترکیبی تبدیل می‌کند و به‌طور خودکار بهترین پروکسی را برای سرعت و قابلیت اطمینان انتخاب می‌کند. (بر اساس [Xray-Load-Balancer](https://github.com/Surfboardv2ray/Xray-Load-Balancer))

**سادگی :**  
   کاربر نیازی ندارد بین تمامی اتصال های ساب اصلی به دنبال بهترین آنها بگردد، در گروه اشتراک (سابسکریپشن گروپ) با این روش تنها یک اتصال ظاهر می شود.


## معایب
عدم پشتیبانی از پروتکل Hysteria2، علت آن محدودیت هسته XRAY است، اگر از کلاینت های مبتنی بر هسته sing-box استفاده می کنید، مبدل های ساب JSON پروتکل های بیشتری را پوشش می‌دهند، از میان آنها [sublink-worker](https://github.com/7Sageer/sublink-worker) جایگزین مناسبی برای این روش روی ورکر کلادفلر است.
## تقدیر و تشکر

- [GFW-knocker](https://github.com/GFW-knocker/gfw_resist_HTTPS_proxy) برای ایده سرور ساختگی و فرگمنت.
- [Xray-Load-Balancer](https://github.com/Surfboardv2ray/Xray-Load-Balancer) برای ویژگی تعادل بار.
