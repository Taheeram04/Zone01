"""Starter technology skill sets for the Hire Talent page.

Adds the languages, frameworks/libraries and specializations shown in the
Technologies grid. ``get_or_create`` keeps any entry an editor has already
customised, and everything can be edited, reordered or removed in the admin.
"""

from django.db import migrations

SKILLS = [
    # Languages
    ("javascript", "JavaScript", "language", 1,
     "Interactive web interfaces and full-stack products."),
    ("typescript", "TypeScript", "language", 2,
     "Type-safe applications at product scale."),
    ("python", "Python", "language", 3,
     "Backend services, automation and data engineering."),
    ("c", "C", "language", 4,
     "Systems programming and low-level problem solving."),
    ("c-plus-plus", "C++", "language", 5,
     "Performance-critical software and systems work."),
    ("golang", "Golang", "language", 6,
     "Fast, concurrent services and cloud tooling."),
    ("rust", "Rust", "language", 7,
     "Memory-safe systems and high-performance tooling."),
    ("java", "Java", "language", 8,
     "Enterprise services and Android applications."),
    ("php", "PHP", "language", 9,
     "Pragmatic web backends and APIs."),
    ("ruby", "Ruby", "language", 10,
     "Rapid product development with Ruby on Rails."),
    ("sql", "SQL", "language", 11,
     "Data modelling, querying and reporting."),
    ("bash", "Bash", "language", 12,
     "Automation, scripting and developer tooling."),
    # Frameworks and libraries
    ("react", "React", "framework", 1,
     "Component-driven interfaces for modern web apps."),
    ("next-js", "Next.js", "framework", 2,
     "Server-rendered React products and marketing sites."),
    ("vue-js", "Vue.js", "framework", 3,
     "Progressive, approachable frontend applications."),
    ("angular", "Angular", "framework", 4,
     "Structured, enterprise-grade frontends."),
    ("django", "Django", "framework", 5,
     "Secure, batteries-included Python backends."),
    ("fastapi", "FastAPI", "framework", 6,
     "High-performance Python APIs with typed contracts."),
    ("node-js", "Node.js", "framework", 7,
     "Event-driven APIs and real-time services."),
    ("express", "Express", "framework", 8,
     "Lightweight Node.js APIs and web services."),
    ("laravel", "Laravel", "framework", 9,
     "Expressive PHP applications and REST APIs."),
    ("spring-boot", "Spring Boot", "framework", 10,
     "Production-grade Java microservices."),
    ("flutter", "Flutter", "framework", 11,
     "Cross-platform mobile apps from one codebase."),
    ("dot-net", ".NET", "framework", 12,
     "Enterprise applications across web and desktop."),
    # Specializations
    ("full-stack", "Full Stack", "specialization", 1,
     "End-to-end product engineering across the stack."),
    ("front-end", "Front End", "specialization", 2,
     "Accessible, responsive interfaces and design systems."),
    ("back-end", "Back End", "specialization", 3,
     "APIs, data models and service reliability."),
    ("devops", "DevOps", "specialization", 4,
     "CI/CD, infrastructure as code and observability."),
    ("ui-ux-design", "UI/UX Design", "specialization", 5,
     "Research-led product and interface design."),
    ("business-analysis", "Business Analysis", "specialization", 6,
     "Requirements, process mapping and delivery support."),
    ("ai-ml", "AI/ML", "specialization", 7,
     "Applied machine learning and AI product engineering."),
    ("data-engineering", "Data Engineering", "specialization", 8,
     "Pipelines, warehouses and reliable data platforms."),
    ("cybersecurity", "Cybersecurity", "specialization", 9,
     "Secure architecture, testing and threat mitigation."),
    ("cloud-computing", "Cloud Computing", "specialization", 10,
     "Cloud-native delivery on AWS, Azure and GCP."),
    ("mobile-development", "Mobile Development", "specialization", 11,
     "Native and cross-platform mobile products."),
    ("qa-testing", "QA & Testing", "specialization", 12,
     "Automated testing and release quality assurance."),
    ("blockchain", "Blockchain", "specialization", 13,
     "Smart contracts and decentralised applications."),
]


def seed_skills(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    for slug, name, category, order, description in SKILLS:
        Service.objects.get_or_create(
            slug=slug,
            defaults={
                "name": name,
                "title": name,
                "category": category,
                "order": order,
                "description": description,
            },
        )


def remove_skills(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.filter(slug__in=[skill[0] for skill in SKILLS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0002_seed_services"),
    ]

    operations = [
        migrations.RunPython(seed_skills, remove_skills),
    ]
