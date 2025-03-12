import React from 'react';
import Tracking from './styles';
import { ListTrackingOrder } from '@/components/molecules';
import { TracingHistoryProps } from '@/utils/type/order';
import moment from 'moment';

interface Props {
    list: TracingHistoryProps[];
}

const TrackingOrder = ({
    list
}: Props) => {

    return (
        <Tracking.Container>
            <Tracking.Title>{'Lacak Pengiriman'}</Tracking.Title>
            {list.length > 0 && (
                <Tracking.Subtitle>{list[0].status || ''}</Tracking.Subtitle>
            )}

            <Tracking.ContainerList>
                {list && list.map((data, index) => (
                    <ListTrackingOrder
                        key={index}
                        date={moment(data.updated_at).format('DD/MM/YYYY HH:mm')}
                        active={index == 0}
                        title={data.status}
                        subtitle={data.status_courier.length > 0 ? data.status_courier : []}
                        withoutBorder={list.length !== index + 1}
                    />
                ))}
            </Tracking.ContainerList>
        </Tracking.Container>
    );
};

export default TrackingOrder;