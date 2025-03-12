import React from 'react';
import Select, { styles } from './styles';
import { Icon } from '@/components';
import {  FormGroup, Label } from 'reactstrap';

interface Props {
    id: string;
    label: string;
    required: boolean;
    value: string;
    onClick: ()=> void;
    disabled: boolean;
    message?: string;
    invalid?: boolean;
    styleMessage? : React.CSSProperties
}
const SelectCustom = ({
    id,
    label,
    value,
    required,
    onClick,
    disabled,
    message,
    invalid,
    styleMessage,
}: Props) => {

    return (
        <FormGroup className="mb-4">
            {label && (
                <Label htmlFor={id}>
                    {label}{required && <span style={styles.required}>*</span>} 
                </Label>
            )}
            <div>
                <Select.Container onClick={onClick} disabled={disabled} invalid={invalid}>
                    <Select.Title>{value}</Select.Title>
                    <Icon
                        name={'chevron-down'}
                        style={styles.icon}
                    ></Icon>
                </Select.Container>
                <div>
                    <span
                        className="text-danger mb-4"
                        style={{...styles.textSmall,...styleMessage}}
                    >
                        {message}
                    </span>
                </div>
            </div>
            
        </FormGroup>
    );
};

export default SelectCustom;