from html import escape
from pathlib import Path

import markdown
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

from apps.catalog.models import Product
from apps.learning.models import Course, Lesson, Module


COURSE_SLUG = "21-day-ai-challenge"
MODULES = (
    ("Foundations", 1, 5),
    ("Work Superpowers", 6, 11),
    ("Claude Co-Work", 12, 15),
    ("Agentic AI", 16, 19),
    ("Your System", 20, 21),
)

BONUS_PROMPTS = (
    "Turn these rough notes into a one-page brief with decisions, owners, and deadlines.",
    "Draft three versions of this email: concise, warm, and executive. Keep the facts unchanged.",
    "Review this document like a skeptical client. List unclear claims and the questions they would ask.",
    "Convert this goal into a weekly plan with milestones, risks, and the first three actions.",
    "Summarise this meeting into decisions, open questions, and follow-ups by person.",
    "Build a reusable checklist for this process. Flag steps that need human approval.",
    "Compare these options using cost, speed, risk, and long-term value. State your assumptions.",
    "Rewrite this explanation for a smart beginner without removing important nuance.",
    "Create a first draft from these facts. Mark every place where more evidence is needed.",
    "Act as my quality reviewer. Find contradictions, missing context, and unsupported numbers.",
    "Turn this customer feedback into themes, representative examples, and practical next steps.",
    "Create five interview questions that test for real experience rather than rehearsed answers.",
    "Help me prepare for this conversation: likely concerns, useful questions, and a clear outcome.",
    "Transform this repeated task into a standard operating procedure a colleague can follow.",
    "Generate ten ideas under these constraints, then rank the strongest three and explain why.",
    "Make this proposal more persuasive by clarifying the problem, value, proof, and next step.",
    "Identify what should not be automated in this workflow and explain the human judgment required.",
    "Create a verification plan for this AI-generated answer using independent, authoritative sources.",
    "Turn this project into a status update: progress, blockers, decisions needed, and next milestone.",
    "Help me design a personal AI workflow for this role using triggers, inputs, steps, and review points.",
)


def parse_lesson_source(source):
    metadata = {}
    body = source
    if source.startswith("---\n"):
        parts = source.split("---", 2)
        if len(parts) == 3:
            body = parts[2].lstrip()
            for line in parts[1].strip().splitlines():
                key, separator, value = line.partition(":")
                if separator:
                    metadata[key.strip()] = value.strip()

    if not metadata.get("title"):
        for line in body.splitlines():
            if line.startswith("# "):
                metadata["title"] = line[2:].strip()
                break

    if not metadata.get("bullets"):
        metadata["bullets"] = (
            "Draft, summarise, structure, and brainstorm faster | "
            "Treat AI as a fast intern whose work you review"
        )
    if not metadata.get("rules"):
        metadata["rules"] = "Verify everything | Add useful context | Improve outputs through iteration"
    return metadata, body


def recap_html(metadata):
    bullets = [escape(item.strip()) for item in metadata.get("bullets", "").split("|") if item.strip()]
    rules = [escape(item.strip()) for item in metadata.get("rules", "").split("|") if item.strip()]
    key_ideas = " · ".join(bullets)
    remember = " · ".join(rules)
    return (
        '<aside class="challenge-recap">'
        '<h2>Lesson recap</h2>'
        f'<p><strong>Key ideas:</strong> {key_ideas}</p>'
        f'<p><strong>Remember:</strong> {remember}</p>'
        "</aside>"
    )


