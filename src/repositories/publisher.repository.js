const Publisher = require('../models/Publisher.model');

const populateOwner = (query) => query
  .populate('createdBy', 'name email role')
  .populate('updatedBy', 'name email role');

async function createPublisher(data) {
  const publisher = await Publisher.create(data);
  return populateOwner(Publisher.findById(publisher._id));
}

async function findPublisherById(id) {
  return populateOwner(Publisher.findById(id));
}

async function listPublishers(filter, { skip, limit, sort }) {
  const [data, totalRecords] = await Promise.all([
    populateOwner(Publisher.find(filter)).sort(sort).skip(skip).limit(limit),
    Publisher.countDocuments(filter)
  ]);
  return { data, totalRecords };
}

async function updatePublisher(id, data) {
  return populateOwner(Publisher.findByIdAndUpdate(id, data, { new: true, runValidators: true }));
}

async function deletePublisher(id) {
  return Publisher.findByIdAndDelete(id);
}

module.exports = { createPublisher, findPublisherById, listPublishers, updatePublisher, deletePublisher };
