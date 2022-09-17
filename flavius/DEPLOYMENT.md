# How to deploy

## Dev

Merging any PR to `develop` branch deploys `develop` branch to `dev` environment

```bash
git checkout develop
git pull
git checkout -b my-feature
# do stuff
git push

gh pr create -w
# merge PR
```

Merging the PR deploys `develop` branch to `dev`.

## Staging

Run command and follow instructions

```bash
VERSION="patch" # can be patch, minor, major or 1.2.3
bash .bin/deployment/prepare-release.sh $VERSION
```

## Production

Create a Release with base `develop`

```bash
VERSION="1.2.3"

# Publish release
gh release create ${VERSION} --target release-${VERSION}

# Or create a draft to publish later
gh release create ${VERSION} --target release-${VERSION} --draft
```

Publishing the release deploys `release-*` branch to `prod`
