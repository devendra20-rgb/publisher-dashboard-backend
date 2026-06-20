const ExcelJS = require('exceljs');
const Publisher = require('../models/Publisher.model');
const Offer = require('../models/Offer.model');

function dateFilter(query) {
  const filter = {};
  const now = new Date();
  if (query.range === 'monthly') {
    filter.createdAt = { $gte: new Date(now.getFullYear(), now.getMonth(), 1), $lte: now };
  } else if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }
  return filter;
}

function prepareSheet(workbook, name, columns) {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = columns;
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  return sheet;
}

async function generatePublisherExport(query) {
  const publishers = await Publisher.find(dateFilter(query)).populate('createdBy', 'name email').sort({ createdAt: -1 });
  const workbook = new ExcelJS.Workbook();
  const sheet = prepareSheet(workbook, 'Publishers', [
    { header: 'Name', key: 'name', width: 28 },
    { header: 'Market', key: 'market', width: 18 },
    { header: 'POC', key: 'poc', width: 22 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Wishlist', key: 'wishlist', width: 30 },
    { header: 'Agency POC', key: 'agencyPoc', width: 22 },
    { header: 'Created By', key: 'createdBy', width: 22 },
    { header: 'Created At', key: 'createdAt', width: 20 },
    { header: 'Updated At', key: 'updatedAt', width: 20 }
  ]);
  publishers.forEach((publisher) => sheet.addRow({
    name: publisher.name, market: publisher.market, poc: publisher.poc, status: publisher.status,
    wishlist: publisher.wishlist, agencyPoc: publisher.agencyPoc,
    createdBy: publisher.createdBy?.name || '', createdAt: publisher.createdAt, updatedAt: publisher.updatedAt
  }));
  return { buffer: await workbook.xlsx.writeBuffer(), recordCount: publishers.length };
}

async function generateOfferExport(query) {
  const offers = await Offer.find(dateFilter(query)).populate('publisherId', 'name').populate('createdBy', 'name email').sort({ createdAt: -1 });
  const workbook = new ExcelJS.Workbook();
  const sheet = prepareSheet(workbook, 'Offers', [
    { header: 'Campaign Name', key: 'campaignName', width: 28 },
    { header: 'Market', key: 'market', width: 18 },
    { header: 'KPI', key: 'kpi', width: 18 },
    { header: 'Costing Model', key: 'costingModel', width: 18 },
    { header: 'Payout', key: 'payout', width: 14 },
    { header: 'Note', key: 'note', width: 32 },
    { header: 'Publisher', key: 'publisher', width: 25 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'End Date', key: 'endDate', width: 18 },
    { header: 'Payment Publisher Name', key: 'publisherName', width: 25 },
    { header: 'Payment Agency POC', key: 'agencyPOC', width: 22 },
    { header: 'Validation Date', key: 'validationDate', width: 18 },
    { header: 'Invoice Date', key: 'invoiceDate', width: 18 },
    { header: 'Payment Date', key: 'paymentDate', width: 18 },
    { header: 'Publisher Confirmation', key: 'publisherConfirmation', width: 25 },
    { header: 'Created By', key: 'createdBy', width: 22 },
    { header: 'Created At', key: 'createdAt', width: 20 },
    { header: 'Updated At', key: 'updatedAt', width: 20 }
  ]);
  offers.forEach((offer) => {
    const payment = offer.paymentDetails || {};
    sheet.addRow({
      campaignName: offer.campaignName, market: offer.market, kpi: offer.kpi,
      costingModel: offer.costingModel, payout: offer.payout, note: offer.note,
      publisher: offer.publisherId?.name || '', status: offer.status, endDate: offer.endDate,
      publisherName: payment.publisherName, agencyPOC: payment.agencyPOC,
      validationDate: payment.validationDate, invoiceDate: payment.invoiceDate,
      paymentDate: payment.paymentDate, publisherConfirmation: payment.publisherConfirmation,
      createdBy: offer.createdBy?.name || '', createdAt: offer.createdAt, updatedAt: offer.updatedAt
    });
  });
  return { buffer: await workbook.xlsx.writeBuffer(), recordCount: offers.length };
}

module.exports = { generatePublisherExport, generateOfferExport };

