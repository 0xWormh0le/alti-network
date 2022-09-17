#!/usr/bin/env python
import os

from tools.boto3_session_generator import Boto3SessionGenerator
from tools.config import Config
from tools import json_tools
from tools.lambda_connect import LambdaConnect
from tools.logger import Logger


def main() -> None:
    logger = Logger.main(level=Logger.INFO)

    env = os.environ["ENV"]
    aws_region = os.environ["AWS_REGION"]
    suffix = os.environ["SUFFIX"]
    configs = Config("thoughtlabs")
    func_name = (
        f"apigateway-{env}-lambda-integration-test-{suffix}"
    )

    input_event = {
        "queryStringParameters": {
            "job_name": "run-integration-tests"
        },
        "requestContext": {
            "authorizer": {
                "project_id": "thoughtlabs"
            }
        }
    }

    session = Boto3SessionGenerator(
        default_profile=env, aws_region=aws_region).generate_default_session()
    lambda_conn = LambdaConnect(boto3_session=session)
    resp = lambda_conn.invoke(
        function_arn=func_name,
        payload=json_tools.dumps(input_event),
        invocation_type="RequestResponse",
        LogType="Tail",
        Qualifier=env
    )
    logger.json(resp, name="integration-test-invocation")
    logger.info(f"Finished invoking {func_name}")


#######################################
if __name__ == "__main__":
    main()
