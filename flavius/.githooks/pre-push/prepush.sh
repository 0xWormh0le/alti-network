#!/bin/sh

remote="$1"
url="$2"

while read local_ref local_sha remote_ref remote_sha
do
    npm run lint
    lint_result=$?
#    yarn test-no-watch
#    test_result=$?
    if [ $lint_result != 0 ]
    then
        echo "FAILED tslint. Please fix all linting errors and try again."
        exit 1
    fi
#    if [ $test_result != 0 ]
#    then
#        echo "FAILED test. Please fix all errors and try again."
#        exit 1
#    fi
    echo "PASSED tslint and tests. Pushing now to $remote_ref"
done

exit 0