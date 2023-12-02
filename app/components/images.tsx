import React from 'react';
import {type StyleProp, type ViewStyle, type TextStyle, View, StyleSheet, Image} from 'react-native';
import AppText from './text';
import colors from '../config/colors';
import {Fontisto} from '@expo/vector-icons';
import icons from '../config/icons';
import {useProfileImage} from '../hooks/useImages';

interface UserImageProps {
    initials?: string;
    size: number;
    containerStyle?: StyleProp<ViewStyle>;
    textStyles?: StyleProp<TextStyle>;
}

export const UserImage: React.FC<UserImageProps> = ({initials, size, containerStyle, textStyles}) => {
    const {localImageUri} = useProfileImage();
    return initials ? (
        <View style={[styles.container, {width: size, height: size, borderRadius: size / 2}, containerStyle]}>
            <AppText style={[styles.initials, {fontSize: size / 2}, textStyles]}>{initials}</AppText>
        </View>
    ) : (
        <View style={[styles.profileIconBackDrop, {width: size, height: size}, containerStyle]}>{localImageUri ? <Image source={{uri: localImageUri}} style={{width: size, height: size}} /> : <Fontisto name='user-secret' size={icons.xl14 + 1} color={colors.primaryColor800B} />}</View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    initials: {
        color: colors.primaryColor600B,
    },
    profileIconBackDrop: {
        backgroundColor: '#b6e3f4',
        borderRadius: 100,
        width: icons.xl16,
        height: icons.xl16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});
