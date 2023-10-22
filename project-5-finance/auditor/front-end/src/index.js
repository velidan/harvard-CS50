
import React from 'react';
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';

// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';


import { App } from "./App";


const container = document.getElementById('react-root');
const root = createRoot(container);
root.render(<App />);

