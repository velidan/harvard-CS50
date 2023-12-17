import * as React from 'react';
import { withPrimaryLayout } from '@appHocs';

export function _About() {
    return <h1>About</h1>
}

export const About = withPrimaryLayout(_About);