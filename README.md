# SimoDevel

SimoDevel is a non-profit educational platform for electronics and mechatronics projects, parts, tools, and tutorials.

## Legal Status

- Copyright (c) 2026 SimoDevel and individual contributors.
- All rights reserved.
- Each contributor retains ownership of their submitted materials.
- By submitting, contributors grant SimoDevel a non-exclusive right to host and publish their content on the platform.

## Reuse Policy

- Do not copy, republish, or commercially reuse content without explicit permission from the copyright owner.
- Educational sharing may be allowed with clear attribution and without misrepresentation.
- For permissions, copyright claims, abuse reports, or own-content removal requests: simodevel@protonmail.com

## Project Links

- Main site: index.html
- About and legal details: about.html
- Contribution form: contribute.html

## Content Configuration Modes

- Default mode (current): separate JSON sources from data/projects_index.json, data/components.json, data/tutorials_index.json, data/tools_index.json.
- Bundle mode (single JSON): set dataPaths.bundle in data/ui_config.json to a file path (for example data/content_bundle.json).
- Sample bundle schema: data/content_bundle.sample.json.

### Inline Topic Fields (Projects and Tutorials)

- Projects can provide inline content with content_md (or readme_text/readmeText) and inline parts with parts_list (or partsList).
- Tutorials can provide inline content with content_md (or readme_text/readmeText).
- If inline fields exist, external readme/parts fetches are skipped.
