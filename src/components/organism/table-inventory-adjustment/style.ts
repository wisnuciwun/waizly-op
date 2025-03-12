import { CSSProperties } from 'react';
import colors from '@/utils/colors';


export const styles: { [key: string]: CSSProperties } = {
    IconSearch: {
        color: colors.darkBlue,
        backgroundColor: '#ffffff',
    },
    WrapperParentSortData: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 8,
        marginBottom: 4,
        gap: 8,
        flexWrap: 'wrap',
    },
    WrapperDatePicker: {
        width: 240,
    },
    WrapperFilterStore: {
        marginLeft: -16,
    },
    HeaderTitleTable: {
        fontWeight: 'normal', 
        color: colors.black, 
        fontSize:12
    },
    TransferNumberColumns: {
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: 12
    },
    RedirectButton: {
        fontWeight: 400,
        width: 80,
        marginRight: 10,
        justifyContent: 'center',
        fontSize: 12
    },
    TextTruncateConfig: {
        maxWidth:200, 
        minWidth:100,
        fontSize: 12,
        color: '#4C4F54'
    }
};