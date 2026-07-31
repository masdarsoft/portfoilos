"""
add_gallery_images.py — Add new gallery images to existing service categories.

Unlike seed_db.py this is idempotent and non-destructive: it never deletes
existing gallery rows, it only copies missing files into MEDIA_ROOT and creates
the CategoryGallery rows that do not exist yet.

Usage (local):
    python add_gallery_images.py

Usage (VPS):
    DJANGO_SETTINGS_MODULE=config.settings.production .venv/bin/python add_gallery_images.py

To add more images later, just extend NEW_IMAGES below with paths relative to
the frontend `public/` folder, then re-run.
"""
import os
import sys
import shutil
import io

import django

# Console UTF-8 so Arabic filenames print correctly on Windows
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.append(project_root)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from django.conf import settings  # noqa: E402
from apps.catalog.models import ServiceCategory, CategoryGallery  # noqa: E402


# Category slug -> list of (source path relative to the frontend public/ folder,
# destination filename inside MEDIA_ROOT/catalog/gallery/).
# Destination names stay ASCII to match the existing media convention and to
# avoid URL-encoding issues when Nginx serves /media/.
NEW_IMAGES = {
    "fan-rentals": [
        ("images/fan/مرواح-1.jpg", "fan_3.jpg"),
        ("images/fan/images.jpg", "fan_4.jpg"),
    ],
    "split-ac-rentals": [
        ("images/مكيفات سبليت/condiation-air.jpg", "split_ac_6.jpg"),
    ],
}

FRONTEND_PUBLIC = os.path.normpath(
    os.path.join(project_root, "..", "templates", "template_1_malakparites", "public")
)

CAPTIONS = {
    "fan-rentals": "صورة تأجير مراوح",
    "split-ac-rentals": "صورة تأجير مكيفات سبليت",
}


def main() -> int:
    if not os.path.isdir(FRONTEND_PUBLIC):
        print(f"Error: frontend public folder not found at {FRONTEND_PUBLIC}")
        return 1

    gallery_dir = os.path.join(settings.MEDIA_ROOT, "catalog", "gallery")
    os.makedirs(gallery_dir, exist_ok=True)

    added = skipped = missing = 0

    for slug, entries in NEW_IMAGES.items():
        categories = list(ServiceCategory.objects.filter(slug=slug))
        if not categories:
            print(f"! No category found with slug '{slug}' — skipping")
            continue

        for rel_path, img_name in entries:
            src = os.path.join(FRONTEND_PUBLIC, rel_path.replace("/", os.sep))
            if not os.path.exists(src):
                print(f"! Source image missing: {src}")
                missing += 1
                continue

            dest_rel = f"catalog/gallery/{img_name}"
            dest_abs = os.path.join(gallery_dir, img_name)

            if not os.path.exists(dest_abs):
                shutil.copy(src, dest_abs)
                print(f"  copied  {img_name}")

            for category in categories:
                if CategoryGallery.objects.filter(category=category, image=dest_rel).exists():
                    print(f"  = already linked: {img_name} -> {category.tenant.subdomain}/{slug}")
                    skipped += 1
                    continue

                next_order = category.gallery_images.count()
                CategoryGallery.objects.create(
                    category=category,
                    image=dest_rel,
                    caption=f"{CAPTIONS.get(slug, category.title)} {next_order + 1}",
                    display_order=next_order,
                )
                print(f"  + added:   {img_name} -> {category.tenant.subdomain}/{slug}")
                added += 1

    print(f"\nDone. added={added} already_present={skipped} source_missing={missing}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
