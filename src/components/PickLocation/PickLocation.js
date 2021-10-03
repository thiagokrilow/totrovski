import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import BackgroundedButton from '../UI/BackgrounedButton/Button';
import MapView from 'react-native-maps';

class PickLocation extends Component {
    componentWillMount() {
        this.reset();
    }

    reset = () => {
        this.setState({
            focusedLoc: {
                latitude: -6.89148,
                longitude: 107.6107,
                latitudeDelta: 0.00522,
                longitudeDelta:
                    (Dimensions.get('window').width /
                        Dimensions.get('window').height) *
                    0.00522
            },
            chosedLoc: false
        });
    };

    pickLocationHandler = event => {
        const coordinates = event.nativeEvent.coordinate;
        this.map.animateToRegion({
            ...this.state.focusedLoc,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        });
        this.setState(prevState => {
            return {
                focusedLoc: {
                    ...prevState.focusedLoc,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude
                },
                chosedLoc: true
            };
        });
        this.props.onLocationPick({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        });
    };

    getLocationHandler = () => {
        const self = this;
        navigator.geolocation.getCurrentPosition(
            pos => {
                const coordsEvent = {
                    nativeEvent: {
                        coordinate: {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        }
                    }
                };
                self.pickLocationHandler(coordsEvent);
            },
            err => {
                alert(
                    'Fetching the position failed, please pick manually on the map'
                );
            }
        );
    };

    render() {
        let marker = null;
        if (this.state.chosedLoc) {
            marker = <MapView.Marker coordinate={this.state.focusedLoc} />;
        }
        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={this.state.focusedLoc}
                    region={
                        !this.state.chosedLoc ? this.state.focusedLoc : null
                    }
                    style={styles.map}
                    onPress={this.pickLocationHandler}
                    ref={ref => (this.map = ref)}>
                    {marker}
                </MapView>
                <View style={styles.button}>
                    <BackgroundedButton
                        color="#29aaf4"
                        bgColor="white"
                        brColor="#29aaf4"
                        onPress={this.getLocationHandler}>
                        Locate Me
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
    map: {
        width: '100%',
        height: 250
    },
    button: {
        margin: 8
    }
});

export default PickLocation;
