import colors from '@/utils/colors';

export const styles = {
    Image: {
        borderRadius: 16,
        marginBottom: 4,

    },
    InfoModal: {
        width: 400,
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginTop: '-125px',
        marginLeft: '-25px',
        padding: 24,
        marginBottom: 13,
    },
    TitleStyleFonts: {
        color: colors.black,
        fontSize: 24,
    },
    WrapperCountAction: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    SuccesCount: {
        color: colors.green,
        fontSize: 12,
        fontWeight: 700,
        background: colors.lightGray100,
        padding: '0px 8px 0px 8px',
        borderRadius: '2px 0px 0px 2px'
    },
    FailedCount: {
        color: colors.red,
        fontSize: 12,
        fontWeight: 700,
        background: colors.peach,
        padding: '0px 8px 0px 8px',
        borderRadius: '0px 2px 2px 0px'
    },
    StyleButtonFit: {
        width: 168,
        fontSize: 14
    }

};