import React from 'react';


import GiphyImageLoader from './GiphyImageLoader.react';


export default class HomeScreenComponent extends React.Component {

	render () {
		return (
			<div>
				<GiphyImageLoader keyword="crazy" />
			</div>
		);
	}
}
