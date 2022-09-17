#!/usr/bin/env python

from pathlib import Path

import setuptools


def main() -> None:
    requirements_path = Path(__file__).parent / "requirements.txt"
    kwargs = {}
    if requirements_path.exists():
        kwargs["install_requires"] = [
            line
            for line in requirements_path.read_text().split("\n")
            if line.strip() and not line.startswith("-")
        ]

    setuptools.setup(**kwargs)


if __name__ == "__main__":
    main()