class Command(BaseCommand):
    help = "Import or update The 21-Day AI Challenge course pack."

    def add_arguments(self, parser):
        parser.add_argument("--price", default="20000.00")
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete the existing challenge course and product before importing.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        source_root = Path(settings.BASE_DIR) / "data" / "21day_challenge"
        missing = [day for day in range(1, 22) if not (source_root / f"day{day:02d}" / "lesson.md").exists()]
        if missing:
            raise CommandError(f"Missing lesson source for day(s): {', '.join(map(str, missing))}")

        if options["reset"]:
            Product.objects.filter(slug=COURSE_SLUG).delete()
            Course.objects.filter(slug=COURSE_SLUG).delete()

        course, _ = Course.objects.update_or_create(
            slug=COURSE_SLUG,
            defaults={
                "title": "The 21-Day AI Challenge",
                "summary": "From zero to up-and-running with AI in 21 days.",
                "description": (
                    "A practical text-and-graphics course for working professionals. "
                    "Build useful AI habits through one focused lesson and task each day."
                ),
                "hero_image": "/static/lesson_heroes/day01_hero.png",
                "is_featured": True,
            },
        )

        modules = {}
        for module_order, (title, first_day, last_day) in enumerate(MODULES, start=1):
            module, _ = Module.objects.update_or_create(
                course=course,
                order=module_order,
                defaults={"title": title, "is_bonus": False},
            )
            modules[module_order] = (module, first_day, last_day)

        for day in range(1, 22):
            module_order, module, first_day = next(
                (order, item[0], item[1])
                for order, item in modules.items()
                if item[1] <= day <= item[2]
            )
            source = (source_root / f"day{day:02d}" / "lesson.md").read_text(encoding="utf-8")
            metadata, body = parse_lesson_source(source)
            title = metadata.get("title") or f"Day {day}"
            title_without_day = title.split("—", 1)[-1].strip() if "—" in title else title
            lesson_slug = f"day-{day:02d}-{slugify(title_without_day)}"
            content_html = markdown.markdown(body, extensions=["extra", "sane_lists"])
            content_html = f"{content_html}\n{recap_html(metadata)}"
            Lesson.objects.update_or_create(
                module=module,
                order=day - first_day + 1,
                defaults={
                    "title": title,
                    "slug": lesson_slug,
                    "content": content_html,
                    "video_url": "",
                    "hero_image": f"/static/lesson_heroes/day{day:02d}_hero.png",
                    "is_preview": day == 1,
                },
            )

        bonus_module, _ = Module.objects.update_or_create(
            course=course,
            order=6,
            defaults={
                "title": "Advanced Prompting: 20 More Work-Saving Prompts",
                "is_bonus": True,
            },
        )
        prompt_items = "".join(f"<li><strong>Prompt {index}:</strong> {escape(prompt)}</li>" for index, prompt in enumerate(BONUS_PROMPTS, start=1))
        Lesson.objects.update_or_create(
            module=bonus_module,
            order=1,
            defaults={
                "title": "20 More Work-Saving Prompts",
                "slug": "bonus-20-work-saving-prompts",
                "content": (
                    "<h1>20 More Work-Saving Prompts</h1>"
                    "<p>Use these as starting points. Replace vague placeholders with your real context, constraints, audience, and desired output.</p>"
                    f"<ol>{prompt_items}</ol>"
                    "<aside class=\"challenge-recap\"><h2>Use them responsibly</h2><p><strong>Remember:</strong> Review sensitive inputs · Verify important claims · Keep human judgment in the loop</p></aside>"
                ),
                "video_url": "",
                "hero_image": "/static/lesson_heroes/day21_hero.png",
                "is_preview": False,
            },
        )

        # Remove stale rows if the command previously imported a different structure.
        Module.objects.filter(course=course).exclude(order__in=range(1, 7)).delete()
        for module, first_day, last_day in modules.values():
            module.lessons.exclude(order__in=range(1, last_day - first_day + 2)).delete()

        Product.objects.update_or_create(
            slug=COURSE_SLUG,
            defaults={
                "title": "The 21-Day AI Challenge",
                "product_type": Product.ProductType.COURSE,
                "short_description": "From zero to up-and-running with AI in 21 days.",
                "description": course.description,
                "price": options["price"],
                "price_usd": "39.00",
                "is_active": True,
                "is_featured": True,
                "cover_image": "/static/lesson_heroes/day01_hero.png",
                "course": course,
            },
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Imported 1 course, 5 core modules, 21 core lessons, 1 gated bonus module, and 1 product."
            )
        )
