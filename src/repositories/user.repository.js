const User = require('../models/User.model');

async function findUserByEmail(email) {
  return User.findOne({ email });
}

async function findUserById(id) {
  return User.findById(id).select('-password');
}

async function findUserByIdWithPassword(id) {
  return User.findById(id);
}

async function listUsers(filter, options) {
  const query = User.find(filter).select('-password');
  const countQuery = User.countDocuments(filter);
  const [data, totalRecords] = await Promise.all([
    query.skip(options.skip).limit(options.limit).sort({ createdAt: -1 }),
    countQuery
  ]);
  return { data, totalRecords };
}

async function createUser(userData) {
  const user = new User(userData);
  return user.save();
}

async function updateUser(id, update) {
  return User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select('-password');
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

module.exports = {
  findUserByEmail,
  findUserById,
  findUserByIdWithPassword,
  listUsers,
  createUser,
  updateUser,
  deleteUser
};
