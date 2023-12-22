export const routes = {
    home: '/',
    categories: '/categories',
    category: '/category/:id',
    costRecords: '/cost-records',
    costRecordTemplates: '/cost-record/templates',
    costRecord: '/cost-record/:id',
    createCostRecord: '/create-cost-record',
    contact: '/contact',
    logout: '/logout',
    createCategory: '/create-category',

    getCategoryRoute(id) {
        return `/category/${id}`
    },
    getCostRecordRoute(id) {
        return `/cost-record/${id}`
    },
}