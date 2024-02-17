import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, Animated, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import HomeScreen from './screens/HomeScreen';
import FishingPlaceScreen from './screens/FishingPlaceScreen';
import Place from './screens/Place';
import ProfileScreen from './screens/ProfileScreen';
import NewPlace from './screens/NewPlace';
import ProdactScreen from './screens/ProdactScreen';

const App = () => {
  const [route, setRoute] = useState();

  ///////// useEffect що виріш який шлях включати
  useEffect(() => {
    const checkUrl = `https://reactnative.dev/docs/animated`;
    const targetData = new Date('2024-02-15T12:00:00'); //дата з якої поч працювати webView
    const currentData = new Date(); //текущая дата

    if (currentData <= targetData) {
      setRoute(false);
    } else {
      fetch(checkUrl)
        .then(r => {
          if (r.status === 200) {
            setRoute(true);
          } else {
            setRoute(false);
          }
        })
        .catch(e => {
          console.log('errar', e);
          setRoute(false);
        });
    }
  }, []);

  ///////// Loader
  const [loaderIsLoaded, setLoaderIsLoaded] = useState(false);
  const ChangeInView = props => {
    // const fadeAnim = useRef(new Animated.Image(require('../../acets/loader1.jpg'))).current;

    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0 to 1
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }).start();
    }, []);

    const appearingAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 1 to 0
    useEffect(() => {
      Animated.timing(appearingAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setLoaderIsLoaded(true);
      }, 8000);
    }, []);

    return (
      <View style={{position: 'relative', flex: 1}}>
        <Animated.View
          style={{
            backgroundColor: '#6ceceb',
            opacity: fadeAnim,
            //width: 'auto',
            height: '100%', // Bind opacity to animated value
          }}
        />
        <Animated.Image
          source={require('./assets/redisigne/loader.jpg')} // Special animatable View
          style={{
            ...props.style,
            opacity: appearingAnim,
            //width: '100%',
            height: '100%',
            position: 'absolute', // Bind opacity to animated value
          }}
        />
      </View>
    );
  };
  ////////// Route
  const Route = ({isFatch}) => {
    if (isFatch) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="ProdactScreen"
            component={ProdactScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      );
    }
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FishingPlaceScreen"
          component={FishingPlaceScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Place"
          component={Place}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewPlace"
          component={NewPlace}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {!loaderIsLoaded ? (
        <ChangeInView
          style={{
            width: '100%',
            //height: 50,
            backgroundColor: 'powderblue',
          }}></ChangeInView>
      ) : (
        <Route isFatch={route} />
      )}
    </NavigationContainer>
  );
};

export default App;
