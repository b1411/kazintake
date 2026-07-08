# План: реальный бэкенд на Turso + доступ курсантов по PIN

Статус: черновик к исполнению. Исполнять через `/claude-mem:do` фазами, каждая фаза — новый контекст.

## Контекст и цель

Сейчас приложение полностью **mock**: данные живут в `useState` внутри
`app/composables/useMockData.ts` и `useMockAuth.ts`, сбрасываются при перезагрузке,
сервера нет (нет `server/`, нет БД). Нужно превратить в реальный CRUD-бэкенд на Turso.

Целевая модель (утверждено пользователем):
- **Админ** заводит курсанта: **ФИО + номер телефона**, и назначает его на курс(ы).
- **Курсант** заходит по **номер телефона + PIN-код курса**. PIN генерится **на курс на месяц**,
  ротируется ежемесячно, показывается в админ-панели. После входа курсант видит все свои курсы,
  проходит тесты.
- **Админ** входит по телефон + пароль (как сейчас, но через сервер).
- Тесты берутся из реальных `.docx` в папке `тесты/` (10 файлов).
- Видео (YouTube) прикрепляются к курсам как материалы.

Ключевые решения (утверждено):
- Слой БД: **drizzle-orm + drizzle-kit** (dialect `sqlite`/`turso`).
- Модель входа курсанта: **телефон + PIN** (email НЕ используем — отменено).
- Тесты: реальный парсинг `.docx` (файлы уже в репозитории, папка `тесты/`).

Ограничение из глобальных правил: изменение затрагивает > 3 файлов — поэтому это план,
а не прямые правки. Никаких флагов/тумблеров для обхода — логика решается по существу.

---

## Phase 0 — Documentation Discovery (сначала, обязательно)

Цель: зафиксировать реальные API (не выдуманные) перед реализацией. Консолидировано ниже;
на старте Phase 1 перепроверить версии командой `pnpm ls drizzle-orm @libsql/client`.

### Разведанные факты (из репозитория)
- Nuxt `^4.3.0`, Nuxt UI `^4.4.0`, zod `^4.3.6` уже установлены. Nitro доступен (папки `server/` пока нет).
- `@libsql/client` и `drizzle-orm` уже присутствуют в `pnpm-lock.yaml` (транзитивно) — установить как прямые зависимости.
- Пакетный менеджер: **pnpm** (`packageManager: pnpm@10.28.2`). Ставить через `pnpm add`.
- Тестовые `.docx` (10 шт.) лежат в `тесты/`. Формат вопроса — **одна строка**:
  `<Текст вопроса>A) <опция> B) <опция> C) <опция> D) <опция>✅ <Буква>`.
  Символ `✅` помечает правильный ответ (буква после него). Формат подтверждён на `ТЕСТ ОТ.docx`.
- Видео-ссылки (YouTube) даны пользователем — см. таблицу соответствия в Phase 2.

### Allowed APIs (использовать ТОЛЬКО это; не изобретать методы)
- **Turso/libSQL клиент**: `import { createClient } from '@libsql/client'` →
  `createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN })`.
- **drizzle**: `import { drizzle } from 'drizzle-orm/libsql'` → `drizzle(client, { schema })`.
  Схема — `drizzle-orm/sqlite-core` (`sqliteTable`, `integer`, `text`).
  Запросы: `db.select().from(t)`, `db.insert(t).values(...)`, `db.update(t).set(...).where(eq(...))`,
  `db.delete(t).where(...)`. Хелперы из `drizzle-orm`: `eq`, `and`, `desc`, `sql`.
- **drizzle-kit**: `drizzle.config.ts` с `dialect: 'turso'`, `schema`, `out`. Команды:
  `pnpm drizzle-kit generate` (SQL-миграции), `pnpm drizzle-kit migrate` (применить).
- **Nitro server routes**: файлы в `server/api/**`, экспорт `defineEventHandler`.
  Тело: `await readBody(event)`; параметры: `getRouterParam(event, 'id')`; query: `getQuery(event)`;
  ошибки: `throw createError({ statusCode, statusMessage })`.
- **Сессии**: модуль **`nuxt-auth-utils`** (запечатанный cookie, без таблицы сессий).
  Сервер: `await setUserSession(event, { user })`, `await requireUserSession(event)`,
  `await clearUserSession(event)`. Клиент: `const { user, loggedIn, clear } = useUserSession()`.
  Требует `NUXT_SESSION_PASSWORD` (≥32 символа) в `.env`.
