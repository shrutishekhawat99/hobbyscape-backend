# DIY.HobbyScape — Backend API

Real backend for the DIY.HobbyScape store: user accounts, JWT login,
and orders — all stored in a real database (MongoDB Atlas) instead
of the browser's localStorage.

---

## 1. What this replaces

| Before (localStorage) | Now (this backend) |
|---|---|
| Passwords stored in plain text in the browser | Passwords hashed with bcrypt, stored in MongoDB |
| Data only visible on one browser/device | Data stored centrally, works across devices |
| Anyone can edit their own "account" via DevTools | Protected by JWT tokens, verified server-side |
| Orders could theoretically be edited by the user | Orders created and read only through the server |

---

## 2. One-time setup: MongoDB Atlas (free)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a **free (M0) cluster** — any provider/region is fine.
3. Under **Database Access**, add a database user (username + password) — save these, you'll need them.
4. Under **Network Access**, click **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`). This is fine for now; you can restrict it later.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add `hobbyscape` as the database name right after `.net/`, so it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hobbyscape?retryWrites=true&w=majority
   ```

---

## 3. Local setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` → the connection string from step 2
- `JWT_SECRET` → any long random string (e.g. generate one at https://randomkeygen.com)
- `CLIENT_ORIGIN` → where your frontend runs locally, e.g. `http://127.0.0.1:5500` (Live Server default)

Then seed the product catalog into the database (one-time, safe to re-run):

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

Visit `http://localhost:5000` in a browser — you should see a small JSON message confirming the API is running.

---

## 4. Deploying to Render (free)

1. Push this `backend` folder to a GitHub repo (own repo, separate from or alongside the frontend).
2. Go to https://render.com → **New** → **Web Service** → connect your GitHub repo.
3. Settings:
   - **Root directory**: `backend` (if frontend + backend are in the same repo)
   - **Build command**: `npm install`
   - **Start command**: `npm start`
4. Add environment variables (same as your `.env`): `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (set this to your live frontend URL once it's hosted, e.g. `https://diyhobbyscape.com`).
5. Deploy. Render gives you a live URL like `https://hobbyscape-api.onrender.com` — this is the base URL your frontend will call.

> Free Render services "sleep" after inactivity and take ~30–50 seconds to wake up on the first request. Fine for testing; worth upgrading once you have real customers.

---

## 5. API Reference

All responses are JSON. Protected routes require a header:
```
Authorization: Bearer <token>
```
(the `token` comes back from signup/login)

### Auth

**POST `/api/auth/signup`**
```json
{ "name": "Shruti Sharma", "email": "shruti@test.com", "phone": "9999999999", "password": "12345678" }
```
→ `{ "token": "...", "user": { "id", "name", "email", "phone" } }`

**POST `/api/auth/login`**
```json
{ "email": "shruti@test.com", "password": "12345678" }
```
→ `{ "token": "...", "user": {...} }`

**GET `/api/auth/me`** *(protected)*
→ `{ "user": {...} }`

### Products

**GET `/api/products`**
→ `{ "products": [ { "id", "name", "price", "category", "rating", "badge", "image", "stock" }, ... ] }`

### Orders

**POST `/api/orders`** *(protected)*
```json
{
  "items": [{ "productId": 1, "name": "Bear Figurine Kit", "price": 499, "image": "images/products/p1.jpg", "quantity": 2 }],
  "total": 1048,
  "customer": { "fullName": "Shruti Sharma", "phone": "9999999999", "address": "123 Test Street, Jaipur" }
}
```
→ `{ "order": {...} }`

**GET `/api/orders/my`** *(protected)*
→ `{ "orders": [...] }` — only ever returns orders belonging to the logged-in user (matched by their database ID, not just an email string), so there's no way for one account to see another's orders.

---

## 6. Next step

This backend is ready, but your frontend (`login.js`, `signup.js`, `checkout.js`, `orders.js`, etc.) still talks to `localStorage`. The next step is rewiring those files to call this API with `fetch(...)` instead — happy to do that as soon as you've got this deployed and have a live API URL to point to.
