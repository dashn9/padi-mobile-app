import * as metrics from '../metrics/metrics';

interface Fonts {
    primaryFontFamily: string;
    buttonFontWeight: '500';
    buttonFontSize: number;
    formInputFontSize: number;
    formLabelFontSize: number;
}

const fonts: Fonts = {
    primaryFontFamily: 'karla',
    buttonFontWeight: '500',
    buttonFontSize: metrics.moderateScale(18),
    formInputFontSize: metrics.moderateScale(16),
    formLabelFontSize: metrics.moderateScale(14),
};
export default fonts;
