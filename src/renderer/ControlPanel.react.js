import React from 'react';

export default class ControlPanelComponent extends React.Component {
	static propTypes = {
		isVisible: React.PropTypes.bool,
		onPause: React.PropTypes.func,
		onSearch: React.PropTypes.func,
		onPrev: React.PropTypes.func,
		onNext: React.PropTypes.func,
	};

	constructor (props) {
		super(props);

		this.state = {
			isSearchOpen: false,
		};

		this._searchInputNode = null;

		this._handleSearch = this._handleSearch.bind(this);
	}

	_setSearchState (state) {
		this.setState({ isSearchOpen: state });
	}

	_handleSearch () {
		this._setSearchState(false);

		this.props.onSearch(this._searchInputNode.value);
	}

	_renderButtons () {
		if (this.state.isSearchOpen) {
			return [
				<input
					ref={(node) => this._searchInputNode = node }
					key="search"
					pattern="[A-Za-z]+"
					type="text"
				/>,
				<button
					onClick={this._handleSearch}
					key="okBtn"
					className="button"
				>
					Ok
				</button>
			];
		}
		else {
			return [
				<button
					onClick={() => this._setSearchState(true)}
					key="findBtn"
					className="button"
				>
					F
				</button>,
				<button key="prevBtn" className="button">{'<'}</button>,
				<button key="nextBtn" className="button">></button>,
				<button key="likeBtn" className="button">✩</button>,
			];
		}
	}

	render () {
		const buttons = this._renderButtons();

		return (
			<div className="control-panel">
				{ buttons }
			</div>
		);
	}
}
