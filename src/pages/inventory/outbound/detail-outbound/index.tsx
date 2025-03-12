/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Content from '@/layout/content/Content';
import { useRouter } from 'next/router';
import { getDataDetailOutbound } from '@/services/inventory';
import { InboundData } from '@/utils/type/inventory';
import DetailInventoryOutbound from '@/layout/inventory-outbound/detail-inventory-outbound';
import { InfoWarning } from '@/components';

function DetailOutbound () {
    const route = useRouter();
    const { query } = route;
    const idData = query.id;

    const [detailOutbound,setDetailOutbound] = useState<InboundData | []>([]);
    const fetchDataDetail = async () => {
        try {
            const { data: detailData } = await getDataDetailOutbound(idData);
            setDetailOutbound(detailData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (query.id) {
            fetchDataDetail();
        }
    },[query.id]);

    return (
        <Content>
            <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
            <DetailInventoryOutbound 
                formData={detailOutbound}
            />
        </Content>
    );
}

export default DetailOutbound;