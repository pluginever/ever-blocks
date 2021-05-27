#!/bin/bash

set -eou pipefail

# IMPORTANT: while secrets are encrypted and not viewable in the GitHub UI,
# they are by necessity provided as plaintext in the context of the Action,
# so do not echo or use debug mode unless you want your secrets exposed!
if [[ -z "$GITHUB_TOKEN" ]]; then
	echo "Set the GITHUB_TOKEN env variable"
	exit 1
fi

TMP="/github/tmp"
mkdir $TMP

# I think we are already here but just in case
cd "$GITHUB_WORKSPACE"

echo "ℹ︎ Configuring git"
git config --global user.email "byteeverbot+github@byteever.com"
git config --global user.name "byteeverbot on GitHub"

git remote set-url origin "https://x-access-token:$GITHUB_TOKEN@github.com/$GITHUB_REPOSITORY.git"