- **Клиентские запросы (Nuxt)**: `useFetch('/api/...')` для GET в setup, `$fetch('/api/...', { method })` для мутаций.
- **docx-парсинг (одноразовый скрипт)**: `.docx` = zip; читать `word/document.xml`,
  заменить `</w:p>`→`\n`, вырезать теги `<[^>]+>`, `html.unescape`. НЕ тянуть тяжёлый парсер, если хватает regex.
  (Опция: пакет `mammoth`, если regex-разбор окажется хрупким на части файлов.)

### Anti-patterns (НЕ делать)
- НЕ обращаться к `useMockData()` / `useMockAuth()` из новых серверных обработчиков — их не существует на сервере.
- НЕ хранить пароль/PIN в открытом виде без надобности в токенах на клиенте; PIN отдавать только админу.
- НЕ ставить `better-sqlite3` — целевая БД Turso (libSQL по сети).
- НЕ изобретать методов drizzle («`.findMany`» без relations-конфига и т.п.); использовать query-builder выше.
- НЕ делать cron для ротации PIN — генерировать лениво по текущему периоду `YYYY-MM` (см. Phase 4).
- НЕ путать `dialect: 'sqlite'` (локально) и `'turso'` (с authToken) в drizzle.config.

Выход Phase 0: этот раздел — готовый справочник. Проверка: `pnpm ls drizzle-orm drizzle-kit @libsql/client nuxt-auth-utils` показывает версии.

---

## Phase 1 — Инфраструктура БД (Turso + drizzle + Nitro)

**Что сделать (копировать паттерны из Phase 0 Allowed APIs):**
1. Зависимости: `pnpm add @libsql/client drizzle-orm nuxt-auth-utils` и
   `pnpm add -D drizzle-kit`. Добавить `nuxt-auth-utils` в `modules` в `nuxt.config.ts`.
2. `.env.example` + `.env` (реальный `.env` в .gitignore уже есть). Ключи:
   `TURSO_DATABASE_URL=`, `TURSO_AUTH_TOKEN=`, `NUXT_SESSION_PASSWORD=`,
   `ADMIN_PHONE=`, `ADMIN_PASSWORD=`.
   Turso: пользователь создаёт БД (`turso db create kazintake`, `turso db show`, `turso db tokens create`).
   Для локальной разработки допустим `TURSO_DATABASE_URL=file:./.data/local.db` без токена.
3. `server/db/schema.ts` — таблицы (drizzle `sqlite-core`):
   - `courses`: id(pk autoincrement), title, description, createdAt(text ISO).
   - `materials`: id, courseId(fk), type('text'|'pdf'|'video'), title, content, sort(int).
   - `tests`: id, courseId(fk unique), title.
   - `questions`: id, testId(fk), text, options(text — JSON-массив), correctAnswer(int — индекс).
   - `participants`: id, fullName, phone(unique), createdAt.
   - `enrollments`: id, participantId(fk), courseId(fk), createdAt; уникальный (participantId, courseId).
   - `coursePins`: id, courseId(fk), period(text `YYYY-MM`), pin(text 6 цифр), createdAt; уникальный (courseId, period).
   - `testResults`: id, participantId(fk), courseId(fk), testId(fk), score(int), total(int), passed(int 0/1), completedAt.
4. `server/utils/db.ts` — синглтон: `createClient` из env → `drizzle(client, { schema })`, экспорт `db`.
5. `drizzle.config.ts` (корень): `dialect: 'turso'`, `schema: './server/db/schema.ts'`, `out: './server/db/migrations'`,
   `dbCredentials: { url, authToken }` из env.
6. Скрипты в `package.json`: `"db:generate": "drizzle-kit generate"`, `"db:migrate": "drizzle-kit migrate"`,
   `"db:seed": "tsx server/db/seed.ts"` (добавить `tsx` в devDeps, если нужен запуск seed вне Nitro).
7. Сгенерировать и применить первую миграцию: `pnpm db:generate` → `pnpm db:migrate`.

**Doc refs:** Phase 0 → Allowed APIs (drizzle, drizzle-kit, libsql, nuxt-auth-utils).

