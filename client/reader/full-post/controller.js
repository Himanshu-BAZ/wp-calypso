/** @format */
/**
 * External Dependencies
 */
import React from 'react';
import page from 'page';
import { defer } from 'lodash';

/**
 * Internal Dependencies
 */
import { trackPageLoad } from 'client/reader/controller-helper';
import AsyncLoad from 'client/components/async-load';
import { renderWithReduxStore } from 'client/lib/react-helpers';

const analyticsPageTitle = 'Reader';

const scrollTopIfNoHash = () =>
	defer( () => {
		if ( typeof window !== 'undefined' && ! window.location.hash ) {
			window.scrollTo( 0, 0 );
		}
	} );

export function blogPost( context ) {
	const blogId = context.params.blog,
		postId = context.params.post,
		basePath = '/read/blogs/:blog_id/posts/:post_id',
		fullPageTitle = analyticsPageTitle + ' > Blog Post > ' + blogId + ' > ' + postId;

	let referral;
	if ( context.query.ref_blog && context.query.ref_post ) {
		referral = { blogId: context.query.ref_blog, postId: context.query.ref_post };
	}
	trackPageLoad( basePath, fullPageTitle, 'full_post' );

	renderWithReduxStore(
		<AsyncLoad
			require="blocks/reader-full-post"
			blogId={ blogId }
			postId={ postId }
			referral={ referral }
			referralStream={ context.lastRoute }
			onClose={ function() {
				page.back( context.lastRoute || '/' );
			} }
		/>,
		document.getElementById( 'primary' ),
		context.store
	);
	scrollTopIfNoHash();
}

export function feedPost( context ) {
	const feedId = context.params.feed,
		postId = context.params.post,
		basePath = '/read/feeds/:feed_id/posts/:feed_item_id',
		fullPageTitle = analyticsPageTitle + ' > Feed Post > ' + feedId + ' > ' + postId;

	trackPageLoad( basePath, fullPageTitle, 'full_post' );

	function closer() {
		page.back( context.lastRoute || '/' );
	}

	renderWithReduxStore(
		<AsyncLoad
			require="blocks/reader-full-post"
			feedId={ feedId }
			postId={ postId }
			onClose={ closer }
			referralStream={ context.lastRoute }
		/>,
		document.getElementById( 'primary' ),
		context.store
	);
	scrollTopIfNoHash();
}
