import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {FormButton} from '../../../components/buttons';
import {Header2, Header3, Header4} from '../../../components/headers';
import {DatePickerCustom, FormTextArea, SearchableDropDown} from '../../../components/inputs';
import {useMessage, Message2} from '../../../components/messages';
import AppText from '../../../components/text';
import colors from '../../../config/colors';
import {useChangeUserPropertyMutation} from '../../../hooks/mutations/useUserMutation';
import {type CreateArtisanProfileScreenProps} from '../../../navigations/AccountNavigator';
import {Back} from '../../../navigations/controls';
import {removeNoOfYearsFromDate} from '../../../utils/datetime';
import * as metrics from '../../../utils/metrics';
import Screen from '../../../components/screen';
import {useFetchServicesQuery} from '../../../hooks/queries/useArtisanQuery';
import {parseSelectableDataFromObject} from '../../../utils/object';

const artisanProfileValidationSchema = Yup.object().shape({
    bio: Yup.string().max(350).required(),
    service: Yup.string().required(),
});

function CreateArtisanProfileScreen({route, navigation}: CreateArtisanProfileScreenProps) {
    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    const [serviceValue, setServiceValue] = useState('');
    const [isProfileCreating, setIsProfileCreating] = useState(false);
    const services = useFetchServicesQuery().data;
    console.log(services);

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
                        birthDate: '',
                    }}
                    onSubmit={async values => {
                        console.log(values);
                    }}
                    validationSchema={artisanProfileValidationSchema}
                >
                    {({handleChange, handleSubmit, errors, touched}) => {
                        useEffect(() => {
                            handleChange('service')(serviceValue);
                        }, [serviceValue]);

                        return (
                            <>
                                <View style={styles.changeAccountPropertyFormContainer}>
                                    <FormTextArea placeholder='What do you want customers to see about you?' inputLabel='Bio' maxLength={300} />
                                    {services ? <SearchableDropDown items={parseSelectableDataFromObject(services, 'serviceName', 'serviceCode')} value={serviceValue} setValue={updateServiceValue} placeholder='Select Service' searchPlaceholder='Search Services' /> : null}
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
