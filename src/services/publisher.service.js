const mongoose = require('mongoose');
const {
  createPublisher,
  findPublisherById,
  listPublishers,
  updatePublisher,
  deletePublisher
} = require('../repositories/publisher.repository');
const { countOffers, listOffers } = require('../repositories/offer.repository');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fail = (message, statusCode) => Object.assign(new Error(message), { statusCode });

function validId(id) {
  if (!mongoose.isValidObjectId(id)) throw fail('Invalid publisher ID', 400);
}

function ownerId(resource) {
  return (resource.createdBy?._id || resource.createdBy)?.toString();
}

function canAccess(user, publisher) {
  return user.role === 'admin' || ownerId(publisher) === user.id;
}

function pagination(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

async function getPublishers(user, query) {
  const filter = user.role === 'admin' ? {} : { createdBy: user.id };
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ name: regex }, { poc: regex }, { agencyPoc: regex }];
  }
  if (query.market) filter.market = query.market;
  if (query.status) filter.status = query.status;
  if (user.role === 'admin' && query.userId) {
    if (!mongoose.isValidObjectId(query.userId)) throw fail('Invalid user ID', 400);
    filter.createdBy = query.userId;
  }
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }
  const { page, limit, skip } = pagination(query);
  const allowedSort = ['name', 'market', 'status', 'createdAt', 'updatedAt'];
  const sortBy = allowedSort.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const result = await listPublishers(filter, {
    skip,
    limit,
    sort: { [sortBy]: query.sortOrder === 'asc' ? 1 : -1 }
  });
  return { ...result, page, limit };
}

async function getPublisher(user, id) {
  validId(id);
  const publisher = await findPublisherById(id);
  if (!publisher || !canAccess(user, publisher)) throw fail('Publisher not found', 404);
  return publisher;
}

async function addPublisher(user, data) {
  return createPublisher({ ...data, createdBy: user.id, updatedBy: user.id });
}

async function editPublisher(user, id, data) {
  const publisher = await getPublisher(user, id);
  if (!canAccess(user, publisher)) throw fail('Publisher not found', 404);
  return updatePublisher(id, { ...data, updatedBy: user.id });
}

async function removePublisher(user, id) {
  if (user.role !== 'admin') throw fail('Admin access required', 403);
  validId(id);
  const publisher = await findPublisherById(id);
  if (!publisher) throw fail('Publisher not found', 404);
  if (await countOffers({ publisherId: id })) {
    throw fail('Publisher cannot be deleted while offers are linked to it', 409);
  }
  return deletePublisher(id);
}

async function getPublisherOffers(user, id, query) {
  await getPublisher(user, id);
  const { page, limit, skip } = pagination(query);
  const filter = { publisherId: id };
  if (user.role !== 'admin') filter.createdBy = user.id;
  const result = await listOffers(filter, {
    skip,
    limit,
    sort: { createdAt: -1 },
    includePayment: user.role === 'admin'
  });
  return { ...result, page, limit };
}

module.exports = { getPublishers, getPublisher, addPublisher, editPublisher, removePublisher, getPublisherOffers };
