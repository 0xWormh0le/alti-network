from abc import abstractmethod
from datetime import datetime, timedelta
from pathlib import Path
from time import time
from typing import Any, Dict, List

import requests
from jinja2 import Template
from tools import datetime_tools
from tools.class_tools import cached_property
from tools.lambda_handler import LambdaEvent, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.ses_dispatch import SESDispatch

from external_api.exceptions import InternalServerError
from external_api.utils.blog_post_parser import BlogPostParser
from external_api.utils.constants import (
    SUMMARY_EMAIL_ADMIN_ADDRESS,
    SUMMARY_EMAIL_BLOG_DOMAIN,
    SUMMARY_EMAIL_FROM_ADDRESS,
    SUMMARY_EMAIL_REPLY_ADDRESS,
)
from external_api.utils.external_api_handler_template import (
    CloudWatchMetric,
    ExternalApiHandlerTemplate,
)


class ExternalEmailTemplate(ExternalApiHandlerTemplate):
    name = __name__
    event: LambdaEvent

    @property
    def job_name(self) -> str:
        return "external_email_template"

    @property
    def root_path(self) -> Path:
        return Path(__file__).absolute().parents[1] / "email_templates" / "daily-risk-email.html"

    @property
    def app_url(self) -> str:
        return "app" if self.configs.env == "prod" else f"app-{self.configs.env}"

    @property
    def risks_url(self) -> str:
        return f"https://{self.app_url}.altitudenetworks.com/risks?utm-source=risk-summary-email"

    @cached_property
    def risk_type_url(self) -> str:
        return (
            f"https://{self.app_url}.altitudenetworks.com/"
            f"risks?utm-source=risk-summary-email&riskTypeIds"
        )

    @cached_property
    def ses_alert(self) -> SESDispatch:
        return SESDispatch(
            from_address=SUMMARY_EMAIL_FROM_ADDRESS,
            aws_region=self.configs.aws_region,
        )

    @property
    def yesterday(self) -> datetime:
        return datetime_tools.get_curr_local_time() - timedelta(1)

    @abstractmethod
    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Override in sub class
        """

    @staticmethod
    def verify_risk_summary_results_are_grouped(results: List[Dict[str, Any]]) -> bool:
        """
        Verifies the risk summary email results are properly grouped

        Arguments:
            results -- mysql risk summary query results

        Returns
            boolean
        """
        risk_type_id_list = [risk["risk_type_id"] for risk in results]
        return len(risk_type_id_list) == len(set(risk_type_id_list))

    @staticmethod
    def get_latest_blog_post() -> Dict[str, Any]:
        """Fetch latest Blog Post from Altitude Network blog"""
        blog_feed = requests.get(SUMMARY_EMAIL_BLOG_DOMAIN).text
        blog_parser = BlogPostParser()
        blog_parser.feed(blog_feed)

        page_feed = requests.get(f"{blog_parser.post_url}").text
        page_parser = BlogPostParser()
        page_parser.feed(page_feed)
        return {
            "img_url": blog_parser.img_src,
            "post_url": blog_parser.post_url,
            "post_title": page_parser.post_title,
        }

    def create_risk_summary_metrics(self, metrics: Dict[str, Any]) -> None:
        """
        Writing Daily Risk metrics to CloudWatch.

        Arguments:
            risk_metrics  -- Risk Metrics

        Response:
            None
        """
        self.logger.json(metrics, name="create-risk-summary-metrics")
        curr_time = int(time())
        self.metric_manager.add_dimension(name="endpoint_name", value=self.job_name)
        self.metric_manager.add_metadata(
            key=CloudWatchMetric.DAILY_RISKS_SUMMARY.value, value=f"{curr_time}"
        )

        # add summary metrics to EMF
        self.log_emf(
            name=metrics["1021"]["desc"].replace(" ", "_").replace("-", "_"),
            value=metrics["1021"]["count"],
        )
        self.log_emf(
            name=metrics["1011"]["desc"].replace(" ", "_").replace("-", "_"),
            value=metrics["1011"]["count"],
        )
        self.log_emf(
            name=metrics["2001"]["desc"].replace(" ", "_").replace("-", "_"),
            value=metrics["2001"]["count"],
        )
        self.log_emf(
            name=metrics["3100"]["desc"].replace(" ", "_").replace("-", "_"),
            value=metrics["3100"]["count"],
        )

        # EMF logs for risk category metrics
        for item in metrics["risk_categories"]:
            risk_desc = item["description"].replace(" ", "_").replace("-", "_")
            self.log_emf(name=f"categories_with_most_risks_{risk_desc}", value=item["count"])

    def get_rendered_emails(self, metrics: Dict[str, Any]) -> str:
        """
        Render Jinja Templates and render Daily Emails html

        Arguments:
            metrics -- Daily Risk metrics

        Response:
            Generated user email
        """
        yesterday_raw = datetime_tools.get_humanized_date(self.yesterday).split(" ")
        yesterday = f"{yesterday_raw[0]} {yesterday_raw[1]}, {yesterday_raw[2]}"
        created_today = (
            metrics["risk_metrics"][0]["risks_created"] if metrics["risk_metrics"] else 0
        )

        latest_blog = self.get_latest_blog_post()
        email_template = Template(self.root_path.read_text())

        return email_template.render(
            company_name=self.configs.company_name,
            current_day=yesterday,
            risks_created_today=created_today,
            risk_desc_1021=metrics["1021"]["desc"],
            risk_count_1021=metrics["1021"]["count"],
            risk_desc_1011=metrics["1011"]["desc"],
            risk_count_1011=metrics["1011"]["count"],
            risk_desc_2001=metrics["2001"]["desc"],
            risk_count_2001=metrics["2001"]["count"],
            risk_desc_3100=metrics["3100"]["desc"],
            risk_count_3100=metrics["3100"]["count"],
            category_with_most_risks=metrics["risk_categories"],
            active_risks_url=self.risks_url,
            blog_img=latest_blog["img_url"],
            blog_url=latest_blog["post_url"],
            blog_title=latest_blog["post_title"],
            copyright_year=datetime_tools.get_curr_local_time().year,
        )

    def send_user_emails(self, risk_metrics: Dict[str, Any]) -> None:
        """
        Generate Daily Risk Email from Template and send to customers.

        Arguments:
            risk_metrics -- Computed Daily risk metrics for the day

        Response:
            None
        """
        # self.logger.json(risk_metrics, name="risk-metrics-json")
        if not self.verify_risk_summary_results_are_grouped(risk_metrics["daily_risks"]):
            raise InternalServerError("Daily Risk Metrics are not properly grouped!")

        # if "recipients" in self.event:  # pending `tools` 15.34.0
        if self.event.get("recipients") is not None:
            assert isinstance(self.event["recipients"], list)
            email_addresses = self.event["recipients"]
        else:
            email_addresses = list(self.configs.risk_summary_email_addresses)
            if self.configs.env == "prod":
                email_addresses.append(SUMMARY_EMAIL_ADMIN_ADDRESS)

        risk_category_list: List[Dict[str, Any]] = []
        for item in risk_metrics["daily_risks"]:
            if item["risk_count"] > 0 and item["risk_type_id"] is not None:
                risk_item = {
                    "description": item["risk_desc"],
                    "count": item["risk_count"],
                    "url": f"{self.risk_type_url}={item['risk_type_id']}",
                }
                risk_category_list.append(risk_item)

        risk_metrics["risk_categories"] = risk_category_list

        # summary metric stats
        metric_stats = risk_metrics["risk_metrics"]
        for item in metric_stats:
            if item["risk_type_id"] in [1021, 1011, 2001, 3100]:
                risk_metrics[f"{item['risk_type_id']}"] = {
                    "desc": item["risk_desc"],
                    "count": item["risk_count"],
                }

        risk_metrics["daily_risks"] = []
        # Write Daily Risk Metrics to Cloudwatch
        self.create_risk_summary_metrics(risk_metrics)

        # Add metrics to rendered email template
        rendered_emails = self.get_rendered_emails(metrics=risk_metrics)
        # f_path = self.root_path.parents[0] / "fake.html"
        # f_path.write_text(rendered_emails)

        # send email
        return self.ses_alert.send(
            subject="Risk Summary from Altitude Networks",
            content=rendered_emails,
            markup_content=rendered_emails,
            to_emails=email_addresses,
            reply_to_email=SUMMARY_EMAIL_REPLY_ADDRESS,
        )


#######################################
def main() -> None:
    class TestExternalEmailTemplate(ExternalEmailTemplate):
        name = __name__
        event: LambdaEvent

        def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
            self.send_user_emails(
                risk_metrics={
                    "daily_risks": [],
                    "risks_found": [],
                    "risks_resolved": [],
                }
            )

            return {}

    context = get_dummy_context()
    context.function_name = "test_email_template_handler"
    event = {"project_id": "thoughtlabs"}
    TestExternalEmailTemplate(enable_sentry=False, raise_errors=True).handle(event, context)


if __name__ == "__main__":
    main()
