import * as React from 'react';

import { withPrimaryLayout } from '@appHocs';

export function _Contact() {
    return <h1>Contact</h1>
}

export const Contact = withPrimaryLayout(_Contact);
