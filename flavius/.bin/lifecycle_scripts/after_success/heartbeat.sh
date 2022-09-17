#!/bin/bash
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_STAGING
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_STAGING
export E2E_END_TIME=$(date -u +'%Y-%m-%dT%H:%M:%S%z')
echo "Creating CloudWatch metric for namespace altitude/flavius value 0 at time ${E2E_END_TIME}"
aws cloudwatch put-metric-data --metric-name CurrentStatus --namespace altitude/flavius --value 0 --timestamp "${E2E_END_TIME}"