import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SERVICES, 
  INITIAL_REPAIRS, 
  INITIAL_BOOKINGS, 
  INITIAL_ORDERS 
} from "./src/data";
import { Product, Service, Repair, Booking, Order, User } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get Gemini client dynamically with the latest API key from the environment
function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please add your Gemini API Key in the 'Settings > Secrets' menu of the AI Studio workspace.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST Endpoint for AI Dialog, Chat history, and Google Search Grounding
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model, systemInstruction, useSearch } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing messages array in request body" });
      return;
    }

    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }]
    }));

    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    
    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const ai = getGemini();
    const selectedModel = model || "gemini-3.5-flash";

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config
    });

    const reply = response.text || "I was unable to formulate a response.";
    
    // Extract Search Grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries;
    
    // Format sources nicely
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Web Source",
      uri: chunk.web?.uri || "#"
    })).filter((src: any) => src.uri !== "#") || [];

    res.json({
      reply,
      sources,
      searchQueries
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// Google OAuth URL Generation
app.get("/api/auth/google/url", (req, res) => {
  try {
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const redirectUri = `${appUrl.replace(/\/$/, "")}/auth/callback`;
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;

    if (!clientId) {
      res.status(400).json({ 
        error: "Google OAuth is not configured. Please add GOOGLE_CLIENT_ID or CLIENT_ID to your environment variables." 
      });
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid profile email",
      access_type: "offline",
      prompt: "select_account"
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({ url: authUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal server error generating OAuth URL" });
  }
});

// Google OAuth Callback Handler
app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.send(`
      <html>
        <head><title>Authentication Failed</title></head>
        <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc; color: #1e293b;">
          <div style="background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px;">
            <div style="color: #ef4444; font-size: 48px; margin-bottom: 12px;">⚠️</div>
            <h2 style="margin: 0 0 8px 0; font-size: 18px;">Authentication Failed</h2>
            <p style="margin: 0; font-size: 13px; color: #64748b;">No authorization code received from Google. Please try again.</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: "OAUTH_AUTH_FAILURE", error: "No authorization code received from Google." }, "*");
                setTimeout(() => window.close(), 3000);
              } else {
                setTimeout(() => { window.location.href = "/"; }, 3000);
              }
            </script>
          </div>
        </body>
      </html>
    `);
    return;
  }

  try {
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const redirectUri = `${appUrl.replace(/\/$/, "")}/auth/callback`;
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Google OAuth credentials (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET).");
    }

    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errText}`);
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // Fetch user profile from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userResponse.ok) {
      const errText = await userResponse.text();
      throw new Error(`Failed to fetch user profile: ${errText}`);
    }

    const googleUser = await userResponse.json();
    
    // Structure a clean user object matching our application's User interface
    const user = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      email: googleUser.email,
      fullName: googleUser.name || `${googleUser.given_name || ""} ${googleUser.family_name || ""}`.trim() || "Google User",
      phone: "", // Default empty phone
      isAdmin: false
    };

    // Serialize user as JSON to send via postMessage
    const serializedUser = JSON.stringify(user);

    // Send success message and data to opener window and close
    res.send(`
      <html>
        <head><title>Authentication Successful</title></head>
        <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc; color: #1e293b;">
          <div style="background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px;">
            <div style="color: #22c55e; font-size: 48px; margin-bottom: 12px;">✅</div>
            <h2 style="margin: 0 0 8px 0; font-size: 18px;">Sign In Successful</h2>
            <p style="margin: 0; font-size: 13px; color: #64748b;">You have been authenticated successfully! Redirecting you now...</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: "OAUTH_AUTH_SUCCESS", 
                  user: ${serializedUser} 
                }, "*");
                window.close();
              } else {
                window.location.href = "/";
              }
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error("Google OAuth callback error:", error);
    const safeError = error.message || "An unknown error occurred during Google sign-in.";
    res.send(`
      <html>
        <head><title>Authentication Error</title></head>
        <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc; color: #1e293b;">
          <div style="background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px;">
            <div style="color: #ef4444; font-size: 48px; margin-bottom: 12px;">⚠️</div>
            <h2 style="margin: 0 0 8px 0; font-size: 18px;">Authentication Error</h2>
            <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b;">${safeError}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: "OAUTH_AUTH_FAILURE", 
                  error: ${JSON.stringify(safeError)} 
                }, "*");
                setTimeout(() => window.close(), 5000);
              } else {
                window.location.href = "/?error=" + encodeURIComponent(${JSON.stringify(safeError)});
              }
            </script>
          </div>
        </body>
      </html>
    `);
  }
});

// ==========================================
// PERSISTENT FILE-BASED DATABASE MANAGER
// ==========================================

const DB_PATH = path.join(process.cwd(), "server_db.json");

interface DbSchema {
  products: Product[];
  services: Service[];
  repairs: Repair[];
  bookings: Booking[];
  orders: Order[];
  users: User[];
}

