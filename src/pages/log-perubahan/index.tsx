/* eslint-disable react-hooks/exhaustive-deps */
// React
import { useEffect, useState } from 'react';

// layout
import Content from '@/layout/content/Content';

// component
import { Head, HistoryLog, NewLog } from '@/components';

// Service
import { getChangeLog, getChangeLogId } from '@/services/change-log';


const ChangeLog = () => {
    const [dataHistoryLog, setDataHistoryLog] = useState([]);
    const [dataHistoryLogId, setDataHistoryLogId] = useState();
    const [selectedId, setSelectedId] = useState();
    const [loadingHistoryLog, setLoadingHistoryLog] = useState(true);
    const [loadingHistoryLogId, setLoadingHistoryLogId] = useState(true);

    // fetch get history change log
    const fetchGetChangeLog = async () => {
        try {
            setLoadingHistoryLog(true);
            const res = await getChangeLog();
            setDataHistoryLog(res.data);
            setSelectedId(res.data[0].change_log_id);
        } catch (err) {
            setLoadingHistoryLog(false);
            // console.log(err)
        } finally {
            setLoadingHistoryLog(false);
        }
    };

    // handle get changlog id for fetch detail
    const handleClickGetId = (id) => {
        if (selectedId === id) return; 
        setSelectedId(id);
    };

    // fetch get history change log
    const fetchGetChangeLogId = async () => {
        try {
            setLoadingHistoryLogId(true);
            const res = await getChangeLogId(selectedId);
            setDataHistoryLogId(res.data);
        } catch (err) {
            setLoadingHistoryLogId(false);
            // console.log(err)
        } finally {
            setLoadingHistoryLogId(false);
        }
    };

    useEffect(() => {
        fetchGetChangeLog();
    }, []);

    useEffect(() => {
        if(selectedId !== undefined || null) {
            fetchGetChangeLogId();
        }
    }, [selectedId]);

    return (
    <>
    <Head title="Log Perubahan" />
    <Content>
        <div className="row">
            <div className="col-5">
                <HistoryLog 
                    data={dataHistoryLog} 
                    loading={loadingHistoryLog}
                    handleClick={handleClickGetId}
                    selectedId={selectedId}/>   
            </div>
            <div className="col">
                <NewLog data={dataHistoryLogId} loading={loadingHistoryLogId}/>
            </div>
        </div>
    </Content>
    </>
   );
};
export default ChangeLog;