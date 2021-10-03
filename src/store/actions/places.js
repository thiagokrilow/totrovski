import { AsyncStorage } from 'react-native';

import {
    SET_PLACES,
    REMOVE_PLACE,
    PLACE_ADDED,
    START_ADD_PLACE
} from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import { authSetToken } from './auth';

export const startAddPlace = () => {
    return {
        type: START_ADD_PLACE
    };
};

export const addPlace = (placeName, location, image) => {
    return (dispatch, getState) => {
        const token = getState().auth.token;
        if (!token) {
            let fetchedToken;
            AsyncStorage.getItem('pf:auth:token')
                .catch(err => {
                    return;
                })
                .then(storedToken => {
                    if (!storedToken) {
                        return;
                    }
                    fetchedToken = storedToken;
                    AsyncStorage.getItem('pf:auth:expiryDate').then(
                        expiryDate => {
                            const parsedExpiryDate = new Date(
                                parseInt(expiryDate)
                            );
                            const now = new Date();
                            if (parsedExpiryDate > now) {
                                dispatch(authSetToken(fetchedToken));
                                startMainTabs();
                            } else {
                                return;
                            }
                        }
                    );
                    dispatch(authSetToken(storedToken));
                });
        }
        dispatch(uiStartLoading());
        fetch(
            'https://us-central1-place-finder-d3f4b.cloudfunctions.net/storeImage',
            {
                method: 'POST',
                body: JSON.stringify({
                    image: image.base64
                }),
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .catch(err => {
                console.log(err);
                alert('Something went wrong, please try again!');
                dispatch(uiStopLoading());
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error();
                }
            })
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location,
                    image: parsedRes.imageUrl,
                    imagePath: parsedRes.imagePath
                };
                return fetch(
                    `https://place-finder-d3f4b.firebaseio.com/places.json?auth=${token}`,
                    {
                        method: 'POST',
                        body: JSON.stringify(placeData)
                    }
                );
            })
            .catch(err => {
                console.log(err);
                alert('Something went wrong, please try again!');
                dispatch(uiStopLoading());
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error();
                }
            })
            .then(parsedRes => {
                console.log(parsedRes);
                dispatch(uiStopLoading());
                dispatch(placeAdded());
            })
            .catch(err => {
                console.log(err);
                alert('Something went wrong, please try again!');
                dispatch(uiStopLoading());
            });
    };
};

export const placeAdded = () => {
    return {
        type: PLACE_ADDED
    };
};

export const getPlaces = () => {
    return (dispatch, getState) => {
        const token = getState().auth.token;
        if (!token) {
            let fetchedToken;
            AsyncStorage.getItem('pf:auth:token')
                .catch(err => {
                    return;
                })
                .then(storedToken => {
                    if (!storedToken) {
                        return;
                    }
                    fetchedToken = storedToken;
                    AsyncStorage.getItem('pf:auth:expiryDate').then(
                        expiryDate => {
                            const parsedExpiryDate = new Date(
                                parseInt(expiryDate)
                            );
                            const now = new Date();
                            if (parsedExpiryDate > now) {
                                dispatch(authSetToken(fetchedToken));
                                startMainTabs();
                            } else {
                                return;
                            }
                        }
                    );
                    dispatch(authSetToken(storedToken));
                });
        }
        fetch(
            `https://place-finder-d3f4b.firebaseio.com/places.json?auth=${token}`
        )
            .catch(err => {
                alert('An error has occured');
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error();
                }
            })
            .then(parsedRes => {
                const places = [];
                for (let key in parsedRes) {
                    places.push({
                        ...parsedRes[key],
                        image: { uri: parsedRes[key].image },
                        key
                    });
                }
                dispatch(setPlaces(places));
            })
            .catch(err => {
                alert('An error has occured');
            });
    };
};

export const setPlaces = places => {
    return {
        type: 'SET_PLACES',
        places
    };
};

export const deletePlace = key => {
    return (dispatch, getState) => {
        dispatch(removePlace(key));
        const token = getState().auth.token;
        if (!token) {
            let fetchedToken;
            AsyncStorage.getItem('pf:auth:token')
                .catch(err => {
                    return;
                })
                .then(storedToken => {
                    if (!storedToken) {
                        return;
                    }
                    fetchedToken = storedToken;
                    AsyncStorage.getItem('pf:auth:expiryDate').then(
                        expiryDate => {
                            const parsedExpiryDate = new Date(
                                parseInt(expiryDate)
                            );
                            const now = new Date();
                            if (parsedExpiryDate > now) {
                                dispatch(authSetToken(fetchedToken));
                                startMainTabs();
                            } else {
                                return;
                            }
                        }
                    );
                    dispatch(authSetToken(storedToken));
                });
        }
        fetch(
            `https://place-finder-d3f4b.firebaseio.com/places/${key}.json?auth=${token}`,
            {
                method: 'DELETE'
            }
        )
            .catch(err => {
                alert('An error has occured');
                console.log(err);
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error();
                }
            })
            .then(parsedRes => {
                console.log('Done!');
            })
            .catch(err => {
                alert('An error has occured');
                console.log(err);
            });
    };
};

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    };
};
