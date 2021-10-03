import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import BackgroundedButton from '../UI/BackgrounedButton/Button';
import imagePlaceHolder from '../../assets/placeholder.png';
import ImagePicker from 'react-native-image-picker';

class PickImage extends Component {
    state = {
        pickedImage: null
    };

    reset = () => {
        this.setState({ pickedImage: null });
    };

    pickImageHandler = () => {
        ImagePicker.showImagePicker(
            { title: 'Pick an Image', maxWidth: 800, maxHeight: 600 },
            res => {
                if (res.didCancel) {
                    console.log('User cancelled');
                } else if (res.error) {
                    console.log('Error :', res.error);
                } else {
                    this.setState({ pickedImage: { uri: res.uri } });
                    this.props.onImagePick({ uri: res.uri, base64: res.data });
                }
            }
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.placeholder, { marginTop: 25 }]}>
                    <Image
                        source={this.state.pickedImage || imagePlaceHolder}
                        style={styles.previewImage}
                    />
                </View>
                <View style={styles.button}>
                    <BackgroundedButton
                        color="#29aaf4"
                        bgColor="white"
                        brColor="#29aaf4"
                        onPress={this.pickImageHandler}>
                        Pick Image
                    </BackgroundedButton>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },
    placeholder: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#eee',
        width: '80%',
        height: 150
    },
    button: {
        margin: 8
    },
    previewImage: {
        width: '100%',
        height: '100%'
    }
});

export default PickImage;