**Verification checklist:**
- [ ] `pnpm db:generate` создаёт SQL в `server/db/migrations/`.
- [ ] `pnpm db:migrate` проходит без ошибок; таблицы созданы (проверить `turso db shell` или локальный файл).
- [ ] `pnpm typecheck` не ругается на `server/db/schema.ts` и `server/utils/db.ts`.

**Anti-pattern guards:** dialect `turso` (не `sqlite`) при работе с токеном; не коммитить `.env`.

---

## Phase 2 — Наполнение: курсы, видео-материалы, тесты из .docx

**Что сделать:**
1. Написать `server/db/seed.ts`. Идемпотентный (upsert по естественному ключу — по title курса).
2. **Курсы + видео.** Каждый `.docx`-тест = один курс. Прикрепить YouTube (embed:
   `https://www.youtube.com/embed/<ID>`), где есть соответствие. Предлагаемое соответствие
   (уточнить у пользователя спорные — помечены `?`):

   | Курс (по .docx) | Видео RU | Видео KZ |
   |---|---|---|
   | Первая помощь (Парамедик) | `xJ0bOpOE8z8` | `uGz-27358EE` |
   | Электробезопасность | `gIVwoS3iaOc` | `kc69OUOgSz4` |
   | Согласительная комиссия | `n1nucwgMpxE` | — |
   | Антикоррупция (Офицер комплаенс) | `VzHAxZetj1s` | — |
   | ПБ (пожарная безопасность) / ПТМ | `Lt37Fjs-_nA` `?` | `wt3TsxiHaME` `?` |
   | ОТ (охрана труда) / БиОТ | `Lt37Fjs-_nA` `?` | `wt3TsxiHaME` `?` |
   | Антитеррор | — | — |
   | Кадровое дело | — | — |
   | ПВК и ПОД ФТ (AML/декретир.?) | `uZloNWNvg2Y` `?` | `KkXYJ62c43s` `?` |
   | Промбез | — | — |

   Видео без явного теста: **Буллинг** (`1ByjRBAZYrY` ru / `Tiz6qbBm0HA` kz),
   **Декретированная группа** (`uZloNWNvg2Y` ru / `KkXYJ62c43s` kz) — завести отдельными курсами
   без теста ЛИБО привязать по решению пользователя. **Флаг: соответствие ПТМ/БиОТ/ПОД ФТ уточнить.**
3. **Парсер тестов.** Функция `parseDocxTest(path)`:
   - `.docx` → zip → `word/document.xml` → текст (regex как в Phase 0).
   - Разбить на вопросы: делимитеры опций — маркеры `A)`, `B)`, `C)`, `D)`.
     Текст вопроса = до `A)`; опции = между маркерами; правильный = буква после `✅`.
   - Собрать `questions` для теста курса; `options` — JSON-массив, `correctAnswer` — индекс (A=0…).
   - Прогнать по всем 10 файлам; **залогировать число вопросов на файл**; если файл распарсился
     в 0 вопросов или формат иной — не глотать молча, вывести предупреждение (см. `verify` ниже).
4. Seed пишет: courses → materials(видео) → tests → questions.

**Doc refs:** Phase 0 (docx-парсинг), формат подтверждён на `ТЕСТ ОТ.docx` (20 вопросов, шаблон
`...A)..B)..C)..D)..✅ X`).

**Verification checklist:**
- [ ] `pnpm db:seed` заполняет все 10 курсов и тесты; в логе — количество вопросов по каждому файлу, ни одного `0`.
- [ ] Спот-проверка `ТЕСТ ОТ`: `correctAnswer` совпадает с буквой после `✅`.
- [ ] Видео-материалы имеют embed-URL `youtube.com/embed/<ID>`, не `youtu.be`.

**Anti-pattern guards:** не хардкодить вопросы вручную — парсить из файла; не терять kz-варианты видео.

---

## Phase 3 — Аутентификация (админ + курсант по PIN) и сессии

**Что сделать:**
1. `server/utils/pin.ts`:
   - `currentPeriod()` → `YYYY-MM` по серверному времени.
   - `getOrCreateCurrentPin(courseId)` → найти `coursePins` за текущий период; нет — сгенерить 6-значный
     PIN, вставить, вернуть. (Ленивая ротация — новый месяц ⇒ новый период ⇒ новый PIN.)
