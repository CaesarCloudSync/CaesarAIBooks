import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
/*import {
  Formats,
  CustomThemes,
  InitialLocation,
  Search,
  OpenExternalLink,
  Annotations,
  Bookmarks,
  FullExample,
  TableOfContents,
  JavascriptInjection,
  Spreads,
  ScrolledDoc,
  ContinuousSpreads,
  ContinuousScrolled,
  WithSlider,
} from 'Ba';
import { Basic } from './Basic';
import { Formats } from './Formats';
import { CustomThemes } from './CustomThemes';
import { InitialLocation } from './InitialLocation';
import { Search } from './Search';
import { OpenExternalLink } from './OpenExternalLink';
import { Annotations } from './Annotations';
import { Bookmarks } from './Bookmarks';
implements */
import { Image } from 'expo-image';

import { FullExample } from './FullExample';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
const { Navigator, Screen } = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    width: '90%',
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 2,
  },
});



function Examples() {
  const isFocused = useIsFocused();
  const [books,setBooks] = React.useState([]);
  const getloadedbooks =async () => {
    let keys = await AsyncStorage.getAllKeys()
    const booksitems:any = await AsyncStorage.multiGet(keys.filter((key) =>{return(key.includes(`books:`))}))
    const bookitems = booksitems.map((item:any) =>{return(JSON.parse(item[1]))})
    console.log(bookitems[0])
    //await AsyncStorage.multiRemove(keys.filter((key) =>{return(key.includes(`books:`))}))
    setBooks(bookitems)
   
  }
  React.useEffect(() =>{
    if (isFocused){
      getloadedbooks()
    }
  },[isFocused])

  const { navigate }:any = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        ...styles.container,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      showsVerticalScrollIndicator={false}
    >
      {books.map(({ title,cover,description, bookurl }) => (
        <TouchableOpacity
          style={styles.button}
          key={title}
          onPress={() => navigate("book",{"bookurl":"https://s3.amazonaws.com/moby-dick/OPS/package.opf"})}
        >
        <View style={{flex:1,flexDirection:"row"}}>
        <Image
        style={ {
            height:100,
            width: 100,
            backgroundColor: '#0553',
            borderRadius:10
          }}
        source={cover}
        //placeholder={{ blurhash }}
     

      />
         <View style={{justifyContent:"center"
        }}>
         <Text>{title}</Text>
          <Text>{description}</Text>
         </View>
          </View>

          
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() =>{ navigate("book",{"bookurl":"https://s3.amazonaws.com/moby-dick/OPS/package.opf"})}}>
        <Text>Add Book</Text></TouchableOpacity>
    </ScrollView>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <PaperProvider
      theme={colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          <Navigator initialRouteName="CaesarAIBooks">
            <Screen
              name="CaesarAIBooks"
              options={{ title: 'CaesarAIBooks' }}
              component={Examples}
            />

            {[{"title":"book"}].map(({ title}) => (
              <Screen
                key={title}
                name={title}
                options={{
                  title,
                  headerShown: ![
                    'book',
                  ].includes("book"),
                }}
                component={FullExample}
              
                
              />
            ))}
          </Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}