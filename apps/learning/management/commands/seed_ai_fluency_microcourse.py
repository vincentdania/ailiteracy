from django.core.management.base import BaseCommand
from django.db import transaction

from apps.learning.models import Course, FinalQuizOption, FinalQuizQuestion, Lesson, Module


class Command(BaseCommand):
    help = "Seed the Introduction to AI Literacy course content and final quiz."

    @transaction.atomic
    def handle(self, *args, **options):
        course, _ = Course.objects.get_or_create(
            slug="ai-fluency",
            defaults={
                "title": "Introduction to AI Literacy: Foundations for Africa",
                "summary": "A practical foundation course on AI concepts, safe use, and economic impact in Africa.",
                "description": (
                    "A structured introduction to AI literacy covering model behavior, "
                    "prompting, risk management, governance, and AI economics in African contexts."
                ),
                "is_featured": True,
            },
        )
        course.title = "Introduction to AI Literacy: Foundations for Africa"
        course.summary = "A practical foundation course on AI concepts, safe use, and economic impact in Africa."
        course.description = (
            "A structured introduction to AI literacy covering model behavior, "
            "prompting, risk management, governance, and AI economics in African contexts."
        )
        course.is_featured = True
        course.save(update_fields=["title", "summary", "description", "is_featured"])

        lesson_payload = [
            {
                "module_title": "Module 1: What AI Literacy Means (6 mins)",
                "lesson_title": "Foundations of AI Literacy",
                "lesson_slug": "foundations-of-ai-literacy",
                "content": (
                    "AI literacy is the ability to understand, evaluate, and apply AI systems responsibly.\n\n"
                    "In practice, AI literacy combines five capabilities:\n"
                    "1) Conceptual understanding: what AI can and cannot do.\n"
                    "2) Practical use: writing prompts and structuring workflows.\n"
                    "3) Critical evaluation: spotting errors, hallucinations, and weak evidence.\n"
                    "4) Governance awareness: privacy, safety, and accountability controls.\n"
                    "5) Economic judgment: how AI changes tasks, value chains, and workforce skills.\n\n"
                    "This course uses applied African examples so learners can move from curiosity to execution."
                ),
            },
            {
                "module_title": "Module 2: AI System Types and Capability Ladder (8 mins)",
                "lesson_title": "Narrow AI, Wide AI, Agentic, Embodied, AGI, and ASI",
                "lesson_slug": "ai-fluency-framework",
                "content": (
                    "Narrow AI:\n"
                    "- Built for specific tasks (classification, translation, recommendations).\n"
                    "- High performance inside defined boundaries.\n\n"
                    "Wide AI (broad-domain AI):\n"
                    "- Handles a wider set of related tasks across domains, but remains bounded.\n"
                    "- More adaptable than narrow systems, not fully general.\n\n"
                    "Agentic AI:\n"
                    "- Plans and executes multi-step goals with tools, memory, and feedback loops.\n"
                    "- Useful for operations, research, and orchestration tasks.\n\n"
                    "Embodied AI:\n"
                    "- AI connected to physical systems (robots, drones, vehicles, sensors).\n"
                    "- Must reason under real-world uncertainty and constraints.\n\n"
                    "AGI:\n"
                    "- Hypothetical human-level general intelligence across diverse tasks.\n\n"
                    "ASI:\n"
                    "- Hypothetical intelligence far beyond human cognitive capability.\n\n"
                    "Literacy goal: match system type to real use-cases without hype."
                ),
            },
            {
                "module_title": "Module 3: How Modern AI Models Work (8 mins)",
                "lesson_title": "Prediction, Context Windows, and Model Limitations",
                "lesson_slug": "prompting-basics-practice",
                "content": (
                    "Most language models predict likely next tokens from patterns in training data.\n\n"
                    "What this enables:\n"
                    "- Drafting, summarization, coding assistance, ideation, synthesis.\n\n"
                    "What this does not guarantee:\n"
                    "- Ground-truth accuracy.\n"
                    "- Reliable citation quality.\n"
                    "- Human-level understanding or intent.\n\n"
                    "Key limitations:\n"
                    "- Hallucinations: fluent but incorrect outputs.\n"
                    "- Context limits: long documents may lose important details.\n"
                    "- Distribution shifts: poor reliability in unfamiliar contexts.\n\n"
                    "Operational habit: trust workflow, not confidence tone."
                ),
            },
            {
                "module_title": "Module 4: Prompt Engineering for Real Work (8 mins)",
                "lesson_title": "Prompt Design for Reliable Outputs",
                "lesson_slug": "risks-ethics-responsible-use",
                "content": (
                    "High-performance prompt pattern:\n"
                    "- Objective: what exact outcome do you need?\n"
                    "- Context: business, audience, geography, constraints.\n"
                    "- Criteria: quality bar, risk constraints, tone, format.\n"
                    "- Verification: request assumptions, unknowns, and citations.\n\n"
                    "Example for African policy work:\n"
                    "- Ask for a policy memo in sections with quantified assumptions, risks, and implementation steps.\n"
                    "- Require source placeholders and manual validation checklist.\n\n"
                    "Prompting rule:\n"
                    "- Better context plus better constraints equals better output quality."
                ),
            },
            {
                "module_title": "Module 5: Hallucinations, Bias, and Fairness (8 mins)",
                "lesson_title": "Risk Detection and Mitigation",
                "lesson_slug": "hallucination-bias-fairness",
                "content": (
                    "Hallucination controls:\n"
                    "- Ask for uncertainty markers and missing data notices.\n"
                    "- Validate critical claims against trusted sources.\n"
                    "- Use human review for high-stakes outputs.\n\n"
                    "Bias and fairness controls:\n"
                    "- Audit training and proxy features.\n"
                    "- Test subgroup performance before deployment.\n"
                    "- Track false-positive/false-negative disparities.\n"
                    "- Provide appeal and override pathways.\n\n"
                    "Applied principle:\n"
                    "- Performance without fairness and accountability is not responsible AI."
                ),
            },
            {
                "module_title": "Module 6: Governance, Privacy, and Safety (8 mins)",
                "lesson_title": "Policy, Compliance, and Human Oversight",
                "lesson_slug": "governance-privacy-safety",
                "content": (
                    "Core governance controls for organizations:\n"
                    "- Data classification before AI use (public, internal, restricted).\n"
                    "- Privacy-by-design for personal and sensitive records.\n"
                    "- Human-in-the-loop checks for critical decisions.\n"
                    "- Logging, audit trails, and incident response processes.\n"
                    "- Vendor risk review and model usage policies.\n\n"
                    "For sectors like health, education, public services, and finance:\n"
                    "- Require explicit accountability for final decisions.\n"
                    "- Keep traceability from input to action."
                ),
            },
            {
                "module_title": "Module 7: AI Economics and Jobs in Africa (7 mins)",
                "lesson_title": "Productivity, Skills, and Economic Transition",
                "lesson_slug": "ai-economics-africa",
                "content": (
                    "AI primarily transforms tasks, then roles, then markets.\n\n"
                    "Economic effects in African contexts:\n"
                    "- Task automation in documentation, support, and analysis.\n"
                    "- New demand for verification, operations, and AI governance skills.\n"
                    "- Faster entrepreneurship through lower production and research costs.\n"
                    "- Uneven gains without deliberate upskilling and inclusion policies.\n\n"
                    "AI literacy is now a labor-market advantage, not optional knowledge."
                ),
            },
            {
                "module_title": "Module 8: Adoption Playbook and Next Steps (6 mins)",
                "lesson_title": "From Learning to Responsible Deployment",
                "lesson_slug": "adoption-playbook-next-steps",
                "content": (
                    "90-day AI literacy adoption plan:\n"
                    "1) Identify three high-impact workflows.\n"
                    "2) Define measurable success metrics.\n"
                    "3) Pilot with strong human review.\n"
                    "4) Document prompt patterns and quality controls.\n"
                    "5) Train teams on safety, privacy, and escalation rules.\n"
                    "6) Review outcomes monthly and improve.\n\n"
                    "Outcome of this course:\n"
                    "- You should be able to evaluate AI systems, use them responsibly, and lead practical adoption with clear governance."
                ),
            },
        ]

        valid_orders = list(range(1, len(lesson_payload) + 1))
        Module.objects.filter(course=course).exclude(order__in=valid_orders).delete()
        for idx, payload in enumerate(lesson_payload, start=1):
            module, _ = Module.objects.get_or_create(course=course, order=idx, defaults={"title": payload["module_title"]})
            module.title = payload["module_title"]
            module.save(update_fields=["title"])
            module.lessons.exclude(order=1).delete()

            lesson, _ = Lesson.objects.get_or_create(
                module=module,
                order=1,
                defaults={
                    "title": payload["lesson_title"],
                    "slug": payload["lesson_slug"],
                    "content": payload["content"],
                },
            )
            lesson.title = payload["lesson_title"]
            lesson.slug = payload["lesson_slug"]
            lesson.content = payload["content"]
            lesson.is_preview = True
            lesson.save(update_fields=["title", "slug", "content", "is_preview"])

        quiz_payload = [
            {
                "text": "What best describes AI literacy?",
                "options": [
                    ("Using AI tools without supervision.", False),
                    ("Understanding, evaluating, and applying AI responsibly.", True),
                    ("Only knowing the names of popular models.", False),
                    ("Writing prompts faster than colleagues.", False),
                ],
            },
            {
                "text": "Which option is a clear example of narrow AI?",
                "options": [
                    ("A model specialized for invoice fraud detection.", True),
                    ("A system that performs all human cognitive tasks.", False),
                    ("A physical robot with self-awareness.", False),
                    ("A universal model that never requires adaptation.", False),
                ],
            },
            {
                "text": "Agentic AI is best defined as:",
                "options": [
                    ("A static model returning one-off predictions only.", False),
                    ("A system that plans and executes multi-step tasks with feedback.", True),
                    ("A chatbot that cannot use tools.", False),
                    ("Any model deployed in a mobile app.", False),
                ],
            },
            {
                "text": "Which scenario is the strongest example of embodied AI?",
                "options": [
                    ("A report generator for quarterly finance updates.", False),
                    ("A drone that maps farms and adjusts path in real time.", True),
                    ("A social media caption tool.", False),
                    ("A grammar correction widget.", False),
                ],
            },
            {
                "text": "What is the most reliable way to reduce hallucination risk?",
                "options": [
                    ("Ask the model to be confident.", False),
                    ("Validate critical claims against trusted external sources.", True),
                    ("Use longer prompts only.", False),
                    ("Avoid all use of citations.", False),
                ],
            },
            {
                "text": "Which is a core fairness control in AI deployment?",
                "options": [
                    ("Ignore subgroup outcomes if total accuracy is high.", False),
                    ("Audit outcomes across demographic and contextual subgroups.", True),
                    ("Hide model behavior from end users.", False),
                    ("Remove all human review for consistency.", False),
                ],
            },
            {
                "text": "Before using sensitive records with AI, what should organizations do first?",
                "options": [
                    ("Share full data to improve model context.", False),
                    ("Classify data and redact restricted personal information.", True),
                    ("Assume vendors automatically handle all compliance duties.", False),
                    ("Use screenshots to avoid privacy obligations.", False),
                ],
            },
            {
                "text": "What is a realistic statement about AI and employment in Africa?",
                "options": [
                    ("AI removes every job permanently.", False),
                    ("AI reshapes task demand, creating pressure for reskilling.", True),
                    ("AI affects only large foreign firms.", False),
                    ("AI adoption has no influence on productivity.", False),
                ],
            },
            {
                "text": "A strong prompt for high-stakes analysis should include:",
                "options": [
                    ("Only a broad objective and no constraints.", False),
                    ("Objective, context, constraints, output format, and validation instructions.", True),
                    ("As many adjectives as possible.", False),
                    ("A request for persuasive language above all else.", False),
                ],
            },
            {
                "text": "Why is human oversight still required in many AI workflows?",
                "options": [
                    ("Because AI cannot produce any useful output.", False),
                    ("Because accountability, safety, and contextual judgment remain human responsibilities.", True),
                    ("Because oversight improves internet speed.", False),
                    ("Because governance applies only to robotics.", False),
                ],
            },
        ]

        course.final_quiz_questions.all().delete()
        for q_index, question_payload in enumerate(quiz_payload, start=1):
            question = FinalQuizQuestion.objects.create(course=course, text=question_payload["text"], order=q_index)
            for o_index, (option_text, is_correct) in enumerate(question_payload["options"], start=1):
                FinalQuizOption.objects.create(
                    question=question,
                    text=option_text,
                    is_correct=is_correct,
                    order=o_index,
                )

        self.stdout.write(self.style.SUCCESS("AI Fluency micro-course seeded successfully."))
