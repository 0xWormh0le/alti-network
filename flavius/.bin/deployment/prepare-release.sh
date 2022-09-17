#!/bin/bash
set -e
update_type=$1

if [ -z "$1" ]
  then echo "Follow this command with an argument of either 'major' or 'minor' to override default patch update" && update_type="patch";
fi

echo "Preparing to create a $update_type release for Flavius..."
git checkout -f develop
git pull

version=$(npm --no-git-tag-version version $update_type)
currentRc=$(git branch -a --sort=committerdate | grep "release-${version:1}" | tail -n 1 | awk -F'rc' '{print $2;}')
[ -z "$currentRc" ] && currentRc=0
newRc=$((currentRc+1))
release_branch="release-${version:1}-rc${newRc}"
echo "Creating release branch: $release_branch from develop..."

git checkout -b $release_branch
echo "Incremented version to $version, committing change"
git add package.json package-lock.json
git commit -m "Version updated to $version"
git push -u origin $release_branch
echo "Pushed updated release branch to remote origin. Creating pull request to master..."

# Requires GitHub CLI, see: https://github.com/cli/cli
gh pr create -B develop --title "Release ${version}" --body "Release ${version}"
echo "Pull request to develop created successfully, release is ready and can be tested at https://app-staging.altitudenetworks.com once CI has finished the deployment"

echo "To deploy ${version} to prod, publish release ${version} here: https://github.com/altitudenetworks/flavius/releases"
echo "Or use GitHub CLI: gh release create ${version} --target release-${version}"
