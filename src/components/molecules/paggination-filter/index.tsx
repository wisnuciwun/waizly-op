/* eslint-disable no-unused-vars */
import React from 'react';
import Paggination from './styles';
import { listSize } from './constant';

interface Props {
    pageSize: number;
    setPageSize: (value: number)=> void;
}

const PagginationFilter = ({
    pageSize,
    setPageSize
}: Props) => {
    
    return (
        <Paggination.Container>
            <Paggination.Label>{'Data Per Halaman'}</Paggination.Label>
            <div className="form-control-select">
                <select
                    name="DataTables_Table_0_length"
                    className="custom-select custom-select-sm form-control form-control-sm"
                    style={{minWidth: 62}}
                    value={pageSize}
                    onChange={(event) => setPageSize(parseInt(event.target.value))}
                >
                    {listSize.map((data, index) => (
                        <option key={index} value={data.value}>{data.label}</option>
                    ))}
                </select>
            </div>
        </Paggination.Container>
    );
};

export default PagginationFilter;