# سایت مدیریت کتابخانه

پروژه‌ای برای مدیریت امانت کتاب، شامل جستجوی کتاب، احراز هویت با کد ملی، و پیگیری
تاریخچه‌ی امانت‌ها. این پروژه کاملاً لوکال اجرا می‌شود و نیازی به سرور یا دامنه ندارد.

## تکنولوژی‌ها

| بخش | تکنولوژی |
|---|---|
| فرانت‌اند | React + Vite + JavaScript + react-router-dom + axios |
| بک‌اند | Python + FastAPI |
| دیتابیس | MySQL |
| احراز هویت | JWT (کد ملی به‌عنوان نام کاربری و رمز عبور) |

## ساختار پوشه‌ها

```
library-app/
├── .gitignore
├── .vscode/
├── backend/
│   ├── .env.example
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI entrypoint
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
   │   │   └── routers/
│   │       ├── auth_router.py
│   │       ├── books_router.py
│   │       └── users_router.py
│   ├── data/
│   │   ├── books.csv
│   │   └── users.csv       # local sample data (consider replacing with users.csv.example)
│   ├── seed.py
│   ├── requirements.txt
│   └── docker-compose.yml
└── frontend/
  ├── .env.example
  ├── index.html
  ├── package.json
  ├── vite.config.js
  ├── public/
  └── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── api/
    ├── components/
    └── pages/
```

## نحوه اجرا

### پیش‌نیازها
- Node.js نسخه 18 به بالا
- Python نسخه 3.10 به بالا
- یک نمونه MySQL در حال اجرا (یا با نصب مستقیم، یا با داکر)

### 1. بالا آوردن دیتابیس MySQL

اگر MySQL روی سیستم‌تان نصب نیست، ساده‌ترین راه استفاده از داکر است:

```bash
cd backend
docker compose up -d
```

اگر MySQL از قبل نصب دارید، نیازی به این مرحله نیست؛ فقط اطلاعات اتصال را در مرحله بعد درست وارد کنید.

### 2. راه‌اندازی بک‌اند

```bash
cd backend
# Create a virtualenv
python -m venv venv
# Activate the venv:
# macOS / Linux: `source venv/bin/activate`
# Windows PowerShell: `venv\Scripts\Activate.ps1`
# Windows CMD: `venv\Scripts\activate.bat`

# Install dependencies
pip install -r requirements.txt

# Copy the example env and edit the real `.env` 
# Unix: `cp .env.example .env`  — Windows PowerShell: `Copy-Item .env.example .env`
Copy-Item .env.example .env
# Edit `backend/.env` and set DB_PASSWORD and other values (see backend/.env.example)

python seed.py       # creates DB/tables and imports sample data

uvicorn app.main:app --reload --port 8000
```

بک‌اند روی آدرس `http://localhost:8000` بالا می‌آید. مستندات تعاملی API در
`http://localhost:8000/docs` قابل مشاهده است.

### 3. راه‌اندازی فرانت‌اند

در یک ترمینال جدید:

```bash
cd frontend
npm install

# Copy the example env for local development
# Unix: `cp .env.example .env`  — Windows PowerShell: `Copy-Item .env.example .env`
Copy-Item .env.example .env
# If needed, change `VITE_API_URL` in `frontend/.env` to your backend URL

npm run dev
```

فرانت‌اند روی آدرس `http://localhost:5173` بالا می‌آید.

### 4. ورود به عنوان یک کاربر نمونه

نام کاربری و رمز عبور هر کاربر، همان کد ملی اوست (هر دو فیلد کد ملی را وارد کنید).
یکی از کدهای ملی نمونه (از داده‌های ارسالی شما) را می‌توانید در فایل
`backend/data/users.csv.example` ببینید. (فایل واقعی `backend/data/users.csv` نباید در مخزن عمومی قرار بگیرد.)

## منطق اصلی پیاده‌سازی شده

- **جستجو (صفحه اصلی):** جستجو در نام کتاب، نویسنده و سال انتشار به‌صورت هم‌زمان انجام
  می‌شود؛ اگر چند کتاب با یک نام ولی مشخصات متفاوت وجود داشته باشند، همه در نتایج
  نمایش داده می‌شوند.
- **گرفتن کتاب بدون ورود قبلی:** اگر کاربر وارد نشده باشد و روی «من این کتاب را
  می‌خواهم» بزند، به صفحه ورود هدایت می‌شود. بعد از ورود موفق، به‌صورت خودکار به همان
  عملیات گرفتن کتاب برمی‌گردد و پیام موفقیت نمایش داده می‌شود.
- **تاریخچه:** تمام رکوردهای امانت (چه پس داده‌شده چه نشده) نمایش داده می‌شوند. کنار
  کتاب‌های پس‌داده‌نشده گزینه‌ی «پس دادن کتاب» و کنار کتاب‌های پس‌داده‌شده گزینه‌ی
  «گرفتن دوباره» وجود دارد (در صورتی که کتاب موجود باشد).
- **وضعیت موجودی:** با پس دادن یا گرفتن یک کتاب، فیلد `is_available` در دیتابیس
  به‌روزرسانی می‌شود و بلافاصله در نتایج جستجو منعکس می‌شود.
- **رمز عبور:** برای امنیت، رمز عبور کاربران (کد ملی) در دیتابیس به‌صورت هش‌شده
  (bcrypt) ذخیره می‌شود، نه به‌صورت متن ساده.

