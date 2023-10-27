import React from 'react';
import {type TextStyle, type StyleProp, Text} from 'react-native';

interface AppTextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
function AppText({children, style}: AppTextProps) {
    return <Text style={[{fontFamily: 'karla'}, style]}>{children}</Text>;
}

export default AppText;
