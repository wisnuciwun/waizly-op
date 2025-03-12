import { memo } from 'react';
import styles from './styles';

interface Props {
    strongWord?: string;
    desc: string;
}

const InfoWarning = ({
    strongWord,
    desc
}: Props) => {

    return (
        <div
            className={'d-flex align-items-center'}
            style={styles.container}
        >
            <em
                className="icon ni ni-alert-circle"
                style={styles.iconInfo}
            />
            <div style={styles.desc}>
                <strong style={styles.strong}>{`${strongWord} `}</strong>
                {desc}
            </div>
        </div>
    );

};

export default memo(InfoWarning);