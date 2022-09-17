# https://github.com/awslabs/aws-support-tools/tree/master/Cognito/decode-verify-jwt
import time
from typing import Any, Dict, List, Tuple
from urllib.request import urlopen

from jose import jwk, jwt
from jose.utils import base64url_decode
from tools import json_tools
from tools.config import Config
from tools.logger import Logger


class CognitoTokenVerifier:
    def __init__(self, configs: Config) -> None:
        self.logger = Logger.for_object(self)
        self.configs = configs

    def get_verified_tokens_list(self) -> List[Dict[str, Any]]:
        """
        Downloads a list of valid tokens from Cognito user pool
        :return: a list of valid keys in deserialized JSON format
        """
        keys_url = (
            f"https://cognito-idp.{self.configs.aws_region}."
            f"amazonaws.com/{self.configs.cognito_user_pool_id}/.well-known/jwks.json"
        )
        keys = json_tools.loads(urlopen(keys_url).read())["keys"]
        return keys

    def is_token_verified(self, token: str) -> bool:
        """
        Verifies a token against a list of valid tokens
        :param token: authentication token passed from the user
        :return: a boolean indicating whether the token is valid
        """
        # get the kid from the headers prior to verification
        keys = self.get_verified_tokens_list()
        try:
            headers = jwt.get_unverified_headers(token)
            kid = headers["kid"]
        except Exception as e:
            self.logger.info("Token verification FAILED.")
            self.logger.error(str(e))
            return False

        # TBD: refactor this search code. I think I have a function for it in tools repo
        # search for the kid in the downloaded public keys
        key_index = -1
        for i, key in enumerate(keys):
            if kid == key["kid"]:
                key_index = i
                break
        if key_index == -1:
            self.logger.info("Public key not found in jwks.json")
            return False

        # construct the public key
        public_key = jwk.construct(keys[key_index])

        # get the last two sections of the token,
        # message and signature (encoded in base64)
        message, encoded_signature = str(token).rsplit(".", 1)

        # decode the signature
        decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

        # verify the signature
        if not public_key.verify(message.encode("utf8"), decoded_signature):
            self.logger.info("Signature verification failed")
            return False

        self.logger.info("Signature successfully verified")
        return True

    def get_verified_claims(self, token: str) -> Tuple[Dict[str, Any], bool]:
        """
        Three checks:
        - verify that the key associated with the token exists in the keys array
        - verify public key signature
        - verify that the token is not expired
        If the token passes these three tests, we return a claims object
        :param token: Authentication token passed by the user
        :return: claims object, a boolean flag for whether the key was verified or not
        """
        if not self.is_token_verified(token):
            return {}, False

        # since we passed the verification, we can now safely
        # use the unverified claims
        claims = dict(jwt.get_unverified_claims(token))

        # additionally we can verify the token expiration
        # time.time() does not specify the timezone
        # to convert to gmt we use time.gmtime(time.time()) - UTC/GMT
        if time.time() > claims["exp"]:
            self.logger.info("Token is expired")
            return {}, False

        # # and the Audience  (use claims['client_id'] if verifying an access token)
        # if claims['client_id'] != app_client_id:
        #     print('Token was not issued for this audience')
        #     return None, False

        # now we can use the claims
        self.logger.info(f"CLAIMS: {claims}")
        return claims, True
