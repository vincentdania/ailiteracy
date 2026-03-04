from django.db import migrations


COURSE_TITLE = "Introduction to AI Literacy: What is AI and Who Is Considered AI Literate?"
COURSE_SUMMARY = "A 15-minute introduction to what AI is and what it means to be AI literate."
COURSE_DESCRIPTION = (
    "Artificial Intelligence is transforming how Nigerians learn, work, and build businesses. "
    "This short course explains what AI really is (beyond hype), and what it means to be AI "
    "literate, so you can use AI tools responsibly and effectively."
)


LESSON_PAYLOAD = [
    {
        "module_title": "Lesson 1 - What is Artificial Intelligence?",
        "lesson_title": "What is Artificial Intelligence?",
        "lesson_slug": "what-is-artificial-intelligence",
        "content": (
            "Artificial Intelligence (AI) refers to computer systems designed to perform tasks that normally require "
            "human intelligence, like understanding language, recognizing images, solving problems, generating text, "
            "and making predictions.\n\n"
            "Most modern AI systems do not \"think\" like humans. Many (especially Generative AI tools like ChatGPT) "
            "generate outputs by predicting likely patterns from training data. This makes them powerful, but it "
            "also means they can sometimes produce confident-sounding mistakes.\n\n"
            "AI vs Machine Learning vs Generative AI\n"
            "- AI: the broad field of making machines perform intelligent tasks.\n"
            "- Machine Learning (ML): a subset of AI where systems learn patterns from data (e.g., fraud detection).\n"
            "- Generative AI: systems that create content: text, images, code, audio.\n\n"
            "Nigeria/Africa examples:\n"
            "- Banks use AI/ML to detect fraud and unusual transactions.\n"
            "- Agritech tools use AI to monitor crop health (often via satellite/drone imagery).\n"
            "- Customer service chatbots are used by telecoms and service companies.\n"
            "- Generative AI helps people draft documents, summarize reports, and write code.\n\n"
            "Key takeaway:\n"
            "AI is best treated as a powerful tool, not a truth machine, not a human brain."
        ),
    },
    {
        "module_title": "Lesson 2 - Where You Already Encounter AI",
        "lesson_title": "Where You Already Encounter AI",
        "lesson_slug": "where-you-already-encounter-ai",
        "content": (
            "Even if you've never used ChatGPT, you likely interact with AI every day:\n"
            "- Search engines (Google): ranking results and generating answer snippets.\n"
            "- Social media feeds (TikTok/Instagram/YouTube): recommending content based on your behavior.\n"
            "- Banking: fraud detection and transaction monitoring.\n"
            "- Transport and logistics: route optimization and ETA prediction.\n"
            "- Customer support: automated chat assistants.\n"
            "- Writing assistants: drafting emails, proposals, CVs, reports.\n\n"
            "Key takeaway:\n"
            "AI is already part of daily life. AI literacy is learning to interact with it intelligently."
        ),
    },
    {
        "module_title": "Lesson 3 - Who Is Considered AI Literate?",
        "lesson_title": "Who Is Considered AI Literate?",
        "lesson_slug": "who-is-considered-ai-literate",
        "content": (
            "Being AI literate does NOT mean being a programmer.\n"
            "An AI literate person can:\n"
            "1) Explain what AI can and cannot do\n"
            "   - AI can generate ideas, draft content, and find patterns\n"
            "   - AI cannot guarantee truth, and it can be wrong confidently\n"
            "2) Use AI tools effectively (prompting)\n"
            "   Weak prompt: \"Write a business plan.\"\n"
            "   Strong prompt: \"Write a one-page plan for a Lagos-based logistics startup targeting SME retailers. "
            "Include pricing assumptions in naira, key risks, and next steps.\"\n"
            "3) Verify AI outputs\n"
            "   - Cross-check facts, statistics, and claims using trusted sources\n"
            "   - Use AI as a starting point, not a final authority\n"
            "4) Understand risks and ethics\n"
            "   - Hallucinations/misinformation\n"
            "   - Bias and unfair outcomes\n"
            "   - Data privacy (don't paste sensitive information)\n"
            "   - Overreliance (humans remain accountable)\n\n"
            "Key takeaway:\n"
            "AI literacy is the ability to use AI tools wisely, verify outputs, and manage risks."
        ),
    },
    {
        "module_title": "Lesson 4 - Why AI Literacy Matters (Nigeria/Africa)",
        "lesson_title": "Why AI Literacy Matters (Nigeria/Africa)",
        "lesson_slug": "why-ai-literacy-matters-nigeria-africa",
        "content": (
            "AI literacy is becoming as important as digital literacy.\n"
            "- Students: learn faster and research better, but must avoid misinformation and misuse.\n"
            "- Workers: improve productivity (reports, summaries, analysis) and remain competitive.\n"
            "- Entrepreneurs: small teams can do more: marketing, customer support, prototyping.\n"
            "- Public sector: better communication and service design, but requires governance and privacy.\n"
            "- Africa: AI can support solutions in health, agriculture, education, and inclusion, if people understand "
            "how to use it responsibly.\n\n"
            "Final takeaway:\n"
            "AI literacy is not about hype. It's about capability, judgment, and responsible use."
        ),
    },
]


