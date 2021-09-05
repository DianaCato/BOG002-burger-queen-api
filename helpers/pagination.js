const pagination = (url, limit, page, totalPages) => {
   const urlPages = {
        first: `${url}?limit=${limit}&page=1`,
        prev: `${url}?limit=${limit}&page=${page - 1}`,
        next: `${url}?limit=${limit}&page=${page + 1}`,
        last: `${url}?limit=${limit}&page=${totalPages}`
      }
    return urlPages;
}

module.exports = pagination;