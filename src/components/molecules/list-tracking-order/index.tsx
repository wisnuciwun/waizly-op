import React, { memo } from 'react';
import TrackingOrder from './styles';
import { Icon } from '@/components';
import colors from '@/utils/colors';
import { StatusCourier } from '@/utils/type/order';
import moment from 'moment';

interface Props {
    date: string;
    title: string;
    subtitle: StatusCourier[];
    active: boolean;
    withoutBorder: boolean;
}
const ListTrackingOrder = ({
    date,
    title,
    subtitle,
    active,
    withoutBorder
}: Props) => {
    return (
        <TrackingOrder.Container>
            <TrackingOrder.ContainerDate active={active}>
                <TrackingOrder.TextDate>{date}</TrackingOrder.TextDate>
            </TrackingOrder.ContainerDate>
            <TrackingOrder.ContainerStatus withoutBorder={withoutBorder} active={active}>
                <TrackingOrder.ContainerDot active={active}>
                    <TrackingOrder.Status active={active}>
                        {active && (
                            <Icon name={'check'} style={{color: colors.white}}></Icon>
                        )}
                    </TrackingOrder.Status>
                </TrackingOrder.ContainerDot>
                
                <TrackingOrder.Title active={active}>{title}</TrackingOrder.Title>
                {
                    subtitle.map((v, index) => 
                        <TrackingOrder.SubTitle key={index} active={active}>
                            <span style={{marginLeft: -5}}>{v.remark}&nbsp;
                                {title === 'Picked Up' || title === 'In Transit' ?
                                    `[${moment(v.updated_at).format('DD/MM/YY HH:mm')}]` : ''}
                             </span>
                        </TrackingOrder.SubTitle>
                    )
                }
            </TrackingOrder.ContainerStatus>
        </TrackingOrder.Container>
    );
};

export default memo(ListTrackingOrder);