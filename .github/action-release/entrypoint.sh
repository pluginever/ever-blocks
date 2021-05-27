#!/usr/bin/env bash

set -eou pipefail

# IMPORTANT: while secrets are encrypted and not viewable in the GitHub UI,
# they are by necessity provided as plaintext in the context of the Action,
# so do not echo or use debug mode unless you want your secrets exposed!
if [[ -z "$GITHUB_TOKEN" ]]; then
	echo "Set the GITHUB_TOKEN env variable"
	exit 1
fi

echo "HELLO WORLD"

