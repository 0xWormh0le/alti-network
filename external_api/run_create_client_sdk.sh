#!/usr/bin/env bash
#
# Usage: Generate and install and upload flavius_client_sdk
set -e

echo "Update openapi_utils >>>"
pip install -U -i $PYPI_REPO openapi_utils
pip install -U -i $PYPI_REPO pypi_upload

echo "Validating and generating mock server >>>"
python -m openapi_utils mockserver -s ./external_api/api/flavius.v1.yml -o flavius_mockserver --format --package-name flavius_mockserver

echo "Generating, installing and uploading flavius_sdk"
# generate a `flavius_client_sdk` package in `test_client_sdk` folder
python -m openapi_utils client_sdk -s external_api/api/flavius.v1.yml -o flavius_client_sdk --format --package-name flavius_client_sdk

echo "Upload package to internal Pypi"
pypi_upload --repo-path flavius_client_sdk --release --force
pypi_upload --repo-path flavius_mockserver --release --force

pip uninstall -y flavius_client_sdk && pip install flavius_client_sdk -i $PYPI_REPO --no-cache
