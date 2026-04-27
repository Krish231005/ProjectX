# MongoDB Setup

The projects module stores added projects in MongoDB.

## 1. Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas/register.
2. Create a free Atlas account.
3. Create a project in Atlas.
4. Create a free cluster.
5. Create a database user and save the username and password.
6. In Network Access, add your current IP address.
7. Open your cluster, click Connect, choose Drivers, select Node.js, and copy the connection string.

## 2. Add Environment Variables

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/projectshut?retryWrites=true&w=majority
MONGODB_DB=projectshut
AUTH_SECRET=replace-with-a-long-random-string
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your Atlas values.

## 3. Run The App

```bash
pnpm dev
```

Open http://localhost:3000/projects and add a project with:

- project name
- description
- video URL

The app will save each entry in the `projects` collection.

Signup/login users are saved in the `users` collection.
