"""UI-001: the sample entry opens real draft, evidence and review responses."""

import re
from pathlib import Path

import pytest

from tests.browser.test_funding_e2e import FIXTURE_ENV, stack

pytestmark = pytest.mark.browser


def test_presentation_sample_from_home_to_exact_version_review(tmp_path: Path) -> None:
    from playwright.sync_api import expect, sync_playwright

    with stack(tmp_path, **FIXTURE_ENV) as base, sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        try:
            page = browser.new_page()
            external: list[str] = []
            page.on(
                "request",
                lambda request: (
                    external.append(request.url) if not request.url.startswith(base) else None
                ),
            )
            page.goto(base)
            page.evaluate(
                "sessionStorage.setItem('strongstart.c.questionSetId', 'prior-selection')"
            )
            expect(page.get_by_text("Sample data", exact=True)).to_be_visible()
            page.get_by_role("link", name="Open sample application").click()
            expect(page.get_by_role("heading", name="Sample application")).to_be_visible()
            expect(page.get_by_text("Representative form · Synthetic evidence")).to_be_visible()
            page.get_by_text("Representative form · Synthetic evidence").click()
            expect(page.get_by_text(re.compile("synthetic demo-bundle"))).to_be_visible()

            page.get_by_role("button", name=re.compile("Describe your services")).click()
            page.get_by_role("button", name="Request a draft").click()
            fact = page.get_by_role("link", name=re.compile("Linked fact"))
            expect(fact).to_be_visible()
            target_id = fact.get_attribute("href")
            assert target_id is not None
            fact.click()
            expect(page.locator(target_id)).to_be_focused()
            expect(page.locator(target_id)).to_contain_text("Reporting period")
            expect(page).to_have_url(f"{base}/#/sample")
            page.get_by_role("button", name="Save version").click()
            expect(page.get_by_role("region", name="Saved draft · Version 1")).to_be_visible()

            fresh = browser.new_page(viewport={"width": 390, "height": 844})
            fresh.goto(base)
            fresh.get_by_role("link", name="Open sample application").click()
            fresh.get_by_role("button", name=re.compile("Describe your services")).click()
            expect(fresh.get_by_role("region", name="Saved draft · Version 1")).to_be_visible()
            fresh.get_by_role("link", name="Open in Review").click()
            expect(fresh).to_have_url(re.compile(r"#/sample/review\?question=services-q2$"))
            expect(fresh.get_by_label("Question", exact=True)).to_have_value("services-q2")
            expect(fresh.get_by_role("heading", name="Checks (review mode)")).to_be_visible()
            expect(
                fresh.get_by_role("button", name=re.compile("Approve this exact version"))
            ).to_be_visible()
            expect(fresh.get_by_text(re.compile("ready for prefill", re.IGNORECASE))).to_have_count(
                0
            )
            assert fresh.evaluate("document.documentElement.scrollWidth === innerWidth")
            assert (
                page.evaluate("sessionStorage.getItem('strongstart.c.questionSetId')")
                == "prior-selection"
            )
            assert external == []
        finally:
            browser.close()
