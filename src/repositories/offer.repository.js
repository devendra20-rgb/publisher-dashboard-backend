const Offer = require('../models/Offer.model');

function populated(query) {
  return query
    .populate('publisherId', 'name market poc status agencyPoc createdBy')
    .populate('createdBy', 'name email role')
    .populate('updatedBy', 'name email role');
}

async function createOffer(data, includePayment = true) {
  const offer = await Offer.create(data);
  const query = Offer.findById(offer._id);
  if (!includePayment) query.select('-paymentDetails');
  return populated(query);
}

async function findOfferById(id, includePayment = true) {
  const query = Offer.findById(id);
  if (!includePayment) query.select('-paymentDetails');
  return populated(query);
}

async function listOffers(filter, { skip, limit, sort, includePayment }) {
  const query = Offer.find(filter);
  if (!includePayment) query.select('-paymentDetails');
  const [data, totalRecords] = await Promise.all([
    populated(query).sort(sort).skip(skip).limit(limit),
    Offer.countDocuments(filter)
  ]);
  return { data, totalRecords };
}

async function updateOffer(id, data, includePayment = true) {
  const query = Offer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!includePayment) query.select('-paymentDetails');
  return populated(query);
}

async function updatePaymentDetails(id, paymentDetails) {
  return populated(Offer.findByIdAndUpdate(
    id,
    { $set: { paymentDetails } },
    { new: true, runValidators: true }
  ));
}

async function deleteOffer(id) {
  return Offer.findByIdAndDelete(id);
}

async function countOffers(filter) {
  return Offer.countDocuments(filter);
}

module.exports = {
  createOffer,
  findOfferById,
  listOffers,
  updateOffer,
  updatePaymentDetails,
  deleteOffer,
  countOffers
};
