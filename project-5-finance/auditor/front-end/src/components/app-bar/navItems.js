import {  routes } from '@appCore';

export const navItems = [
    {
      label: 'Home',
      path: routes.home
    }, 
    {
      label: 'Categories',
      path: routes.categories
    }, 
    {
      label: 'Cost Templates',
      path: routes.costRecordTemplates
    }, 
    {
      label: 'Create Category',
      path: routes.createCategory
    },
    {
      label: 'Create Cost',
      path: routes.createCostRecord
    }, 
    {
      label: 'Logout',
      path: routes.logout
    }, 
  
  ];

  export const checkIsActivePath = path => {
    // handling home route
    let locPath = location.pathname === '/' ? '/' : document.location.pathname.replace(/\/$/, '');

    if (locPath.includes('/category/')) {
      locPath = routes.categories
    }

    return locPath === path
  };