import * as React from 'react';

import { AppBar } from "@appComponents/app-bar";
import { getDisplayName } from '@appHocs/utils';

export function withPrimaryLayout(Component) {

    function WithPrimaryLayoutHOC(props) {
        return (
            <main className='primary-layout'>
    
            <AppBar />
            
            <Component {...props} />
             </main>
        );
    }

    WithPrimaryLayoutHOC.displayName = `withPrimaryLayout(${getDisplayName(Component)})`;

    return WithPrimaryLayoutHOC;
  
}