function loadDatabase(): DbSchema {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      const db: DbSchema = JSON.parse(data);
      
      // Ensure the admin account ntixtechsolutions@gmail.com exists
      const hasNtixAdmin = db.users.some(u => u.email.toLowerCase() === 'ntixtechsolutions@gmail.com');
      if (!hasNtixAdmin) {
        db.users.push({
          id: 'usr-admin-ntix',
          fullName: 'NTIX Administrator',
          email: 'ntixtechsolutions@gmail.com',
          phone: '0111915606',
          isAdmin: true
        });
        saveDatabase(db);
      }
      return db;
    }
  } catch (err) {
    console.error("Failed to read server_db.json, using seed values:", err);
  }

  // Initial Seed
  const defaultDb: DbSchema = {
    products: INITIAL_PRODUCTS,
    services: INITIAL_SERVICES,
    repairs: INITIAL_REPAIRS,
    bookings: INITIAL_BOOKINGS,
    orders: INITIAL_ORDERS,
    users: [
      {
        id: 'usr-johndoe',
        fullName: 'John Doe',
        email: 'maunduevans2004@gmail.com',
        phone: '0111915606',
        isAdmin: false
      },
      {
        id: 'usr-admin',
        fullName: 'Admin User',
        email: 'admin@ntix.co.ke',
        phone: '0712345678',
        isAdmin: true
      },
      {
        id: 'usr-admin-ntix',
        fullName: 'NTIX Administrator',
        email: 'ntixtechsolutions@gmail.com',
        phone: '0111915606',
        isAdmin: true
      }
    ]
  };
  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(data: DbSchema) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to server_db.json:", err);
  }
}

// Ensure the DB is initialized upon boot
loadDatabase();

// ==========================================
// REST API ENDPOINTS
// ==========================================

// --- PRODUCTS API ---
app.get("/api/products", (req, res) => {
  const db = loadDatabase();
  res.json(db.products);
});

app.get("/api/products/:id", (req, res) => {
  const db = loadDatabase();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const db = loadDatabase();
  const newProduct: Product = {
    id: `prod-${Math.floor(1000 + Math.random() * 9000)}`,
    name: req.body.name || "Unnamed Product",
    price: Number(req.body.price) || 0,
    oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : undefined,
    image: req.body.image || "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop&q=80",
    category: req.body.category || "General",
    brand: req.body.brand || "Generic",
    rating: Number(req.body.rating) || 5.0,
    reviewsCount: Number(req.body.reviewsCount) || 0,
    inStock: req.body.inStock !== false,
    specs: Array.isArray(req.body.specs) ? req.body.specs : [],
    description: req.body.description || ""
  };
  db.products.push(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  db.products[index] = {
    ...db.products[index],
    ...req.body,
    id: req.params.id // lock the id
  };
  saveDatabase(db);
  res.json(db.products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const deleted = db.products.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, deleted: deleted[0] });
});

// --- SERVICES API ---
app.get("/api/services", (req, res) => {
  const db = loadDatabase();
  res.json(db.services);
});

app.get("/api/services/:id", (req, res) => {
  const db = loadDatabase();
  const service = db.services.find(s => s.id === req.params.id);
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(service);
});

app.post("/api/services", (req, res) => {
  const db = loadDatabase();
  const newService: Service = {
    id: `serv-${Math.floor(1000 + Math.random() * 9000)}`,
    name: req.body.name || "New Service",
    description: req.body.description || "",
    icon: req.body.icon || "Layers",
    priceDetails: req.body.priceDetails || "Contact for pricing"
  };
  db.services.push(newService);
  saveDatabase(db);
  res.status(201).json(newService);
});

app.put("/api/services/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  db.services[index] = {
    ...db.services[index],
    ...req.body,
    id: req.params.id
  };
  saveDatabase(db);
  res.json(db.services[index]);
});

app.delete("/api/services/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  const deleted = db.services.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, deleted: deleted[0] });
});

// --- REPAIRS API ---
app.get("/api/repairs", (req, res) => {
  const db = loadDatabase();
  const { customerName, customerPhone } = req.query;
  let list = db.repairs;
  if (customerName) {
    list = list.filter(r => r.customerName.toLowerCase().includes((customerName as string).toLowerCase()));
  }
  if (customerPhone) {
    list = list.filter(r => r.customerPhone.includes(customerPhone as string));
  }
  res.json(list);
});

app.get("/api/repairs/:id", (req, res) => {
  const db = loadDatabase();
  const repair = db.repairs.find(r => r.id === req.params.id);
  if (!repair) {
    res.status(404).json({ error: "Repair tracking number not found" });
    return;
  }
  res.json(repair);
});

