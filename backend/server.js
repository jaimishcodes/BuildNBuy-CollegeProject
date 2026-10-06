require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { accountModels, findAccountsByEmail } = require("./utils/accountModels");
const Admin = require("./models/Admin");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const contractorRoutes = require("./routes/contractorRoutes");
const constructionRequirementRoutes = require("./routes/constructionRequirementRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

const ensureDefaultAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || "admin@gmail.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.warn("ADMIN_PASSWORD is not set. Admin login will fail until it is added to backend/.env");
    return;
  }

  try {
    const rawMatches = await Promise.all(
      Object.values(accountModels).map((Model) => Model.findOne({ email }))
    );
    const matches = rawMatches.filter(Boolean);

    if (matches.length > 1) {
      const preferredAdmin = matches.find((account) => account.constructor.modelName === "Admin" && account.role === "admin")
        || matches.find((account) => account.role === "admin")
        || matches[0];

      for (const duplicate of matches) {
        if (String(duplicate._id) !== String(preferredAdmin._id)) {
          await duplicate.constructor.deleteOne({ _id: duplicate._id });
        }
      }
    }

    const existingAccounts = await findAccountsByEmail(email, true);
    const admin = existingAccounts.find((account) => account && account.role === "admin");

    if (admin) {
      admin.name = admin.name || "BuildNBuy Admin";
      admin.password = password;
      admin.isBlocked = false;
      await admin.save();
      return;
    }

    if (existingAccounts.some((account) => account && account.role !== "admin")) {
      throw new Error("ADMIN_EMAIL is already used by a non-admin account");
    }

    await Admin.create({
      name: "BuildNBuy Admin",
      email,
      password,
      role: "admin",
    });

    console.log(`Admin account created: ${email}`);
  } catch (error) {
    console.error(`Admin bootstrap failed: ${error.message}`);
  }
};

const app = express();

// Security & core middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Basic rate limiting on auth routes to slow brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/auth", authLimiter);

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "BuildNBuy API is running",
      timestamp: new Date().toISOString(),
    });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/contractors", contractorRoutes);
app.use("/api/construction-requirements", constructionRequirementRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => ensureDefaultAdmin())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  });

module.exports = app;
