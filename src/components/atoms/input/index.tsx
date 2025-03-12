/* eslint-disable no-unused-vars */
import React, {memo, ReactNode } from 'react';
import {FormFeedback, FormGroup, Label} from 'reactstrap';
import styled from './styles';
// import { FormInput } from "../form-input";
import {Input as FormInput} from 'reactstrap';
import {InputType} from 'reactstrap/types/lib/Input';
interface Props {
  id: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  label?: string;
  required?: boolean;
  invalid?: boolean;
  register?: any;
  placeholder?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
  stickyLabel?: string | ReactNode;
  stickyPosition?: 'left' | 'right';
  message?: string;
  type?: InputType;
  onInput?: (e) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  style?: React.CSSProperties;
  noMargin?: boolean;
  messageStyles?: React.CSSProperties;
}

const Input = ({id, value, defaultValue, label, required, invalid, register, placeholder, onChange, maxLength, disabled, stickyLabel, stickyPosition = 'left', type = 'text', message, style, onBlur, onInput, onKeyDown, noMargin, messageStyles}: Props) => {
  return (
    <FormGroup className={`${noMargin ? '' : 'mb-4'}`}>
      {label && (
        <Label htmlFor={id} style={styled.label}>
          {label}
          {required && <span style={styled.required}>*</span>}
        </Label>
      )}

      <div className={stickyLabel ? 'form-control-wrap' : ''}>
        {stickyLabel && (
          <div className={`form-icon form-icon-${stickyPosition}`}>
            <span style={styled.textSmall}>{stickyLabel}</span>
          </div>
        )}
        <FormInput
          invalid={invalid}
          name={id}
          style={style}
          defaultValue={defaultValue}
          value={value}
          placeholder={placeholder}
          onChange={(event: {target: {value: string}}) => {
            onChange(event.target.value);
          }}
          type={type}
          maxLength={maxLength}
          disabled={disabled}
          onInput={onInput}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        <FormFeedback>
          <span className="text-danger position-absolute mb-4" style={{...messageStyles, ...styled.textSmall}}>
            {message}
          </span>
        </FormFeedback>
      </div>
    </FormGroup>
  );
};

export default memo(Input);
