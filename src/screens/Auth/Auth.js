import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    StyleSheet,
    ImageBackground,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import BackgroundedButton from '../../components/UI/BackgrounedButton/Button';

import bgImage from '../../assets/background.jpg';
import validate from '../../utility/validation';
import { tryAuth, authAutoSignIn } from '../../store/actions/index';

class AuthScreen extends Component {
    state = {
        styles: {
            pwContainerDirection: 'column',
            pwContainerJustifyContent: 'flex-start',
            pwWrapperWidth: '100%'
        },
        authMode: 'login',
        controls: {
            email: {
                value: '',
                valid: false,
                validationRules: {
                    isEmail: true
                },
                touched: false
            },
            password: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confPassword: {
                value: '',
                valid: false,
                validationRules: {
                    equalTo: 'password'
                },
                touched: false
            }
        }
    };

    constructor(props) {
        super(props);
        Dimensions.addEventListener('change', this.updateStyles);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.updateStyles);
    }

    componentDidMount() {
        this.props.onAutoSignIn();
    }

    updateStyles = dims => {
        this.setState({
            styles: {
                pwContainerDirection:
                    Dimensions.get('window').height > 500 ? 'column' : 'row',
                pwContainerJustifyContent:
                    Dimensions.get('window').height > 500
                        ? 'flex-start'
                        : 'space-between',
                pwWrapperWidth:
                    Dimensions.get('window').height > 500 ||
                    this.state.authMode === 'login'
                        ? '100%'
                        : '45%'
            }
        });
    };

    authHandler = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        };
        this.props.onTryAuth(authData, this.state.authMode);
    };

    updateInput = (key, value) => {
        let conValue = {};
        if (this.state.controls[key].validationRules.equalTo) {
            const eqControl = this.state.controls[key].validationRules.equalTo;
            const equalTo = this.state.controls[eqControl].value;
            conValue = {
                ...conValue,
                equalTo
            };
        }
        if (key === 'password') {
            conValue = { ...conValue, equalTo: value };
        }
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confPassword: {
                        ...prevState.controls.confPassword,
                        valid:
                            key === 'password'
                                ? validate(
                                      prevState.controls.confPassword.value,
                                      prevState.controls.confPassword
                                          .validationRules,
                                      conValue
                                  )
                                : prevState.controls.confPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value,
                        valid: validate(
                            value,
                            prevState.controls[key].validationRules,
                            conValue
                        ),
                        touched: true
                    }
                }
            };
        });
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                authMode: prevState.authMode === 'login' ? 'signup' : 'login'
            };
        });
        this.updateStyles();
    };

    render() {
        let headingText = null;
        let confPasswordControl = null;

        if (Dimensions.get('window').height > 500) {
            headingText = (
                <MainText>
                    <HeadingText>
                        Please{' '}
                        {this.state.authMode !== 'login' ? 'Sign Up' : 'Login'}
                    </HeadingText>
                </MainText>
            );
        }

        if (this.state.authMode === 'signup') {
            confPasswordControl = (
                <View
                    style={{
                        width: this.state.styles.pwWrapperWidth
                    }}>
                    <DefaultInput
                        placeholder="Confirm Password"
                        style={styles.input}
                        value={this.state.controls.confPassword.value}
                        onChangeText={val =>
                            this.updateInput('confPassword', val)
                        }
                        valid={this.state.controls.confPassword.valid}
                        touched={this.state.controls.confPassword.touched}
                        secureTextEntry
                    />
                </View>
            );
        }

        return (
            <ImageBackground
                source={bgImage}
                style={styles.backgroundImage}
                imageStyle={{ resizeMode: 'stretch' }}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior="padding">
                    {headingText}
                    <BackgroundedButton
                        bgColor="#29aaf4"
                        color="white"
                        brColor="transparent"
                        onPress={this.switchAuthModeHandler}>
                        {this.state.authMode === 'login' ? 'Sign Up' : 'Login'}{' '}
                        Here
                    </BackgroundedButton>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inputContainer}>
                            <DefaultInput
                                placeholder="Email"
                                style={styles.input}
                                value={this.state.controls.email.value}
                                onChangeText={val =>
                                    this.updateInput('email', val)
                                }
                                valid={this.state.controls.email.valid}
                                touched={this.state.controls.email.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                            <View
                                style={{
                                    flexDirection: this.state.styles
                                        .pwContainerDirection,
                                    justifyContent: this.state.styles
                                        .pwContainerJustifyContent
                                }}>
                                <View
                                    style={{
                                        width: this.state.styles.pwWrapperWidth
                                    }}>
                                    <DefaultInput
                                        placeholder="Password"
                                        style={styles.input}
                                        value={
                                            this.state.controls.password.value
                                        }
                                        onChangeText={val =>
                                            this.updateInput('password', val)
                                        }
                                        valid={
                                            this.state.controls.password.valid
                                        }
                                        touched={
                                            this.state.controls.password.touched
                                        }
                                        secureTextEntry
                                    />
                                </View>
                                {confPasswordControl}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {this.props.isLoading ? (
                        <ActivityIndicator size="large" color="#29aaf4" />
                    ) : (
                        <BackgroundedButton
                            bgColor="#29aaf4"
                            color="white"
                            brColor="transparent"
                            onPress={this.authHandler}
                            disabled={
                                (!this.state.controls.confPassword.valid &&
                                    this.state.authMode === 'signup') ||
                                !this.state.controls.password.valid ||
                                !this.state.controls.email.valid
                            }>
                            Submit
                        </BackgroundedButton>
                    )}
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImage: {
        width: '100%',
        flex: 1
    },
    inputContainer: {
        width: '75%'
    },
    input: {
        backgroundColor: '#eee',
        borderColor: '#bbb'
    }
});

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAuth: (authData, authMode) =>
            dispatch(tryAuth(authData, authMode)),
        onAutoSignIn: () => dispatch(authAutoSignIn())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthScreen);
