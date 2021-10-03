import React from 'react';
import {
    TouchableOpacity,
    TouchableNativeFeedback,
    Text,
    View,
    StyleSheet,
    Platform
} from 'react-native';

const button = props => {
    const content = (
        <View
            style={[
                styles.button,
                { backgroundColor: props.bgColor, borderColor: props.brColor },
                props.disabled ? styles.disabled : null
            ]}>
            <Text
                style={[
                    styles.textButton,
                    { color: props.color },
                    props.disabled ? styles.disabledText : null
                ]}>
                {props.children}
            </Text>
        </View>
    );
    if (props.disabled) {
        return content;
    }
    if (Platform.OS === 'android') {
        return (
            <TouchableNativeFeedback onPress={props.onPress}>
                {content}
            </TouchableNativeFeedback>
        );
    }
    return (
        <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1
    },
    textButton: {
        color: 'white'
    },
    disabled: {
        backgroundColor: '#eee',
        borderColor: '#aaa'
    },
    disabledText: {
        color: '#aaa'
    }
});

export default button;
