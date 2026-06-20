const mongoose = require('mongoose');
const User = require('../models/User.model');
const Publisher = require('../models/Publisher.model');
const Offer = require('../models/Offer.model');

async function getDashboard(user) {
  const ownerScope = user.role === 'admin' ? {} : { createdBy: new mongoose.Types.ObjectId(user.id) };
  const now = new Date();
  const inThirtyDays = new Date(now);
  inThirtyDays.setDate(inThirtyDays.getDate() + 30);

  const [
    totalUsers,
    publisherCount,
    offerCount,
    activeOffers,
    completedOffers,
    upcomingPayments,
    pendingPayments,
    recentPublishers,
    recentOffers,
    monthlyStats
  ] = await Promise.all([
    user.role === 'admin' ? User.countDocuments({ role: 'individual' }) : Promise.resolve(undefined),
    Publisher.countDocuments(ownerScope),
    Offer.countDocuments(ownerScope),
    Offer.countDocuments({ ...ownerScope, status: /^active$/i }),
    Offer.countDocuments({ ...ownerScope, status: /^completed$/i }),
    user.role === 'admin'
      ? Offer.countDocuments({ 'paymentDetails.paymentDate': { $gte: now, $lte: inThirtyDays } })
      : Promise.resolve(undefined),
    user.role === 'admin'
      ? Offer.countDocuments({ $or: [{ 'paymentDetails.paymentDate': null }, { 'paymentDetails.paymentDate': { $exists: false } }] })
      : Promise.resolve(undefined),
    Publisher.find(ownerScope).populate('createdBy', 'name email').sort({ updatedAt: -1 }).limit(5),
    Offer.find(ownerScope)
      .select(user.role === 'admin' ? '' : '-paymentDetails')
      .populate('publisherId', 'name market')
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 })
      .limit(5),
    Offer.aggregate([
      { $match: ownerScope },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ])
  ]);

  return {
    totalUsers,
    totalPublishers: user.role === 'admin' ? publisherCount : undefined,
    totalOffers: user.role === 'admin' ? offerCount : undefined,
    myPublishers: user.role === 'individual' ? publisherCount : undefined,
    myOffers: user.role === 'individual' ? offerCount : undefined,
    activeOffers,
    completedOffers,
    upcomingPayments,
    pendingPayments,
    recentPublishers,
    recentOffers,
    monthlyStats: monthlyStats.map(({ _id, count }) => ({ year: _id.year, month: _id.month, count }))
  };
}

module.exports = { getDashboard };
