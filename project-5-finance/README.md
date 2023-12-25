# Finance Auditor
*The application that allows you to track your costs you were spending.*

<hr />
The idea of this project to help everyone with the common problem - unexpected costs spending by tracking your costs. I decided to make this app because I personally often found that I have a gap in my budget but I didn't know for what I was spending my money and this app should help with that.

The main challenge in this project was mixing the Django and Front-end modern stack: React, scss, bundling, dependencies handling. Neither pure backend neither pure SPA won't work for me because in the case of SPA we'll throw away awesome Django built-in features such as Auth or redirections because in the case of SPA jwt tokens, validation, refreshing etc. handles on the client side.
Pure backend app also won't work as we'll lost may cool stuff on the client side such as no-reloading app, components, dependencies, bundling etc. Basically it's possible on django only but it will be much harder and the whole Front-end codebase won't be so elegant like in the case of SPA.

I decided to use a mixed approach. Welcome screen and auth features I delivered Django and all other SPA things I delivered to React and it's ecosystem like bundling, rest calls, SASS managing etc. 

For better REST flow I decided to use Django Rest Framework as it provides many nice features like API dashboard, serializers, ModelViewSet that make things like common CRUD way easier. I tried to make the app in a `production-like` format. How would I like to see it in production with a possibility to scale and support by other teammembers.

It was an experiment and it worth tryings because everything works like a charm.

P.S. I'm not a designer but I did my best to make the app looks nice


#### 1) Distinctiveness and Complexity
  The project different than the previous projects because it's a big composition of the django stack and front-end stack works together and it's a main complexity of the app. The client side of the app located in the dedicated folder and it's like an independent project in general but Django has a possibility to pass a variables to the frontend directly if needed. Backend contains all the static HTML.

  Backend contains crucial dependencies that makes it closest to the Production app. It has static file handling (image uploading), Django Rest Framework with API dashboard, custom forms and I used a lot of aggregations, filtering and queries operation using Q, F, queryset.annotate, When, Case, there afre OneToMany relations etc. 

  Also it was tricky to configure router correctly to provide Django urls handling for auth and pass appropriate routes to the SPA ignoring them (because there are no views)

  Frontend app contains React, Webpack, SASS, own dependencies and it handles it's own routes, calling django REST, MUI, React Queries with client cache, handling errors on client side, providing compiled and bundled static js/css files that will be used for the Backend HTML.

