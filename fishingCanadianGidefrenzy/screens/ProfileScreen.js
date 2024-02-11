import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  ScrollView,
  TextInput,
  SafeAreaViews,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {uid} from 'uid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({navigation}) => {
  const [sideBarIsVisible, setSideBarIsVisible] = useState(false);
  const [selectPhoto, setSelectPhoto] = useState(null);
  const [nameModal, setNameModal] = useState(false);
  const [fishingPlaceModal, setFishingPlaceModal] = useState(false);
  const [nameInModal, setNameInModal] = useState('');
  const [name, setName] = useState('');
  //console.log('nameLang==>', name.length)
  const [fishingPlace, setFishingPlace] = useState([]);
  //console.log('fishingPlace==>', fishingPlace)
  const [place, setPlace] = useState('');
  const [fidback, setFidback] = useState('');
  const [selected, setSelected] = useState('');

  {
    /** */
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setData();
  }, [name, selectPhoto, fishingPlace]);

  const setData = async () => {
    try {
      const data = {
        selectPhoto,
        name,
        fishingPlace,
      };
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(`ProfileScreen`, jsonData);
      console.log('Дані збережено в AsyncStorage');
    } catch (e) {
      console.log('Помилка збереження даних:', e);
    }
  };

  const getData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem(`ProfileScreen`);
      if (jsonData !== null) {
        const parsedData = JSON.parse(jsonData);
        console.log('parsedData==>', parsedData);
        setSelectPhoto(parsedData.selectPhoto);
        setName(parsedData.name);
        setFishingPlace(parsedData.fishingPlace);
      }
    } catch (e) {
      console.log('Помилка отримання даних:', e);
    }
  };

  const ImagePicer = () => {
    let options = {
      storageOptios: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      if (!response.didCancel) {
        //console.log('response==>', response.assets[0].uri);
        setSelectPhoto(response.assets[0].uri);
      } else {
        console.log('Вибір скасовано');
      }
    });
  };

  const handleAddName = () => {
    setName(nameInModal);
    setNameInModal('');
    setNameModal(false);
  };

  const handleAddDataAboutFishingPlace = () => {
    let newFishingPlace = {
      place,
      fidback,
      selected,
    };
    setFishingPlace([newFishingPlace, ...fishingPlace]);

    CloseFishinngPleseModal();
  };

  const CloseFishinngPleseModal = () => {
    setPlace('');
    setFidback('');

    setFishingPlaceModal(false);
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/redisigne/bgr.jpg')}>
        <SafeAreaView style={{flex: 1, position: 'relative'}}>
          <View style={{marginHorizontal: 10, marginTop: 10}}>
            {/**AVATAR */}
            <View style={{alignItems: 'center'}}>
              <Image
                style={{width: 100, height: 70}}
                source={require('../assets/redisigne/hhh.png')}
              />

              {!selectPhoto ? (
                <TouchableOpacity
                  onPress={() => {
                    ImagePicer();
                  }}
                  style={{
                    width: 250,
                    height: 250,
                    backgroundColor: 'rgba(128, 128, 128, 0.5)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 150,
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 38, fontWeight: '600'}}>
                    TAB FOR
                  </Text>
                  <Text
                    style={{color: '#fff', fontSize: 38, fontWeight: '600'}}>
                    ADD PHOTO
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    ImagePicer();
                  }}>
                  <Image
                    source={{uri: selectPhoto}}
                    style={{
                      width: 250,
                      height: 250,
                      backgroundColor: 'rgba(128, 128, 128, 0.5)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 150,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/**NAME AND BUTTONS*/}

            <View style={{alignItems: 'center'}}>
              {name.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    setNameModal(true);
                  }}>
                  <Text style={{fontSize: 30, fontWeight: '600'}}>{name}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setNameModal(true);
                  }}>
                  <Text style={{fontSize: 30, fontWeight: '600'}}>
                    My name is...
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  setFishingPlaceModal(true);
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowOffset: {width: 3, height: 4},
                  shadowOpacity: 0.8,
                  elevation: 9,
                  marginTop: 5,
                  marginBottom: 15,
                  paddingLeft: 10,
                  fontSize: 20,
                  borderWidth: 1,
                  borderColor: '#fff',
                  color: '#000',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 10,
                  width: 250,
                  height: 40,
                }}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                  Add fishing place
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {fishingPlace.map(i => {
                return (
                  <View
                    style={{
                      shadowOffset: {width: 3, height: 4},
                      shadowOpacity: 0.8,
                      elevation: 9,
                      marginBottom: 10,
                      paddingLeft: 10,
                      borderWidth: 1,
                      borderColor: '#fff',
                      color: '#000',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: 10,
                      width: '100%',
                    }}
                    key={uid()}>
                    <Text style={{color: '#fff'}}>{i.selected}</Text>
                    <Text style={{color: 'green', fontWeight: 'bold'}}>
                      {i.place}
                    </Text>
                    <Text style={{color: '#fff'}}>{i.fidback}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/**BTN  SIDEBAR*/}
          <TouchableOpacity
            onPress={() => setSideBarIsVisible(true)}
            style={{
              borderWidth: 1,
              borderColor: '#fff',
              position: 'absolute',
              top: 40,
              left: 15,
              width: 60,
              height: 60,
              backgroundColor: 'rgba(128, 128, 128, 0.5)',
              borderRadius: 20,
            }}>
            <AntDesign name="bars" style={{color: '#fff', fontSize: 50}} />
          </TouchableOpacity>

          {/**BTN  goBack*/}
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              borderWidth: 1,
              borderColor: '#fff',
              position: 'absolute',
              bottom: 15,
              right: 15,
              width: 60,
              height: 60,
              backgroundColor: 'rgba(128, 128, 128, 0.5)',
              borderRadius: 20,
            }}>
            <Entypo name="reply" style={{fontSize: 50, color: '#fff'}} />
          </TouchableOpacity>

          {/**SIDEBAR */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={sideBarIsVisible}>
            <View
              style={{
                backgroundColor: '#0f8ab4',
                flex: 1,
                marginRight: '30%',
                borderRightColor: '#fff',
                borderWidth: 1,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}>
              {/**BTN route block */}
              <View style={{marginTop: 70, marginLeft: 20}}>
                {/**BTN SideBar Close */}
                <TouchableOpacity
                  onPress={() => {
                    setSideBarIsVisible(false);
                  }}
                  style={{marginBottom: 10}}>
                  <Text style={{color: '#fff', fontSize: 40}}>X</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('HomeScreen'),
                      setSideBarIsVisible(false);
                  }}
                  style={{marginBottom: 10}}>
                  <Text style={{color: '#fff', fontSize: 30}}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('FishingPlaceScreen'),
                      setSideBarIsVisible(false);
                  }}
                  style={{marginBottom: 10}}>
                  <Text style={{color: '#fff', fontSize: 30}}>Location</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ProfileScreen'),
                      setSideBarIsVisible(false);
                  }}
                  style={{marginBottom: 10}}>
                  <Text style={{color: '#fff', fontSize: 30}}>Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/**Modal Name */}
          <Modal animationType="fade" transparent={true} visible={nameModal}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0f8ab4',
                flex: 1,
                marginRight: '10%',
                marginLeft: '10%',
                marginTop: '50%',
                marginBottom: '50%',
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 1,
              }}>
              {/**BTN SideBar Close */}
              <TouchableOpacity
                onPress={() => {
                  setNameModal(false);
                }}
                style={{position: 'absolute', top: 20, left: 10}}>
                <Text style={{color: '#fff', fontSize: 30}}>X</Text>
              </TouchableOpacity>

              <TextInput
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                placeholder="Communittie..."
                value={nameInModal}
                onChangeText={setNameInModal}
                style={{
                  shadowOffset: {width: 3, height: 4},
                  shadowOpacity: 0.8,
                  elevation: 9,
                  marginTop: 5,
                  marginBottom: 15,
                  paddingLeft: 10,
                  fontSize: 20,
                  borderWidth: 1,
                  borderColor: '#fff',
                  color: '#000',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 10,
                  width: 250,
                  height: 40,
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  handleAddName();
                }}
                style={{
                  shadowOffset: {width: 3, height: 4},
                  shadowOpacity: 0.8,
                  elevation: 9,
                  marginTop: 5,
                  marginBottom: 15,
                  paddingLeft: 10,
                  fontSize: 20,
                  borderWidth: 1,
                  borderColor: '#fff',
                  color: '#000',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 10,
                  width: 100,
                  height: 40,
                }}>
                <Text style={{color: '#fff', fontSize: 30}}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/**Modal Fishinng place */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={fishingPlaceModal}>
            <View
              style={{
                alignItems: 'center',
                paddingTop: 40,
                backgroundColor: '#0f8ab4',
                flex: 1,
                marginRight: '5%',
                marginLeft: '5%',
                marginTop: '10%',
                marginBottom: '10%',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#fff',
              }}>
              {/**BTN SideBar Close */}
              <TouchableOpacity
                onPress={() => {
                  CloseFishinngPleseModal();
                }}
                style={{position: 'absolute', top: 20, left: 10}}>
                <Text style={{color: '#fff', fontSize: 30}}>X</Text>
              </TouchableOpacity>

              <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <ScrollView style={{marginBottom: 50}}>
                    <View>
                      <Calendar
                        onDayPress={day => {
                          setSelected(day.dateString);
                        }}
                        markedDates={{
                          [selected]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedDotColor: 'orange',
                          },
                        }}
                      />

                      <TextInput
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        placeholder="Fishing place..."
                        value={place}
                        onChangeText={setPlace}
                        style={{
                          shadowOffset: {width: 3, height: 4},
                          shadowOpacity: 0.8,
                          elevation: 9,
                          marginTop: 20,
                          marginBottom: 15,
                          paddingLeft: 10,
                          fontSize: 20,
                          borderWidth: 1,
                          borderColor: '#fff',
                          color: '#000',
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: 10,
                          width: 250,
                          height: 40,
                        }}
                      />

                      <TextInput
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        placeholder="My feedback..."
                        multiline={true}
                        value={fidback}
                        onChangeText={setFidback}
                        style={{
                          shadowOffset: {width: 3, height: 4},
                          shadowOpacity: 0.8,
                          elevation: 9,
                          marginTop: 5,
                          marginBottom: 15,
                          paddingLeft: 10,
                          fontSize: 20,
                          borderWidth: 1,
                          borderColor: '#fff',
                          color: '#000',
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: 10,
                          width: 250,
                          height: 80,
                        }}
                      />

                      <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                          onPress={() => {
                            handleAddDataAboutFishingPlace();
                          }}
                          style={{
                            shadowOffset: {width: 3, height: 4},
                            shadowOpacity: 0.8,
                            elevation: 9,
                            marginTop: 20,
                            marginBottom: 15,
                            paddingLeft: 10,
                            fontSize: 20,
                            borderWidth: 1,
                            borderColor: '#fff',
                            color: '#000',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: 10,
                            width: 100,
                            height: 40,
                          }}>
                          <Text style={{color: '#fff', fontSize: 30}}>
                            SAVE
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View>
          </Modal>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;
