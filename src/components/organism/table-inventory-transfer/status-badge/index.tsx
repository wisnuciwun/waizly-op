import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Badge } from 'reactstrap'; 

const StyledBadge = styled(Badge)`
    font-weight: 700;
    height: 20px;
    padding: 0px 8px;
    border: none;
    background-color: ${props => 
        props.status === 'MENUNGGU PERSETUJUAN' ? '#FFF2C6' :
        props.status === 'DIBATALKAN' || props.status === 'RUSAK' ? '#FFE3E0' : 
        props.status === '-' ? 'white' : '#E2FFEC' } !important;
    color: ${props => 
        props.status === 'MENUNGGU PERSETUJUAN' ? '#FFB703' : 
        props.status === 'DIBATALKAN' || props.status === 'RUSAK' ? '#FF6E5D' : 
        props.status === '-' ? 'black' :'#36C068'} !important;
`;


const StatusBadge = ({ status }) => {
    return (
        <StyledBadge 
            style={{fontSize: 12}}
            status={status.toUpperCase()}
        >
            {status.toUpperCase()}
        </StyledBadge>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string.isRequired,
};

export default StatusBadge;
