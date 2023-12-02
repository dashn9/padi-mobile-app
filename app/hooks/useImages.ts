
import React from 'react';
import * as FileSystem from 'expo-file-system';

import {default as imagesURL, setAvatarSeed} from '../apis/images';

import {useAuthContext} from './contexts/AuthContext';

export const useProfileImage = () => {
    const {user} = useAuthContext();
    const [localImageUri, setLocalImageUri] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        const localAvatarsDirectory = `${FileSystem.documentDirectory}user/images/avatars/`;
        const mainUserAvatar = `user_avatar_${user?.id}.jpg`;

        const downloadImage = async () => {
            await FileSystem.makeDirectoryAsync(localAvatarsDirectory, {intermediates: true});
            FileSystem.getInfoAsync(localAvatarsDirectory + mainUserAvatar)
                .then(fileInfo => {
                    if (fileInfo.exists) {
                        setLocalImageUri(localAvatarsDirectory + mainUserAvatar);
                    } else {
                        throw new Error('Image doesn&39;t exist.');
                    }
                })
                .catch(() => {
                    setAvatarSeed(user?.id);
                    // Image file doesn't exist, download it from the internet
                    FileSystem.downloadAsync(imagesURL.generateAvatar.url, localAvatarsDirectory + mainUserAvatar)
                        .then(async imageDownloadResult => {
                            setLocalImageUri(imageDownloadResult.uri);
                        })
                        .catch(error => {
                            console.log(error);
                            void 0;
                        });
                });

            // Send an event if the user is not online to attempt a delete on the avatar so whoever is logging in don't use the previous avatar
        };

        void downloadImage();
    }, []);

    return {localImageUri};
};
