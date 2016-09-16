import React from 'react';

import GiphyImage from './GiphyImage.react';
import * as giphyService from './service/giphy';

export default class GiphyImageLoaderComponent extends React.Component {
	static propTypes = {
		keyword: React.PropTypes.string.isRequired,
		rotationSpeed: React.PropTypes.number,
		cacheCount: React.PropTypes.number,
		cacheMaxHit: React.PropTypes.number,
	};

	static defaultProps = {
		rotationSpeed: 15 * 1000, // 15 sec,
		cacheCount: 50,
		cacheMaxHit: 40,
	};

	constructor (props) {
		super(props);

		this.state = {
			images: [],
			currentImage: null,
			offset: 0,
		};

		this._imageIterator = null;
		this._handleImageLoaded = this._handleImageLoaded.bind(this);
	}

	componentDidMount () {
		this._fetchImagesFromOffset(0)
			.then((result) => {
				if (result.images.length) {
					const image = result.images[0];

					this.setState({
						images: result.images,
						currentImage: image,
						offset: this.props.cacheCount,
					});

					giphyService.resizeWindowForImage(image.width, image.height);

					this._tryPreloadNextImage(0);
				}
			})
	}

	_startImageIteration () {
		this._imageIterator = setTimeout(() => {
			const currentImageIndex = this.state.images
				.findIndex((image) => image === this.state.currentImage);

			if (currentImageIndex === this.state.images.length - 1) {
				this._stopImageIteration();
			}
			else {
				const nextImage = this.state.images[currentImageIndex + 1];

				if (nextImage) {
					giphyService.resizeWindowForImage(nextImage.width, nextImage.height);

					this.setState({
						currentImage: nextImage
					});
				}

				this._tryPreloadNextImage(currentImageIndex);
				//TODO(honza): Dodelat nacteni dalsich obrazku pri vycerpani cache

			}

		}, this.props.rotationSpeed);
	}

	_stopImageIteration () {
		clearTimeout(this._imageIterator);
	}

	_fetchImagesFromOffset (offset) {
		const { keyword } = this.props;

		return giphyService.searchGifsByName(keyword, { offset, limit: this.props.cacheCount });
	}

	_preloadImageUrl (url) {
		const image = new Image();

		image.src = url;
	}

	_tryPreloadNextImage (currentImageIndex) {
		const nextImage = this.state.images[currentImageIndex + 1];

		if (nextImage) {
			this._preloadImageUrl(nextImage.url);
		}
	}

	_handleImageLoaded () {
		this._startImageIteration();
	}

	render () {
		return (
			<div>
				{
					this.state.images.length ?
						<GiphyImage
							url={this.state.currentImage.url}
							width={this.state.currentImage.width}
							height={this.state.currentImage.height}
							onImageLoaded={this._handleImageLoaded}
						/> :
						'No image loaded'
				}
			</div>

		);
	}
}