2. `server/api/auth/admin-login.post.ts`: body `{ phone, password }`; сверить с `ADMIN_PHONE`/`ADMIN_PASSWORD`
   из env; `setUserSession(event, { user: { role: 'admin', name } })`.
3. `server/api/auth/participant-login.post.ts`: body `{ phone, pin }`.
   - Найти `participant` по `phone`. Нет — 401.
   - Найти курсы, где текущий (за период) PIN == введённому И на которые курсант записан (`enrollments`).
   - Совпадений нет — 401. Есть — `setUserSession(event, { user: { role: 'participant', participantId, name } })`.
4. `server/api/auth/logout.post.ts` → `clearUserSession`. `server/api/auth/me.get.ts` → текущая сессия.
5. Валидация тел запросов через **zod** (уже установлен).

**Doc refs:** Phase 0 (`nuxt-auth-utils`, `createError`, zod).

**Verification checklist:**
- [ ] Логин курсанта с верным телефоном+PIN текущего месяца → 200 и сессия; неверный PIN → 401.
- [ ] Логин курсанта, не записанного на курс → 401, даже если PIN верный.
- [ ] Логин админа из env-кредов → 200; неверный → 401.

**Anti-pattern guards:** PIN не возвращать в ответах курсантских ручек; не хранить пароль админа в коде.

---

## Phase 4 — Админские API (CRUD + ротация PIN)

**Что сделать (все под `requireUserSession` + проверка `role==='admin'`; вынести в `server/utils/requireAdmin.ts`):**
- Курсы: `server/api/admin/courses/index.get|post.ts`, `[id].get|put|delete.ts`.
- Материалы: `server/api/admin/courses/[id]/materials` (list/add/remove).
- Тесты/вопросы: `server/api/admin/tests/...`, `.../questions/...`.
- Курсанты: `server/api/admin/participants/index.get|post.ts`, `[id].delete.ts` — поля **ФИО + телефон**.
- Записи на курс: `server/api/admin/enrollments/index.get|post.ts`, `[id].delete.ts`
  (участник ↔ курс; это заменяет прежние «Назначения»).
- PIN-коды: `server/api/admin/pins.get.ts` → для каждого курса вызвать `getOrCreateCurrentPin` и вернуть
  `{ courseId, courseTitle, period, pin }`. `server/api/admin/pins/[courseId]/rotate.post.ts` →
  сгенерировать новый PIN за текущий период (перезаписать строку), вернуть новый.

**Doc refs:** Phase 0 (Nitro routes, drizzle query-builder), Phase 3 (pin.ts).

**Verification checklist:**
- [ ] Без админ-сессии админские ручки → 401/403.
- [ ] Создание курсанта (ФИО+телефон), запись на курс, удаление — отражается в БД.
- [ ] `GET /api/admin/pins` возвращает PIN на каждый курс за текущий период; `rotate` меняет PIN, период тот же.

**Anti-pattern guards:** проверять роль на КАЖДОЙ админской ручке (не полагаться на скрытие в UI).

---

## Phase 5 — API курсанта

**Что сделать (под `requireUserSession` + `role==='participant'`):**
- `server/api/my/courses.get.ts` → курсы из `enrollments` текущего участника (+ признак пройденного теста).
- `server/api/courses/[id].get.ts` → курс + материалы, ТОЛЬКО если участник записан (иначе 403).
- `server/api/courses/[id]/test.get.ts` → тест БЕЗ поля `correctAnswer` (не палить ответы клиенту).
- `server/api/courses/[id]/test/submit.post.ts` → body `{ answers: number[] }`; считать score на сервере
  (порог 70% как в текущем моке), записать `testResults`, вернуть результат.
- `server/api/my/results.get.ts` → результаты участника.

**Doc refs:** текущая логика подсчёта — `useMockData.ts:submitTestResult` (порог 0.7), перенести на сервер.

**Verification checklist:**
- [ ] `GET /api/courses/:id/test` не содержит `correctAnswer`.
- [ ] Подсчёт балла на сервере совпадает с ожиданием на `ТЕСТ ОТ` (эталонные ответы).
- [ ] Доступ к чужому/незаписанному курсу → 403.

**Anti-pattern guards:** НИКОГДА не отдавать правильные ответы в GET теста; балл считать только на сервере.

---

## Phase 6 — Фронтенд на реальный API (замена моков)

