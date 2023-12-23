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
      label: 'Create Cost Record',
      path: routes.createCostRecord
    }, 
    {
      label: 'Logout',
      path: routes.logout
    }, 
  
  ];

  export const checkIsActivePath = path => {
    return document.location.pathname.replace(/\/$/, '') === path
  };