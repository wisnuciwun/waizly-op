import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { rootReducer } from './reducer';
import { configureStore } from '@reduxjs/toolkit';
import storage from '@/utils/storage';

// const persistConfig = {
//   key: 'root',
//   storage: storage
// };



// const encryptionKey ='qwerty123456zxcvbnmasdfghjkl';

// const encryptor = createTransform(
//   // transform state on its way to being serialized and persisted
//   (inboundState) => {
//     const encryptedState = CryptoJS.AES.encrypt(
//       JSON.stringify(inboundState),
//       encryptionKey
//     ).toString();
//     return encryptedState;
//   },
//   // transform state being rehydrated
//   (outboundState) => {
//     const bytes = CryptoJS.AES.decrypt(outboundState, encryptionKey);
//     const decryptedState = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//     return decryptedState;
//   },
//   // { whitelist: ['auth'] } // Only encrypt specific reducers
// );
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth', 'register', 'product'],
  blacklist: [],
  // transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);
export { persistor, store };
