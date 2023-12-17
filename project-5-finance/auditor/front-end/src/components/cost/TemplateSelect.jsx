import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useGetAllUnpaginatedCostTemplates } from '@appHooks';

export function TemplateSelect(props) {
    const { onChange, value } = props;

    const { isPending, error, data: unpaginatedData } = useGetAllUnpaginatedCostTemplates();

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message


    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="templates-select-label">Select Cost Template</InputLabel>
                <Select
                    labelId="cost-record-select"
                    id="cost-select"
                    value={value}
                    label="Cost Template select"
                    onChange={
                        (event) => {
                            onChange(event.target.value);
                          }
                        }
                >
                    {unpaginatedData.map(o => {
                        return (<MenuItem key={o.id} value={o.id}>{o.title}</MenuItem>)
                    })}

                </Select>
            </FormControl>
        </Box>
    )
}