#### 2) How to run the application

    Be sure that you have installed python v3 and node v18

  1. clone the repo
  2. open the terminal and go to the root folder of the app
  3. **Optional**: setup python venv depending on your OS. Or you can use python global scope (Not reccomended)
  4. install backend dependencies using: `pip install -r requirements.txt`
  5. make migrations running: `python ./manage.py makemigrations auditor`
  6. execute migrate command: `python ./manage.py migrate`
  7. start the backend: `python ./manage.py runserver`
  8. open another instance of terminal and go to the client folder: `/auditor/front-end/` 
  9. install Front-end dependencies: `npm install` or `yarn` or `pnpm install` (if you have yarn or pnpm installed and love to use them). Wait till the dependencies will be installed
  10. run the frontend: `npm run dev` or `yarn dev` or `pnpm dev` (if you are using yarn or pnpm for your node stuff)
   
   Now you can go to the app in a browser by default address: http://127.0.0.1:8000/.  
   P.S. To see Django Rest Framework API dashboard you can use this url: http://127.0.0.1:8000/api

  #### 3) Project structure (what's contained in each file I created)
   ##### Backend (Django)
  - `/requirements.txt` -> dependencies of the django app
  - `/media/images` -> folder contains static images that will be uploaded from the client side. Category thumbnails
  - `/finance` -> folder contains the project config files
  - `/auditor` -> the app folder
  - `/auditor/{common django files like: apps, views, urls, models, tests, admin}` -> common django files for views/models/routes/app config etc.
  - `/auditor/serializers.py` -> Django Rest Framework serializers
  - `/auditor/permissions.py` -> permissions for the views. In this case is user authenticated
  - `/auditor/pagination.py` -> custom paginator
  - `/auditor/forms.py` -> forms for the auth section. Sign In/Sign Up. Handles by Django
  - `/auditor/templates/auditor/layout.html` -> common layout for the django based HTML
  - `/auditor/templates/auditor/{sign_in.html | sign_up.html}` -> html for the auth section. Sign In/Sign Up
  - `auditor/templates/auditor/index.html` -> index html file. Contain Welcome section
  -> `/auditor/templates/auditor/common/messages.html` -> contains django messages layout (flash messages etc.). Used for the notifying on Auth events
  - `/auditor/templates/auditor/common/scripts.html` -> contains link to the compiled static js file from Front-end webpack and provides the current username variable to the Front-end side
  - `/auditor/static` -> this folder used by frontend and webpack will place here all the static files it provides such as js and css
  
   ##### Front-end (React/Webpack/SASS/)
   - `/auditor/front-end` - the client side part. Front-end
   - `/auditor/front-end/webpack.config.js` - webpack configuration. Bundles the app
   - `/auditor/front-end/package.json` - node.js core file. Manages dependencies, scripts running, precommit hooks, npm meta etc.
   - `/auditor/front-end/.babelrc` - babel config file. Transpiles the app
  ---
   - `/auditor/front-end/styles/` -> **contains app styles**
   - `/auditor/front-end/styles/common.scss` - contains common and utility style classes that could be applied for everything
   - `/auditor/front-end/styles/django-welcome.scss` - styles for the welcome index.html that handles by django. I created a dedicated for it because the purpose of that unit is different than the other files in SPA as it's belongs to the django
   - `/auditor/front-end/styles/style.scss` - app styles. I could create many smaller files separated by logical meaning but just didn't want to do many small files because the client side contains tons of files even without them. Also, there not so many styles in that file
  ---
   - `/auditor/front-end/src/` - contains the Front end source files 
   - `/auditor/front-end/src/index.js` -> entry point of the Front-end
   - `/auditor/front-end/src/App.js` -> React entry point
   - `/auditor/front-end/src/utils/` -> contains client app utilities
   - `/auditor/front-end/src/utils/getAxiosHeaders.js` -> provides headers for axios that manages content type and auth data (Django CSRF token) 
   - `/auditor/front-end/src/utils/getCookie.js` -> helps to get cookie by name
   - `/auditor/front-end/src/utils/getUrlFromSelectedFile.js` -> provides DataURL from the BLOB file. Useful to show Preview of the picked image without calling Backend
   - `/auditor/front-end/src/utils/index.js` -> export point
  ---
 -  `/auditor/front-end/src/hooks/` -> **all react hooks**
 -  `/auditor/front-end/src/hooks/index.js` -> export point
 -  `/auditor/front-end/src/hooks/usePagination.js` -> react-router-dom pagination that helps to work with history
 -  `/auditor/front-end/src/hooks/api/` -> API layer. All API hooks that calls Django Rest Endpoints. Contains Error handling, toast show, headers managing etc.
 -  `/auditor/front-end/src/hooks/api/index.js` -> export point
 -  `/auditor/front-end/src/hooks/api/useCreateCategory.js` -> create category 
 -  `/auditor/front-end/src/hooks/api/useCreateCostRecord.js` -> create cost record
 -  `/auditor/front-end/src/hooks/api/useDeleteCategory.js` -> delete category
 -  `/auditor/front-end/src/hooks/api/useDeleteCostRecord.js` -> delete cost record
 -  `/auditor/front-end/src/hooks/api/useGetAllCategories.js` -> get all categories
 -  `/auditor/front-end/src/hooks/api/useGetAllCostRecords.js` -> get all cost records
 -  `/auditor/front-end/src/hooks/api/useGetAllCostRecordTemplates.js` -> get all cost records templates 
 -  `/auditor/front-end/src/hooks/api/useGetAllUnpaginatedCategories.js` -> get all unpaginated categories. Useful for the category select component as there shouldn't be the pagination 
 -  `/auditor/front-end/src/hooks/api/useGetAllUnpaginatedCostTemplates.js` -> get all unpaginated templates. Useful for the template select component as there shouldn't be the pagination 
 -  `/auditor/front-end/src/hooks/api/useGetCategory.js` -> get a single category
 -  `/auditor/front-end/src/hooks/api/useGetCostRecord.js` -> get a single cost record
 -  `/auditor/front-end/src/hooks/api/useGetCostsTotal.js` -> get total spent costs value (aggregated sum of all costs) 
 -  `/auditor/front-end/src/hooks/api/useGetCostsTotalGroupedByCategory.js` -> returns an object that contains category as keys and all relative costs as values. Required for the PIE chart
 -  `/auditor/front-end/src/hooks/api/useLogout.js` -> logout the user and go to Django Welcome index.html
 -  `/auditor/front-end/src/hooks/api/useUpdateCategory.js` -> updates category
 -  `/auditor/front-end/src/hooks/api/useUpdateCostRecord.js` -> updates cost record
