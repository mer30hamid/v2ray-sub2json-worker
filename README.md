# V2Ray Sub2JSON Worker

## مبدل اشتراک (ساب) و کانفیگ V2Ray به جیسون در ورکر کلادفر

این اسکریپت، از طریق بستر ورکر کلادفلر، اشتراک‌ (ساب) V2Ray را به یک اشتراک با قالب JSON تبدیل می‌کند که در کلاینت‌های مبتنی بر هسته XRAY مانند **[V2RayN](https://github.com/2dust/v2rayN)** (برای دسکتاپ) و **[V2RayNG](https://github.com/2dust/v2rayNG)** (برای اندروید) قابل استفاده است. این کار باعث بهبود اتصال و قابلیت‌های بهتر در اشتراک می‌شود.


## نصب سریع

برای نصب سریع، روی دکمه زیر کلیک کنید و مراحل را از طریق نصب کننده ورکر کلادفلر دنبال کنید:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mer30hamid/v2ray-sub2json-worker)
## نصب بصورت دستی

1. ابتدا آخرین فایل زیپ آماده شده را از قسمت [Releases](https://github.com/mer30hamid/v2ray-sub2json-worker/releases) دانلود کنید (نام آن با فرمت v2ray-sub2json-worker-vx.x.x.zip در قسمت Assets است)
2. وارد حساب کاربری کلادفر شده و یک ورکر یا پیجز بسازید و از فایل دانلود شده استفاده کنید

## پیش‌نمایش

آدرس زیر را باز کنید، نتیجه را ببینید و امتحان کنید:

[https://v2ray-sub2json.mer30repl.workers.dev/convert](https://v2ray-sub2json-worker.mer30repl.workers.dev/convert)


## نحوه استفاده

پس از ساختن ورکر، در انتهای آدرس آن عبارت زیر را قرار دهید:
```
/convert
```

### مثال: 

اگر <آدرس ورکر شما> بصورت زیر باشد:

`https://your-worker.address.workers.dev/`


با اضافه کردن `/convert` به انتهای آن، آدرس `https://your-worker.address.workers.dev/convert` را در مرورگر، باز کنید تا فرم زیر ظاهر شود:


![Screen Shot 2025-03-29 at 19 53 23](https://github.com/user-attachments/assets/507c55a8-d1c5-43c5-9ee8-5ffaa18cc36a)





و اگر <آدرس ساب شما> نیز بصورت زیر باشد:


`https://your-sub-url.com/v2ray.txt`

در قسمت گفته شده یعنی "لینک(های) اشتراک و یا کانفیگ(های) V2Ray خود را وارد کنید:" وارد نمایید. می‌توانید چندین لینک یا کانفیگ را در این قسمت وارد نمایید.

اگر روی دکمه "تبدیل و کپی" کلیک کنید، آدرس تبدیل شده در حافظه کپی شده و می توانید در نرم افزارهای V2ray وارد کنید.

برای اطمینان می توانید روی دکمه "باز کردن" کلیک کنید تا صفحه تبدیل باز شود. اگر نتیجه خروجی JSON باشد، نشان می دهد ساب شما سالم است و اسکریپت هم بخوبی کار می کند. می‌توانید از قسمت محدود کردن خروجی، تنها حالت ها و پروتکل های دلخواه را در خروجی محدود کنید.


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

- VLESS
- VMESS
- TROJAN
- Shadowsocks
- Wireguard


## ویژگی ها

**امکان باز کردن اشتراک‌های از دسترس خارج شده**:  
   اشتراک‌های مسدود شده را با دریافت و پردازش آن‌ها دوباره فعال می‌کند. (حتی در صورت فیلتر شدن ورکر، با در نظر گرفتن این که آدرس ورکر در کلادفلر قابلیت اختصاص دامنه اختیاری دارد)


**تبدیل کانفیگ های خام به ساب جیسون**:  
   می توانید چندین کانفیگ را وارد کرده و در نهایت آن را به یک کانفیگ تبدیل کنید، از بین آنها همواره بصورت خودکار بهترین کانفیگ انتخاب می‌شود.

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
