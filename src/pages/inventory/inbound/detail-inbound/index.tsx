/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import DetailInventoryInbound from '@/layout/inventory-inbound/detail-inventory-inbound';
import Content from '@/layout/content/Content';
import ConfirmationInventory from '@/layout/inventory-inbound/confirmation-inventory-inbound';
import { useRouter } from 'next/router';
import { getDataDetailInbound } from '@/services/inventory';
import { InboundData } from '@/utils/type/inventory';
import { InfoWarning } from '@/components';

function DetailInbound () {
    const route = useRouter();
    const { query, pathname, replace } = route;
    const idData = query.id;

    const [detailInbound,setDetailInbound] = useState<InboundData | []>([]);
    const [temporaryDetailInbound,setTemporaryDetailInbound] = useState<InboundData | []>([]);

    const handleChangePageToConfirm = () => {
        replace({
            pathname: pathname,
            query: {
                ...query,
                type: 'confirm'
            },
        });
    };
    const handleChangePageToDetail = () => {
        route.push({
            pathname: '/inventory/inbound',
            query: {
                ...query,
                tab: 'all'
            },
        });
    };

    const fetchDataDetail = async () => {
        try {
            const { data: detailData } = await getDataDetailInbound(idData);
            const modifiedDetailData = {
                ...detailData,
                inbound_detail: detailData.inbound_detail.map(item => {
                    return {
                        ...item,
                        good_quantity: item.good_quantity === 0 ? null : item.good_quantity,
                        damage_quantity: item.damage_quantity === 0 ? null : item.damage_quantity
                    };
                })
            };
            setDetailInbound(detailData);
            setTemporaryDetailInbound(modifiedDetailData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (query.id) {
            fetchDataDetail();
        }
    },[query.id,query?.type]);

    return (
        <Content>
            <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
            {query.type === 'detail'? 
                <DetailInventoryInbound 
                    handleChangePageToConfirm={handleChangePageToConfirm}
                    formData={detailInbound}
                />
                    :
                <ConfirmationInventory 
                    formData={temporaryDetailInbound}
                    setFormData={setTemporaryDetailInbound}
                    comparisonData={detailInbound}
                    handleChangePageToDetail={handleChangePageToDetail}
                />
            }
        </Content>
    );
}

export default DetailInbound;