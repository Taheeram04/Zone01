"""Seed content for the FAQ knowledge base.

Single source of truth for the support answers used by both the website and the
WhatsApp assistant. Loaded with ``python manage.py seed_faqs``
(:mod:`content.management.commands.seed_faqs`), which is idempotent: re-running
it updates the wording without creating duplicates.

Each item's ``keywords`` are extra comma-separated terms the assistant can match
against a visitor's free-text message when the question wording alone is not
enough. Keep them lowercase and specific.
"""

FAQ_SEED = [
    {
        "slug": "application-progress",
        "title": "Application Progress",
        "blurb": "Everything you need before you take the cognitive games.",
        "items": [
            {
                "question": "How to apply?",
                "answer": (
                    "To apply you need to create an account via Join us. Once you have created an "
                    "account, you can take the cognitive tests."
                ),
                "keywords": "apply, application, sign up, register, create account, join us, "
                "how do i apply, application process, get started, kujiunga, maombi, kuomba, "
                "kujisajili, ninaweza, jinsi ya kujiunga, nataka kujiunga",
            },
            {
                "question": "What is the online cognitive test?",
                "answer": (
                    "Our online cognitive test lasts just over an hour and a half. It consists of "
                    "a short memory game, followed by a longer logic game.\n\n"
                    "Memorization, problem solving and logical reasoning skills are very good "
                    "indicators of your abilities to become a creative digital talent!\n\n"
                    "No development experience is needed to complete the games and you don't need "
                    "to revise for it."
                ),
                "keywords": "cognitive test, online test, memory game, logic game, games, "
                "what is the test like, aptitude test, assessment",
            },
            {
                "question": "When can I apply?",
                "answer": (
                    "Applications are on a rolling basis. The first step is to take the cognitive "
                    "tests online. Check out this page - Join us - to create your profile and then "
                    "access the tests.\n\n"
                    "The cognitive test results are evaluated at the latest within 2 weeks preceding "
                    "each Piscine. If no pool date is announced, applications may be temporarily "
                    "suspended. In this case, you can consult the site regularly to stay informed of "
                    "the next Piscine dates."
                ),
                "keywords": "when can i apply, application deadline, when to apply, rolling basis, "
                "application window, intake, applications open, lini kuomba, muda wa maombi, "
                "nafasi",
            },
            {
                "question": "How many times can I try the online cognitive test?",
                "answer": (
                    "Once you've started the test, you can't pause or restart it. You have three "
                    "attempts to complete the online tests and your last result will count, so "
                    "there's no risk in trying again."
                ),
                "keywords": "how many times, attempts, retake test, retry, fail the test, "
                "three attempts, can i take the test again",
            },
            {
                "question": "Who can apply?",
                "answer": (
                    "The Zone01 Kisumu digital training is open to anyone over 18 years old. No "
                    "prior programming experience or academic qualifications are required to "
                    "apply.\n\n"
                    "Diversity and Inclusion are key elements of Zone01 Kisumu's mission. We "
                    "therefore particularly encourage women, people with disabilities, people from "
                    "disadvantaged backgrounds, refugees and ethnic minorities to apply."
                ),
                "keywords": "who can apply, who is eligible, eligible, eligibility, requirements, "
                "age, over 18, qualifications, do i need experience, can girls apply, women, "
                "umri, sifa, mahitaji, nani anaweza kuomba, wanawake, kcse, grades, entry, "
                "no degree, without degree, no qualifications",
            },
            {
                "question": "What are the qualities required?",
                "answer": (
                    "We're not testing your math skills - your passion, collaboration, "
                    "perseverance, and creativity are much stronger indicators to gauge your ability "
                    "to code. Our curriculum is designed to be challenging and demanding, and our "
                    "learners should work together collaboratively, not in competition with each "
                    "other.\n\n"
                    "Passion - You need to have an interest in software development, combined with a "
                    "strong motivation to develop your skills.\n\n"
                    "Collaboration - It is important to be able to work as a team to complete "
                    "projects and overcome obstacles.\n\n"
                    "Creativity - You will have to be able to quickly find innovative solutions and "
                    "imagine different approaches to solving complex problems.\n\n"
                    "Perseverance - It is necessary to keep your motivation and to remain assiduous "
                    "despite the increasing difficulty of the projects to be carried out."
                ),
                "keywords": "qualities, skills needed, passion, collaboration, creativity, "
                "perseverance, do i need maths, math skills, what do you look for",
            },
            {
                "question": "What are the different stages of the application procedure?",
                "answer": (
                    "Cognitive tests - online cognitive tests consisting of two games. If you pass "
                    "these tests, you will be invited to participate in the Piscine.\n\n"
                    "The Piscine - a four-week period of immersion in software programming based on "
                    "face-to-face projects. If you pass this pool, you will be invited to enroll in "
                    "the Zone01 Kisumu program.\n\n"
                    "Please note: The Piscine is an intensive screening process to test your ability "
                    "to learn quickly, perform intensive work, collaborate with other people and, "
                    "most importantly, test your motivation."
                ),
                "keywords": "stages, application steps, process, application procedure, steps, "
                "what happens next, selection process",
            },
        ],
    },
    {
        "slug": "the-piscine",
        "title": "The Piscine",
        "blurb": "The four-week, in-person selection sprint.",
        "items": [
            {
                "question": "If I can't attend the Piscine I have been accepted to participate in, "
                "are there other options?",
                "answer": (
                    "If you are contacted to participate in the Piscine and you cannot join us on "
                    "the dates indicated, we suggest that you participate in a future Piscine if "
                    "the dates are fixed and there are places available.\n\n"
                    "As the number of places is limited, if you decide to participate in a Piscine "
                    "it means that you know that you are fully available for the duration of the 4 "
                    "weeks."
                ),
                "keywords": "cant attend piscine, miss piscine, reschedule piscine, future piscine, "
                "unavailable, defer, postpone",
            },
            {
                "question": "When will I know if I am accepted to participate in the Piscine?",
                "answer": (
                    "If you are shortlisted for the pool, you will be contacted by phone or email "
                    "within 2 weeks prior to the Piscine."
                ),
                "keywords": "when accepted, piscine acceptance, shortlisted, invitation, when do i hear "
                "back, selected for piscine",
            },
            {
                "question": "When and where does the Piscine take place?",
                "answer": (
                    "We will organize several successive Piscines once we have enough qualified "
                    "candidates from the games. Each Piscine lasts 4 weeks. The Piscines take place "
                    "on-site, face-to-face, at the Zone01 Kisumu campus located at LakeHub, Lake "
                    "Basin Mall in Kisumu."
                ),
                "keywords": "when piscine, where piscine, piscine date, next piscine, upcoming "
                "piscine, location, venue, campus, dates, how long, 4 weeks, kisumu, lake basin mall, "
                "piscine iko wapi, piscine ni lini, mahali, wapi, muda, lini, tarehe",
            },
            {
                "question": "I failed the Piscine, can I re-register?",
                "answer": (
                    "If you failed the Piscine, it is possible to retake the cognitive tests to try "
                    "to be preselected again for a Piscine. However, you have to wait a year before "
                    "you can apply again."
                ),
                "keywords": "failed piscine, re-register, retake piscine, reapply, apply again, "
                "wait a year, second chance",
            },
            {
                "question": "What is the Piscine?",
                "answer": (
                    "The Piscine is an intensive 4-week programming challenge that takes place on "
                    "the Zone01 Kisumu campus. It is based on a unique Zone01 educational model. You "
                    "will carry out different quests during the four weeks. Every Friday, you will "
                    "take a test to assess your personal progress. On weekends, team projects will "
                    "allow you to test your understanding and consolidate your learning from the "
                    "previous week. If you are admitted to the Piscine, get ready for four very "
                    "intense and extremely rewarding weeks. You will make many friends and new "
                    "memories, while acquiring a complete introduction to software development."
                ),
                "keywords": "what is the piscine, piscine meaning, pool, 4 week challenge, bootcamp, "
                "selection month",
            },
            {
                "question": "How do you assess the Piscine participants?",
                "answer": (
                    "The Piscine, like the entire course, is based on modification. This means that "
                    "you will receive points for all quests completed, including group projects and "
                    "the assessments you complete.\n\n"
                    "The Piscine evaluates your ability to learn quickly, perform intensive work, "
                    "collaborate with other people and, above all, test your motivation. We also take "
                    "into account your work ethic, your contribution to the collaboration and your "
                    "willingness to learn during this experience throughout the 4 weeks.\n\n"
                    "It is the Piscine that will determine whether or not you can integrate the "
                    "training, because this stage makes it possible to identify your motivation, your "
                    "aptitude for software development and your fulfillment in this innovative "
                    "educational approach."
                ),
                "keywords": "assessed, grading, piscine points, how are participants evaluated, "
                "passed or failed, evaluation, score",
            },
            {
                "question": "How will I know if I have been accepted into the Piscine?",
                "answer": (
                    "When you have completed the games, you will see the level you have reached for "
                    "each one. If you are pre-selected after the online games, you will be contacted "
                    "by phone or email to attend a check-in session before you register for the "
                    "Piscine. Participation in the Piscine is the 2nd stage of selection. If you "
                    "don't hear from us, it means you haven't been shortlisted, because there are a "
                    "lot of applications and unfortunately we cannot respond to each person when "
                    "they are not selected."
                ),
                "keywords": "accepted into piscine, piscine result, hear back, check-in session, "
                "no response, not selected, second stage",
            },
        ],
    },
    {
        "slug": "course-training",
        "title": "The Modalities of the Course / Training",
        "blurb": "How the peer-to-peer program actually works, day to day.",
        "items": [
            {
                "question": "Is it an e-learning (distance) training?",
                "answer": (
                    "No, the training offered by Zone01 Kisumu is not an e-learning training. It is "
                    "a face-to-face training (on site)."
                ),
                "keywords": "e-learning, online training, online classes, online course, virtual, "
                "zoom, distance learning, remote, study from home, is it online, physical, on site",
            },
            {
                "question": "How can we learn without teachers and lessons?",
                "answer": (
                    "You will learn through our innovative 01Edu platform - a peer-to-peer and "
                    "gamified learning platform, through which thousands of people around the world "
                    "have gained ready-to-use digital talents. By collaborating with other learners "
                    "on group projects, as well as honing your skills individually, you will acquire "
                    "a full set of skills.\n\n"
                    "The 01Edu platform has instructions, support videos and built-in functions to "
                    "teach everyone the basics of programming. The 01 community promotes the creation "
                    "of collective intelligence. Study groups and chats are planned to promote "
                    "support and collaborative work. Throughout your training, the Zone01 Kisumu "
                    "team will be available to answer any questions you may have or provide "
                    "additional support if needed."
                ),
                "keywords": "no teachers, no lessons, peer to peer, 01edu, how do we learn, "
                "self learning, platform, no lecturers",
            },
            {
                "question": "Can I be absent / take a vacation during the training?",
                "answer": (
                    "It is possible to be absent or take a leave of absence as long as you catch up "
                    "with the training. You can therefore decide when you will be absent during your "
                    "first year of training. The terms of absence during the work-study period will "
                    "be defined with the team."
                ),
                "keywords": "absent, vacation, leave, holiday, time off, break during training",
            },
            {
                "question": "Do I have to have a laptop to be able to join the training?",
                "answer": (
                    "The campus is equipped to allow each learner to work on a computer. It is not "
                    "necessary to have a personal computer to be part of the training."
                ),
                "keywords": "laptop, computer, do i need a laptop, equipment, own computer, device, "
                "kompyuta, laptop yangu, kifaa",
            },
            {
                "question": "If I don't want to complete the training, can I drop out during the "
                "course?",
                "answer": (
                    "Our free education model is made possible by our partner companies, who work "
                    "with us to recruit the best digital talent. In order to receive a complete "
                    "training in programming and to guarantee you the best job prospects, it is "
                    "essential to complete your training."
                ),
                "keywords": "drop out, quit, leave the course, abandon training, withdraw",
            },
            {
                "question": "What support is available for learners on campus?",
                "answer": (
                    "Two types of support are offered to learners by Zone01: technical support and "
                    "support concerning well-being.\n\n"
                    "Technical coaching - when learners are completely stuck on a problem, they can "
                    "ask questions and our technical coaches will be available to help guide their "
                    "thinking around solving complex problems without giving the full answer!\n\n"
                    "Well-being support - resource people are available on campus to help learners "
                    "feel good and deal with any difficulties they may encounter during the course."
                ),
                "keywords": "support, help, coaching, technical support, wellbeing, student support, "
                "stuck, assistance",
            },
            {
                "question": "Is the program full-time and how many days per week does it take?",
                "answer": (
                    "This is an intensive program based on the principle of peer learning. You will "
                    "have to make sure that, during group work, you are able to work at the same time "
                    "as the other learners.\n\n"
                    "To offer the greatest flexibility to everyone, the campus is open 24 hours a "
                    "day, 7 days a week.\n\n"
                    "Access to the campus is therefore done in such a way that you can come and go "
                    "without time constraints.\n\n"
                    "The program is entirely self-paced."
                ),
                "keywords": "full-time, part-time, days per week, hours, schedule, timetable, "
                "how many days, flexible",
            },
            {
                "question": "How is the program graded over the three years? Is it a pass or fail "
                "system?",
                "answer": (
                    "This is not a pass or fail system, but rather an escalation of challenges as "
                    "you progress through the training. There are 60 different projects to solve "
                    "during the training and you will level up once you complete each project.\n\n"
                    "Moreover, it is completely normal to fail a project! This is how you learn from "
                    "your mistakes. Like the cognitive tests when you apply, the course is designed "
                    "to train highly competent full-stack developers, so the level is intentionally "
                    "difficult."
                ),
                "keywords": "grading, graded, pass or fail, marks, exams, score, how are we graded, "
                "level up, projects",
            },
            {
                "question": "What programming languages will I learn?",
                "answer": (
                    "You will be exposed to several programming languages. By carrying out around "
                    "sixty projects, you will learn to code in JavaScript, Go and Rust, as well as C, "
                    "C++, Ruby on Rails, PHP and Python. You will be able to code in most of the "
                    "programming environments."
                ),
                "keywords": "languages, programming languages, what will i learn, javascript, go, "
                "golang, rust, python, php, c++, ruby, tech stack, curriculum",
            },
            {
                "question": "What is Zone01 Kisumu?",
                "answer": (
                    "Zone01 Kisumu offers a 2-year training program and is the start of your career "
                    "as a full-stack developer, followed by a 3-year guaranteed job contract. It "
                    "consists of:\n\n"
                    "- 18 months of free training, based on the resolution of projects, which will "
                    "allow you to acquire very complete skills in software development.\n"
                    "- 12 months of work-study to deepen your skills and work on projects of partner "
                    "companies.\n"
                    "- 6 months of professional training on projects of partner companies.\n"
                    "- 3 years guaranteed job contract."
                ),
                "keywords": "what is zone01, about the program, duration, 2 years, job contract, "
                "overview, who is zone01, duration, how long is the course, how long is the "
                "program, course length, long, length, course, years, many, muda, miaka, wiki, "
                "ni nini",
            },
            {
                "question": "What are the qualities required by the Zone01 program / course?",
                "answer": (
                    "Passion - You need to have an interest in software development, combined with a "
                    "strong motivation to develop your skills.\n\n"
                    "Collaboration - It is important to be able to work as a team to complete "
                    "projects and overcome obstacles.\n\n"
                    "Creativity - You will have to be able to quickly find innovative solutions and "
                    "imagine different approaches to solving complex problems.\n\n"
                    "Perseverance - It is necessary to keep your motivation and to remain assiduous "
                    "despite the increasing difficulty of the projects to be carried out.\n\n"
                    "We're not testing your math skills - your passion, collaboration, perseverance, "
                    "and creativity are much stronger indicators to gauge your ability to code. This "
                    "is why we do not recruit on the basis of studies: everyone has their place at "
                    "Zone01 Kisumu, whatever the course.\n\n"
                    "Our curriculum is designed to be challenging and demanding, and our learners "
                    "should work together collaboratively, not in competition with each other."
                ),
                "keywords": "qualities required, what do i need, traits, skills, passion, "
                "collaboration, creativity, perseverance, maths",
            },
            {
                "question": "Can I work while I learn?",
                "answer": (
                    "Training is a big commitment, and it is not possible to work full time while "
                    "you are training."
                ),
                "keywords": "work while learning, part-time job, employment during training, "
                "can i work, side job",
            },
            {
                "question": "What support is available for people with learning difficulties?",
                "answer": (
                    "The Learner Experience team is here to support, encourage and help you thrive. "
                    "They provide quality advice and guidance and can also offer learning support to "
                    "help you if you live with a disability or have a learning difficulty."
                ),
                "keywords": "learning difficulties, disability, special needs, accessibility, "
                "dyslexia, support for disabilities",
            },
            {
                "question": "Do I have to be physically present on campus? Can I learn from home?",
                "answer": (
                    "The training is based on a highly collaborative and community-oriented "
                    "pedagogical approach. About 80% of the projects in the program are done in "
                    "groups, which are easier and faster to complete when you are together in the "
                    "same room.\n\n"
                    "The Zone01 Kisumu campus is accessible 24 hours a day, 7 days a week, to allow "
                    "everyone to work flexibly at the times that suit them best. However, we strongly "
                    "encourage our applicants to take precautions when leaving the campus late at "
                    "night or early in the morning.\n\n"
                    "We strongly advise you to be present on campus throughout the duration of the "
                    "training, because it is of immense importance to be in the environment and to "
                    "learn and pass on knowledge to other members of the community. It is very "
                    "motivating to work and learn together - you will progress faster. In addition, "
                    "we regularly organize social activities and conferences on campus to enrich your "
                    "learning experience."
                ),
                "keywords": "physically present, campus, learn from home, remote, attendance, "
                "must i be on site, presence",
            },
            {
                "question": "What is the content of the three-year course?",
                "answer": (
                    "During the first 18 months, learners will discover the Go, JavaScript and Rust "
                    "language libraries. Each language will require 6 months of working on projects, "
                    "allowing learners to deepen their understanding of the language and explore "
                    "additional concepts. Learners will be divided into groups so that they can work "
                    "as a team on projects."
                ),
                "keywords": "course content, three year course, what will we study, syllabus, "
                "18 months, go javascript rust",
            },
            {
                "question": "How much does the training cost?",
                "answer": (
                    "It's tuition-free. There are no registration fees, unit costs or examination "
                    "fees throughout the duration of the course."
                ),
                "keywords": "cost, fees, tuition, how much, price, free, do i pay, tuition-free, "
                "registration fee, bei, gharama, pesa, malipo, bure, ni bei gani, masomo, "
                "gharama za masomo",
            },
            {
                "question": "I don't have the means to support myself during the training. Are there "
                "scholarships?",
                "answer": (
                    "There are no tuition fees and the pedagogy offered can make it possible to work "
                    "part-time. However, we understand that the costs of transport, food or "
                    "accommodation constitute a budget limiting the possibilities of following the "
                    "training. As a result, we offer monthly stipends of Ksh. 15,000 to support our "
                    "learners meet some of the costs.\n\n"
                    "We understand that this is not enough, so we encourage candidates to make the "
                    "necessary arrangements to support themselves throughout the 2-year learning "
                    "period."
                ),
                "keywords": "scholarship, stipend, financial support, money, transport, food, "
                "accommodation, allowance, 15000, stipend amount, bursary, posho, msaada wa pesa, "
                "malazi, chakula, usafiri",
            },
        ],
    },
    {
        "slug": "after-training",
        "title": "After Training",
        "blurb": "The career paths and opportunities that open up.",
        "items": [
            {
                "question": "What work can I do?",
                "answer": (
                    "You will finish the training with a global knowledge in any field of "
                    "programming, as well as the professional experience acquired during the 1.5 year "
                    "work-study program spent working on concrete issues.\n\n"
                    "Here are the jobs available after the training:\n\n"
                    "In the web domain: Back-end developer, front-end developer, e-commerce "
                    "consultant, new media specialist, SEO specialist, SEO analyst, SEO consultant, "
                    "user experience designer, UI designer, web content manager, web designer, web "
                    "developer, webmaster.\n\n"
                    "Cybersecurity: Computer forensics specialist, cybersecurity strategist, "
                    "cryptography specialist, cybercrime specialist, privacy specialist, "
                    "cybersecurity administrator, security analyst.\n\n"
                    "Information Systems: DevOps, Database Administrator, Enterprise Architect, IT "
                    "Operations Analyst, System Administrator, System Analyst, System Architect, "
                    "System Engineer.\n\n"
                    "Networks: Network analyst, network engineer, telecommunications engineer, "
                    "telecommunications specialist.\n\n"
                    "Software: Chief Software Engineer, Quality Assurance Specialist Engineer, "
                    "Software Developer, Software Update Manager, Software Tester.\n\n"
                    "Hardware: Hardware engineer, electronics engineer, interaction designer.\n\n"
                    "Artificial Intelligence: Algorithm developer, artificial intelligence "
                    "specialist, computer visualization engineer, Machine Learning specialist.\n\n"
                    "Data: Business intelligence analyst, blockchain specialist, data scientist, "
                    "data analyst, EDI system analyst, statistical programmer.\n\n"
                    "Video games: Game designer, game developer, game producer, game programmer, "
                    "game tester, module designer, technical artist.\n\n"
                    "Graphics: 3D animator, 3D developer, 3D modeler, character designer, AR "
                    "developer, VR developer.\n\n"
                    "Others: Cloud infrastructure specialist, IT trainer, professional gamer, "
                    "project manager, product manager."
                ),
                "keywords": "what work, jobs, career, after training, job opportunities, roles, "
                "employment, job titles, developer jobs",
            },
            {
                "question": "Where will I work after the 2-year training?",
                "answer": (
                    "After spending 2 years acquiring the necessary skills to become a full-stack "
                    "developer, you are guaranteed employment according to these 3 options:\n\n"
                    "- Work full-time in our talent agency on various freelance projects.\n"
                    "- Work full-time for one of our partner companies.\n"
                    "- Combine your own entrepreneurial project with a part-time job in our talent "
                    "agency."
                ),
                "keywords": "where will i work, placement, job guarantee, employment, partner "
                "companies, talent agency, after the program",
            },
            {
                "question": "Will I get a diploma or a certificate at the end of the training?",
                "answer": (
                    "At the end of your training, you do not receive a diploma or certificate, "
                    "because this model does not correspond to any traditional definition.\n\n"
                    "This is not a problem in the digital sector, because companies are interested "
                    "in what you can do, who you are and how you work. In addition, at the end of "
                    "your training you have a guaranteed job, which allows you to gain professional "
                    "experience."
                ),
                "keywords": "diploma, certificate, degree, qualification, do i get a certificate, "
                "graduation, papers",
            },
        ],
    },
    {
        "slug": "contact-support",
        "title": "Contact & Support",
        "blurb": "How to reach a real person when you need one.",
        "items": [
            {
                "question": "How can I contact the Zone01 team?",
                "answer": (
                    "Email info@zone01kisumu.ke and the team will get back to you. For application "
                    "questions, use the Join us portal at learn.zone01kisumu.ke. For hiring or "
                    "partnership enquiries, email Torsten@lakehub.co.ke."
                ),
                "keywords": "contact, contact you, email, email address, your email, address, "
                "phone number, reach you, talk to someone, human, support, wasiliana, barua pepe, "
                "simu, msaada, mawasiliano",
            },
            {
                "question": "Where is the Zone01 Kisumu campus?",
                "answer": (
                    "Our campus is at LakeHub, Lake Basin Mall, in Kisumu. It is open 24 hours a "
                    "day, 7 days a week for learners. Email info@zone01kisumu.ke if you need "
                    "directions before visiting."
                ),
                "keywords": "where are you, where are you located, located, campus location, "
                "address, directions, where is zone01, iko wapi, mahali, anwani, campus iko wapi",
            },
            {
                "question": "Do you have a campus in Nairobi or other towns?",
                "answer": (
                    "All training and Piscines take place at our Kisumu campus, at LakeHub, Lake "
                    "Basin Mall. There is no separate campus elsewhere; if you are selected you "
                    "will attend in person in Kisumu."
                ),
                "keywords": "other campus, campus in nairobi, branch, campuses, another campus, "
                "kampasi nyingine, tawi, nairobi campus",
            },
            {
                "question": "I haven't received a reply to my application. What should I do?",
                "answer": (
                    "If you are shortlisted for a Piscine, we contact you by phone or email within "
                    "the 2 weeks before it starts. If you do not hear from us, you were not "
                    "shortlisted for that intake. Check your spam folder and the Join us portal, "
                    "and email info@zone01kisumu.ke if you are unsure."
                ),
                "keywords": "no reply, no response, didn't hear back, application status, check "
                "application, shortlisted, spam folder, application update, maombi, majibu, "
                "hakuna jibu, hali ya maombi",
            },
            {
                "question": "I can't log in to the application portal or I forgot my password.",
                "answer": (
                    "Use the 'Forgot password' link on learn.zone01kisumu.ke to reset it. If you "
                    "still can't get in, email info@zone01kisumu.ke with your full name and the "
                    "email address you registered with."
                ),
                "keywords": "forgot password, can't log in, login problem, reset password, account "
                "access, portal, nimesahau nywila, kuingia, akaunti",
            },
            {
                "question": "The cognitive test is not loading. What should I do?",
                "answer": (
                    "Use a stable internet connection and a modern browser such as Chrome, then "
                    "reload the page. Don't start the test until you are ready, because it can't be "
                    "paused or restarted. If it still fails, email info@zone01kisumu.ke with a "
                    "screenshot."
                ),
                "keywords": "test not loading, technical problem, error, page frozen, test crashed, "
                "browser, internet, mtihani, shida, hitilafu",
            },
            {
                "question": "Can I visit the campus or attend an open day?",
                "answer": (
                    "Yes. We share open days and events on our website and social channels. To "
                    "arrange a campus visit, email info@zone01kisumu.ke and the team will suggest a "
                    "good time."
                ),
                "keywords": "visit, campus tour, open day, come to campus, see the campus, event, "
                "kutembelea, ziara, tukio",
            },
            {
                "question": "How do I report a problem or share feedback?",
                "answer": (
                    "Email info@zone01kisumu.ke with as much detail as possible, including a "
                    "screenshot if it helps. We read every message and will follow up."
                ),
                "keywords": "feedback, complaint, report a problem, suggestion, issue, malalamiko, "
                "maoni, ripoti",
            },
            {
                "question": "What are the campus opening hours?",
                "answer": (
                    "The campus is open 24 hours a day, 7 days a week for learners. Email is the "
                    "fastest way to reach the team, and we reply during working hours; for a visit, "
                    "email first so the right person is available."
                ),
                "keywords": "office hours, opening hours, when are you open, call, visit time, "
                "working hours, muda wa kazi, saa za kazi, saa za kufungua",
            },
        ],
    },
    {
        "slug": "practicalities",
        "title": "Practicalities & Campus Life",
        "blurb": "Getting ready for campus, costs and day-to-day questions.",
        "items": [
            {
                "question": "Can I apply if I live outside Kisumu?",
                "answer": (
                    "Yes, anyone can apply. The training is face-to-face in Kisumu, so if you are "
                    "selected you will need to attend campus in person."
                ),
                "keywords": "outside kisumu, another county, relocate, move to kisumu, travel, "
                "distance, nje ya kisumu, mkoa, kuhamia",
            },
            {
                "question": "Can I reapply if I was not selected?",
                "answer": (
                    "If you were not shortlisted for a Piscine, you can apply again in a future "
                    "intake. If you attended a Piscine and failed it, you must wait one year before "
                    "applying again."
                ),
                "keywords": "reapply, apply again, not selected, unsuccessful, rejected, try again, "
                "next intake, kuomba tena, hakuchaguliwa",
            },
            {
                "question": "Is the Piscine free?",
                "answer": (
                    "Yes. The Piscine is part of the selection process and there is no fee to "
                    "attend. The whole programme is tuition-free."
                ),
                "keywords": "piscine fee, pay for piscine, cost of piscine, free piscine, malipo ya "
                "piscine, bure, gharama",
            },
            {
                "question": "Can I miss a day during the Piscine?",
                "answer": (
                    "The Piscine is an intensive 4-week selection sprint and you need to be fully "
                    "available for the whole period. If an emergency comes up, contact the team as "
                    "soon as possible at info@zone01kisumu.ke."
                ),
                "keywords": "miss a day, absent during piscine, skip piscine, unavailable, "
                "emergency, kutokuwepo, dharura",
            },
            {
                "question": "Do I need a laptop or my own internet to join?",
                "answer": (
                    "No. The campus is equipped with computers and internet for learners, so you "
                    "don't need your own laptop. For the online application and cognitive tests, "
                    "you only need a device with a stable internet connection."
                ),
                "keywords": "laptop, computer, internet, wifi, data, device, simu, kompyuta, "
                "mtandao, kifaa",
            },
            {
                "question": "What language is the training in?",
                "answer": (
                    "Training materials and projects are in English, and our team can also assist "
                    "you in Swahili. You don't need a language certificate to apply."
                ),
                "keywords": "language, language of instruction, teach, teaching, instruction, "
                "medium of instruction, english, swahili, kiswahili, lugha, kizungu, certificate",
            },
            {
                "question": "How should I prepare for the Piscine?",
                "answer": (
                    "There is nothing academic to revise - the Piscine tests how you learn and work "
                    "with others. Come rested, ready for four intensive weeks, and bring your "
                    "motivation. Computers are provided on campus."
                ),
                "keywords": "prepare for piscine, ready for piscine, what to bring, piscine "
                "preparation, before piscine, kujiandaa, tayari",
            },
            {
                "question": "Is accommodation or food provided?",
                "answer": (
                    "Learners arrange their own accommodation and meals in Kisumu. During the "
                    "training, the monthly stipend helps with transport, food and accommodation "
                    "costs. Email info@zone01kisumu.ke if you would like advice before the Piscine."
                ),
                "keywords": "accommodation, housing, hostel, where to stay, meals, food, malazi, "
                "chakula, hosteli, mahali pa kulala, ninaweza, kupata, ninaweza kupata malazi",
            },
            {
                "question": "How much is the monthly stipend and when does it start?",
                "answer": (
                    "Eligible learners receive Ksh 15,000 per month during the training to help with "
                    "transport, food and accommodation. The team will confirm the exact start date "
                    "and payment details when you enrol."
                ),
                "keywords": "stipend, allowance, monthly pay, when stipend, how much stipend, "
                "posho, malipo ya kila mwezi, msaada wa pesa",
            },
            {
                "question": "How can I hire Zone01 talent?",
                "answer": (
                    "Visit the Hire Talent page on zone01kisumu.ke or email Torsten@lakehub.co.ke "
                    "with the role you are hiring for. You can also message the talent team on "
                    "WhatsApp at wa.me/254748902779."
                ),
                "keywords": "hire talent, employer, recruit, hire developers, kuajiri, wafanyakazi",
            },
            {
                "question": "How can I partner with or support Zone01?",
                "answer": (
                    "We would love to hear from you. Email info@zone01kisumu.ke or "
                    "Torsten@lakehub.co.ke for partnership, sponsorship or hiring conversations."
                ),
                "keywords": "partner, partnership, sponsor, donate, support zone01, collaborate, "
                "ushirikiano, kuchangia, msaada",
            },
        ],
    },
]