QUIZ_PAYLOAD = [
    {
        "text": "Which statement best describes how modern AI language models work?",
        "options": [
            ("They search the internet in real time to generate answers.", False),
            ("They predict the next word based on patterns learned from large datasets.", True),
            ("They think and reason like humans.", False),
            ("They retrieve answers directly from a built-in database.", False),
        ],
    },
    {
        "text": "Which is the best example of responsible AI use in a Nigerian workplace?",
        "options": [
            ("Copying confidential company documents into AI to summarize them.", False),
            ("Using AI to draft a report and verifying key facts before submission.", True),
            ("Allowing AI to make final financial decisions without human review.", False),
            ("Using AI outputs without checking them because the system is advanced.", False),
        ],
    },
    {
        "text": "Which best describes AI literacy?",
        "options": [
            ("The ability to build machine learning algorithms.", False),
            ("The ability to understand AI systems, use them effectively, and verify outputs.", True),
            ("The ability to memorize AI terminology.", False),
            ("The ability to automate all tasks with AI.", False),
        ],
    },
    {
        "text": "Why can AI sometimes produce incorrect or misleading answers?",
        "options": [
            ("AI intentionally misleads users.", False),
            (
                "AI predicts patterns in language and may generate plausible but incorrect information.",
                True,
            ),
            ("AI cannot process language properly.", False),
            ("AI systems always rely on outdated data.", False),
        ],
    },
    {
        "text": "Which scenario best demonstrates AI augmentation rather than AI replacement?",
        "options": [
            ("A company fires staff and replaces them entirely with AI.", False),
            ("A teacher uses AI to help generate lesson plans but reviews them before teaching.", True),
            ("A bank allows AI to approve loans without human oversight.", False),
            ("A business stops hiring people because AI can do everything.", False),
        ],
    },
]


def forwards(apps, schema_editor):
    Course = apps.get_model("learning", "Course")
    Module = apps.get_model("learning", "Module")
    Lesson = apps.get_model("learning", "Lesson")
    FinalQuizQuestion = apps.get_model("learning", "FinalQuizQuestion")
    FinalQuizOption = apps.get_model("learning", "FinalQuizOption")

    course, _ = Course.objects.get_or_create(
        slug="ai-fluency",
        defaults={
            "title": COURSE_TITLE,
            "summary": COURSE_SUMMARY,
            "description": COURSE_DESCRIPTION,
            "is_featured": True,
        },
    )

    course.title = COURSE_TITLE
    course.summary = COURSE_SUMMARY
    course.description = COURSE_DESCRIPTION
    course.is_featured = True
    course.save(update_fields=["title", "summary", "description", "is_featured"])

    valid_module_orders = set()
    for module_order, payload in enumerate(LESSON_PAYLOAD, start=1):
        valid_module_orders.add(module_order)
        module, _ = Module.objects.get_or_create(
            course=course,
            order=module_order,
            defaults={"title": payload["module_title"]},
        )
        module.title = payload["module_title"]
        module.save(update_fields=["title"])

        lesson, _ = Lesson.objects.get_or_create(
            module=module,
            order=1,
            defaults={
                "title": payload["lesson_title"],
                "slug": payload["lesson_slug"],
                "content": payload["content"],
                "is_preview": True,
            },
        )
        lesson.title = payload["lesson_title"]
        lesson.slug = payload["lesson_slug"]
        lesson.content = payload["content"]
        lesson.is_preview = True
        lesson.save(update_fields=["title", "slug", "content", "is_preview"])

        Lesson.objects.filter(module=module).exclude(order=1).delete()

    Module.objects.filter(course=course).exclude(order__in=valid_module_orders).delete()

    valid_question_orders = set()
    for question_order, payload in enumerate(QUIZ_PAYLOAD, start=1):
        valid_question_orders.add(question_order)
        question, _ = FinalQuizQuestion.objects.get_or_create(
            course=course,
            order=question_order,
            defaults={"text": payload["text"]},
        )
        question.text = payload["text"]
        question.save(update_fields=["text"])

        valid_option_orders = set()
        for option_order, (option_text, is_correct) in enumerate(payload["options"], start=1):
            valid_option_orders.add(option_order)
            option, _ = FinalQuizOption.objects.get_or_create(
                question=question,
                order=option_order,
                defaults={"text": option_text, "is_correct": is_correct},
            )
            option.text = option_text
            option.is_correct = is_correct
            option.save(update_fields=["text", "is_correct"])

        FinalQuizOption.objects.filter(question=question).exclude(order__in=valid_option_orders).delete()

    FinalQuizQuestion.objects.filter(course=course).exclude(order__in=valid_question_orders).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("learning", "0002_courseattempt_finalquizquestion_finalquizoption_and_more"),
    ]

    operations = [
        migrations.RunPython(forwards, migrations.RunPython.noop),
    ]
