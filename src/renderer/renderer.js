import * as React from 'react';
import * as ReactDOM from 'react-dom';

import HomeScreen from './HomeScreen.react';

class App extends React.Component {
	render () {
		return (
			<div className="app-wrapper">
				<HomeScreen />
			</div>
		);

	}
}

// Prvotni bootstrap
const loadingBoxElement = document.getElementById('loading-box');

loadingBoxElement.parentNode.removeChild(loadingBoxElement);

require('devtron').install();

ReactDOM.render(
	<App />,
	document.getElementById('react-root')
);
