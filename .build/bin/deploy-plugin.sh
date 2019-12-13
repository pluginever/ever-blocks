#! /bin/bash

## Checkout ever-blocks from WordPress.org
svn co "http://svn.wp-plugins.org/ever-blocks" $HOME/ever-blocks
#
## Clean /trunk/ and copy over plugin files
#rm -rf $HOME/svn/wp-plugins/ever-blocks/trunk/*
#cp -a build/ever-blocks/* $HOME/svn/wp-plugins/ever-blocks/trunk/
#
## Create the tag on the SVN repo and copy over plugin files
#svn cp $HOME/svn/wp-plugins/ever-blocks/trunk $HOME/svn/wp-plugins/ever-blocks/tags/${CIRCLE_TAG}
#svn commit -m "Tagging version ${CIRCLE_TAG}"
#
## Copy the WordPress.org assets over
#rm -rf $HOME/ever-blocks/assets/*
#cp -a .wordpress-org/* $HOME/svn/wp-plugins/ever-blocks/assets/
#
## Deploy ever-blocks to WordPress.org
#cd $HOME/svn/wp-plugins/ever-blocks
#svn add * --force
## Delete removed files
#svn status | grep '^!' | awk '{print $2}' | xargs svn delete
#svn ci --no-auth-cache --username ${WP_ORG_USERNAME} --password ${WP_ORG_PASSWORD} -m "Deploy new version of ever-blocks"

# Deploy a ever-blocks Github release
ghr -t ${GH_ACCESS_TOKEN} -u ${CIRCLE_PROJECT_USERNAME} -r ${CIRCLE_PROJECT_REPONAME} -c ${CIRCLE_SHA1} -delete ${CIRCLE_TAG} /tmp/artifacts
