//Parses the parameters to get sort, search and page parameters
export const pagination = (req, res, next) => {
    const{search, sort} = req.params;
    const page = Math.max(parseInt(req.param.page ) || 1, 1);
    const count = Math.max(parseInt(req.params.count) || 10, 10);

    req.pagination = {page, count, search, sort};
    next();
}