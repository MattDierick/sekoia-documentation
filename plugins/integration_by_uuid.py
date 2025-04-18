from pathlib import Path

import mkdocs
from mkdocs.config import Config
from mkdocs.structure.files import File, Files
from mkdocs.utils.meta import get_data


class IntegrationByUUIDPlugin(mkdocs.plugins.BasePlugin):
    """
    Reading Markdown files that contains an `uuid` metadata to provide
    a redirection.

    When such a file is identified, a new
    `operation_center/integration_catalog/uuid/$uuid.md` file is faked
    which will redirect to it.
    """

    template = """<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <link rel="canonical" href="../../../../{destination}">
    <meta name="robots" content="noindex">
    <script>var anchor=window.location.hash.substr(1);location.href="../../../../{destination}"+(anchor?"#"+anchor:"")</script>
    <meta http-equiv="refresh" content="0; url=../../../../{destination}">
</head>
<body>
Redirecting...
</body>
</html>"""

    _redirection_table: dict[str, str] = {}
    _integrations: list[dict[str, str]] = []

    def process_intake_file(
        self,
        source_file: File,
        metadata: dict,
        config: Config,
    ):
        new_files = []
        dialect_uuids = (uuid.strip() for uuid in metadata["uuid"].split(","))

        for dialect_uuid in dialect_uuids:
            self._redirection_table[dialect_uuid] = source_file.url
            self._integrations.append(
                {
                    "uuid": dialect_uuid,
                    "name": metadata.get("name"),
                    "destination": source_file.url,
                }
            )

            newfile = File(
                path=f"operation_center/integration_catalog/uuid/{dialect_uuid}.md",
                src_dir="operation_center/integration_catalog/uuid",
                dest_dir=config["site_dir"],
                use_directory_urls=True,
            )
            new_files.append(newfile)

        new_files.append(
            File(
                path="integration/categories/index.md",
                src_dir="operation_center/integration_catalog/",
                dest_dir=config["site_dir"],
                use_directory_urls=True,
            )
        )

        return new_files

    def process_module_file(
        self,
        source_file: File,
        metadata: dict,
        config: Config,
    ):
        self._redirection_table[metadata["uuid"]] = source_file.url

        return [
            File(
                path=f"integration/action_library/uuid/{metadata['uuid']}.md",
                src_dir="integration/action_library/uuid",
                dest_dir=config["site_dir"],
                use_directory_urls=True,
            )
        ]

    def on_files(self, files: Files, config: Config):
        new_files: list[File] = []
        source_files = [
            source_file for source_file in files if source_file.src_path.endswith(".md")
        ]

        for source_file in files:
            if not source_file.src_path.endswith(".md"):
                continue

            filename = Path(config["docs_dir"]) / Path(source_file.src_path)
            with filename.open() as f:
                _, metadata = get_data(f.read())

                if "uuid" not in metadata:
                    continue

                if metadata.get("type").lower() == "intake":
                    new_files += self.process_intake_file(source_file, metadata, config)
                elif metadata.get(
                    "type"
                ).lower() == "playbook" and source_file.url.startswith(
                    "integration/action_library/"
                ):
                    new_files += self.process_module_file(source_file, metadata, config)

        for file in new_files:
            if file.src_uri in files._src_uris:
                files.remove(file)
            files.append(file)

    def on_page_read_source(self, page, config):
        if page.file.src_path.startswith("operation_center/integration_catalog/uuid/"):
            if page.file.name in self._redirection_table:
                return self.template.format(
                    destination=self._redirection_table[page.file.name]
                )

        if page.file.src_path == "integration/categories/index.md":
            filename = Path(config["docs_dir"]) / Path(page.file.src_path)
            content = filename.open().read()

            for page in sorted(self._integrations, key=lambda x: x["name"]):
                href = (
                    f"/{page['destination']}".replace(
                        "/integration/categories/", ""
                    ).rstrip("/")
                    + ".md"
                )
                content += f"- [{page['name']}]({href})\n"

            return content

        if page.file.src_path.startswith("integration/action_library/uuid/"):
            if page.file.name in self._redirection_table:
                return self.template.format(
                    destination=self._redirection_table[page.file.name]
                )
