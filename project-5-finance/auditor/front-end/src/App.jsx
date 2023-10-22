import * as React from 'react';

import { AppContextProvider } from './core';
import { Home } from './components/pages/Home';

function _App() {
    return <AppContextProvider>
        <Home />
    </AppContextProvider>
}

export const App = _App;