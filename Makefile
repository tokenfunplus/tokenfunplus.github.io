.PHONY: check preview

check:
	python3 scripts/check_site.py
	node --check docs/assets/site.js
	node --check docs/assets/scenes.js
	node --check docs/cove/cove.js

preview:
	python3 -m http.server 4178 --bind 127.0.0.1 --directory docs
