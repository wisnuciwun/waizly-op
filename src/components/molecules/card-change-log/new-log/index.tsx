import CardLog, { styles } from './styles';

// component
import { BlockTitle, SkeletonLoading } from '@/components/atoms';

// utils
import { formatDateYearAndMonth } from '@/utils/formater';

interface dataHistoryLog {
    change_log_id: number;
    title: string;
    description: string;
    version: string;
    is_new: boolean;
    created_at: string;
  }

interface Props {
    data: dataHistoryLog;
    loading: boolean;
  }

  // separator function br
  function formatDescription(description) {
    const descriptions = description.split(/\r?\n/);
    const formattedDescriptions = descriptions.map((desc, index) => (
        <li key={index} style={{color: '#4C4F54'}}>{desc.trim()}</li>
    ));
    return formattedDescriptions;
}
  

const NewLog = ({data, loading}:Props) => {
    return (
         <>
        <CardLog.Container>
            {loading ? 
            <>
            <SkeletonLoading
                width={'50%'}
                height={'25px'}
            />
            <div className="d-flex mt-2 gap-2">
            <SkeletonLoading
                width={'15%'}
                height={'20px'}
            />
            <SkeletonLoading
                width={'10%'}
                height={'20px'}
            />
            </div>
            <CardLog.Content>
                <p style={styles.textHead}>
                    <SkeletonLoading
                        width={'10%'}
                        height={'17px'}
                    />
                </p>
                <ul>
                    <li >
                    {[...Array(10)].map((_, index) => (
                        <div key={index}>
                            <SkeletonLoading
                            width={'100%'}
                            height={'10px'}
                            className="my-2"
                        />
                        </div>
                    ))}
                    </li>
                </ul>
            </CardLog.Content>
            </> 
            : 
            <>
            <BlockTitle fontSize={24}>
                {data.is_new ? 'Perubahan Baru' : 'Perubahan Terdahulu'}
            </BlockTitle>
            <CardLog.badgeVersionContainer>
                Versi:{' '}
                <span style={styles.textVersion}>{data?.version ?? '-'}</span> 
                </CardLog.badgeVersionContainer>
                <span style={styles.text}>{formatDateYearAndMonth(data?.created_at) ?? '-'}</span>
            <CardLog.Content>
                <p style={styles.textHead}>
                    {data?.title ?? '-'}
                </p>
                <ul className="list-log">
                    {formatDescription(data?.description ?? '-')}
                </ul>
            </CardLog.Content>
            </>
            }
        </CardLog.Container>
        </>
    );
};

export default NewLog;