---
 -  `/auditor/front-end/src/hocs` -> **High Order Components**
 -  `/auditor/front-end/src/hocs/index.js` -> export point
 -  `/auditor/front-end/src/hocs/utils.js` -> better display name for the wrapped component. Useful for debugging purposes
 -  `/auditor/front-end/src/hocs/layouts/index.js` -> export point
 -  `/auditor/front-end/src/hocs/layouts/withPrimaryLayout.jsx` -> primary layout for the app pages
 ---
 -  `/auditor/front-end/src/core/` -> **client app essentials config/state management etc.**
 -  `/auditor/front-end/src/core/index.js` -> export point 
 -  `/auditor/front-end/src/core/AppContext.js` -> React Context for the global app state
 -  `/auditor/front-end/src/core/config.js` -> React Query client   
 -  `/auditor/front-end/src/core/routes.js` -> Front-end routes that should be processed by React Router Dom
 -  `/auditor/front-end/src/core/reducers/categoryReducer.js` ->  reducer for the selected category
 -  `/auditor/front-end/src/core/reducers/costReducer.js.js` ->  reducer for the selected cost
 -  `/auditor/front-end/src/core/reducers/systemReducer.js` -> contains global system state such as open drawer etc.
 -  `/auditor/front-end/src/core/reducers/toastReducer.js` -> state for Toast
 -  `/auditor/front-end/src/core/reducers/index.js` -> export point
---
 -  `/auditor/front-end/src/components/` -> **client app React components**

 -  `/auditor/front-end/src/components/app-bar/` -> ***App bar files***
 -  `/auditor/front-end/src/components/app-bar/index.js` -> export point
 -  `/auditor/front-end/src/components/app-bar/AppBar.jsx` -> App bar (main nav on Desktop)
 -  `/auditor/front-end/src/components/app-bar/Drawer.jsx` -> man nav on Mobile
 -  `/auditor/front-end/src/components/app-bar/navItems.js` -> config for nav items that will be used in Drawer and AppBar
 -  `/auditor/front-end/src/components/category/` -> ***Category relative components***
 -  `/auditor/front-end/src/components/category/index.js` -> export point 
 -  `/auditor/front-end/src/components/category/CategoryCard.jsx` -> category card for previews
 -  `/auditor/front-end/src/components/category/CategoryForm.jsx` -> create/update form for category depends on the mode
 -  `/auditor/front-end/src/components/category/CategoryPreview.jsx` -> preview in the categories list
 -  `/auditor/front-end/src/components/category/CategorySelect.jsx` -> component allows to select a category
