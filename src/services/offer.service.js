const mongoose = require('mongoose');
const {
  createOffer,
  findOfferById,
  listOffers,
  updateOffer,
  updatePaymentDetails,
  deleteOffer
} = require('../repositories/offer.repository');
const { findPublisherById } = require('../repositories/publisher.repository');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fail = (message, statusCode) => Object.assign(new Error(message), { statusCode });
const ownerId = (resource) => (resource.createdBy?._id || resource.createdBy)?.toString();

function offerForUser(user, offer) {
  if (!offer || user.role === 'admin') return offer;
  const safeOffer = typeof offer.toObject === 'function' ? offer.toObject() : { ...offer };
  delete safeOffer.paymentDetails;
  return safeOffer;
}

function validId(id, label = 'offer') {
  if (!mongoose.isValidObjectId(id)) throw fail(`Invalid ${label} ID`, 400);
}

async function accessiblePublisher(user, publisherId) {
  validId(publisherId, 'publisher');
  const publisher = await findPublisherById(publisherId);
  if (!publisher || (user.role !== 'admin' && ownerId(publisher) !== user.id)) {
    throw fail('Publisher not found', 404);
  }
  return publisher;
}

function pagination(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

async function getOffers(user, query) {
  const filter = user.role === 'admin' ? {} : { createdBy: user.id };
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ campaignName: regex }, { market: regex }, { kpi: regex }, { note: regex }];
  }
  if (query.publisherId) {
    validId(query.publisherId, 'publisher');
    filter.publisherId = query.publisherId;
  }
  if (query.market) filter.market = query.market;
  if (query.status) filter.status = query.status;
  if (user.role === 'admin' && query.userId) {
    validId(query.userId, 'user');
    filter.createdBy = query.userId;
  }
  if (query.endDateFrom || query.endDateTo) {
    filter.endDate = {};
    if (query.endDateFrom) filter.endDate.$gte = new Date(query.endDateFrom);
    if (query.endDateTo) {
      const end = new Date(query.endDateTo);
      end.setHours(23, 59, 59, 999);
      filter.endDate.$lte = end;
    }
  }
  const { page, limit, skip } = pagination(query);
  const allowedSort = ['campaignName', 'market', 'status', 'endDate', 'createdAt', 'updatedAt'];
  const sortBy = allowedSort.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const result = await listOffers(filter, {
    skip,
    limit,
    sort: { [sortBy]: query.sortOrder === 'asc' ? 1 : -1 },
    includePayment: user.role === 'admin'
  });
  result.data = result.data.map((offer) => offerForUser(user, offer));
  return { ...result, page, limit };
}

async function getOffer(user, id) {
  validId(id);
  const offer = await findOfferById(id, user.role === 'admin');
  if (!offer || (user.role !== 'admin' && ownerId(offer) !== user.id)) throw fail('Offer not found', 404);
  return offerForUser(user, offer);
}

async function addOffer(user, data) {
  await accessiblePublisher(user, data.publisherId);
  const offer = await createOffer({ ...data, createdBy: user.id, updatedBy: user.id }, user.role === 'admin');
  return offerForUser(user, offer);
}

async function editOffer(user, id, data) {
  const offer = await getOffer(user, id);
  await accessiblePublisher(user, data.publisherId);
  const updated = await updateOffer(offer._id, { ...data, updatedBy: user.id }, user.role === 'admin');
  return offerForUser(user, updated);
}

async function removeOffer(user, id) {
  if (user.role !== 'admin') throw fail('Admin access required', 403);
  validId(id);
  const offer = await findOfferById(id);
  if (!offer) throw fail('Offer not found', 404);
  return deleteOffer(id);
}

async function editPaymentDetails(user, id, data) {
  if (user.role !== 'admin') throw fail('Admin access required', 403);
  validId(id);
  const offer = await findOfferById(id);
  if (!offer) throw fail('Offer not found', 404);
  const normalized = { ...data };
  ['endDate', 'validationDate', 'invoiceDate', 'paymentDate'].forEach((key) => {
    if (normalized[key] === '') normalized[key] = null;
  });
  return updatePaymentDetails(id, normalized);
}

module.exports = { getOffers, getOffer, addOffer, editOffer, removeOffer, editPaymentDetails };
