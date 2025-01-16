# tnext-finance

Build a Finance SaaS Platform With Nextjs, React, Honojs with CSV Upload (2024)
https://www.youtube.com/watch?v=N_uNKAus0II

---

COMPONENTS
https://ui.shadcn.com/
npx shadcn@latest init

---

authentication
https://dashboard.clerk.com/apps/new
yarn add @clerk/nextjs
https://hono.dev/
yarn add @hono/clerk-auth
yarn add @clerk/backend

---

## https://logoipsum.com/

---
yarn add hono
yarn add @hono/zod-validator
---
yarn add react-use
---
conect to database
https://console.neon.tech/
---
ORM outra opcao ao prisma

yarn add drizzle-orm @neondatabase/serverless
yarn add -D drizzle-kit

 "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate --dialect=postgresql --schema=db/schema.ts --out=./drizzle",
    "db:migrate": "tsx ./scripts/migrate.ts",
    "db:studio": "drizzle-kit studio"
  },

  yarn db:generate // quando muda alguma coisa nas tabelas
----------------
  yarn add @tanstack/react-query
------------
yarn add -D drizzle-zod
-------------
yarn add -D @paralleldrive/cuid2
-------------
yarn add -D zustand
-------------
yarn add @tanstack/react-table
-------------
yarn add date-fns
-------------
yarn add react-select
-------------
yarn add react-currency-input-field
-------------
yarn add react-papaparse
---------------