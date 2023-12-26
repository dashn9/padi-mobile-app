import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';

import * as Yup from 'yup';
import {Formik} from 'formik';

import {FormButton} from '../../../components/buttons';
import {Message2, useMessage} from '../../../components/messages';
import Screen from '../../../components/screen';
import {Header4} from '../../../components/headers';
import {type ChangeArtisanServicesScreenProps, type ChangeArtisanBioScreenProps, type ChangeBirthDateScreenProps, type ChangeStateScreenProps} from '../../../navigations/AccountNavigator';
import {Back} from '../../../navigations/controls';
import * as metrics from '../../../utils/metrics';
import {states} from '../../../config/lists';
import {useChangeUserPropertyMutation} from '../../../hooks/mutations/useUserMutation';
import AppText from '../../../components/text';
import colors from '../../../config/colors';
import {DatePickerCustom, FormTextArea, SearchableDropDown} from '../../../components/inputs';
import {removeNoOfYearsFromDate} from '../../../utils/datetime';
import {useComposeArtisanMutation} from '../../../hooks/mutations/useArtisanMutation';
import {useFetchMyArtisanProfileQuery, useFetchServicesQuery} from '../../../hooks/queries/useArtisanQuery';
import {parseSelectableDataFromObject} from '../../../utils/object';

export interface ChangeAccountProperty {
    id: number;
}

const accountStateValidationSchema = Yup.object().shape({
    state: Yup.string().required(),
});

const accountBirthDateValidationSchema = Yup.object().shape({
    birthDate: Yup.string()
        .required()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (yyyy-mm-dd)'),
});

const artisanBioValidationSchema = Yup.object().shape({
    bio: Yup.string().required().label('Bio'),
});

const artisanServicesValidationSchema = Yup.object().shape({
    services: Yup.string().required().label('Service'),
});

export function ChangeAccountStateScreen({route, navigation}: ChangeStateScreenProps) {
    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    const [stateValue, setStateValue] = useState('');
    const [isAccountStateUpdating, setIsAccountStateUpdating] = useState(false);
    const userPropertyMutator = useChangeUserPropertyMutation(
        setIsAccountStateUpdating,
        () => {
            showMessage('State updated successfully', 'success');
            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        },
        error => {
            showMessage('Unable to update your state', 'failure');
        }
    );

    const updateStateValue = (stateValue: React.SetStateAction<string>) => {
        setStateValue(stateValue);
    };

    const statesInput = [...states];
    statesInput.shift();

    return (
        <Screen>
            <View style={styles.changeAccountPropertyScreenContainer}>
                <Message2 message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                <Back style={{position: 'relative', top: 0, marginTop: metrics.verticalScale(24)}} />
                <Header4>Enter your state</Header4>
                <Formik
                    initialValues={{
                        state: stateValue,
                    }}
                    onSubmit={async values => {
                        userPropertyMutator.mutate({state: values.state});
                    }}
                    validationSchema={accountStateValidationSchema}
                >
                    {({handleChange, handleSubmit, errors, touched}) => {
                        useEffect(() => {
                            handleChange('state')(stateValue);
                        }, [stateValue]);
                        return (
                            <>
                                <View style={styles.changeAccountPropertyFormContainer}>
                                    <SearchableDropDown items={statesInput} value={stateValue} setValue={updateStateValue} placeholder='State' searchPlaceholder='Search States' />
                                    {touched?.state ? <AppText style={{color: colors.failureRedBold}}>{errors.state}</AppText> : undefined}
                                </View>
                                <View style={styles.changeAccountPropertyFormSubmitContainer}>
                                    <FormButton text='Update State' onPress={handleSubmit} isLoading={isAccountStateUpdating} />
                                </View>
                            </>
                        );
                    }}
                </Formik>
            </View>
        </Screen>
    );
}

export function ChangeAccountBirthDateScreen({route, navigation}: ChangeBirthDateScreenProps) {
    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    const [isAccountStateUpdating, setIsAccountStateUpdating] = useState(false);

    const userPropertyMutator = useChangeUserPropertyMutation(
        setIsAccountStateUpdating,
        () => {
            showMessage('Birth date updated successfully', 'success');
            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        },
        error => {
            showMessage('Unable to update your birth date', 'failure');
        }
    );

    return (
        <Screen>
            <View style={styles.changeAccountPropertyScreenContainer}>
                <Message2 message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                <Back style={{position: 'relative', top: 0, marginTop: metrics.verticalScale(24)}} />
                <Header4>Enter your birth date</Header4>
                <Formik
                    initialValues={{
                        birthDate: '',
                    }}
                    onSubmit={async values => {
                        console.log(values);
                        userPropertyMutator.mutate({birthDate: values.birthDate});
                    }}
                    validationSchema={accountBirthDateValidationSchema}
                >
                    {({handleChange, handleSubmit, errors, touched}) => {
                        const onDateUpdate = (date: string | Date) => {
                            handleChange('birthDate')(date as string);
                        };

                        return (
                            <>
                                <View style={styles.changeAccountPropertyFormContainer}>
                                    <DatePickerCustom mode='date' onUpdate={onDateUpdate} parseToString={true} maximumDate={removeNoOfYearsFromDate(new Date(), 16)} />
                                    {touched?.birthDate ? <AppText style={{color: colors.failureRedBold}}>{errors.birthDate}</AppText> : undefined}
                                </View>
                                <View style={styles.changeAccountPropertyFormSubmitContainer}>
                                    <FormButton text='Update Birth Date' onPress={handleSubmit} isLoading={isAccountStateUpdating} />
                                </View>
                            </>
                        );
                    }}
                </Formik>
            </View>
        </Screen>
    );
}

