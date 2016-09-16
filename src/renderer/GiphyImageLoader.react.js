import React from 'react';
import { remote } from 'electron';

import GiphyImage from './GiphyImage.react';
import ControlPanel from './ControlPanel.react';
import * as giphyService from './service/giphy';
import * as mainService from './service/main';

export default class GiphyImageLoaderComponent extends React.Component {
	static propTypes = {
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
			keyword: '',
			images: [],
			currentImage: null,
			offset: 0,
		};

		this._imageIterator = null;
		this._handleImageLoaded = this._handleImageLoaded.bind(this);
		this._handlePinToggle = this._handlePinToggle.bind(this);
		this._handleSearch = this._handleSearch.bind(this);
	}

	componentDidMount () {
		if (!this.state.keyword) {
			return;
		}

		this._fetchImagesFromOffset(0)
			.then((result) => {
				if (result.images.length) {
					const image = result.images[0];

					this.setState({
						images: result.images,
						currentImage: image,
					});

					giphyService.resizeWindowForImage(image.width, image.height);

					this._tryPreloadNextImage(0);
				}
			});
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
						currentImage: nextImage,
						offset: this.state.offset + 1,
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
		return giphyService
			.searchGifsByName(this.state.keyword, { offset, limit: this.props.cacheCount });
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

	_handlePinToggle (isPinned) {
		mainService.setAlwaysOnTop(isPinned);
	}

	_handleSearch (query) {
		this._stopImageIteration();
		this.setState(
			{ keyword: query },
			() => {
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
					});
			}
		);
	}

	render () {
		const controllPanel = (
			<ControlPanel
				key="controll-panel"
				keyword={this.state.keyword}
				hasImages={this.state.images.length !== 0}
				onSearch={this._handleSearch}
				onPin={this._handlePinToggle}
			/>
		);
		let content = [
			<img key="image" src="images/no_image.png" alt=""/>,
			controllPanel,
		];

		if (this.state.images.length) {
			content = [
				<GiphyImage
					key="image"
					url={this.state.currentImage.url}
					width={this.state.currentImage.width}
					height={this.state.currentImage.height}
					onImageLoaded={this._handleImageLoaded}
				/>,
				controllPanel
			];
		}

		return (
			<div className="giphy-loader">
				{ content }
			</div>
		);
	}
}
