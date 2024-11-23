import {NativeModules} from 'react-native';
import {store} from '../store';
import {makePutRequest} from './axiosHelper';
import {formatLocation, getNewCurrentPosition} from './locationHelper';

const {JSToNativeExecutionModule} = NativeModules;

let timer = false;

export const startBackgroundService = async () => {
  try {
    JSToNativeExecutionModule.startBackgroundTask('bar');
  } catch (e) {
    console.error(e);
  }
};

export const stopBackgroundService = async () => {
  console.log('Background Task Stopped', new Date().toLocaleDateString());
  clearInterval(timer);
  timer = null;
};

// export const backgroundTask = async taskData => {
//   return new Promise((resolve, reject) => {
//     const trigger = () => {
//       try {
//         const tracker = store?.getState()?.session?.tracker;
//         if (tracker?._id) {
//           getCurrentPosition({
//             onSuccess: async position => {
//               const location = formatLocation(position);
//               console.log('Location: ', location);
//               if (!location) {
//                 return;
//               }
//               await makePutRequest(`/tracker/log/${tracker._id}`, {
//                 location: location,
//               });
//               console.log('Location sent');
//             },
//             onError: error => {
//               Alert.alert('Error', JSON.stringify(error));
//             },
//           });
//         } else {
//           clearInterval(timer);
//           resolve();
//         }
//       } catch (error) {
//         catchError(error);
//       }
//     };
//     timer = setInterval(() => {
//       trigger();
//       if (!timer) {
//         resolve();
//       }
//     }, Config.POLLING_INTERVAL);
//     trigger();
//   });
// };

export const payload = {
  id: '67413e761618be800b7ef5da',
  location: {
    accuracy: 5,
    altitude: 0,
    heading: 0,
    latitude: 26.632906666666667,
    longitude: 93.60332333333334,
    speed: 0,
  },
};

export const backgroundTask = async taskData => {
  console.log('Background Task Started', new Date().toLocaleDateString());
  return new Promise((resolve, reject) => {
    const trigger = async () => {
      console.log('Background Task Triggered', new Date().toLocaleDateString());
      const tracker = store?.getState()?.session?.tracker;
      console.log('Tracker: ', tracker?._id);
      if (tracker?._id) {
        console.log('inside');
        const location = await getNewCurrentPosition();
        console.log('getNewCurrentPosition Location: ', location);
        const formattedLocation = formatLocation(location);
        await makePutRequest(`/tracker/log/${tracker._id}`, {
          location: formattedLocation,
        });
        console.log('request completed, waiting for next trigger');
      }
      // await makePutRequest(`tracker/log/${payload.id}`, {
      //   location: payload.location,
      // });
      // console.log('request completed, waiting for next trigger');
    };
    timer = setInterval(() => {
      trigger();
      if (!timer) {
        resolve();
      }
    }, 10000);
    trigger();
  });
};
