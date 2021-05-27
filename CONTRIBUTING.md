# Workflow

The `develop` branch is the development branch which means it contains the next version to be released.  `stable` contains the current latest release and `master` contains the corresponding stable development version.  Always work on the `develop` branch and open up PRs against `develop`.

## Release instructions

1. Branch: Starting from `develop`, cut a release branch named `release/X.Y.Z` for your changes.
1. Version bump: Bump the version number in `ever-blocks.php` and `readme.txt` if it does not already reflect the version being released.
1. Changelog: Add/update the changelog in both `readme.txt` and `CHANGELOG.md`.
1. Props: Update `CREDITS.md` file with any new contributors, confirm maintainers are accurate.
1. Readme updates: Make any other readme changes as necessary.  `README.md` is geared toward GitHub and `readme.txt` contains WordPress.org-specific content.  The two are slightly different.
1. New files: Check to be sure any new files/paths that are unnecessary in the production version are included in `.gitattributes`.
1. Merge: Make a non-fast-forward merge from your release branch to `develop` (or merge the pull request), then do the same for `develop` into `trunk` (`git checkout trunk && git merge --no-ff develop`).  `trunk` contains the stable development version.
1. Test: While still on the `trunk` branch, test for functionality locally.
1. Push: Push your `trunk` branch to GitHub (e.g. `git push origin trunk`).
1. Release: Create a [new release](/releases/new), naming the tag and the release with the new version number, and targeting the `trunk` branch.  Paste the changelog from `CHANGELOG.md` into the body of the release and include a link to the closed issues on the milestone.
1. SVN: Wait for the [GitHub Action](/actions?query=workflow%3A%22Deploy+to+WordPress.org%22) to finish deploying to the WordPress.org repository.  If all goes well, users with SVN commit access for that plugin will receive an emailed diff of changes.
1. Check WordPress.org: Ensure that the changes are live on [https://wordpress.org/plugins/ever-blocks/](https://wordpress.org/plugins/ever-blocks/).  This may take a few minutes.
1. Close milestone: Edit the [X.Y.Z milestone](/milestone/#) with release date (in the `Due date (optional)` field) and link to GitHub release (in the `Description` field), then close the milestone.
1. Punt incomplete items: If any open issues or PRs which were milestoned for `X.Y.Z` do not make it into the release, update their milestone to `X.Y.Z+1`, `X.Y+1.0`, `X+1.0.0` or `Future Release`.
