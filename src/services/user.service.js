const { ADMIN, INDIVIDUAL } = require('../constants/roles');
const {
  findUserByEmail,
  findUserById,
  listUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../repositories/user.repository');
const { hashPassword } = require('./auth.service');
const mongoose = require('mongoose');

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid user ID');
    error.statusCode = 400;
    throw error;
  }
}

async function getUsers(query) {
  const { page = 1, limit = 10, search = '', role, active } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
  }
  if (role) {
    filter.role = role;
  }
  if (active !== undefined) {
    filter.active = active === 'true';
  }

  return listUsers(filter, { skip, limit: Number(limit) });
}

async function createNewUser(data) {
  if (data.role === ADMIN) {
    const error = new Error('Additional admin accounts cannot be created');
    error.statusCode = 400;
    throw error;
  }
  const existing = await findUserByEmail(data.email);
  if (existing) {
    const error = new Error('Email already exists');
    error.statusCode = 409;
    throw error;
  }
  const password = await hashPassword(data.password);
  return createUser({ ...data, password, role: INDIVIDUAL });
}

async function updateExistingUser(id, updater) {
  assertValidId(id);
  const target = await findUserById(id);
  if (!target) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  if (target.role === ADMIN && (updater.role === INDIVIDUAL || updater.active === false)) {
    const error = new Error('The admin account cannot be demoted or deactivated');
    error.statusCode = 400;
    throw error;
  }
  if (updater.email) {
    const existing = await findUserByEmail(updater.email);
    if (existing && existing._id.toString() !== id) {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }
  }
  return updateUser(id, updater);
}

async function removeUser(id) {
  assertValidId(id);
  const target = await findUserById(id);
  if (!target) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  if (target.role === ADMIN) {
    const error = new Error('The admin account cannot be deleted');
    error.statusCode = 400;
    throw error;
  }
  return deleteUser(id);
}

async function getUserById(id) {
  assertValidId(id);
  return findUserById(id);
}

module.exports = { getUsers, createNewUser, updateExistingUser, removeUser, getUserById };
