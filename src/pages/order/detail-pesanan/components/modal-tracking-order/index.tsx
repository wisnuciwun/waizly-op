import React from 'react';
import Image from 'next/image';
import { Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap';
import { TrackingOrder } from '@/components/organism';
import deliveryImage from '@/assets/gift/deliveryImage.gif';
import { TracingHistoryProps } from '@/utils/type/order';
import colors from '@/utils/colors';
import styled from 'styled-components';
interface Props {
    items: TracingHistoryProps[];
    show: boolean;
    loading: boolean;
    onBack: ()=> void;

}
const ModalTrackingOrder = ({
    items,
    show,
    loading,
    onBack
}: Props) => {

    return (
        <Modal isOpen={show} className="modal-xl" style={styles.container}>
            <ModalHeader className={'border-0 p-0 center'}>
                <Image
                    src={deliveryImage}
                    width={541}
                    height={400}
                    alt="illustration"
                    style={{ borderRadius: 16, objectFit: 'cover' }}
                />
            </ModalHeader>
            <TracingOrder.ContainerRound/>
            <ModalBody className={'bg-white'} style={styles.ModalBody}>
                {loading ? (
                     <TracingOrder.ContainerLoading>
                        <Spinner size="lg" color="blue" />
                    </TracingOrder.ContainerLoading>
                
                ):(
                    <TrackingOrder list={items}/>
                )}
               
              
            </ModalBody>
            <TracingOrder.TextBack onClick={onBack}>{'Kembali'}</TracingOrder.TextBack>
        </Modal>
    );
};

const TracingOrder = {
    Container: styled.div`
        width: 400px;
    `,
    ContainerRound: styled.div`
        height: 100px;
        width: 100%;
        border-radius: 50%;
        background-color: ${colors.white};
        margin-top: -90px;
    `,
    ContainerList: styled.div`
        height: 200px;
        overflow: auto;
    `,
    TextBack: styled.text`
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: ${colors.darkBlue};
        text-align: center;
        margin-bottom: 16px;
        margin-top: 8px;
        cursor: pointer;
    `,
    ContainerLoading: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: center;
        justify-content: center;
        height: 200px;
        width: 100%;
    `
};

const styles = {
    modalContainer: {
        width: 541,
        maxHeight: '100%',
    },
    container: {
        width: 541,
        height: 731
    },
    image: {
        borderRadius: 16
    },
    ModalBody: {
        marginTop: '-60px',
    }
};




export default ModalTrackingOrder;