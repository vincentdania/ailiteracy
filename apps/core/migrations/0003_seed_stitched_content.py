from django.db import migrations


def seed_core_content(apps, schema_editor):
    Mentor = apps.get_model("core", "Mentor")
    PremiumResource = apps.get_model("core", "PremiumResource")
    Project = apps.get_model("core", "Project")
    ReferralProgram = apps.get_model("core", "ReferralProgram")

    mentor_defaults = {
        "name": "Tunde Bakare",
        "title": "Lead AI Mentor",
        "bio": "Senior AI Research Engineer helping African teams deploy practical AI systems at scale.",
        "quote": "My mission is to equip the next generation of African builders with practical AI capabilities.",
        "expertise": "Machine Learning Systems\nLLM Product Design\nAI Team Enablement",
        "is_active": True,
        "order": 1,
    }
    Mentor.objects.update_or_create(slug="tunde-bakare", defaults=mentor_defaults)

    projects = [
        {
            "slug": "hausa-translation-model",
            "title": "Hausa Translation Model",
            "summary": "A multilingual assistant that translates English content to Hausa for classrooms and NGOs.",
            "description": "This project demonstrates localized AI by combining translation models with contextual prompt pipelines for educational use.",
            "impact": "Used by 2,300+ learners across Northern Nigeria.",
            "stack": "Python, Transformers, FastAPI",
            "is_published": True,
            "order": 1,
        },
        {
            "slug": "market-price-intelligence",
            "title": "Market Price Intelligence",
            "summary": "AI price-tracker helping retailers monitor inflation trends in major Nigerian markets.",
            "description": "A data pipeline and forecasting system that transforms daily market prices into actionable decision signals.",
            "impact": "Reduced manual reporting by 65%.",
            "stack": "Django, Celery, PostgreSQL",
            "is_published": True,
            "order": 2,
        },
        {
            "slug": "clinic-triage-assistant",
            "title": "Clinic Triage Assistant",
            "summary": "A symptom-routing assistant for primary healthcare centres with local language prompts.",
            "description": "The assistant helps nurses prioritize visits and standardize triage notes in low-resource environments.",
            "impact": "Deployed in 12 clinics.",
            "stack": "NLP, Retrieval-Augmented Generation",
            "is_published": True,
            "order": 3,
        },
    ]
    for item in projects:
        slug = item.pop("slug")
        Project.objects.update_or_create(slug=slug, defaults=item)

    referral_programs = [
        {
            "slug": "campus-ambassador",
            "title": "Campus Ambassador Network",
            "commission": "20%",
            "description": "Partner with us on campuses and earn referral rewards for each successful enrollment.",
            "is_active": True,
            "order": 1,
        },
        {
            "slug": "creator-affiliate",
            "title": "Creator Affiliate Program",
            "commission": "15%",
            "description": "Share AILiteracy resources with your audience and earn monthly payouts.",
            "is_active": True,
            "order": 2,
        },
    ]
    for item in referral_programs:
        slug = item.pop("slug")
        ReferralProgram.objects.update_or_create(slug=slug, defaults=item)

    premium_resources = [
        {
            "slug": "sales-automation-blueprint",
            "title": "Sales Automation Blueprint",
            "category": "Business Systems",
            "summary": "A complete operating playbook for using AI to automate lead qualification and follow-up.",
            "description": "Includes scripts, prompt packs, and implementation sequences for sales teams.",
            "is_published": True,
            "order": 1,
        },
        {
            "slug": "ai-team-playbook",
            "title": "AI Team Playbook",
            "category": "Operations",
            "summary": "Templates and governance workflows for rolling out AI across your team.",
            "description": "Defines policy, quality controls, and role-based AI process adoption for teams.",
            "is_published": True,
            "order": 2,
        },
    ]
    for item in premium_resources:
        slug = item.pop("slug")
        PremiumResource.objects.update_or_create(slug=slug, defaults=item)


def unseed_core_content(apps, schema_editor):
    Mentor = apps.get_model("core", "Mentor")
    PremiumResource = apps.get_model("core", "PremiumResource")
    Project = apps.get_model("core", "Project")
    ReferralProgram = apps.get_model("core", "ReferralProgram")

    Mentor.objects.filter(slug="tunde-bakare").delete()
    Project.objects.filter(
        slug__in=[
            "hausa-translation-model",
            "market-price-intelligence",
            "clinic-triage-assistant",
        ]
    ).delete()
    ReferralProgram.objects.filter(slug__in=["campus-ambassador", "creator-affiliate"]).delete()
    PremiumResource.objects.filter(slug__in=["sales-automation-blueprint", "ai-team-playbook"]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_mentor_premiumresource_project_referralprogram"),
    ]

    operations = [
        migrations.RunPython(seed_core_content, unseed_core_content),
    ]
