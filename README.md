#🍬 Sweet Shop ApplicationA full-stack application for managing a sweet shop inventory. This project allows administrators to stock sweets and customers to purchase them, featuring real-time stock updates and secure authentication.

##🚀 Tech Stack**Frontend:**

* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State/API:** Axios, React Hooks

**Backend:**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** SQLite (with TypeORM)
* **Authentication:** JWT (JSON Web Tokens)

---

##🛠️ Setup & InstallationThis project requires **two separate terminals** running simultaneously (one for the backend, one for the frontend).

###1. Backend Setup1. Navigate to the backend folder:
```bash
cd sweet-shop-backend

```


2. Install dependencies:
```bash
npm install

```


3. Start the server:
```bash
npm run dev

```


*Server will start on `http://localhost:3000*`

###2. Frontend Setup1. Open a new terminal and navigate to the frontend folder:
```bash
cd sweet-shop-frontend

```


2. Install dependencies:
```bash
npm install

```


3. Start the application:
```bash
npm run dev

```


*App will run at `http://localhost:5173*`

---

##🔑 Key Features* **User Authentication:** Secure Login and Registration system.
* **Admin Dashboard:** Admins can add new sweets (Name, Category, Price, Quantity) to the inventory.
* **Shopping:** Users can view available sweets and purchase them.
* **Real-time Stock Logic:** Items automatically show as "Sold Out" when quantity hits 0, preventing further purchases.

---

##📡 API Endpoints| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user (Admin/User) |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/sweets` | Get list of all sweets |
| `POST` | `/api/sweets` | Add a new sweet (Admin only) |
| `POST` | `/api/sweets/:id/purchase` | Buy a sweet and decrease stock |

---

##🤖 My AI Usage###AI Tools Used* **Gemini (Google):** Used as the primary pair programmer and debugging assistant throughout the development lifecycle.

###How I Used AI1. **Debugging & Error Resolution:**
* I used Gemini to diagnose a "Black Screen" issue in React, identifying that `main.tsx` had incorrect import paths.
* When I encountered a "Version Mismatch" error with Tailwind CSS (accidentally installing v4 Beta), I used Gemini to identify the conflict and downgrade to the stable v3 version.
* I leveraged AI to interpret cryptic `ERR_CONNECTION_REFUSED` errors, leading to the discovery that my Backend server wasn't running or CORS was missing.


2. **Code Generation & Boilerplate:**
* I asked Gemini to generate the initial `Axios` setup to handle API requests cleanly.
* I used AI to draft the `Dashboard.tsx` component, specifically the logic for mapping through the inventory array and conditionally rendering the "Sold Out" button.
* I requested the TypeScript interfaces (e.g., `interface Sweet`) to ensure type safety between my backend entities and frontend state.


3. **Workarounds & Scripting:**
* Since I hadn't built a Registration UI yet, I asked Gemini for a way to create an Admin user quickly. It provided a JavaScript `fetch` script to run directly in the browser console, saving me from writing a temporary form.



###Reflection on AI ImpactUsing AI significantly accelerated my workflow, particularly during the "Configuration Hell" phases. Instead of spending hours searching StackOverflow for specific Vite/Tailwind compatibility issues, Gemini provided immediate, context-aware fixes.

It also acted as a "bridge" between the backend and frontend. When I was unsure why the frontend wasn't receiving data, the AI helped me trace the issue to a missing `app.listen()` call in the backend, effectively debugging the full stack at once. This allowed me to focus more on the business logic (inventory management) rather than getting stuck on syntax or configuration errors.