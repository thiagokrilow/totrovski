import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback,
    StyleSheet,
    Platform,
    Animated
} from 'react-native';
import { connect } from 'react-redux';

import PlaceList from '../../components/PlaceList/PlaceList';
import { getPlaces } from '../../store/actions/index';

class FindPlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: '#29aaf4'
    };

    state = {
        placesLoaded: false,
        btnAnimation: new Animated.Value(1)
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === 'ScreenChangedEvent') {
            if (event.id === 'willAppear') {
                this.props.onLoadPlaces();
            }
        }
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'sideDrawerToggle') {
                this.props.navigator.toggleDrawer({
                    side: 'left'
                });
            }
        }
    };

    itemSelectedHandler = key => {
        const selPlace = this.props.places.find(place => {
            return place.key === key;
        });
        this.props.navigator.push({
            screen: 'place-finder.PlaceDetailScreen',
            title: selPlace.name,
            passProps: {
                selectedPlace: selPlace
            }
        });
    };

    placesSearchHandler = () => {
        Animated.timing(this.state.btnAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start();
        this.setState({ placesLoaded: true });
    };

    render() {
        let content =
            Platform.OS === 'android' ? (
                <Animated.View
                    style={{
                        opacity: this.state.btnAnimation,
                        transform: [
                            {
                                scale: this.state.btnAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [12, 1]
                                })
                            }
                        ]
                    }}>
                    <TouchableNativeFeedback onPress={this.placesSearchHandler}>
                        <View style={styles.searchButton}>
                            <Text style={styles.searchText}>Find Places</Text>
                        </View>
                    </TouchableNativeFeedback>
                </Animated.View>
            ) : (
                <Animated.View
                    style={{
                        opacity: this.state.btnAnimation,
                        transform: [
                            {
                                scale: this.state.btnAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [12, 1]
                                })
                            }
                        ]
                    }}>
                    <TouchableOpacity onPress={this.placesSearchHandler}>
                        <View style={styles.searchButton}>
                            <Text style={styles.searchText}>Find Places</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            );

        if (this.state.placesLoaded) {
            content = (
                <PlaceList
                    places={this.props.places}
                    onItemSelected={this.itemSelectedHandler}
                />
            );
        }

        return (
            <View
                style={this.state.placesLoaded ? null : styles.buttonContainer}>
                {content}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchButton: {
        borderColor: '#29aaf4',
        borderWidth: 2,
        borderRadius: 20,
        padding: 15
    },
    searchText: {
        color: '#29aaf4',
        fontWeight: 'bold',
        fontSize: 20
    }
});

const mapStateToProps = state => {
    return {
        places: state.places.places
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadPlaces: () => dispatch(getPlaces())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FindPlaceScreen);
