const mongoose = require('mongoose');
const { connectDatabase } = require('../config/db');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config/env');
const { ADMIN } = require('../constants/roles');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  await connectDatabase();
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = new User({
    name: 'Administrator',
    email: ADMIN_EMAIL,
    password,
    role: ADMIN,
    active: true
  });

  await admin.save();
  console.log('Admin user created:', ADMIN_EMAIL);
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
