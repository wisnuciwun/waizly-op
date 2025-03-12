import { Tooltip } from 'reactstrap';
import styled from 'styled-components';

export const TooltipStyle = styled(Tooltip)`
    .tooltip{
        max-width: fit-content !important;
        opacity: 0px;
        left: ${props => props.isLeftBottom ? props.isLeftBottom : '0px'} !important;
    }
`;