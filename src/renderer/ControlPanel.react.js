import React from 'react';
import classNames from 'classnames';

export default class ControlPanelComponent extends React.Component {
	static propTypes = {
		onPin: React.PropTypes.func,
		onSearch: React.PropTypes.func,
		onPrev: React.PropTypes.func,
		onNext: React.PropTypes.func,
	};

	constructor (props) {
		super(props);

		this.state = {
			isSearchOpen: false,
			windowIsPinned: false,
		};

		this._searchInputNode = null;

		this._handleSearch = this._handleSearch.bind(this);
		this._handlePinToggle = this._handlePinToggle.bind(this);
	}

	_setSearchState (state) {
		this.setState({ isSearchOpen: state });
	}

	_handleSearch () {
		this._setSearchState(false);

		this.props.onSearch(this._searchInputNode.value);
	}

	_handlePinToggle () {
		this.setState(
			{ windowIsPinned: !this.state.windowIsPinned },
			() => { this._searchInputNode.focus() }
		);

		this.props.onPin(!this.state.windowIsPinned);
	}

	_renderButtons () {
		if (this.state.isSearchOpen) {
			return [
				<input
					ref={(node) => this._searchInputNode = node }
					key="search"
					maxLength="50"
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
				<button
					key="likeBtn"
					onClick={this._handlePinToggle}
					className={classNames('button', { active: this.state.windowIsPinned })}
				>
					P
				</button>,
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
