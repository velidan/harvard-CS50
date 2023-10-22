import * as React from 'react';
import Button from '@mui/material/Button';

import { withPrimaryLayout } from '@appHocs';

export function _Home() {
    return <Button variant="contained">Hello world</Button>
}

export const Home = withPrimaryLayout(_Home);
