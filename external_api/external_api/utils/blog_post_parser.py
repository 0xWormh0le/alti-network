"""
Fetch the Latest or most important Announcement from our Company Blog for the customer emails.
"""
from html.parser import HTMLParser
from typing import List, Optional, Tuple

from external_api.utils.constants import SUMMARY_EMAIL_ALTITUDE_DOMAIN


class BlogPostParser(HTMLParser):  # pylint: disable=W0223
    def __init__(self) -> None:
        super().__init__()
        self.img_src: Optional[str] = None
        self.post_url: Optional[str] = None
        self.post_title: Optional[str] = None

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        """Handle tags to fetch img_src and post_url links"""
        attrs_dict = dict(attrs)

        # set self.img_src
        if (
            not self.img_src
            and tag == "div"
            and attrs_dict.get("class") == "resources__posts--card-hero"
        ):
            self.img_src = SUMMARY_EMAIL_ALTITUDE_DOMAIN + (attrs_dict["style"] or "").split("'")[1]

        # set self.post_url
        if not self.post_url and tag == "a" and attrs_dict.get("class") == "resources__posts--card":
            self.post_url = SUMMARY_EMAIL_ALTITUDE_DOMAIN + (attrs_dict["href"] or "")

        # set self.post_title
        if (
            not self.post_title
            and attrs_dict.get("prefix") == "og: http://ogp.me/ns#"
            and attrs_dict.get("property") == "og:title"
        ):
            self.post_title = attrs_dict["content"]


def main() -> None:
    import requests  # pylint: disable=import-outside-toplevel

    t_feed = requests.get(f"{SUMMARY_EMAIL_ALTITUDE_DOMAIN}/resources/webcasts").text
    parser = BlogPostParser()
    parser.feed(t_feed)
    print(f"Img: {parser.img_src}, URL: {parser.post_url}, Title: {parser.post_title}")

    n_feed = requests.get(f"{parser.post_url}").text
    n_parser = BlogPostParser()
    n_parser.feed(n_feed)

    print(f"Img: {parser.img_src}, URL: {parser.post_url}, Title: {n_parser.post_title}")


if __name__ == "__main__":
    main()
