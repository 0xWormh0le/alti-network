from tools.lambda_handler import LambdaEventError, LambdaHandlerError


class BadRequest(LambdaEventError):
    status_code = 400


class UnauthorizedError(LambdaEventError):
    status_code = 401


class NotFoundError(LambdaEventError):
    status_code = 404


class ForbiddenError(LambdaEventError):
    status_code = 403


class TooLargePayloadError(LambdaEventError):
    status_code = 413


class InternalServerError(LambdaHandlerError):
    status_code = 500


class IncompleteDBDataError(InternalServerError):
    """
    Raised if:
    - if incomplete data is returned from the DB.
    """


class ActorNotFound(IncompleteDBDataError):
    """
    Raised if:
    - An actor information is missing from DB response.
    """


class InvalidSensitivePhrase(LambdaEventError):
    """
    Raised if:
    - sensitive phrase is invalid
    """

    status_code = 422
