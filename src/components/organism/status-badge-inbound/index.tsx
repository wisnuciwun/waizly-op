import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Badge } from 'reactstrap'; 

const StyledBadge = styled(Badge)`
    font-weight: 700;
    height: 20px;
    padding: 0px 8px;
    border: none;
    background-color: ${props => props.status === 'MENUNGGU INBOUND' || props.status === 'MENUNGGU OUTBOUND' ? '#D5FDFF' : '#E2FFEC'} !important;
    color: ${props => props.status === 'MENUNGGU INBOUND' || props.status === 'MENUNGGU OUTBOUND' ? '#00A7E1' : '#36C068'} !important;
    font-size: 12px;
`;

const StatusBadge = ({ status }) => {
    return (
        <StyledBadge 
            status={status?.toUpperCase()}
        >
            {status?.toUpperCase()}
        </StyledBadge>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string.isRequired,
};

const StyledBadgeSource = styled(Badge)`
    font-weight: 700;
    height: 20px;
    padding: 0px 8px;
    border: none;
    background-color: ${props => props.status === 'PURCHASE' ? '#FFE9D0' : '#FFF2C6'} !important;
    color: ${props => props.status === 'PURCHASE' ? '#EF7A27' : '#FFB703'} !important;
    font-size: 12px;
`;

export const StatusBadgeSource = ({ status }) => {
    const manipulateStatus = status === 'purchase' ? 'PEMBELIAN' : 'TRANSFER';
    return (
        <StyledBadgeSource 
            status={status?.toUpperCase()}
        >
            {manipulateStatus?.toUpperCase()}
        </StyledBadgeSource>
    );
};

StatusBadgeSource.propTypes = {
    status: PropTypes.string.isRequired,
};


export default StatusBadge;

