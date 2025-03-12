/* eslint-disable no-unused-vars */
import { DropdownOption } from '@/components';
import { SelectItemOptionsType } from 'primereact/selectitem';
import React from 'react';
import { FormFeedback, FormGroup, Label } from 'reactstrap';
import styles from './styles';

interface Props {
    id: string;
    value?: string;
    label: string;
    options: SelectItemOptionsType;
    placeholder: string;
    required?: boolean;
    disabled?: boolean;
    onChange?: (value: string)=> void;
    message?: string;
    defaultValue?: string;
    onBlur?: ()=> void;
}
const InputSelect = ({
    id,
    value,
    options,
    required,
    placeholder,
    label,
    disabled,
    message,
    onChange,
    defaultValue,
    onBlur
}: Props) => {

    return(
        <FormGroup className="mb-4">
            {label && (
                <Label htmlFor={id} style={styles.label}>
                    {label}{required && <span style={styles.required}>*</span>} 
                </Label>
            )}
            <DropdownOption
                options={options}
                optionLabel={'label'}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                defaultValue={defaultValue}
                style={{ fontSize: 12 }}
                onChange={(event) => onChange(event.target.value)}
                onBlur={()=> {
                    onBlur && onBlur();
                }}
            />

            <FormFeedback>
                <span
                    className="text-danger position-absolute"
                    style={styles.textSmall}
                >
                    {message}
                </span>
            </FormFeedback>
        </FormGroup>
        
    );
};

export default InputSelect;