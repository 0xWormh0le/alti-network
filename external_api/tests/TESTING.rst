########################################
Instructions for adding new tests
########################################

(a) Add a collection of different test payloads under the same directory as the handler function.
The naming convention for the test payloads is:
{base_name}_test_events.json

The format of the test_events json file is:
{
  "test_events":
  [
    {
        test_event_1
    },
    {
        test_event_2
    },
    {
        test_event_3
    }
  ]
}


(b) Add a pytest module under external_api/tests
The naming convention for the test module is:
test_{base_name}


(c) Update the main() function of the handler module to
also read test data from the {base_name}_test_events.json
file.


########################################
Guide to pytest's test discovery
########################################
pytest's Test finder conventions:
- Find test_*.py or *_test.py files, imported by their test package name.
- From those files, collect test items:
-- test_ prefixed test functions or methods outside of class
-- test_ prefixed test functions or methods inside 'Test' prefixed test classes (without an __init__ method)
https://docs.pytest.org/en/latest/goodpractices.html#test-discovery


#######################################
Known bugs and technical debt
#######################################

=======================================================================================
Issue: boto3 s3 client download hangs when executed outside class or functions
=======================================================================================
S3 download works when run as the __main__ script,
or when it is executed inside a function.
But it does not work when executed in the root of an imported module.

As a result, we cannot 'import' our lambda functions
into another python module (eg, a test module),
while keeping the S3 download code in the root script of the lambda module.
This is an issue with boto3 client, not our code.

We can go around this limitation by including a dummy S3 download
in the root of the test python module.

But, the issue is that pytest also imports that test module
to run its code. As a result, this workaround falls through
when used with pytest.


Current behavior:
If we put the S3 download code in the root of the test module:
from tools.sentry_setup import SentrySetup
ssetup = SentrySetup()
ssetup.download_config_file()

The, this is the behavior we get
# cd ~/gits/external_api
# This works:           python external_api/tests/services/unit/test_top_risks.py
# This works:           python -m external_api.tests.services.unit.test_top_risks
# This does not work:   pytest external_api/tests/services/unit/test_top_risks.py
# This does not work:   python -m pytest
# This does not work:   pytest
# This does not work:   pytest --pyargs external_api



To fix this bug, we have the following workarounds:


---------------------------------------
(Option a) Function invocation
---------------------------------------
Put the S3 download inside a function in the lambda module.
This is the most sustainable option, as it does not depend on the
downstream modules and test modules to make any changes to their codes.
The issue is that we need to keep the db connection creation code
in the root of lambda module (outside the handler)
to enable connection sharing between lambda invocations.


---------------------------------------
(Option b) Dummy file download
---------------------------------------
Add a dummy download_file in the main body
of the test (or other downstream) python scripts,
and run those scripts as python code (not module).
It looks like that the issue above only applies
to the first S3 download in a job.
If the first download happens properly,
the subsequent downloads can happen
even in the root of the imported modules.

This is a completely arbitrary download, so only use
small and non-sensitive files to download
to 'open up the way' for future downloads.

Once caveat: when a test module is executed using 'pytest' command from bash,
pytest will run the test module as an imported module. Therefore,
the dummy S3 download in the root of the test module will still hang, because
it is run in the 'import' statement of the pytest execution.

In short, we cannot execute the test python script as a module,
and have to run it as a python code.
To do that, run the test code as:
$ python <test_code_path.py>


IMPORTANT: Do not execute the test code as a module; ie, DON'T do this:
$ python -m <test_code_path>
This may run the code properly, but it does not run it in pytest framework.
As examples, the commands below that start with "python" or "python -m pytest"
will run, but they dont produce results in pytest format. Ie, they
just run the test module as a normal python script.
# cd ~/gits/external_api
# This works:           python external_api/tests/services/unit/test_top_risks.py
# This works:           python -m external_api.tests.services.unit.test_top_risks
# This does not work:   pytest external_api/tests/services/unit/test_top_risks.py
# This does not work:   python -m pytest
# This does not work:   pytest
# This does not work:   pytest --pyargs external_api


---------------------------------------
(Option c) Use moto library for testing
---------------------------------------
If the only reason for 'fixing' this issue is for testing,
use moto library to mock boto3 calls instead of making real calls.


---------------------------------------
(Option d) Store configs.json in a db
---------------------------------------
Instead of using a json file, we can store configs.json in a dynamodb table,
where it will be easily and securely accessible to AWS resources.
This way we dont need to download an S3 object on startup of each lambda function.
This may even shave off a few milliseconds from each lambda call,
because as the number of customers increases, it will be faster
to query a key-value data store than downloading an S3 object,
and read the values from the json file.


-----------------------------------------------------------------
(Option e) Pass configs params to lambda function as env vars
-----------------------------------------------------------------
To remove the need to download the config file from S3,
we can pass the config parameters to the lambda function
as env var. For that, we need to read the configs params
during lambda deployment, and update env_vars.json file.

This can also speed up the lambda execution time.


-----------------------------------------------------------------
(Option f) Only download from S3 if configs.json not on disk
-----------------------------------------------------------------
We can add a condition to lambda_setup.download_config_file()
to check whether configs.json file already exists on disk.
Only download the file if it does not exist on disk.
Also add a script to .travis.yml file to download configs.json
file prior to running pytest testing scripts.

That is the quickest fix to the issue we are facing right now.
But in the long term, we still need to move configs.json file
to a more scalable solution such as dynamodb.

This solution has the side benefit of "caching" the config file
in between successive lambda invocations. Similar to
the connection-sharing trick where the container memory persists
in between successive invocations, the container file system
also persists in between calls. So, if we download the S3 file
in one invocation, it is likely that the file still exists on
the filesystem when the next invocation happens.
This way, we save time and money by reducing S3 calls.
Especially, saving money for S3 or dynamodb calls can be
a good motivation to keep our config info inside
a physical configs.json and not dynamodb.


########################################
RESOURCES
########################################
https://docs.python-guide.org/writing/tests/
https://docs.pytest.org/en/latest/contents.html

