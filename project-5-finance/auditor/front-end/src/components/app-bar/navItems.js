import {  routes } from '@appCore';

export const navItems = [
    {
      label: 'Home',
      path: routes.home
    }, 
    {
      label: 'Create Category',
      path: routes.createCategory
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
      label: 'Create Cost Record',
      path: routes.createCostRecord
    }, 
    {
      label: 'Logout',
      path: routes.logout
    }, 
  
  ];

  export const checkIsActivePath = path => document.location.pathname === path;