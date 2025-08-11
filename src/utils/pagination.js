// Pagination utility
const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  // Ensure positive numbers and reasonable limits
  const validPage = Math.max(1, isNaN(pageNum) ? 1 : pageNum);
  const validLimit = Math.min(100, Math.max(1, isNaN(limitNum) ? 10 : limitNum));
  
  const skip = (validPage - 1) * validLimit;
  
  return {
    skip,
    take: validLimit,
    page: validPage,
    limit: validLimit
  };
};

// Create pagination meta information
const createPaginationMeta = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalCount,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    limit
  };
};

module.exports = {
  getPagination,
  createPaginationMeta
};