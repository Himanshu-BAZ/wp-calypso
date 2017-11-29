/*
 * @format
 */

/**
 * Internal dependencies
 */
import { isDiscoverPost } from 'client/reader/discover/helper';
import { shouldShowComments } from 'client/blocks/comments/helper';
import config from 'config';

export function shouldShowConversationFollowButton( post ) {
	return (
		config.isEnabled( 'reader/conversations' ) &&
		post.site_ID &&
		! post.is_external &&
		shouldShowComments( post ) &&
		! isDiscoverPost( post )
	);
}
