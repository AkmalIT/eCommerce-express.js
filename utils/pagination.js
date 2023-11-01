module.exports = class Pagination {
    constructor(page = 1, paginationlimit = 12, totalItems) {
        this.limit = +paginationlimit
        this.page = +page
        this.totalItems = +totalItems
        this.totalPage = Math.ceil(this.totalItems / this.limit)
        this.offset = ((this.page - 1) * this.limit)
    }
}