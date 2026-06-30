import os
import sys
import django
import shutil
import io

# Set encoding to UTF-8 for console outputs on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add the project root to python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.append(project_root)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from apps.tenants.models import Tenant
from apps.accounts.models import TenantUser
from apps.catalog.models import ServiceCategory, CategoryGallery, ServiceReview
from apps.pages.models import Page, PageTab, ContentBlock


def parse_ts_constants():
    """
    Parses RENTAL_CATEGORIES from constants/index.ts in the backup folder.
    This reads the file, parses array of objects using simple python evaluators.
    """
    file_path = "c:/Users/Ramzi/Desktop/Nejed/portfoilo/template_1_nejd_backup/app/constants/index.ts"
    if not os.path.exists(file_path):
        print(f"Error: constants file not found at {file_path}")
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract RENTAL_CATEGORIES array
    start_token = "export const RENTAL_CATEGORIES"
    if start_token not in content:
        print("Error: RENTAL_CATEGORIES not found in constants file")
        return []

    start_idx = content.find(start_token)
    equals_idx = content.find("=", start_idx)
    array_start = content.find("[", equals_idx)

    # Simple parenthesis matching to extract the full array block
    brace_count = 0
    array_end = -1
    for i in range(array_start, len(content)):
        char = content[i]
        if char == "[":
            brace_count += 1
        elif char == "]":
            brace_count -= 1
            if brace_count == 0:
                array_end = i + 1
                break

    if array_end == -1:
        print("Error: Could not parse array braces matching")
        return []

    raw_array_str = content[array_start:array_end]

    # Clean the TypeScript string so it's evaluatable in Python:
    # 1. Remove comments
    lines = raw_array_str.split("\n")
    cleaned_lines = []
    for line in lines:
        if "//" in line:
            line = line.split("//")[0]
        cleaned_lines.append(line)
    cleaned_str = "\n".join(cleaned_lines)

    # Remove JS block comments
    while "/*" in cleaned_str:
        start_comment = cleaned_str.find("/*")
        end_comment = cleaned_str.find("*/", start_comment)
        if end_comment == -1:
            break
        cleaned_str = cleaned_str[:start_comment] + cleaned_str[end_comment + 2:]

    # 2. Adjust javascript keywords and backticks to python equivalents
    cleaned_str = cleaned_str.replace("`", '"""')
    cleaned_str = cleaned_str.replace("true", "True").replace("false", "False")

    # 3. Dynamic evaluation namespace that resolves undefined variables (like Lucide icons) as strings automatically
    class StringNamespace(dict):
        def __missing__(self, key):
            return key

    try:
        # Evaluate as a Python list literal using the dynamic namespace
        data = eval(cleaned_str, {"__builtins__": None}, StringNamespace())
        return data
    except Exception as e:
        print(f"Error evaluating array with Python eval: {e}")
        return []


