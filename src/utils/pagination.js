/**
 * Builds pagination meta and the skip value from query params.
 *
 * Usage:
 *   const { skip, limit, meta } = paginate(req.query, totalCount);
 */
const paginate = (query, total) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  return {
    skip,
    limit,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { paginate };
