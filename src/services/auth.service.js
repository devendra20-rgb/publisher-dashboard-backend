const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { findUserByEmail, findUserByIdWithPassword, updateUser } = require('../repositories/user.repository');
const mongoose = require('mongoose');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user || !user.active) {
    throw new Error('Email or password is invalid');
  }
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Email or password is invalid');
  }
  const token = createToken({ userId: user._id, role: user.role });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }, token };
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await findUserByIdWithPassword(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const isCurrentValid = await comparePassword(currentPassword, user.password);
  if (!isCurrentValid) {
    throw new Error('Current password is invalid');
  }
  user.password = await hashPassword(newPassword);
  await user.save();
  return true;
}

async function resetPassword(userId, tempPassword) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error('Invalid user ID');
    error.statusCode = 400;
    throw error;
  }
  const user = await findUserByIdWithPassword(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  const hashed = await hashPassword(tempPassword);
  return updateUser(userId, { password: hashed });
}

module.exports = {
  hashPassword,
  login,
  verifyToken,
  changePassword,
  resetPassword
};
