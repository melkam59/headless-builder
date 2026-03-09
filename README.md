This is a [Next.js](https://nextjs.org) project with Drizzle ORM and PostgreSQL.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL with Docker:
```bash
docker-compose up -d
```

3. Push the database schema:
```bash
npm run db:push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.
Visit [http://localhost:3000/users](http://localhost:3000/users) to see the users page.

## Database Management

- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio to manage data
- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Run migrations
