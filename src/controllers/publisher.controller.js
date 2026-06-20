const {
  getPublishers,
  getPublisher,
  addPublisher,
  editPublisher,
  removePublisher,
  getPublisherOffers
} = require('../services/publisher.service');
const { successResponse, createdResponse, errorResponse } = require('../utils/apiResponse');

const paginated = (result) => ({
  data: result.data,
  page: result.page,
  limit: result.limit,
  totalPages: Math.ceil(result.totalRecords / result.limit),
  totalRecords: result.totalRecords
});

async function list(req, res) {
  try { return successResponse(res, 'Publishers fetched successfully', paginated(await getPublishers(req.user, req.query))); }
  catch (error) { return errorResponse(res, error.statusCode || 500, error.message, []); }
}
async function details(req, res) {
  try { return successResponse(res, 'Publisher fetched successfully', await getPublisher(req.user, req.params.id)); }
  catch (error) { return errorResponse(res, error.statusCode || 500, error.message, []); }
}
async function create(req, res) {
  try { return createdResponse(res, 'Publisher created successfully', await addPublisher(req.user, req.body)); }
  catch (error) { return errorResponse(res, error.statusCode || 400, error.message, []); }
}
async function update(req, res) {
  try { return successResponse(res, 'Publisher updated successfully', await editPublisher(req.user, req.params.id, req.body)); }
  catch (error) { return errorResponse(res, error.statusCode || 400, error.message, []); }
}
async function remove(req, res) {
  try { await removePublisher(req.user, req.params.id); return successResponse(res, 'Publisher deleted successfully'); }
  catch (error) { return errorResponse(res, error.statusCode || 500, error.message, []); }
}
async function offers(req, res) {
  try { return successResponse(res, 'Publisher offers fetched successfully', paginated(await getPublisherOffers(req.user, req.params.id, req.query))); }
  catch (error) { return errorResponse(res, error.statusCode || 500, error.message, []); }
}

module.exports = { list, details, create, update, remove, offers };
