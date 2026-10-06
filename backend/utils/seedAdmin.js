require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const { findAccountsByEmail, moveLegacyAccount } = require('./accountModels');

const email = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

const seedAdmin = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }
  if (!password) {
    throw new Error('ADMIN_PASSWORD is required');
  }

  await mongoose.connect(process.env.MONGO_URI, { dbName: 'buildnbuy' });

  const existingAccounts = await findAccountsByEmail(email, true);
  let admin = existingAccounts.find((account) => account.role === 'admin');
  if (existingAccounts.some((account) => account.role !== 'admin')) {
    throw new Error('ADMIN_EMAIL is already used by a non-admin account');
  }
  if (!admin) {
    await Admin.create({
      name: 'BuildNBuy Admin',
      email,
      password,
      role: 'admin',
    });
    console.log(`Admin created: ${email}`);
  } else {
    admin = await moveLegacyAccount(admin);
    admin.name = admin.name || 'BuildNBuy Admin';
    admin.password = password;
    admin.isBlocked = false;
    await admin.save();
    console.log(`Admin credentials updated: ${email}`);
  }

  await mongoose.disconnect();
};

seedAdmin().catch(async (error) => {
  console.error(`Admin seed failed: ${error.message}`);
  await mongoose.disconnect();
  process.exitCode = 1;
});