export function ChangeArtisanBioScreen({route, navigation}: ChangeArtisanBioScreenProps) {
    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    const [isAccountStateUpdating, setIsAccountStateUpdating] = useState(false);
    const myArtisan = useFetchMyArtisanProfileQuery();
    const artisanPropertyMutator = useComposeArtisanMutation({
        mutationLoadingCallbackFn: setIsAccountStateUpdating,
        mutationSuccessCallbackFn() {
            showMessage('Bio updated successfully', 'success');
            void myArtisan.refetch();
            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        },
        mutationErrorCallbackFn(error) {
            showMessage('Unable to update your bio', 'failure');
        },
    });

    return (
        <Screen>
            <View style={styles.changeAccountPropertyScreenContainer}>
                <Message2 message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                <Back style={{position: 'relative', top: 0, marginTop: metrics.verticalScale(24)}} />
                <Header4>Modify your bio</Header4>
                <Formik
                    initialValues={{
                        bio: route.params.currentBio,
                    }}
                    onSubmit={async values => {
                        artisanPropertyMutator.mutate({bio: values.bio});
                    }}
                    validationSchema={artisanBioValidationSchema}
                >
                    {({handleChange, handleSubmit, errors, touched}) => (
                        <>
                            <View style={styles.changeAccountPropertyFormContainer}>
                                <FormTextArea
                                    placeholder='Enter your new bio'
                                    outText={route.params.currentBio}
                                    onChangeText={text => {
                                        handleChange('bio')(text);
                                    }}
                                />
                                {touched?.bio ? <AppText style={{color: colors.failureRedBold}}>{errors.bio}</AppText> : undefined}
                            </View>
                            <View style={styles.changeAccountPropertyFormSubmitContainer}>
                                <FormButton text='Update State' onPress={handleSubmit} isLoading={isAccountStateUpdating} />
                            </View>
                        </>
                    )}
                </Formik>
            </View>
        </Screen>
    );
}

export function ChangeArtisanServicesScreen({route, navigation}: ChangeArtisanServicesScreenProps) {
    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    const [serviceValue, setServiceValue] = useState('');
    const [isAccountStateUpdating, setIsAccountStateUpdating] = useState(false);
    const myArtisan = useFetchMyArtisanProfileQuery();
    const artisanPropertyMutator = useComposeArtisanMutation({
        mutationLoadingCallbackFn: setIsAccountStateUpdating,
        mutationSuccessCallbackFn() {
            showMessage('Service updated successfully', 'success');
            void myArtisan.refetch();
            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        },
        mutationErrorCallbackFn(error) {
            showMessage('Unable to update your service', 'failure');
        },
    });

    const services = useFetchServicesQuery().data;

    const updateServiceValue = (serviceValue: React.SetStateAction<string>) => {
        setServiceValue(serviceValue);
    };

    return (
        <Screen>
            <View style={styles.changeAccountPropertyScreenContainer}>
                <Message2 message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                <Back style={{position: 'relative', top: 0, marginTop: metrics.verticalScale(24)}} />
                <Header4>Enter your state</Header4>
                <Formik
                    initialValues={{
                        services: '',
                    }}
                    onSubmit={async values => {
                        artisanPropertyMutator.mutate({services: [values.services]});
                    }}
                    validationSchema={artisanServicesValidationSchema}
                >
                    {({handleChange, handleSubmit, errors, touched}) => {
                        useEffect(() => {
                            handleChange('services')(serviceValue);
                        }, [serviceValue]);
                        return (
                            <>
                                <View style={styles.changeAccountPropertyFormContainer}>
                                    {services ? <SearchableDropDown items={parseSelectableDataFromObject(services, 'serviceName', 'serviceCode')} value={serviceValue} setValue={updateServiceValue} placeholder='Select Service' searchPlaceholder='Search Services' /> : null}
                                    {touched?.services ? <AppText style={{color: colors.failureRedBold}}>{errors.services}</AppText> : undefined}
                                </View>
                                <View style={styles.changeAccountPropertyFormSubmitContainer}>
                                    <FormButton text='Update State' onPress={handleSubmit} isLoading={isAccountStateUpdating} />
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
    changeAccountPropertyScreenContainer: {
        flex: 1,
    },
    changeAccountPropertyFormContainer: {},
    changeAccountPropertyFormSubmitContainer: {
        marginTop: 'auto',
        marginBottom: '4%',
    },
});
