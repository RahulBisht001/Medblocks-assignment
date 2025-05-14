# Patient Registration Admin App

A frontend-only app for registering and querying patient data, utilizing Pglite for local SQL storage with IndexedDB. The app supports multi-tab synchronization, localStorage-based persistence, and raw SQL queries.

## 📝Features

1. Register new patients with validation
2. Query patient data using raw SQL
3. Persistent data across browser refreshes (using localStorage)
4. Multi-tab synchronization of form data
5. Error handling for invalid SQL queries

## 🛠️Local Setup & Usage Instructions

1. Clone the repository:

```bash
git clone https://github.com/your-username/patient-registration-app.git

cd patient-registration-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app:
Open your browser and go to:

```bash
http://localhost:3000
```

`ℹ️ Note:` The SQL query interface may take a moment to initialize
after page load due to IndexedDB and Pglite setup. If you see no response
or errors at first, wait 1–2 seconds and try again.


## 🔧Deployment

Deployed on Vercel

* [View live Demo](https://medblocks-assignment-seven.vercel.app/)


[Meet The Developer](https://www.linkedin.com/in/RahulB001/)
[rahulbisht1012@gmail.com]

## Challenges

This list is not following any order.

1. **Multi-Tab Sync**

    I worked on form data persistence earlier but had never explored multi-tab synchronization. This was my first time diving into it. After researching extensively, I learned about the `BroadcastChannel API` for synchronization. However, I ultimately found a clever and concise solution on Stack Overflow for the sync using `storage` event.

2. **PgLite experience**

    Before starting this project, I had only worked with server-based databases like MongoDB, MySQL, etc. This was the first time I was using a lightweight, browser-based database similar to SQLite. I tried to find a visual GUI for it, but there was no solution like `phpMyAdmin` or `MongoDB Compass`. In the end, I resorted to using the classic `console.log()` for debugging.

3. **Next.js 15 SSR issues**

    Every major release of Next.js brings its own set of challenges. This time, I wanted to create a DbContext to avoid writing redundant code using `Context API`. However, since DbContext is a client component due to the use of React hooks, wrapping it around the app in layout.js—a server component—caused a conflict.
    I found the solution through a YouTube tutorial: I needed to create an additional component to wrap the provider. Check out `/components/DbProviderClient.js`. This component wraps the actual provider and is then used to wrap `layout.js`, resolving the server/client mismatch.
