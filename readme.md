# financetracker-backend

NestJS 12 + Prisma 7 + PostgreSQL 17 + TypeScript, Docker orqali `dev` yoki `prod` rejimda ishga tushadi.

## Tez boshlash

```bash
cp .env.example .env
npm install            # lokal IDE uchun (types, prisma client generate)

npm run docker:dev     # dev: hot-reload, debug porti 9229, DB porti 5432 ochiq
npm run docker:prod    # prod: optimallashgan image, fon rejimida (-d)
```

Yangi npm paket qo'shilganda `npm run docker:dev` qayta ishga tushiring (`-V` node_modules volume'ini yangilaydi).

To'xtatish: `npm run docker:dev:down` / `npm run docker:prod:down`.
DB ma'lumotlarini ham o'chirish uchun oxiriga `-- -v` qo'shing.

Ilova: http://localhost:8000/api
Swagger: http://localhost:8000/docs (JSON: `/docs/json`)

| Endpoint              | Tavsif                       |
| --------------------- | ---------------------------- |
| `GET /api`            | Ilova haqida                 |
| `GET /api/health`     | Ilova + DB holati            |

## Rejimlar

| | dev | prod |
| --- | --- | --- |
| Compose | `docker-compose.yml` + `docker-compose.dev.yml` | `docker-compose.yml` + `docker-compose.prod.yml` |
| Dockerfile target | `development` | `production` |
| Kod | bind-mount, `nest start --watch` | `dist/` dan `node`, faqat prod paketlar, `node` user |
| Migratsiya | start'da `prisma migrate deploy` | start'da `prisma migrate deploy` |
| Postgres porti | `5432` tashqariga ochiq | faqat ichki tarmoqda |

`.env` dagi `DATABASE_URL` lokal (`localhost`) uchun. Konteyner ichida compose uni avtomatik `db` hostiga almashtiradi.

## Swagger

- `/docs` da ochiladi. Dev'da yoqiq, prod'da default o'chiq — `.env` da `SWAGGER_ENABLED=true` qilib yoqish mumkin.
- `@nestjs/swagger` CLI plugin ([nest-cli.json](nest-cli.json)) DTO maydonlari, `class-validator` qoidalari va
  JSDoc izohlaridan (`/** @example ... */`) sxemani avtomatik yasaydi — har maydonga `@ApiProperty` yozish shart emas.
- Hot-reload'da kod o'zgarsa, ilova qayta ishga tushadi va Swagger ham yangilanadi (sahifani refresh qiling).
- Yangi controller'ga `@ApiTags('nom')` qo'shing.
- Fayl o'chirilsa/nomi o'zgarsa `tsc --watch` `TS6053: File not found` bilan qotib qolishi mumkin — `npm run docker:dev:restart`.

## Prisma bilan ishlash

Schema: [prisma/schema.prisma](prisma/schema.prisma). Client `src/generated/prisma` ga generatsiya qilinadi (gitga kirmaydi).

Schema o'zgargandan keyin yangi migratsiya (app konteyneri ishlab turishi shart emas):

```bash
npm run docker:migrate -- --name <nom>
```

Bu `prisma migrate dev` ni vaqtinchalik konteynerda bajaradi, keyin avtomatik `prisma generate` qiladi
(Prisma 7 da `migrate dev` client'ni o'zi generatsiya qilmaydi). Ishlab turgan dev ilova yangi client'ni
hot-reload orqali oladi. Faqat client kerak bo'lsa: `npm run docker:generate`.

Yoki docker'siz, faqat DB konteyner bilan: `npm run prisma:migrate`.
Studio: `npm run prisma:studio`.

## Docker'siz lokal ishga tushirish

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
npm run prisma:deploy
npm run start:dev
```

## Skriptlar

- `npm run build` / `start:prod` — build va prod ishga tushirish
- `npm run lint` (oxlint), `npm run format` (prettier)
- `npm test` — unit testlar (vitest), `npm run test:e2e` — e2e (DB kerak)

## Struktura

```
src/
  config/env.validation.ts   # env o'zgaruvchilar validatsiyasi
  config/swagger.ts          # Swagger sozlamalari (/docs)
  prisma/                    # global PrismaService (pg adapter)
  health/                    # /api/health
  main.ts, app.module.ts
prisma/
  schema.prisma, migrations/
prisma.config.ts             # Prisma 7 konfiguratsiyasi (DATABASE_URL shu yerda)
Dockerfile                   # base → deps → development | build → production
```
