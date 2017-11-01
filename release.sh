#!/usr/bin/env bash
zip LivePage-`git describe --abbrev=0 --tags`.zip _locales/*/* css/* imgs/* js/* js/*/* CHANGELOG.md LICENSE.md manifest.json options.html README.md
