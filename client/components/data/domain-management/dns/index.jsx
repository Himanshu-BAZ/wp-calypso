/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import StoreConnection from 'client/components/data/store-connection';
import DnsStore from 'client/lib/domains/dns/store';
import DomainsStore from 'client/lib/domains/store';
import upgradesActions from 'client/lib/upgrades/actions';
import { getSelectedSite } from 'client/state/ui/selectors';

const stores = [ DomainsStore, DnsStore ];

function getStateFromStores( props ) {
	let domains;

	if ( props.selectedSite ) {
		domains = DomainsStore.getBySite( props.selectedSite.ID );
	}

	return {
		domains,
		dns: DnsStore.getByDomainName( props.selectedDomainName ),
		selectedDomainName: props.selectedDomainName,
		selectedSite: props.selectedSite,
	};
}

export class DnsData extends Component {
	static propTypes = {
		component: PropTypes.func.isRequired,
		selectedDomainName: PropTypes.string.isRequired,
		selectedSite: PropTypes.object,
	};

	constructor( props ) {
		super( props );

		this.loadDns();
	}

	componentWillUpdate() {
		this.loadDns();
	}

	loadDns = () => {
		upgradesActions.fetchDomains( this.props.selectedSite.ID );
		upgradesActions.fetchDns( this.props.selectedDomainName );
	};

	render() {
		return (
			<StoreConnection
				component={ this.props.component }
				stores={ stores }
				getStateFromStores={ getStateFromStores }
				selectedDomainName={ this.props.selectedDomainName }
				selectedSite={ this.props.selectedSite }
			/>
		);
	}
}

const mapStateToProps = state => ( {
	selectedSite: getSelectedSite( state ),
} );

export default connect( mapStateToProps )( DnsData );
