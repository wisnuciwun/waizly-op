/* eslint-disable no-unused-vars */
// style
import CardLog, { styles } from './styles';

// component
import { SkeletonLoading } from '@/components/atoms';
import colors from '@/utils/colors';

// utils
import { formatDateYearAndMonth } from '@/utils/formater';
interface dataHistoryLog {
    change_log_id: number;
    title: string;
    version: string;
    created_at: string;
    is_new: boolean;
  }

interface Props {
    data: dataHistoryLog[];
    loading: boolean;
    handleClick: (id: number) => void;
    selectedId: number | null;
  }

const HistoryLog = ({data, loading, handleClick, selectedId}:Props) => {

    return (
        <>
        <CardLog.Container>
            <p style={{fontSize:20, fontWeight: 700, color: colors.darkBlue}}>
                Riwayat Perubahan
            </p>
            {loading ? 
            <>
              {[...Array(5)].map((_, index) => (
                <CardLog.Content key={index}>
                    <CardLog.ContainerText>
                        <SkeletonLoading
                            width={'50%'}
                            height={'25px'}
                        />
                        <SkeletonLoading
                            width={'15%'}
                            height={'25px'}
                        />
                    </CardLog.ContainerText>
                    <div className='d-flex mt-3 gap-2'>
                        <SkeletonLoading
                            width={'20%'}
                            height={'20px'}
                        />
                        <SkeletonLoading
                            width={'20%'}
                            height={'20px'}
                        />
                    </div>
                </CardLog.Content>
                ))}
            </>
            : 
            <>
                {data.map((item, index) => (
                <CardLog.Content 
                    key={index} 
                    style={item.change_log_id === selectedId ? {backgroundColor: '#F5F6FA'} : {}}
                    onClick={() => handleClick(item.change_log_id)}
                >
                    <CardLog.ContainerText>
                        <div>
                            <span style={styles.textHead}>
                                {item?.title ?? '-' }
                            </span>
                            <br/>
                            <CardLog.badgeVersionContainer>
                                Versi:{' '}
                                <span style={styles.textVersion}>{item?.version ?? '-'}</span> 
                            </CardLog.badgeVersionContainer>
                            <span style={styles.text}>{formatDateYearAndMonth(item?.created_at) ?? '-'}</span>
                        </div>
                        {item.is_new && (
                            <div className='align-content-top'>
                                <span style={styles.badge}>
                                    BARU
                                </span>
                            </div>
                        )}
                    </CardLog.ContainerText>
                </CardLog.Content>
                ))}
            </>
            }
        </CardLog.Container>
        </>
    );
};

export default HistoryLog;