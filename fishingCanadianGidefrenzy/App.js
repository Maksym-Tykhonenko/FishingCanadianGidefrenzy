import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Animated,
  Image,
  LogBox,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
//import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';

import {LogLevel, OneSignal} from 'react-native-onesignal';
import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();

import HomeScreen from './screens/HomeScreen';
import FishingPlaceScreen from './screens/FishingPlaceScreen';
import Place from './screens/Place';
import ProfileScreen from './screens/ProfileScreen';
import NewPlace from './screens/NewPlace';
import ProdactScreen from './screens/ProdactScreen';

const App = () => {
  LogBox.ignoreLogs([
    'Sending `onAnimatedValueUpdate` with no listeners registered',
  ]);
  const [route, setRoute] = useState();

  ///////////// Отримання IDFA
  const [idfa, setIdfa] = useState(null);
  console.log('idfa==>', idfa);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setData();
  }, [idfa]);

  const setData = async () => {
    try {
      const data = {
        idfa,
      };
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem('App', jsonData);
      console.log('Дані збережено в AsyncStorage');
    } catch (e) {
      console.log('Помилка збереження даних:', e);
    }
  };

  const getData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('App');
      if (jsonData !== null) {
        const parsedData = JSON.parse(jsonData);
        console.log('Дані дістаються в AsyncStorage');
        console.log('parsedData in App==>', parsedData);
        setIdfa(parsedData.idfa);
      } else {
        await fetchIdfa();
        await someFunction();
      }
    } catch (e) {
      console.log('Помилка отримання даних:', e);
    }
  };

  const fetchIdfa = async () => {
    try {
      const res = await ReactNativeIdfaAaid.getAdvertisingInfo();
      if (!res.isAdTrackingLimited) {
        setIdfa(res.id);
      } else {
        setIdfa(true);
      }
    } catch (err) {
      console.log('err', err);
      setIdfa(null);
      fetchIdfa(); //???
    }
  };

  ///////////// OneSignal.Notifications
  // a6528be4-5c83-4576-917c-2e063c230909
  const requestPermission = () => {
    return new Promise((resolve, reject) => {
      try {
        OneSignal.Notifications.requestPermission(true);
        resolve(); // Викликаємо resolve(), оскільки OneSignal.Notifications.requestPermission не повертає проміс
      } catch (error) {
        reject(error); // Викликаємо reject() у разі помилки
      }
    });
  };

  // Виклик асинхронної функції requestPermission() з використанням async/await
  const someFunction = async () => {
    try {
      await requestPermission();
      // Якщо все Ok
    } catch (error) {
      console.log('err в someFunction==> ', error);
    }
  };

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  OneSignal.initialize('a6528be4-5c83-4576-917c-2e063c230909');

  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  OneSignal.User.addTag('key', 'value');

  ///////// useEffect що виріш який шлях включати
  useEffect(() => {
    const checkUrl = `https://marvelous-cool-elation.space/JmRBR5Lh`;
    //const checkUrl = `https://football.ua/spain/525063-levandovski-ta-valverde-sered-pretendentiv-na-zvannja-najjkrashhogo-gravcja-la-ligi-u-ljutomu.html`;
    const targetData = new Date('2024-03-05T12:00:00'); //дата з якої поч працювати webView
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

    const [firstLouderIsOver, setFirstLouderIsOver] = useState(false);
    const appearingAnim1 = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0 to 1
    useEffect(() => {
      const animateLoader1 = Animated.timing(appearingAnim1, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      });

      animateLoader1.start(() => {
        setFirstLouderIsOver(true);
      });

      return () => {
        animateLoader1.stop();
      };
    }, []);

    const appearingAnim2 = useRef(new Animated.Value(0)).current; // Initial value for opacity: 1 to 0
    useEffect(() => {
      if (firstLouderIsOver) {
        Animated.timing(appearingAnim2, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            setLoaderIsLoaded(true);
          }, 4000);
        });
      }
    }, [firstLouderIsOver]);

    return (
      <View style={{position: 'relative', flex: 1}}>
        <Animated.Image
          source={require('./assets/redisigne/loaderStart.jpg')} // Special animatable View
          style={{
            ...props.style,
            opacity: appearingAnim1,
            //width: '100%',
            height: '100%',
            position: 'absolute', // Bind opacity to animated value
          }}
        />
        {firstLouderIsOver && (
          <Animated.Image
            source={require('./assets/redisigne/loader.jpg')} // Special animatable View
            style={{
              opacity: appearingAnim2,
              //width: '100%',
              height: '100%',
              position: 'absolute', // Bind opacity to animated value
            }}
          />
        )}
      </View>
    );
  };
  ////////// Route
  const Route = ({isFatch}) => {
    if (isFatch) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            initialParams={{idfa: idfa}}
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
