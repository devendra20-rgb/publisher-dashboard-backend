const { getOffers, getOffer, addOffer, editOffer, removeOffer, editPaymentDetails } = require('../services/offer.service');
const { successResponse, createdResponse, errorResponse } = require('../utils/apiResponse');

const paginated = (result) => ({
  data: result.data,
  page: result.page,
  limit: result.limit,
  totalPages: Math.ceil(result.totalRecords / result.limit),
  totalRecords: result.totalRecords
});

async function list(req, res) {
  try { return successResponse(res, 'Offers fetched successfully', paginated(await getOffers(req.user, req.query))); }
  catch (error) { return errorResponse(res, error.statusCode || 500, error.message, []); }
}
async function details(req, res) {
  try { return successResponse(res, 'Offer fetched successfully', await getOffer(req.user, req.params.id)); }
  catch (error) { return errorResponse(res, error.statusCode || 500, error.message, []); }
}
async function create(req, res) {
  try { return createdResponse(res, 'Offer created successfully', await addOffer(req.user, req.body)); }
  catch (error) { return errorResponse(res, error.statusCode || 400, error.message, []); }
}
async function update(req, res) {
  try { return successResponse(res, 'Offer updated successfully', await editOffer(req.user, req.params.id, req.body)); }
  catch (error) { return errorResponse(res, error.statusCode || 400, error.message, []); }
}
async function remove(req, res) {
  try { await removeOffer(req.user, req.params.id); return successResponse(res, 'Offer deleted successfully'); }
  catch (error) { return errorResponse(res, error.statusCode || 500, error.message, []); }
}
async function payment(req, res) {
  try { return successResponse(res, 'Payment details updated successfully', await editPaymentDetails(req.user, req.params.id, req.body)); }
  catch (error) { return errorResponse(res, error.statusCode || 400, error.message, []); }
}

module.exports = { list, details, create, update, remove, payment };
