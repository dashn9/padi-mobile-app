import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {FormButton} from '../../../../components/buttons';
import {Header2, Header3, Header4} from '../../../../components/headers';
import {DatePickerCustom, FormTextArea, SearchableDropDown} from '../../../../components/inputs';
import {useMessage, Message2} from '../../../../components/messages';
import AppText from '../../../../components/text';
import colors from '../../../../config/colors';
import {useChangeUserPropertyMutation} from '../../../../hooks/mutations/useUserMutation';
import {type CreateArtisanProfileScreenProps} from '../../../../navigations/AccountNavigator';
import {Back} from '../../../../navigations/controls';
import {removeNoOfYearsFromDate} from '../../../../utils/datetime';
import * as metrics from '../../../../utils/metrics';
import Screen from '../../../../components/screen';
import {useCheckIfIsArtisanQuery, useFetchServicesQuery} from '../../../../hooks/queries/useArtisanQuery';
import {parseSelectableDataFromObject} from '../../../../utils/object';
import {useComposeArtisanMutation} from '../../../../hooks/mutations/useArtisanMutation';

const artisanProfileValidationSchema = Yup.object().shape({
    bio: Yup.string().max(350).required(),
    services: Yup.string().required(),
});

function CreateArtisanProfileScreen({route, navigation}: CreateArtisanProfileScreenProps) {
    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    const [serviceValue, setServiceValue] = useState('');
    const [isProfileCreating, setIsProfileCreating] = useState(false);
    const isArtisan = useCheckIfIsArtisanQuery();
    const composeArtisanProfile = useComposeArtisanMutation({
        mutationLoadingCallbackFn: setIsProfileCreating,
        mutationSuccessCallbackFn() {
            showMessage('State updated successfully', 'success');
            void isArtisan.refetch();
            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        },
        mutationErrorCallbackFn() {
            showMessage('Unable to update your state', 'failure');
        },
    });
    const services = useFetchServicesQuery().data;

    const updateServiceValue = (serviceValue: React.SetStateAction<string>) => {
        setServiceValue(serviceValue);
    };

    return (
        <Screen>
            <View style={styles.createArtisanProfileScreenContainer}>
                <Message2 message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                <Back style={{position: 'relative', top: 0, marginTop: metrics.verticalScale(24)}} />
                <Header3>Create Artisan Profile</Header3>
                <Formik
                    initialValues={{
                        bio: '',
                        services: '',
                    }}
                    onSubmit={async values => {
                        const newValues = {...values, services: [values.services]};
                        composeArtisanProfile.mutate(newValues);
                    }}
                    validationSchema={artisanProfileValidationSchema}
                >
                    {({handleChange, handleSubmit, errors, touched}) => {
                        useEffect(() => {
                            handleChange('services')(serviceValue);
                        }, [serviceValue]);

                        return (
                            <>
                                <View style={styles.changeAccountPropertyFormContainer}>
                                    <FormTextArea
                                        onChangeText={text => {
                                            handleChange('bio')(text);
                                        }}
                                        placeholder='What do you want customers to see about you?'
                                        inputLabel='Bio'
                                        maxLength={300}
                                    />
                                    {touched?.bio ? <AppText style={{color: colors.failureRedBold}}>{errors.bio}</AppText> : undefined}
                                    {services ? <SearchableDropDown items={parseSelectableDataFromObject(services, 'serviceName', 'serviceCode')} value={serviceValue} setValue={updateServiceValue} placeholder='Select Service' searchPlaceholder='Search Services' /> : null}
                                    {touched?.services ? <AppText style={{color: colors.failureRedBold}}>{errors.services}</AppText> : undefined}
                                </View>
                                <View style={styles.changeAccountPropertyFormSubmitContainer}>
                                    <FormButton text='Become An Artisan' onPress={handleSubmit} isLoading={isProfileCreating} />
                                </View>
                            </>
                        );
                    }}
                </Formik>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    createArtisanProfileScreenContainer: {
        flex: 1,
    },
    changeAccountPropertyFormContainer: {},
    changeAccountPropertyFormSubmitContainer: {
        marginTop: 'auto',
        marginBottom: '4%',
    },
});

export default CreateArtisanProfileScreen;
