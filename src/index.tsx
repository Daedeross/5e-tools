import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './app/store';
import MobCalculator from './features/mob/mob-calculator';
import { useAppDispatch } from './app/hooks';
import { monstersActions } from './features/monster/monster-slice';

// Importing the Bootstrap CSS
import './scss/styles.scss';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

function App() {
    const dispatch = useAppDispatch();
    dispatch(dispatch(monstersActions.createNewMonster()));

    return (
        <MobCalculator />
    );
}

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

// export const pushUpdate = updateState ;

// if(process.env.NODE_ENV == 'development') {
//     setTimeout(() => {
//         updateState(testCharacter as CharacterDto);
//     }, 100);
// }