**Что сделать:**
1. `useMockData.ts` → удалить/заменить на тонкий `app/composables/useApi.ts` поверх `useFetch`/`$fetch`.
   Типы (`Course`, `TestQuestion`, …) вынести в `shared/types.ts` (общие для сервера и клиента).
2. `useMockAuth.ts` → `useAuth.ts` поверх `useUserSession()` (`nuxt-auth-utils`) + вызовы login-ручек.
3. `app/middleware/auth.global.ts` → опираться на `useUserSession().user.role` вместо мок-стейта.
4. **Login-страница** `app/pages/login.vue`: два режима — **Курсант** (телефон + PIN) и **Админ** (телефон + пароль).
   Убрать демо-креды студента; при желании оставить подсказку для админа.
5. Админ-страницы под API:
   - `admin/courses/*`, `admin/tests/*` — CRUD через `/api/admin/...`.
   - `admin/students/index.vue` → «Курсанты»: ФИО + телефон.
   - `admin/assignments/index.vue` → «Записи на курс»: участник ↔ курс (без групп/паролей).
   - **Новая** `admin/pins/index.vue` + пункт меню «Коды доступа» в `app/layouts/admin.vue`
     (`navItems`): таблица курс→PIN→период, кнопка «Обновить код» (rotate).
6. Студенческие страницы `student/*` → `my/courses`, `courses/:id`, `courses/:id/test` через API.

**Doc refs:** текущая разметка страниц (Nuxt UI компоненты уже используются: `UCard`, `UModal`,
`USelect`, `UDashboard*`, `UAuthForm`) — переиспользовать, менять только источник данных.

**Verification checklist:**
- [ ] Полный путь: админ логинится → заводит курсанта (ФИО+тел) → пишет на курс → видит PIN.
- [ ] Курсант логинится (тел+PIN) → видит курс → смотрит видео → проходит тест → видит результат.
- [ ] Перезагрузка страницы НЕ теряет данные (пришли из БД, не из `useState`).
- [ ] Нет импортов `useMockData`/`useMockAuth` в проекте (grep пусто).

**Anti-pattern guards:** не оставлять параллельно мок и API; удалить мок-композаблы после миграции.

---

## Phase 7 — Финальная верификация

1. **Grep анти-паттернов:**
   - `grep -rn "useMockData\|useMockAuth" app/` → пусто.
   - `grep -rn "correctAnswer" server/api/courses` → только в submit (подсчёт), не в GET теста.
   - `grep -rn "youtu.be" server/db` → пусто (все embed-URL).
2. **Типы/линт:** `pnpm typecheck` и `pnpm lint` чисто.
3. **Сборка:** `pnpm build` без ошибок.
4. **E2E прогон** (через `/run` или вручную `pnpm dev`): сценарии из Phase 6 checklist.
5. **Данные:** все 10 тестов имеют вопросы (спот-чек количества), у курсов есть видео-материалы,
   PIN виден в админке и меняется по кнопке.
6. **Соответствие плану:** ни одной выдуманной API-функции (сверить с Phase 0 Allowed APIs).

---

## Открытые вопросы к пользователю (уточнить до/во время исполнения)
1. Соответствие спорных курсов и видео (строки с `?` в таблице Phase 2): ПТМ vs ОТ/БиОТ, ПВК/ПОД ФТ vs декретированная группа.
2. Буллинг и Декретированная группа — отдельные курсы (видео без теста) или привязать к существующим?
3. Один PIN на курс на месяц для всех курсантов курса — подтверждаем (да, по описанию). Длина PIN: 6 цифр — ок?
4. Turso: продакшн-БД создаёт пользователь (нужны `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`); для локали — `file:` БД.

## Файлы, которые появятся/изменятся (обзор)
- Новое: `server/db/{schema.ts,seed.ts,migrations/}`, `server/utils/{db.ts,pin.ts,requireAdmin.ts}`,
  `server/api/**`, `drizzle.config.ts`, `.env.example`, `shared/types.ts`, `app/composables/{useApi.ts,useAuth.ts}`,
  `app/pages/admin/pins/index.vue`.
- Изменится: `nuxt.config.ts`, `package.json`, `app/middleware/auth.global.ts`, `app/pages/login.vue`,
  `app/layouts/admin.vue`, все `app/pages/admin/*` и `app/pages/student/*`.
- Удалится: `app/composables/useMockData.ts`, `app/composables/useMockAuth.ts`.
