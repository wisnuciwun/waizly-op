/* eslint-disable no-unused-vars */
import { SelectItem } from 'primereact/selectitem';
import React from 'react';
import FormTab from './styles';

interface Props {
    selected: string;
    list: SelectItem[];
    onClick: (value: string) => void;
    edit: boolean;
}

const TabForm = ({
    selected,
    list,
    onClick,
    edit
}: Props) => {

    return (
        <FormTab.Container>
            {list && list.map((data, index) => (
                 <FormTab.Card edit={edit} onClick={() => onClick(data.value)} key={index} active={selected === data.value}>
                    <FormTab.Text>{data.label}</FormTab.Text>
                 </FormTab.Card>
            ))}
        </FormTab.Container>
    );
};

export default TabForm;