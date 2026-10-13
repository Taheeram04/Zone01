// components/faqs.jsx
import { useCallback, useRef, useState } from 'react';
import { APPLICATION_URL } from '../constants.js';
import './faqs.css';

/*
 * Frequently Asked Questions — hover-to-reveal Q&A tables.
 *
 * The page is grouped into four themed tables (Application Progress, The
 * Piscine, The Modalities of the Course / Training, After Training). Each row
 * reveals its answer as soon as the pointer touches the question — no click
 * required. Clicking / tapping (and Enter/Space for keyboard users) also
 * toggles a row, so the same interaction works on touch devices.
 *
 * The "Join us" mentions link straight through to the same destination as the
 * site-wide Apply button, so both entry points stay in sync.
 */

/* ---- Inline answer helpers ---------------------------------------------- */

// "Join us" always points at the same place as the navbar / hero Apply button.
const JoinUs = ({ children = 'Join us' }) => (
  <a
    className="faq-a__link"
    href={APPLICATION_URL}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const P = ({ children }) => <p className="faq-a__p">{children}</p>;

const Qual = ({ label, children }) => (
  <p className="faq-a__p">
    <strong className="faq-a__label">{label}</strong> {children}
  </p>
);

const Note = ({ children }) => <p className="faq-a__note">{children}</p>;

/* ---- Content ------------------------------------------------------------ */

const FAQ_TABLES = [
  {
    id: 'application-progress',
    index: '01',
    title: 'Application Progress',
    blurb: 'Everything you need before you take the cognitive games.',
    items: [
      {
        q: 'How to apply?',
        a: (
          <P>
            To apply you need to create an account via <JoinUs />. Once you have
            created an account, you can take the cognitive tests.
          </P>
        ),
      },
      {
        q: 'What is the online cognitive test?',
        a: (
          <>
            <P>
              Our online cognitive test lasts just over an hour and a half. It
              consists of a short memory game, followed by a longer logic game.
            </P>
            <P>
              Memorization, problem solving and logical reasoning skills are very
              good indicators of your abilities to become a creative digital
              talent!
            </P>
            <P>
              No development experience is needed to complete the games and you
              don&apos;t need to revise for it.
            </P>
          </>
        ),
      },
      {
        q: 'When can I apply?',
        a: (
          <>
            <P>
              Applications are on a rolling basis. The first step is to take the
              cognitive tests online. Check out this page — <JoinUs /> — to
              create your profile and then access the tests.
            </P>
            <P>
              The cognitive test results are evaluated at the latest within 2
              weeks preceding each Piscine. If no pool date is announced,
              applications may be temporarily suspended. In this case, you can
              consult the site regularly to stay informed of the next Piscine
              dates.
            </P>
          </>
        ),
      },
      {
        q: 'How many times can I try the online cognitive test?',
        a: (
          <P>
            Once you&apos;ve started the test, you can&apos;t pause or restart it.
            You have three attempts to complete the online tests and your last
            result will count, so there&apos;s no risk in trying again.
          </P>
        ),
      },
      {
        q: 'Who can apply?',
        a: (
          <>
            <P>
              The Zone01 Kisumu digital training is open to anyone over 18 years
              old. No prior programming experience or academic qualifications are
              required to apply.
            </P>
            <P>
              Diversity and Inclusion are key elements of Zone01 Kisumu&apos;s
              mission. We therefore particularly encourage women, people with
              disabilities, people from disadvantaged backgrounds, refugees and
              ethnic minorities to apply.
            </P>
          </>
        ),
      },
      {
        q: 'What are the qualities required?',
        a: (
          <>
            <P>
              We&apos;re not testing your math skills — your passion,
              collaboration, perseverance, and creativity are much stronger
              indicators to gauge your ability to code. Our curriculum is designed
              to be challenging and demanding, and our learners should work
              together collaboratively, not in competition with each other.
            </P>
            <Qual label="Passion –">
              You need to have an interest in software development, combined with
              a strong motivation to develop your skills.
            </Qual>
            <Qual label="Collaboration –">
              It is important to be able to work as a team to complete projects
              and overcome obstacles.
            </Qual>
            <Qual label="Creativity –">
              You will have to be able to quickly find innovative solutions and
              imagine different approaches to solving complex problems.
            </Qual>
            <Qual label="Perseverance –">
              It is necessary to keep your motivation and to remain assiduous
              despite the increasing difficulty of the projects to be carried
              out.
            </Qual>
          </>
        ),
      },
      {
        q: 'What are the different stages of the application procedure?',
        a: (
          <>
            <Qual label="Cognitive tests –">
              online cognitive tests consisting of two games. If you pass these
              tests, you will be invited to participate in the Piscine.
            </Qual>
            <Qual label="The Piscine –">
              a four-week period of immersion in software programming based on
              face-to-face projects. If you pass this pool, you will be invited to
              enroll in the Zone01 Kisumu program.
            </Qual>
            <Note>
              Please note: The Piscine is an intensive screening process to test
              your ability to learn quickly, perform intensive work, collaborate
              with other people and, most importantly, test your motivation.
            </Note>
          </>
        ),
      },
    ],
  },
  {
    id: 'the-piscine',
    index: '02',
    title: 'The Piscine',
    blurb: 'The four-week, in-person selection sprint.',
    items: [
      {
        q: "If I can't attend the Piscine I have been accepted to participate in, are there other options?",
        a: (
          <>
            <P>
              If you are contacted to participate in the Piscine and you cannot
              join us on the dates indicated, we suggest that you participate in a
              future Piscine if the dates are fixed and there are places
              available.
            </P>
            <P>
              As the number of places is limited, if you decide to participate in
              a Piscine it means that you know that you are fully available for
              the duration of the 4 weeks.
            </P>
          </>
        ),
      },
      {
        q: 'When will I know if I am accepted to participate in the Piscine?',
        a: (
          <P>
            If you are shortlisted for the pool, you will be contacted by phone or
            email within 2 weeks prior to the Piscine.
          </P>
        ),
      },
      {
        q: 'When and where does the Piscine take place?',
        a: (
          <P>
            We will organize several successive Piscines once we have enough
            qualified candidates from the games. Each Piscine lasts 4 weeks. The
            Piscines take place on-site, face-to-face, at the Zone01 Kisumu
            campus located at LakeHub, Lake Basin Mall in Kisumu.
          </P>
        ),
      },
      {
        q: 'I failed the Piscine, can I re-register?',
        a: (
          <P>
            If you failed the Piscine, it is possible to retake the cognitive
            tests to try to be preselected again for a Piscine. However, you have
            to wait a year before you can apply again.
          </P>
        ),
      },
      {
        q: 'What is the Piscine?',
        a: (
          <P>
            The Piscine is an intensive 4-week programming challenge that takes
            place on the Zone01 Kisumu campus. It is based on a unique Zone01
            educational model. You will carry out different quests during the four
            weeks. Every Friday, you will take a test to assess your personal
            progress. On weekends, team projects will allow you to test your
            understanding and consolidate your learning from the previous week. If
            you are admitted to the Piscine, get ready for four very intense and
            extremely rewarding weeks. You will make many friends and new
            memories, while acquiring a complete introduction to software
            development.
          </P>
        ),
      },
      {
        q: 'How do you assess the Piscine participants?',
        a: (
          <>
            <P>
              The Piscine, like the entire course, is based on modification. This
              means that you will receive points for all quests completed,
              including group projects and the assessments you complete.
            </P>
            <P>
              The Piscine evaluates your ability to learn quickly, perform
              intensive work, collaborate with other people and, above all, test
              your motivation. We also take into account your work ethic, your
              contribution to the collaboration and your willingness to learn
              during this experience throughout the 4 weeks.
            </P>
            <P>
              It is the Piscine that will determine whether or not you can
              integrate the training, because this stage makes it possible to
              identify your motivation, your aptitude for software development
              and your fulfillment in this innovative educational approach.
            </P>
          </>
        ),
      },
      {
        q: 'How will I know if I have been accepted into the Piscine?',
        a: (
          <P>
            When you have completed the games, you will see the level you have
            reached for each one. If you are pre-selected after the online games,
            you will be contacted by phone or email to attend a check-in session
            before you register for the Piscine. Participation in the Piscine is
            the 2nd stage of selection. If you don&apos;t hear from us, it means
            you haven&apos;t been shortlisted, because there are a lot of
            applications and unfortunately we cannot respond to each person when
            they are not selected.
          </P>
        ),
      },
    ],
  },
  {
    id: 'course-training',
    index: '03',
    title: 'The Modalities of the Course / Training',
    blurb: 'How the peer-to-peer program actually works, day to day.',
    items: [
      {
        q: 'Is it an e-learning (distance) training?',
        a: (
          <P>
            No, the training offered by Zone01 Kisumu is not an e-learning
            training. It is a face-to-face training (on site).
          </P>
        ),
      },
      {
        q: 'How can we learn without teachers and lessons?',
        a: (
          <>
            <P>
              You will learn through our innovative 01Edu platform — a
              peer-to-peer and gamified learning platform, through which
              thousands of people around the world have gained ready-to-use
              digital talents. By collaborating with other learners on group
              projects, as well as honing your skills individually, you will
              acquire a full set of skills.
            </P>
            <P>
              The 01Edu platform has instructions, support videos and built-in
              functions to teach everyone the basics of programming. The 01
              community promotes the creation of collective intelligence. Study
              groups and chats are planned to promote support and collaborative
              work. Throughout your training, the Zone01 Kisumu team will be
              available to answer any questions you may have or provide
              additional support if needed.
            </P>
          </>
        ),
      },
      {
        q: 'Can I be absent / take a vacation during the training?',
        a: (
          <P>
            It is possible to be absent or take a leave of absence as long as you
            catch up with the training. You can therefore decide when you will be
            absent during your first year of training. The terms of absence during
            the work-study period will be defined with the team.
          </P>
        ),
      },
      {
        q: 'Do I have to have a laptop to be able to join the training?',
        a: (
          <P>
            The campus is equipped to allow each learner to work on a computer.
            It is not necessary to have a personal computer to be part of the
            training.
          </P>
        ),
      },
      {
        q: "If I don't want to complete the training, can I drop out during the course?",
        a: (
          <P>
            Our free education model is made possible by our partner companies,
            who work with us to recruit the best digital talent. In order to
            receive a complete training in programming and to guarantee you the
            best job prospects, it is essential to complete your training.
          </P>
        ),
      },
      {
        q: 'What support is available for learners on campus?',
        a: (
          <>
            <P>
              Two types of support are offered to learners by Zone01: technical
              support and support concerning well-being.
            </P>
            <Qual label="Technical coaching –">
              when learners are completely stuck on a problem, they can ask
              questions and our technical coaches will be available to help guide
              their thinking around solving complex problems without giving the
              full answer!
            </Qual>
            <Qual label="Well-being support –">
              resource people are available on campus to help learners feel good
              and deal with any difficulties they may encounter during the course.
            </Qual>
          </>
        ),
      },
      {
        q: 'Is the program full-time and how many days per week does it take?',
        a: (
          <>
            <P>
              This is an intensive program based on the principle of peer
              learning. You will have to make sure that, during group work, you
              are able to work at the same time as the other learners.
            </P>
            <P>
              To offer the greatest flexibility to everyone, the campus is open
              24 hours a day, 7 days a week.
            </P>
            <P>
              Access to the campus is therefore done in such a way that you can
              come and go without time constraints.
            </P>
            <P>The program is entirely self-paced.</P>
          </>
        ),
      },
      {
        q: 'How is the program graded over the three years? Is it a pass or fail system?',
        a: (
          <>
            <P>
              This is not a pass or fail system, but rather an escalation of
              challenges as you progress through the training. There are 60
              different projects to solve during the training and you will level
              up once you complete each project.
            </P>
            <P>
              Moreover, it is completely normal to fail a project! This is how you
              learn from your mistakes. Like the cognitive tests when you apply,
              the course is designed to train highly competent full-stack
              developers, so the level is intentionally difficult.
            </P>
          </>
        ),
      },
      {
        q: 'What programming languages will I learn?',
        a: (
          <P>
            You will be exposed to several programming languages. By carrying out
            around sixty projects, you will learn to code in JavaScript, Go and
            Rust, as well as C, C++, Ruby on Rails, PHP and Python. You will be
            able to code in most of the programming environments.
          </P>
        ),
      },
      {
        q: 'What is Zone01 Kisumu?',
        a: (
          <>
            <P>
              Zone01 Kisumu offers a 2-year training program and is the start of
              your career as a full-stack developer, followed by a 3-year
              guaranteed job contract. It consists of:
            </P>
            <ul className="faq-a__list">
              <li>
                18 months of free training, based on the resolution of projects,
                which will allow you to acquire very complete skills in software
                development.
              </li>
              <li>
                12 months of work-study to deepen your skills and work on projects
                of partner companies.
              </li>
              <li>
                6 months of professional training on projects of partner
                companies.
              </li>
              <li>3 years guaranteed job contract.</li>
            </ul>
          </>
        ),
      },
      {
        q: 'What are the qualities required by the Zone01 program / course?',
        a: (
          <>
            <Qual label="Passion –">
              You need to have an interest in software development, combined with
              a strong motivation to develop your skills.
            </Qual>
            <Qual label="Collaboration –">
              It is important to be able to work as a team to complete projects
              and overcome obstacles.
            </Qual>
            <Qual label="Creativity –">
              You will have to be able to quickly find innovative solutions and
              imagine different approaches to solving complex problems.
            </Qual>
            <Qual label="Perseverance –">
              It is necessary to keep your motivation and to remain assiduous
              despite the increasing difficulty of the projects to be carried
              out.
            </Qual>
            <P>
              We&apos;re not testing your math skills — your passion,
              collaboration, perseverance, and creativity are much stronger
              indicators to gauge your ability to code. This is why we do not
              recruit on the basis of studies: everyone has their place at Zone01
              Kisumu, whatever the course.
            </P>
            <P>
              Our curriculum is designed to be challenging and demanding, and our
              learners should work together collaboratively, not in competition
              with each other.
            </P>
          </>
        ),
      },
      {
        q: 'Can I work while I learn?',
        a: (
          <P>
            Training is a big commitment, and it is not possible to work full time
            while you are training.
          </P>
        ),
      },
      {
        q: 'What support is available for people with learning difficulties?',
        a: (
          <P>
            The Learner Experience team is here to support, encourage and help you
            thrive. They provide quality advice and guidance and can also offer
            learning support to help you if you live with a disability or have a
            learning difficulty.
          </P>
        ),
      },
      {
        q: 'Do I have to be physically present on campus? Can I learn from home?',
        a: (
          <>
            <P>
              The training is based on a highly collaborative and
              community-oriented pedagogical approach. About 80% of the projects
              in the program are done in groups, which are easier and faster to
              complete when you are together in the same room.
            </P>
            <P>
              The Zone01 Kisumu campus is accessible 24 hours a day, 7 days a
              week, to allow everyone to work flexibly at the times that suit them
              best. However, we strongly encourage our applicants to take
              precautions when leaving the campus late at night or early in the
              morning.
            </P>
            <P>
              We strongly advise you to be present on campus throughout the
              duration of the training, because it is of immense importance to be
              in the environment and to learn and pass on knowledge to other
              members of the community. It is very motivating to work and learn
              together — you will progress faster. In addition, we regularly
              organize social activities and conferences on campus to enrich your
              learning experience.
            </P>
          </>
        ),
      },
      {
        q: 'What is the content of the three-year course?',
        a: (
          <P>
            During the first 18 months, learners will discover the Go, JavaScript
            and Rust language libraries. Each language will require 6 months of
            working on projects, allowing learners to deepen their understanding
            of the language and explore additional concepts. Learners will be
            divided into groups so that they can work as a team on projects.
          </P>
        ),
      },
      {
        q: 'How much does the training cost?',
        a: (
          <P>
            It&apos;s tuition-free. There are no registration fees, unit costs or
            examination fees throughout the duration of the course.
          </P>
        ),
      },
      {
        q: "I don't have the means to support myself during the training. Are there scholarships?",
        a: (
          <>
            <P>
              There are no tuition fees and the pedagogy offered can make it
              possible to work part-time. However, we understand that the costs of
              transport, food or accommodation constitute a budget limiting the
              possibilities of following the training. As a result, we offer
              monthly stipends of Ksh. 15,000 to support our learners meet some of
              the costs.
            </P>
            <P>
              We understand that this is not enough, so we encourage candidates to
              make the necessary arrangements to support themselves throughout the
              2-year learning period.
            </P>
          </>
        ),
      },
    ],
  },
  {
    id: 'after-training',
    index: '04',
    title: 'After Training',
    blurb: 'The career paths and opportunities that open up.',
    items: [
      {
        q: 'What work can I do?',
        a: (
          <>
            <P>
              You will finish the training with a global knowledge in any field of
              programming, as well as the professional experience acquired during
              the 1½ year work-study program spent working on concrete issues.
            </P>
            <P>Here are the jobs available after the training:</P>
            <p className="faq-a__p">
              <strong className="faq-a__label">In the web domain:</strong> Back-end
              developer, front-end developer, e-commerce consultant, new media
              specialist, SEO specialist, SEO analyst, SEO consultant, user
              experience designer, UI designer, web content manager, web designer,
              web developer, webmaster.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Cybersecurity:</strong> Computer
              forensics specialist, cybersecurity strategist, cryptography
              specialist, cybercrime specialist, privacy specialist, cybersecurity
              administrator, security analyst.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Information Systems:</strong> DevOps,
              Database Administrator, Enterprise Architect, IT Operations Analyst,
              System Administrator, System Analyst, System Architect, System
              Engineer.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Networks:</strong> Network analyst,
              network engineer, telecommunications engineer, telecommunications
              specialist.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Software:</strong> Chief Software
              Engineer, Quality Assurance Specialist Engineer, Software Developer,
              Software Update Manager, Software Tester.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Hardware:</strong> Hardware engineer,
              electronics engineer, interaction designer.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Artificial Intelligence:</strong>{' '}
              Algorithm developer, artificial intelligence specialist, computer
              visualization engineer, Machine Learning specialist.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Data:</strong> Business intelligence
              analyst, blockchain specialist, data scientist, data analyst, EDI
              system analyst, statistical programmer.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Video games:</strong> Game designer,
              game developer, game producer, game programmer, game tester, module
              designer, technical artist.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Graphics:</strong> 3D animator, 3D
              developer, 3D modeler, character designer, AR developer, VR
              developer.
            </p>
            <p className="faq-a__p">
              <strong className="faq-a__label">Others:</strong> Cloud infrastructure
              specialist, IT trainer, professional gamer, project manager, product
              manager.
            </p>
          </>
        ),
      },
      {
        q: 'Where will I work after the 2-year training?',
        a: (
          <>
            <P>
              After spending 2 years acquiring the necessary skills to become a
              full-stack developer, you are guaranteed employment according to
              these 3 options:
            </P>
            <ul className="faq-a__list">
              <li>
                Work full-time in our talent agency on various freelance projects.
              </li>
              <li>Work full-time for one of our partner companies.</li>
              <li>
                Combine your own entrepreneurial project with a part-time job in
                our talent agency.
              </li>
            </ul>
          </>
        ),
      },
      {
        q: 'Will I get a diploma or a certificate at the end of the training?',
        a: (
          <>
            <P>
              At the end of your training, you do not receive a diploma or
              certificate, because this model does not correspond to any
              traditional definition.
            </P>
            <P>
              This is not a problem in the digital sector, because companies are
              interested in what you can do, who you are and how you work. In
              addition, at the end of your training you have a guaranteed job,
              which allows you to gain professional experience.
            </P>
          </>
        ),
      },
    ],
  },
];

/* ---- Component ---------------------------------------------------------- */

const Faqs = () => {
  // Only one answer stays open at a time, keyed by `${tableId}-${itemIndex}`.
  const [openKey, setOpenKey] = useState(null);
  // Remembers whether the current row was opened by hovering, so lifting the
  // pointer only auto-closes the rows the pointer itself revealed. Answers
  // opened by click / keyboard stay put until the user chooses to close them.
  const hoverKeyRef = useRef(null);

  const keyFor = (tableId, i) => `${tableId}-${i}`;

  // Hover reveal — mouse only; touch devices use the click toggle below.
  const handlePointerEnter = useCallback(
    (key) => (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      hoverKeyRef.current = key;
      setOpenKey(key);
    },
    [],
  );

  const handlePointerLeave = useCallback((event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    setOpenKey((current) => (current === hoverKeyRef.current ? null : current));
    hoverKeyRef.current = null;
  }, []);

  const handleToggle = useCallback((key) => () => {
    hoverKeyRef.current = null;
    setOpenKey((current) => (current === key ? null : key));
  }, []);

  return (
    <section
      id="faqs"
      data-nav-theme="light"
      className="faq"
      aria-labelledby="faq-title"
    >
      <div className="faq__inner">
        <header className="faq__head">
          <p className="faq__eyebrow">Frequently Asked Questions</p>
          <h2 id="faq-title" className="faq__title">
            FAQs
          </h2>
        </header>

        <div className="faq__tables">
          {FAQ_TABLES.map((table) => (
            <section
              key={table.id}
              id={table.id}
              className="faq-table"
              aria-labelledby={`${table.id}-title`}
            >
              <header className="faq-table__head">
                <div>
                  <h3 id={`${table.id}-title`} className="faq-table__title">
                    {table.title}
                  </h3>
                  <p className="faq-table__blurb">{table.blurb}</p>
                </div>
              </header>

              <div className="faq-table__body">
                {table.items.map((item, i) => {
                  const key = keyFor(table.id, i);
                  const open = openKey === key;

                  return (
                    <article
                      key={item.q}
                      className={`faq-row${open ? ' is-open' : ''}`}
                      onPointerEnter={handlePointerEnter(key)}
                      onPointerLeave={handlePointerLeave}
                    >
                      <button
                        type="button"
                        id={`${key}-question`}
                        className="faq-row__q"
                        aria-expanded={open}
                        aria-controls={`${key}-answer`}
                        onClick={handleToggle(key)}
                      >
                        <span className="faq-row__q-text">{item.q}</span>
                        <span className="faq-row__icon" aria-hidden="true" />
                      </button>

                      <div
                        id={`${key}-answer`}
                        className="faq-row__a"
                        role="region"
                        aria-labelledby={`${key}-question`}
                      >
                        <div className="faq-row__a-inner">
                          <div className="faq-row__a-content">{item.a}</div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="faq__cta">
          <p className="faq__cta-text">
            Ready to find out what you are capable of?
          </p>
          <a
            className="faq__cta-btn"
            href={APPLICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
