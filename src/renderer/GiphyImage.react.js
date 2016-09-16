import React from 'react';

export default (props) => {
	return (
		<div className="giphy-image-wrapper">
			<img
				src={props.url}
				width={props.width}
				height={props.height}
				onLoad={props.onImageLoaded}
				alt=""
			/>
		</div>
	);
}