---
 -  `/auditor/front-end/src/components/cost/` -> ***Cost record relative components***
 -  `/auditor/front-end/src/components/cost/index.js` -> export point 
 -  `/auditor/front-end/src/components/cost/CostRecordPreview.jsx` -> preview for the cost record on the costs list
 -  `/auditor/front-end/src/components/cost/CostRecordUpdateForm.jsx` -> cost update form
 -  `/auditor/front-end/src/components/cost/TemplateSelect.jsx` -> allows to select the template for the cost
---
 -  `/auditor/front-end/src/components/common/` -> ***Common components***
 -  `/auditor/front-end/src/components/common/index.js` -> export point
 -  `/auditor/front-end/src/components/common/Pagination.jsx` -> pagination for the categories/templates/costs (home page)
 -  `/auditor/front-end/src/components/common/PieDiagram.jsx` -> pie chart for the costs page (home)
 -  `/auditor/front-end/src/components/common/Toast.jsx` -> Toast component for all the success/error handling of the API
---
-  `/auditor/front-end/src/components/pages/` -> ***Pages components that represent a whole route screen***
-  `/auditor/front-end/src/components/pages/index.js` -> export point
-  `/auditor/front-end/src/components/pages/AllCategories.jsx` -> renders all categories page
-  `/auditor/front-end/src/components/pages/AllCostRecords.jsx` -> renders all cost records page
-  `/auditor/front-end/src/components/pages/AllCostRecordTemplates.jsx` -> renders all cost templates page
-  `/auditor/front-end/src/components/pages/Category.jsx` -> a category details page
-  `/auditor/front-end/src/components/pages/CostRecord.jsx` -> renders cost record details page. If it's in the template - there will be a notice about that (helps to recognize what cost used as template and what is not)
-  `/auditor/front-end/src/components/pages/CreateCategory.jsx` -> create category page
-  `/auditor/front-end/src/components/pages/CreateCostRecord.jsx` -> create cost record page
-  `/auditor/front-end/src/components/pages/Error.jsx` -> Global error handling component. There could be some Sentry or global logger etc.

 #### 4) Backend dependencies
  - Django -> lovely django
  - django-crispy-forms -> nice bootstrap forms for django
  - django-filter -> helps to filter querysets esilly
  - djangorestframework -> REST framework
  - crispy-bootstrap4 -> for crispy forms
  - Pillow -> python image library

 #### 5) Front-end dependencies
  ***Standard dependencies***
  - @emotion/react -> MUI dependency
  - @emotion/styled -> MUI dependency
  - @fontsource/roboto -> MUI dependency
  - @mui/icons-material -> MUI icons (didn't use it in the app but in general it's reccomended to install regarding their docs)
  - @mui/material - Material Design React library
  - @tanstack/react-query - handles API interaction with api cache and many other nice features that make life easier
  - axios - http client
  - chart.js - different charts on JS
  - formik - handle forms on client
  - react - react. Client side UI library
  - react-chartjs-2 - chart.js react components
  - react-dom - React DOM library
  - react-router-dom - React client side router (for SPA)
  - yup - forms validation helper library 
  
***Dev dependencies***
  - @babel/core-> babel transpiler core package
  - @babel/preset-env -> babel transpiler env preset
  - @babel/preset-react -> babel transpiler preset for react. Transpiles react JSX to plain JS
  - babel-loader -> babel loader for webpack
  - babel-plugin-transform-class-properties -> allows transpile ES6 class properties
  - babel-plugin-transform-es2015-modules-commonjs -> transpiles ES6 modules to common js
  - css-loader -> webpack css loader
  - file-loader -> webpack file loader
  - mini-css-extract-plugin -> webpack minify css
  - sass -> sass package
  - sass-loader -> webpack sass loader
  - style-loader -> webpack style loader
  - url-loader -> transforms files into base64 URIs
  - webpack -> module bundler
  - webpack-cli -> CLI for webpack to be able to run it from scripts
  - webpack-fix-style-only-entries -> Helps to fix style sass only entries generating an extra js file
  
Thank you for your patience and time if you read this file till the end!
