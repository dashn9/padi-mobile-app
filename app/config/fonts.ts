import * as metrics from '../utils/metrics';

interface Fonts {
    primaryFontFamily: string;
    primaryFontFamilySemiBold: string;
    buttonFontWeight: '500';
    buttonFontSize: number;
    formInputFontSize: number;
    formLabelFontSize: number;
    large: number;
    medium: number;
    normalMedium: number;
    normal: number;
    small: number;
}

const fonts: Fonts = {
    primaryFontFamily: 'karlaBold',
    primaryFontFamilySemiBold: 'karlaSemiBold',
    buttonFontWeight: '500',
    buttonFontSize: metrics.moderateScale(18),
    formInputFontSize: metrics.moderateScale(16),
    formLabelFontSize: metrics.moderateScale(14),

    // Defaults
    large: metrics.moderateScale(20),
    medium: metrics.moderateScale(18),
    normalMedium: metrics.moderateScale(16),
    normal: metrics.moderateScale(14),
    small: metrics.moderateScale(12),
};
export default fonts;