def seed():
    print("=== Starting Multi-Tenant Database Seeding ===")

    # Define the two tenants to seed
    tenants_config = [
        {
            "subdomain": "najd-al-zain",
            "custom_domain": "najdalzian.com",
            "name": "مؤسسة ملك الحفلات لتجهيز المناسبات",
            "tagline": "لتجهيز المناسبات الفاخرة",
            "phone": "+966569436019",
            "whatsapp": "+966569436019",
            "email": "info@najdalzian.com",
            "address": "حي الملقا، طريق الملك فهد، الرياض",
            "city": "الرياض",
            "geo_lat": "24.8122",
            "geo_lng": "46.6133",
            "theme": {
                "primary": "#5B2D4A",
                "dark": "#3B1B30",
                "light": "#7A3F65",
                "gold_accent": "#D4AF37",
                "gold_light": "#F3D062",
                "bg_soft": "#FAFAFA"
            },
            "meta_title": "تأجير خيام ومكيفات وبيوت شعر بالرياض | ملك الحفلات",
            "meta_description": "ملك الحفلات: أفضل خدمات تأجير المكيفات الصحراوية والسبليت والدولابية، الخيام الملكية والأوروبية، بيوت الشعر، الجلسات الداخلية والخارجية بالرياض.",
            "replace_brand": False
        },
        {
            "subdomain": "malak-parties",
            "custom_domain": "malakparties.com",
            "name": "مؤسسة ملك الحفلات لتجهيز المناسبات",
            "tagline": "لتجهيز المناسبات الملكية",
            "phone": "+966569436019",
            "whatsapp": "+966569436019",
            "email": "info@malakparties.com",
            "address": "حي الملقا، الرياض",
            "city": "الرياض",
            "geo_lat": "24.8122",
            "geo_lng": "46.6133",
            "theme": {
                "primary": "#0B132B",
                "dark": "#1C2541",
                "light": "#3A506B",
                "gold_accent": "#C5A880",
                "gold_light": "#E6D7C3",
                "bg_soft": "#F8F9FA"
            },
            "meta_title": "مؤسسة ملك الحفلات | تأجير خيام ومكيفات وجلسات بالرياض",
            "meta_description": "ملك الحفلات: أفضل خدمات تأجير خيام ملكية، مكيفات صحراوية وفريون، بيوت شعر، وجلسات خارجية بالرياض بأسعار منافسة.",
            "replace_brand": True
        }
    ]

    # Create media folders for images
    media_root = "media"
    catalog_main = os.path.join(media_root, "catalog", "main")
    catalog_gallery = os.path.join(media_root, "catalog", "gallery")
    os.makedirs(catalog_main, exist_ok=True)
    os.makedirs(catalog_gallery, exist_ok=True)

    # Copy logo/icon assets
    src_images = "c:/Users/Ramzi/Desktop/Nejed/portfoilo/template_1_nejd_backup/public/images"
    src_logo = "c:/Users/Ramzi/Desktop/Nejed/portfoilo/template_1_nejd_backup/public/logo.png"
    src_icon = "c:/Users/Ramzi/Desktop/Nejed/portfoilo/template_1_nejd_backup/public/icon.png"
    
    if os.path.exists(src_logo):
        shutil.copy(src_logo, os.path.join(catalog_main, "logo.png"))
    if os.path.exists(src_icon):
        shutil.copy(src_icon, os.path.join(catalog_main, "icon.png"))

    # Parse categories data from TypeScript constants
    categories_data = parse_ts_constants()
    print(f"Loaded {len(categories_data)} base categories from constants file.")

    for cfg in tenants_config:
        subdomain = cfg["subdomain"]
        print(f"\n--- Seeding Tenant: {subdomain} ({cfg['name']}) ---")

        # 1. Create or get Tenant
        tenant, created = Tenant.objects.get_or_create(
            subdomain=subdomain,
            defaults={
                "custom_domain": cfg["custom_domain"],
                "name": cfg["name"],
                "tagline": cfg["tagline"],
                "phone": cfg["phone"],
                "whatsapp": cfg["whatsapp"],
                "email": cfg["email"],
                "address": cfg["address"],
                "city": cfg["city"],
                "geo_lat": cfg["geo_lat"],
                "geo_lng": cfg["geo_lng"],
                "logo": "catalog/main/logo.png",
                "favicon": "catalog/main/icon.png",
                "theme": cfg["theme"],
                "analytics": {
                    "gtm_id": "",
                    "ga_id": ""
                }
            }
        )
        if created:
            print(f"Created Tenant Model: {tenant.name}")
        else:
            # Force update details
            tenant.custom_domain = cfg["custom_domain"]
            tenant.name = cfg["name"]
            tenant.tagline = cfg["tagline"]
            tenant.phone = cfg["phone"]
            tenant.whatsapp = cfg["whatsapp"]
            tenant.email = cfg["email"]
            tenant.address = cfg["address"]
            tenant.theme = cfg["theme"]
            tenant.save()
            print(f"Loaded & Updated Tenant Model: {tenant.name}")

        # 2. Create Admin User if not exists
        admin_user, user_created = TenantUser.objects.get_or_create(
            username=f"admin_{subdomain.replace('-', '_')}",
            defaults={
                "email": f"admin@{subdomain}.com",
                "first_name": "مدير",
                "last_name": "الموقع",
                "role": "owner",
                "tenant": tenant,
                "is_staff": True,
                "is_superuser": True
            }
        )
        if user_created:
            admin_user.set_password("admin123")
            admin_user.save()
            print(f"Created Superuser: {admin_user.username} / admin123")

        # Helper helper for string brand replacements if requested
        def apply_branding(text):
            if not text or not cfg["replace_brand"]:
                return text
            return text.replace("ملك الحفلات", "ملك الحفلات").replace("نجد", "ملك الحفلات")

        # 3. Seed Categories
        for idx, cat_data in enumerate(categories_data):
            slug = cat_data.get("id")
            raw_title = cat_data.get("title")
            title = apply_branding(raw_title)
            
            # Resolve main image
            src_main = cat_data.get("mainImage", "")
            main_img_name = os.path.basename(src_main)
            dest_main_path = ""
            if main_img_name:
                src_file_path = os.path.join(src_images, main_img_name)
                if os.path.exists(src_file_path):
                    shutil.copy(src_file_path, os.path.join(catalog_main, main_img_name))
                    dest_main_path = f"catalog/main/{main_img_name}"

            # Brand description fields
            desc = apply_branding(cat_data.get("description", ""))
            seo_title = apply_branding(cat_data.get("seoTitle", raw_title))
            seo_desc = apply_branding(cat_data.get("seoDescription", ""))
            blog_content = apply_branding(cat_data.get("blogContent", ""))
            raw_features = cat_data.get("features", [])
            features = [apply_branding(f) for f in raw_features]
            raw_keywords = cat_data.get("seoKeywords", [])
            seo_keywords = [apply_branding(k) for k in raw_keywords]

            # Create/Update Category in DB
            category, cat_created = ServiceCategory.objects.get_or_create(
                tenant=tenant,
                slug=slug,
                defaults={
                    "title": title,
                    "seo_title": seo_title,
                    "description": desc,
                    "seo_description": seo_desc,
                    "seo_keywords": seo_keywords,
                    "main_image": dest_main_path,
                    "icon": str(cat_data.get("icon", "Sparkles")),
                    "features": features,
                    "blog_content": blog_content,
                    "display_order": idx,
                    "is_active": True
                }
            )
            if cat_created:
                print(f"Created Service Category: {title} ({slug})")
            else:
                # Update properties
                category.title = title
                category.seo_title = seo_title
                category.description = desc
                category.seo_description = seo_desc
                category.seo_keywords = seo_keywords
                if dest_main_path:
                    category.main_image = dest_main_path
                category.icon = str(cat_data.get("icon", "Sparkles"))
                category.features = features
                category.blog_content = blog_content
                category.save()
                print(f"Updated Service Category: {title} ({slug})")

            # Create/Reset Gallery Images
            gallery_list = cat_data.get("gallery", [])
            CategoryGallery.objects.filter(category=category).delete()
            for g_idx, g_path in enumerate(gallery_list):
                g_img_name = os.path.basename(g_path)
                if g_img_name:
                    g_src_file = os.path.join(src_images, g_img_name)
                    if os.path.exists(g_src_file):
                        shutil.copy(g_src_file, os.path.join(catalog_gallery, g_img_name))
                        CategoryGallery.objects.create(
                            category=category,
                            image=f"catalog/gallery/{g_img_name}",
                            caption=apply_branding(f"صورة {raw_title} {g_idx + 1}"),
                            display_order=g_idx
                        )

            # Create/Reset Customer Reviews
            reviews_list = cat_data.get("reviews", [])
            ServiceReview.objects.filter(category=category).delete()
            for rev_data in reviews_list:
                ServiceReview.objects.create(
                    category=category,
                    reviewer_name=apply_branding(rev_data.get("name", "عميل")),
                    rating=rev_data.get("rating", 5),
                    text=apply_branding(rev_data.get("text", "")),
                    city=rev_data.get("city", "الرياض"),
                    review_date=rev_data.get("date", "2026-05")
                )

        # 4. Create default Home Page
        page, page_created = Page.objects.get_or_create(
            tenant=tenant,
            slug="home",
            defaults={
                "title": "الرئيسية",
                "page_type": "home",
                "meta_title": tenant.meta_title,
                "meta_description": tenant.meta_description,
                "is_published": True,
                "display_order": 0
            }
        )
        
        # Reset tabs and content block links
        PageTab.objects.filter(page=page).delete()
        ContentBlock.objects.filter(page=page).delete()

        # Add section anchor links
        PageTab.objects.create(page=page, label="الرئيسية", icon="home", tab_type="section_anchor", link_value="#hero", display_order=0)
        PageTab.objects.create(page=page, label="خدماتنا", icon="sparkles", tab_type="section_anchor", link_value="#services", display_order=1)
        PageTab.objects.create(page=page, label="من نحن", icon="info", tab_type="section_anchor", link_value="#about", display_order=2)

        # Add Hero Content block
        headline = apply_branding("مؤسسة ملك الحفلات لتجهيز المناسبات الفاخرة بالرياض")
        subheadline = apply_branding("خيام ملكية وأوروبية، مكيفات صحراوية وفريون، بيوت شعر، وجلسات خارجية راقية")
        ContentBlock.objects.create(
            page=page,
            block_type="hero",
            content={
                "headline": headline,
                "subheadline": subheadline,
                "cta_primary_text": "تصفح خدماتنا",
                "cta_primary_url": "#services",
                "cta_secondary_text": "اتصل بنا الآن",
                "cta_secondary_url": f"tel:{cfg['phone']}"
            },
            display_order=0
        )
        print(f"Seeded Page Builder elements for {tenant.name} home page.")

    print("\n=== Multi-Tenant Database Seeding Completed Successfully ===")


if __name__ == "__main__":
    seed()
