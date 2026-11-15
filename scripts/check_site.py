"""Check static resource references, page metadata, and public copy before publishing."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / "docs"


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references = []
        self.ids = set()
        self.h1_count = 0
        self.has_title = False
        self.english = False
        self.description = False
        self.images_without_alt = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "html":
            self.english = attrs.get("lang") == "en"
        if tag == "h1":
            self.h1_count += 1
        if tag == "title":
            self.has_title = True
        if tag == "meta" and attrs.get("name") == "description":
            self.description = bool(attrs.get("content"))
        if tag == "img" and "alt" not in attrs:
            self.images_without_alt += 1
        if "id" in attrs:
            if attrs["id"] in self.ids:
                raise ValueError(f"Duplicate ID: {attrs['id']}")
            self.ids.add(attrs["id"])
        for attribute in ("src", "href", "srcset", "data-gallery-image", "data-preview-src", "data-mobile-src", "data-skin-src"):
            if attribute in attrs:
                self.references.append(attrs[attribute])


def target_path(page, path):
    target = ROOT / path.lstrip("/") if path.startswith("/") else page.parent / path
    target = target.resolve()
    if target != ROOT and ROOT not in target.parents:
        raise ValueError(f"Reference escapes website: {path}")
    return target / "index.html" if target.is_dir() else target


def main():
    pages = {}
    errors = []
    for path in sorted(ROOT.rglob("*.html")):
        page = Page()
        text = path.read_text()
        page.feed(text)
        pages[path] = page
        if not page.english or not page.has_title or page.h1_count != 1:
            errors.append(f"{path.relative_to(ROOT)}: expected English, a title, and one h1")
        if path.name != "404.html" and not page.description:
            errors.append(f"{path.relative_to(ROOT)}: missing description")
        if page.images_without_alt:
            errors.append(f"{path.relative_to(ROOT)}: images missing alt text")
        if re.search(r"[\u3400-\u9fff]", text):
            errors.append(f"{path.relative_to(ROOT)}: non-English copy")
        if re.search(r"(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,})", text):
            errors.append(f"{path.relative_to(ROOT)}: possible credential")

    references = 0
    for path, page in pages.items():
        for value in page.references:
            reference = urlsplit(value)
            if reference.scheme or reference.netloc:
                if reference.scheme != "https":
                    errors.append(f"{path.relative_to(ROOT)}: non-HTTPS destination {value}")
                continue
            target = target_path(path, unquote(reference.path)) if reference.path else path
            references += 1
            if not target.exists():
                errors.append(f"{path.relative_to(ROOT)}: missing resource {value}")
            elif reference.fragment and target in pages and unquote(reference.fragment) not in pages[target].ids:
                errors.append(f"{path.relative_to(ROOT)}: missing anchor {value}")
    ET.parse(ROOT / "sitemap.xml")
    for stylesheet in ROOT.rglob("*.css"):
        for value in re.findall(r"url\(['\"]?([^)'\"]+)['\"]?\)", stylesheet.read_text()):
            if not urlsplit(value).scheme and not target_path(stylesheet, value).is_file():
                errors.append(f"{stylesheet.relative_to(ROOT)}: missing CSS resource {value}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"Checked {len(pages)} pages and {references} local references; metadata, assets, anchors, and public copy passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
