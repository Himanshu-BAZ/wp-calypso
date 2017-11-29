/** @format */
/**
 * External Dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import SectionNav from 'client/components/section-nav';
import NavItem from 'client/components/section-nav/item';
import NavTabs from 'client/components/section-nav/tabs';
import Intervals from './intervals';
import FollowersCount from 'client/blocks/followers-count';
import { isPluginActive, isSiteAutomatedTransfer } from 'client/state/selectors';
import { isJetpackSite } from 'client/state/sites/selectors';
import { navItems, intervals as intervalConstants } from './constants';
import { getJetpackSites } from 'client/state/selectors';
import QueryJetpackPlugins from 'client/components/data/query-jetpack-plugins';
import config from 'config';

class StatsNavigation extends Component {
	static propTypes = {
		interval: PropTypes.oneOf( intervalConstants.map( i => i.value ) ),
		isJetpack: PropTypes.bool,
		isStore: PropTypes.bool,
		jetPackSites: PropTypes.array,
		selectedItem: PropTypes.oneOf( Object.keys( navItems ) ).isRequired,
		siteId: PropTypes.number,
		slug: PropTypes.string,
	};

	isValidItem = item => {
		const { isStore, isAtomic, isJetpack } = this.props;
		switch ( item ) {
			case 'activity':
				return config.isEnabled( 'jetpack/activity-log' ) && isJetpack && ! isAtomic;
			case 'store':
				return isStore;
			default:
				return true;
		}
	};

	render() {
		const { isJetpack, slug, selectedItem, interval, jetPackSites } = this.props;
		const { label, showIntervals, path } = navItems[ selectedItem ];
		const slugPath = slug ? `/${ slug }` : '';
		const pathTemplate = `${ path }/{{ interval }}${ slugPath }`;
		return (
			<div className="stats-navigation">
				<SectionNav selectedText={ label }>
					{ isJetpack && <QueryJetpackPlugins siteIds={ jetPackSites.map( site => site.ID ) } /> }
					<NavTabs label={ 'Stats' } selectedText={ label }>
						{ Object.keys( navItems )
							.filter( this.isValidItem )
							.map( item => {
								const navItem = navItems[ item ];
								const intervalPath = navItem.showIntervals ? `/${ interval || 'day' }` : '';
								const itemPath = `${ navItem.path }${ intervalPath }${ slugPath }`;
								return (
									<NavItem key={ item } path={ itemPath } selected={ selectedItem === item }>
										{ navItem.label }
									</NavItem>
								);
							} ) }
					</NavTabs>
					{ showIntervals && <Intervals selected={ interval } pathTemplate={ pathTemplate } /> }
					<FollowersCount />
				</SectionNav>
				{ showIntervals && (
					<Intervals selected={ interval } pathTemplate={ pathTemplate } standalone />
				) }
			</div>
		);
	}
}

export default connect( ( state, { siteId } ) => {
	const isJetpack = isJetpackSite( state, siteId );
	return {
		isJetpack,
		jetPackSites: getJetpackSites( state ),
		isAtomic: isSiteAutomatedTransfer( state, siteId ),
		isStore: isJetpack && isPluginActive( state, siteId, 'woocommerce' ),
		siteId,
	};
} )( StatsNavigation );