app.post("/api/repairs", (req, res) => {
  const db = loadDatabase();
  const newRepair: Repair = {
    id: req.body.id || `NT${Math.floor(1000 + Math.random() * 9000)}`,
    device: req.body.device || "Laptop",
    issue: req.body.issue || "General Diagnosis",
    status: req.body.status || 'Pending',
    receivedOn: req.body.receivedOn || new Date().toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }),
    estimatedDelivery: req.body.estimatedDelivery || "2-3 Days",
    customerName: req.body.customerName || "Walk-in Customer",
    customerPhone: req.body.customerPhone || "",
    history: req.body.history || [
      {
        title: "Repair Request Received",
        date: new Date().toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
        completed: true
      }
    ]
  };
  db.repairs.push(newRepair);
  saveDatabase(db);
  res.status(201).json(newRepair);
});

app.put("/api/repairs/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.repairs.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Repair not found" });
    return;
  }
  db.repairs[index] = {
    ...db.repairs[index],
    ...req.body,
    id: req.params.id
  };
  saveDatabase(db);
  res.json(db.repairs[index]);
});

app.delete("/api/repairs/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.repairs.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Repair not found" });
    return;
  }
  const deleted = db.repairs.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, deleted: deleted[0] });
});

// --- BOOKINGS API ---
app.get("/api/bookings", (req, res) => {
  const db = loadDatabase();
  const { customerEmail } = req.query;
  let list = db.bookings;
  if (customerEmail) {
    list = list.filter(b => b.customerEmail.toLowerCase() === (customerEmail as string).toLowerCase());
  }
  res.json(list);
});

app.get("/api/bookings/:id", (req, res) => {
  const db = loadDatabase();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(booking);
});

app.post("/api/bookings", (req, res) => {
  const db = loadDatabase();
  const newBooking: Booking = {
    id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
    serviceId: req.body.serviceId || "serv-internet",
    serviceName: req.body.serviceName || "Cyber Session",
    customerName: req.body.customerName || "Anonymous Customer",
    customerEmail: req.body.customerEmail || "",
    customerPhone: req.body.customerPhone || "",
    date: req.body.date || new Date().toISOString().split('T')[0],
    time: req.body.time || "10:00 AM",
    status: req.body.status || 'Pending',
    notes: req.body.notes || "",
    files: Array.isArray(req.body.files) ? req.body.files : []
  };
  db.bookings.push(newBooking);
  saveDatabase(db);
  res.status(201).json(newBooking);
});

app.put("/api/bookings/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  db.bookings[index] = {
    ...db.bookings[index],
    ...req.body,
    id: req.params.id
  };
  saveDatabase(db);
  res.json(db.bookings[index]);
});

app.delete("/api/bookings/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const deleted = db.bookings.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, deleted: deleted[0] });
});

// --- ORDERS API ---
app.get("/api/orders", (req, res) => {
  const db = loadDatabase();
  const { email } = req.query;
  let list = db.orders;
  if (email) {
    list = list.filter(o => o.email.toLowerCase() === (email as string).toLowerCase());
  }
  res.json(list);
});

app.get("/api/orders/:id", (req, res) => {
  const db = loadDatabase();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

app.post("/api/orders", (req, res) => {
  const db = loadDatabase();
  const newOrder: Order = {
    id: req.body.id || `#NT${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: req.body.customerName || "Customer",
    email: req.body.email || "",
    phone: req.body.phone || "",
    address: req.body.address || "",
    city: req.body.city || "",
    county: req.body.county || "",
    items: Array.isArray(req.body.items) ? req.body.items : [],
    subtotal: Number(req.body.subtotal) || 0,
    deliveryFee: Number(req.body.deliveryFee) || 0,
    total: Number(req.body.total) || 0,
    status: req.body.status || 'Pending',
    paymentMethod: req.body.paymentMethod || 'M-PESA',
    date: req.body.date || new Date().toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })
  };
  db.orders.push(newOrder);
  saveDatabase(db);
  res.status(201).json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  db.orders[index] = {
    ...db.orders[index],
    ...req.body,
    id: req.params.id
  };
  saveDatabase(db);
  res.json(db.orders[index]);
});

app.delete("/api/orders/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const deleted = db.orders.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, deleted: deleted[0] });
});

// --- USERS API ---
app.get("/api/users", (req, res) => {
  const db = loadDatabase();
  res.json(db.users);
});

app.get("/api/users/:id", (req, res) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

app.post("/api/users", (req, res) => {
  const db = loadDatabase();
  const existingUser = db.users.find(u => u.email.toLowerCase() === req.body.email?.toLowerCase());
  if (existingUser) {
    res.status(400).json({ error: "A user with this email address already exists" });
    return;
  }
  const newUser: User = {
    id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: req.body.fullName || "New User",
    email: req.body.email || "",
    phone: req.body.phone || "",
    isAdmin: req.body.isAdmin === true
  };
  db.users.push(newUser);
  saveDatabase(db);
  res.status(201).json(newUser);
});

app.put("/api/users/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  db.users[index] = {
    ...db.users[index],
    ...req.body,
    id: req.params.id
  };
  saveDatabase(db);
  res.json(db.users[index]);
});

app.delete("/api/users/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const deleted = db.users.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, deleted: deleted[0] });
});

// Configure Vite middleware or Static files hosting
async function configureApp() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up production static file serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NTIX Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

configureApp();
