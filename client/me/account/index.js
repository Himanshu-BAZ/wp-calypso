/** @format */

/**
 * External dependencies
 */

import page from 'page';

/**
 * Internal dependencies
 */
import meController from 'client/me/controller';
import controller from './controller';

export default function() {
	page( '/me/account', meController.sidebar, controller.account );
}
