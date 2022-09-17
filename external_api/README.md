# external_api

![Dev - Deploy application services](https://github.com/altitudenetworks/external_api/workflows/Dev%20-%20Deploy%20application%20services/badge.svg)
[![Announce new release in Slack](https://github.com/altitudenetworks/external_api/actions/workflows/on_release_merge.yml/badge.svg)](https://github.com/altitudenetworks/external_api/actions/workflows/on_release_merge.yml)
[![Code style & unit tests](https://github.com/altitudenetworks/external_api/actions/workflows/on_push.yml/badge.svg)](https://github.com/altitudenetworks/external_api/actions/workflows/on_push.yml)
[![Test & validates service templates](https://github.com/altitudenetworks/external_api/actions/workflows/on_push_validate_service_templates.yml/badge.svg)](https://github.com/altitudenetworks/external_api/actions/workflows/on_push_validate_service_templates.yml)

[![forthebadge](https://forthebadge.com/images/badges/made-with-python.svg)](https://forthebadge.com)

User Facing API endpoints and services for Altitude Networks Application.


## Description
`external_api` provides customer facing API endpoints and Lambda services for Flavius and External site applications for Altitude Networks.

Below are some applications currently supported by this repository
- Flavius and External site Swagger APIs
- User Schema Models
- Segment user tracking via Altimeter
- Daily Risk summary Emails
- Risk Remediation services
- SQL Paginator
- Apigateway Authorizer service
- API application services(Lambda)
- IaC deployment templates for Altitude CI/CD


### API Gateway

Design, Define API contracts using [Stoplight](https://stoplight.io/) and deploy on Amazon API Gateway with Swagger

1. [Stoplight API Design](https://stoplight.io/design/)
2. [Introducing Amazon API Gateway Deployments](https://swagger.io/blog/api-development/introducing-the-amazon-api-gateway-integration/)
3. [Create serverless RESTFul APIs with API Gateway](https://cloudonaut.io/create-a-serverless-restful-api-with-api-gateway-swagger-lambda-and-dynamodb/)
4. [Amazon API Gateway Integration](https://app.swaggerhub.com/help/integrations/amazon-api-gateway)
5. [Create an API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-create-api.html)

### Risk Engine

Most of the queries for `external_apis` depend heavily on changes occuring on the [`risk-engine`](https://github.com/altitudenetworks/risk_detection). However, these links contain the current state of the `risk-engine` design.

1. [Risk Catalog](https://altitudenetworks.atlassian.net/wiki/spaces/PROD/pages/31129740/Risk+Catalog)
2. [Risk Type Specs](https://altitudenetworks.atlassian.net/wiki/spaces/PROD/pages/762216490/Risk+Type+Specs)
3. [Risk Remediation will be moved to RISK Engine soon!](https://github.com/altitudenetworks/risk_detection)


## Installation

To install external_api, simply use [pipenv](http://pipenv.org/) (or pip, of course):

```bash
$ git clone https://github.com/altitudenetworks/external_api.git
$ cd external_api
$ touch .env # paste the content below
$ pipenv install --dev
$ pipenv shell
$ repo_checker -u
$ pytest -vv # run unit tests
$ python services/new_service/new_service_handler.py # run specified risk service locally.
```

Also don't forget to setup the VPN to connect to our DBs since they're located in VPCs.

### Create the `.env` file as follows
```sh
export AWS_REGION=us-west-2
export ENV=dev
export project_id=thoughtlabs
export SUFFIX=01
export env=dev
export CONF_DIR=~/.aws/conf
export REPO=external_api
export INTERNAL_PYPI_USERNAME=elasticpypi
export INTERNAL_PYPI_PASS=CookiesInParadise42
export api_version="$(cat external_api/version.txt)"
export API_VERSION=${api_version}
export REPO_PATH="${GITS_DIR}/${REPO}"
export URL="https://app.altitudenetworks.com/risks?riskTypeIds"
export INTERNAL_PYPI_URL=078f54k4k0.execute-api.us-west-2.amazonaws.com/dev/simple
export PYPI_REPO=https://${INTERNAL_PYPI_USERNAME}:${INTERNAL_PYPI_PASS}@${INTERNAL_PYPI_URL}
export DEBUG_MODE=true
```


## How to Contribute
1.  Become more familiar with the project by reading our [Contributor's Guide](https://altitudenetworks.atlassian.net/wiki/spaces/ENG/pages/33185/Code+Contribution+Guidelines) and our [development workflow](https://altitudenetworks.atlassian.net/wiki/spaces/ENG/pages/22642689/Altitude+Deployment+Workflow).
2.  Check for open issues or open a fresh issue to start a discussion
    around a feature idea or a bug. There is a [Contributor
    Friendly](https://altitudenetworks.atlassian.net/secure/RapidBoard.jspa?projectKey=BACK&useStoredSettings=true&rapidView=3)
    tag for issues that should be ideal for people who are not very
    familiar with the codebase yet.
3.  Create a branch from [the repository](https://github.com/altitudenetworks/external_api) on
    GitHub to start making your changes to the **master** branch
4.  Write a test which shows that the bug was fixed or that the feature
    works as expected.
5.  Send a pull request when done and assign to a maintainer for review and merge.


## Documentation

Fantastic documentation will be available at [Project Guide](https://altitudenetworks.atlassian.net/wiki/spaces/ENG/pages/113279027/How+to+set+up+pipenv+for+development+and+deployment) soon.

### Upserting an API Gateway endpoint

- Install [stoplight](https://stoplight.io/design/) locally and get your account setup by Altitude Networks.
- Import the apis and models `yml` files defined in `external_api/api` and `external_api/schema` into stoplight.
- Edit and validate from the Stoplight App.
- Save changes and create a PR into this repo.


## Deployment
All deployments are done via Actions on GitHub. Refer to the *Developer Guide* above for more information.

## Support
If you need support, start with the guides provided above, and work your way through the process as outlined.
That said, if you have any further questions don't hesitate to reach out to other team members via slack or email.
