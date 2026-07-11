/*
 * CyberShield Academy - Interactive Learning Center Controller
 * Dedicated module handling the Digital Book Library, course maps,
 * persistent progress engine, interactive quizzes, and credential signatures.
 */

import { lessons1to5 } from './linux-lessons-1-5.js';
import { lessons6to10 } from './linux-lessons-6-10.js';
import { lessons11to15 } from './linux-lessons-11-15.js';
import { finalQuizQuestions, finalAssessmentScenarios } from './linux-quiz-data.js';

const initLearningCenter = () => {
  // Combine all Linux lessons
  const linuxLessons = [
    ...lessons1to5,
    ...lessons6to10,
    ...lessons11to15
  ];

  // --- DATABASE & STATE ENGINES ---
  let activeBookId = "ethical-hacking-basics"; // Set default to requested book
  let activeLessonIndex = 0;
  let currentSearchKeyword = "";
  let activeFilterTab = "all";
  let currentView = "library"; // "library" or "book-details"
  let fullOwaspLessons = [];
  let fullCryptoLessons = [];
  let fullPasswordLessons = [];
  let fullMalwareLessons = [];
  let fullForensicsLessons = [];

  const ACADEMY_STORAGE_KEY = 'cybershield_academy_progress';

  let progressState = {
    completedLessons: {}, // Map of 'lesson-id' -> true
    bookmarks: {},        // Map of 'book-id' -> true
    xp: 0,
    completedPaths: {},   // Map of 'path-id' -> true
    finalQuizPassed: false,
    finalAssessmentPassed: false,
    finalQuizAnswers: {}, // Map of question ID -> selected choice
    finalAssessmentAnswers: {}, // Map of scenario ID -> selected choice
    owaspUnlockedCount: 1, // Sequential generation state
    cryptoUnlockedCount: 1, // Sequential generation state
    passwordUnlockedCount: 1, // Sequential generation state
    malwareUnlockedCount: 1, // Sequential generation state
    forensicsUnlockedCount: 1 // Sequential generation state
  };

  // Static properties and specifications for books in the library
  const BOOKS = [
    {
      id: "ethical-hacking-basics",
      title: "Ethical Hacking Basics",
      category: "OFFENSIVE SECURITY",
      difficulty: "Beginner",
      readingTime: "6 Hours",
      coverGradient: "linear-gradient(135deg, #09200f 0%, #020a04 100%)",
      coverAccent: "rgba(0, 255, 136, 0.08)",
      coverEmoji: "💀",
      edition: "PENTEST v1.1",
      author: "CYBERSHIELD CERTIFIED",
      description: "Discover the art of ethical hacking, web vulnerability scanning, authentication security, and malware mitigation under realistic scenarios.",
      learningObjectives: [
        "Understand the legal and operational boundaries of penetration testing.",
        "Execute reconnaissance strategies and digital footprinting safely.",
        "Diagnose and remediate SQL Injection, XSS, and CSRF vulnerabilities."
      ],
      skillsLearned: [
        "Network scanning configurations.",
        "Web application vulnerability diagnostics.",
        "Threat modeling and system security verification."
      ],
      lessons: [] // Loaded dynamically from intermediate.json
    },
    {
      id: "owasp-top-10",
      title: "OWASP Top 10",
      category: "Application Security",
      difficulty: "Beginner to Intermediate",
      readingTime: "10-12 Hours",
      coverGradient: "linear-gradient(135deg, #1f0515 0%, #080105 100%)",
      coverAccent: "rgba(189, 0, 255, 0.08)",
      coverEmoji: "🕸️",
      edition: "OWASP v4.0",
      author: "CYBERSHIELD CERTIFIED",
      description: "Master the standard web application threat models. Gain deep operational awareness of IDOR, Command Injection, default credential hazards, cryptographic failures, and Server-Side Request Forgery (SSRF).",
      learningObjectives: [
        "Audit web application interfaces for broken access control flaws.",
        "Detect and mitigate command and SQL injection injection vectors.",
        "Block server-side request forgery (SSRF) cloud metadata inquiries."
      ],
      skillsLearned: [
        "Insecure Direct Object Reference (IDOR) detection.",
        "Input sanitization and query parameterization.",
        "Secure cloud metadata request routing blocks."
      ],
      lessons: [] // Loaded dynamically and sequentially
    },
    {
      id: "cryptography",
      title: "Cryptography",
      category: "Cyber Security",
      difficulty: "Beginner to Intermediate",
      readingTime: "10-12 Hours",
      coverGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      coverAccent: "rgba(0, 188, 212, 0.08)",
      coverEmoji: "🔑",
      edition: "CRYPTO v1.0",
      author: "CYBERSHIELD CERTIFIED",
      description: "Master symmetric and asymmetric encryption, cryptographic hash functions, digital signatures, SSL/TLS protocol mechanics, and Public Key Infrastructure (PKI).",
      learningObjectives: [
        "Understand symmetric encryption algorithms and initialization vectors.",
        "Differentiate public and private key pairs in asymmetric cryptography.",
        "Implement secure digital signatures, TLS setups, and certificate revocations."
      ],
      skillsLearned: [
        "AES-GCM encryption configuration.",
        "Elliptic Curve key exchange verification.",
        "SSL/TLS cipher suite orchestration."
      ],
      lessons: [] // Loaded dynamically and sequentially
    },
    {
      id: "password-security",
      title: "Password Security",
      category: "Cyber Security",
      difficulty: "Beginner to Intermediate",
      readingTime: "8-10 Hours",
      coverGradient: "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
      coverAccent: "rgba(233, 30, 99, 0.08)",
      coverEmoji: "🔑",
      edition: "PASSWORDS v1.0",
      author: "CYBERSHIELD CERTIFIED",
      description: "Master password strength calculations, slow hashing architectures, salted hash storage, multi-factor authentication, phishing awareness, and overall cyber hygiene habits.",
      learningObjectives: [
        "Understand entropy calculations and how to mitigate brute-force attempts.",
        "Configure secure hashing databases using salt and slow algorithms.",
        "Implement multi-factor authentication (MFA) and identify phishing indicators."
      ],
      skillsLearned: [
        "Bcrypt and Argon2 configuration.",
        "TOTP authentication validation.",
        "Phishing email header investigation."
      ],
      lessons: [] // Loaded dynamically and sequentially
    },
    {
      id: "malware-defense",
      title: "Malware Awareness & Defense",
      category: "Cyber Security",
      difficulty: "Beginner to Intermediate",
      readingTime: "10-12 Hours",
      coverGradient: "linear-gradient(135deg, #3d0505 0%, #110000 100%)",
      coverAccent: "rgba(244, 67, 54, 0.08)",
      coverEmoji: "🦠",
      edition: "MALWARE v1.0",
      author: "CYBERSHIELD CERTIFIED",
      description: "Master the mechanics of Trojans, network-propagating worms, asymmetric ransomware, spyware exfiltration, and active incident response protocols.",
      learningObjectives: [
        "Differentiate Trojans from self-propagating network worms.",
        "Analyze double extortion ransomware schemes and asymmetric encryption.",
        "Understand spyware evasion and execute structured incident response stages."
      ],
      skillsLearned: [
        "Registry persistence and fileless execution mitigation.",
        "Process injection detection and memory artifact recovery.",
        "Breach containment and system eradication methodologies."
      ],
      lessons: [] // Loaded dynamically and sequentially
    },
    {
      id: "linux-basics",
      title: "Linux Basics",
      category: "OPERATING SYSTEMS",
      difficulty: "Beginner",
      readingTime: "8 Hours",
      coverGradient: "linear-gradient(135deg, #02050a 0%, #0c1524 100%)",
      coverAccent: "rgba(0, 242, 255, 0.08)",
      coverEmoji: "🐧",
      edition: "COMPLIANCE v2.4",
      author: "CYBERSHIELD CERTIFIED",
      description: "Master the foundational core of modern security operations. This interactive digital book leads you through standard shell commands, filesystems, and terminal system hardening.",
      learningObjectives: [
        "Acquire fluent command-line interface confidence.",
        "Map and audit critical Linux file hierarchy nodes.",
        "Deploy Uncomplicated Firewall and secure SSH configurations."
      ],
      skillsLearned: [
        "Octal permission decoding and chmod.",
        "Process manipulation, job control, and signal kills.",
        "Grep pattern-matching pipeline filters."
      ],
      lessons: linuxLessons
    },
    {
      id: "networking-basics",
      title: "Networking Basics",
      category: "INFRASTRUCTURE",
      difficulty: "Beginner",
      readingTime: "5 Hours",
      coverGradient: "linear-gradient(135deg, #241407 0%, #0c0602 100%)",
      coverAccent: "rgba(255, 122, 0, 0.08)",
      coverEmoji: "🌐",
      edition: "NETWORKS v1.0",
      author: "CYBERSHIELD ACADEMY",
      description: "Build a rock-solid foundation in computer networks, TCP/IP, OSI model, subnetting, and network analysis.",
      learningObjectives: [
        "Explain the layers of OSI and TCP/IP models.",
        "Calculate subnet masks and assign IP corridors.",
        "Understand DNS and HTTPS connection protocols."
      ],
      skillsLearned: [
        "Subnetting and CIDR planning.",
        "DNS lookup vulnerability mitigation.",
        "Packet capture and routing diagnostics."
      ],
      lessons: []
    },
    {
      id: "digital-forensics",
      title: "Digital Forensics",
      category: "Cyber Security",
      difficulty: "Beginner to Intermediate",
      readingTime: "12-15 Hours",
      coverGradient: "linear-gradient(135deg, #240b36 0%, #0c0214 100%)",
      coverAccent: "rgba(189, 0, 255, 0.08)",
      coverEmoji: "🕵️",
      edition: "FORENSICS v1.2",
      author: "CYBERSHIELD ACADEMY",
      description: "Master digital forensics and incident response. Learn how to preserve evidence, analyze disk and memory, parse system logs, and maintain secure chain of custody.",
      learningObjectives: [
        "Perform safe digital evidence preservation.",
        "Analyze active memory captures for malicious indicators.",
        "Sift through web and operating system log trails."
      ],
      skillsLearned: [
        "Disk imaging and artifact recovery.",
        "Log parsing and correlation.",
        "Legal chain of custody compliance."
      ],
      lessons: []
    },
    {
      id: "python-security",
      title: "Python for Cyber Security",
      category: "PROGRAMMING",
      difficulty: "Intermediate",
      readingTime: "10 Hours",
      coverGradient: "linear-gradient(135deg, #1f1f0a 0%, #0a0a03 100%)",
      coverAccent: "rgba(255, 235, 59, 0.08)",
      coverEmoji: "🐍",
      edition: "AUTOMATION v1.0",
      author: "CYBERSHIELD ACADEMY",
      description: "Automate security scanning, reconnaissance, and exploitation tasks. Build your own port scanners, packet sniffers, and custom automation tools from scratch.",
      learningObjectives: [
        "Write custom security automation scripts.",
        "Build socket scanners and exploit helpers.",
        "Parse and manipulate system files programmatically."
      ],
      skillsLearned: [
        "Socket API programming.",
        "Packet manipulation and analysis.",
        "Automated log scraping and parsing."
      ],
      lessons: []
    },
    {
      id: "web-security",
      title: "Web Security",
      category: "APPLICATION SECURITY",
      difficulty: "Advanced",
      readingTime: "14 Hours",
      coverGradient: "linear-gradient(135deg, #3a0d0d 0%, #170404 100%)",
      coverAccent: "rgba(244, 67, 54, 0.08)",
      coverEmoji: "🕸️",
      edition: "OWASP TOP 10 v3.0",
      author: "CYBERSHIELD CERTIFIED",
      description: "Master the web application threat model. Gain practical, deep experience diagnosing and defending against SQL Injection, XSS, CSRF, SSRF, and broken access controls.",
      learningObjectives: [
        "Examine and explain OWASP Top 10 flaws.",
        "Exploit and mitigate application weaknesses safely.",
        "Implement secure headers and authorization filters."
      ],
      skillsLearned: [
        "Manual and automated SQL injection testing.",
        "Content Security Policy (CSP) design.",
        "JWT and cookie security protection layers."
      ],
      lessons: []
    },
    {
      id: "cloud-security",
      title: "Cloud Security",
      category: "CLOUD PLATFORMS",
      difficulty: "Advanced",
      readingTime: "11 Hours",
      coverGradient: "linear-gradient(135deg, #0d3a4a 0%, #03151c 100%)",
      coverAccent: "rgba(0, 188, 212, 0.08)",
      coverEmoji: "☁️",
      edition: "CLOUD OPS v1.1",
      author: "CYBERSHIELD ACADEMY",
      description: "Secure modern cloud environments, IAM architectures, container clusters, and serverless computing corridors against real-world misconfigurations.",
      learningObjectives: [
        "Audit cloud infrastructure configurations.",
        "Define strict Principle of Least Privilege policies.",
        "Detect container breakout and privilege escalation."
      ],
      skillsLearned: [
        "Cloud identity configuration audits.",
        "Docker/K8s image risk analysis.",
        "Cloud logging and alert correlation."
      ],
      lessons: []
    }
  ];

  // --- INITIALIZATION ---
  function initAcademy() {
    loadLocalProgress();

    // Reorder BOOKS array to match requested sequential learning Roadmap order
    const ROADMAP_ORDER = [
      "linux-basics",
      "ethical-hacking-basics",
      "networking-basics",
      "owasp-top-10",
      "cryptography",
      "password-security",
      "malware-defense",
      "digital-forensics",
      "python-security"
    ];

    const orderedBooks = [];
    ROADMAP_ORDER.forEach(id => {
      const b = BOOKS.find(book => book.id === id);
      if (b) {
        orderedBooks.push(b);
      }
    });
    // Replace current BOOKS elements with ordered books
    BOOKS.length = 0;
    BOOKS.push(...orderedBooks);

    setupEventHandlers();
    
    // Fetch Ethical Hacking Basics book lessons asynchronously from intermediate.json
    const p1 = fetch('/data/courses/intermediate.json')
      .then(r => r.json())
      .then(data => {
        const mappedLessons = data.map((item, idx) => {
          return {
            id: item.id,
            title: item.chapter.title || item.title,
            category: "Offensive Security",
            duration: "45 mins",
            objectives: item.chapter.definitions ? Object.keys(item.chapter.definitions) : ["Understand baseline offensive security concepts."],
            introduction: item.chapter.summary || item.chapter.explanation.slice(0, 150) + "...",
            explanation: item.chapter.explanation,
            stepByStep: item.chapter.examples || [
              "Understand pentesting rules and scoping agreements.",
              "Conduct active and passive information harvesting.",
              "Confirm explicit legal boundaries before proceeding."
            ],
            realWorldExample: item.chapter.realWorldExample,
            keyTerms: item.chapter.definitions,
            diagram: item.chapter.diagram,
            notes: item.chapter.notes || [],
            bestPractices: item.chapter.tips || ["Get explicit written authorization.", "Establish clear testing bounds."],
            commonMistakes: ["Scanning without scope permission.", "Overlooking strict network boundaries."],
            faq: item.chapter.definitions ? Object.keys(item.chapter.definitions).map(key => ({
              q: `What is the security relevance of ${key}?`,
              a: item.chapter.definitions[key]
            })) : [],
            quiz: [
              {
                question: item.quiz.question,
                options: item.quiz.options,
                answer: item.quiz.answer,
                explanation: item.quiz.explanation
              }
            ]
          };
        });

        const ethBook = BOOKS.find(b => b.id === 'ethical-hacking-basics');
        if (ethBook) {
          ethBook.lessons = mappedLessons;
        }

        const targetMalwareIds = [
          'malware-mechanics',
          'ransomware-tactics',
          'spyware-detection',
          'incident-response'
        ];
        const malwareLessons = mappedLessons.filter(lesson => targetMalwareIds.includes(lesson.id));
        malwareLessons.sort((a, b) => targetMalwareIds.indexOf(a.id) - targetMalwareIds.indexOf(b.id));
        fullMalwareLessons = malwareLessons;

        const malwareBook = BOOKS.find(b => b.id === 'malware-defense');
        if (malwareBook) {
          malwareBook.lessons = fullMalwareLessons.slice(0, progressState.malwareUnlockedCount || 1);
        }
      });

    // Fetch OWASP Top 10 and Cryptography book lessons from advanced.json
    const p2 = fetch('/data/courses/advanced.json')
      .then(r => r.json())
      .then(data => {
        const owaspData = data.filter(item => item.id && item.id.startsWith('owasp-'));
        fullOwaspLessons = owaspData.map((item, idx) => {
          return {
            id: item.id,
            title: item.chapter.title || item.title,
            category: "Application Security",
            duration: "45 mins",
            objectives: item.chapter.definitions ? Object.keys(item.chapter.definitions) : ["Understand baseline web security concepts."],
            introduction: item.chapter.summary || item.chapter.explanation.slice(0, 150) + "...",
            explanation: item.chapter.explanation,
            stepByStep: item.chapter.examples || [
              "Review the security vulnerabilities and exploit vectors.",
              "Test inputs and access control endpoints safely.",
              "Deploy secure parameters and standard whitelists."
            ],
            realWorldExample: item.chapter.realWorldExample,
            keyTerms: item.chapter.definitions,
            diagram: item.chapter.diagram,
            notes: item.chapter.notes || [],
            bestPractices: item.chapter.tips || ["Parameterize database statements.", "Deploy strict Content Security Policies."],
            commonMistakes: ["Trusting authorization states sent from client.", "Executing untrusted OS commands in shells."],
            faq: item.chapter.definitions ? Object.keys(item.chapter.definitions).map(key => ({
              q: `What is the security relevance of ${key}?`,
              a: item.chapter.definitions[key]
            })) : [],
            quiz: [
              {
                question: item.quiz.question,
                options: item.quiz.options,
                answer: item.quiz.answer,
                explanation: item.quiz.explanation
              }
            ]
          };
        });

        const owaspBook = BOOKS.find(b => b.id === 'owasp-top-10');
        if (owaspBook) {
          owaspBook.lessons = fullOwaspLessons.slice(0, progressState.owaspUnlockedCount || 1);
        }

        const cryptoData = data.filter(item => item.id && item.id.startsWith('crypto-'));
        fullCryptoLessons = cryptoData.map((item, idx) => {
          return {
            id: item.id,
            title: item.chapter.title || item.title,
            category: "Cyber Security",
            duration: "45 mins",
            objectives: item.chapter.definitions ? Object.keys(item.chapter.definitions) : ["Understand symmetric/asymmetric encryption."],
            introduction: item.chapter.summary || item.chapter.explanation.slice(0, 150) + "...",
            explanation: item.chapter.explanation,
            stepByStep: item.chapter.examples || [
              "Analyze cipher specifications and keys.",
              "Run verification and hashing routines.",
              "Enforce strict transport layer rules."
            ],
            realWorldExample: item.chapter.realWorldExample,
            keyTerms: item.chapter.definitions,
            diagram: item.chapter.diagram,
            notes: item.chapter.notes || [],
            bestPractices: item.chapter.tips || ["Never reuse initialization vectors.", "Prefer authenticated encryption like AES-GCM."],
            commonMistakes: ["Reusing initialization vectors (IVs).", "Using weak hashing algorithms like MD5/SHA-1."],
            faq: item.chapter.definitions ? Object.keys(item.chapter.definitions).map(key => ({
              q: `What is the significance of ${key}?`,
              a: item.chapter.definitions[key]
            })) : [],
            quiz: [
              {
                question: item.quiz.question,
                options: item.quiz.options,
                answer: item.quiz.answer,
                explanation: item.quiz.explanation
              }
            ]
          };
        });

        const cryptoBook = BOOKS.find(b => b.id === 'cryptography');
        if (cryptoBook) {
          cryptoBook.lessons = fullCryptoLessons.slice(0, progressState.cryptoUnlockedCount || 1);
        }

        const forensicsData = data.filter(item => item.id && item.id.startsWith('forensics-'));
        const targetForensicsIds = [
          'forensics-disk',
          'forensics-memory',
          'forensics-logs',
          'forensics-evidence',
          'forensics-chain'
        ];
        forensicsData.sort((a, b) => targetForensicsIds.indexOf(a.id) - targetForensicsIds.indexOf(b.id));

        fullForensicsLessons = forensicsData.map((item, idx) => {
          return {
            id: item.id,
            title: item.chapter.title || item.title,
            category: "Cyber Security",
            duration: "45 mins",
            objectives: item.chapter.definitions ? Object.keys(item.chapter.definitions) : ["Understand security parameters."],
            introduction: item.chapter.summary || item.chapter.explanation.slice(0, 150) + "...",
            explanation: item.chapter.explanation,
            stepByStep: item.chapter.examples || [
              "Identify attack and defense vectors.",
              "Adopt robust defensive configurations.",
              "Review logging and validation alerts."
            ],
            realWorldExample: item.chapter.realWorldExample,
            keyTerms: item.chapter.definitions,
            diagram: item.chapter.diagram,
            notes: item.chapter.notes || [],
            bestPractices: item.chapter.tips || ["Implement digital evidence controls.", "Utilize write blockers during imaging."],
            commonMistakes: ["Failing to keep accurate chain of custody.", "Analyzing evidence directly on active systems."],
            faq: item.chapter.definitions ? Object.keys(item.chapter.definitions).map(key => ({
              q: `What is the significance of ${key}?`,
              a: item.chapter.definitions[key]
            })) : [],
            quiz: [
              {
                question: item.quiz.question,
                options: item.quiz.options,
                answer: item.quiz.answer,
                explanation: item.quiz.explanation
              }
            ]
          };
        });

        const forensicsBook = BOOKS.find(b => b.id === 'digital-forensics');
        if (forensicsBook) {
          forensicsBook.lessons = fullForensicsLessons.slice(0, progressState.forensicsUnlockedCount || 1);
        }
      });

    // Fetch Password Security book lessons from beginner.json
    const p3 = fetch('/data/courses/beginner.json')
      .then(r => r.json())
      .then(data => {
        const targetPasswordSecurityIds = [
          'password-security',
          'mfa-basics',
          'email-security',
          'phishing-awareness',
          'social-engineering',
          'cyber-hygiene',
          'safe-browsing'
        ];
        const passwordData = data.filter(item => item.id && targetPasswordSecurityIds.includes(item.id));
        
        // Sort the data to match targetPasswordSecurityIds sequence
        passwordData.sort((a, b) => targetPasswordSecurityIds.indexOf(a.id) - targetPasswordSecurityIds.indexOf(b.id));

        fullPasswordLessons = passwordData.map((item, idx) => {
          return {
            id: item.id,
            title: item.chapter.title || item.title,
            category: "Cyber Security",
            duration: "45 mins",
            objectives: item.chapter.definitions ? Object.keys(item.chapter.definitions) : ["Understand security parameters."],
            introduction: item.chapter.summary || item.chapter.explanation.slice(0, 150) + "...",
            explanation: item.chapter.explanation,
            stepByStep: item.chapter.examples || [
              "Identify attack and defense vectors.",
              "Adopt robust defensive configurations.",
              "Review logging and validation alerts."
            ],
            realWorldExample: item.chapter.realWorldExample,
            keyTerms: item.chapter.definitions,
            diagram: item.chapter.diagram,
            notes: item.chapter.notes || [],
            bestPractices: item.chapter.tips || ["Implement multi-factor authentication.", "Use secure, high-entropy passphrases."],
            commonMistakes: ["Using short, guessable passwords.", "Failing to enable multi-factor authentication."],
            faq: item.chapter.definitions ? Object.keys(item.chapter.definitions).map(key => ({
              q: `What is the significance of ${key}?`,
              a: item.chapter.definitions[key]
            })) : [],
            quiz: [
              {
                question: item.quiz.question,
                options: item.quiz.options,
                answer: item.quiz.answer,
                explanation: item.quiz.explanation
              }
            ]
          };
        });

        const passwordBook = BOOKS.find(b => b.id === 'password-security');
        if (passwordBook) {
          passwordBook.lessons = fullPasswordLessons.slice(0, progressState.passwordUnlockedCount || 1);
        }
      });

    Promise.all([p1, p2, p3])
      .then(() => {
        renderBookHub();
      })
      .catch(err => {
        console.error("Failed to load academic syllabus:", err);
        renderBookHub();
      });
  }

  // --- PROGRESS PERSISTENCE ---
  function loadLocalProgress() {
    const raw = localStorage.getItem(ACADEMY_STORAGE_KEY);
    if (raw) {
      try {
        progressState = JSON.parse(raw);
        if (!progressState.completedLessons) progressState.completedLessons = {};
        if (!progressState.bookmarks) progressState.bookmarks = {};
        if (progressState.xp === undefined) progressState.xp = 0;
        if (!progressState.completedPaths) progressState.completedPaths = {};
        if (progressState.finalQuizPassed === undefined) progressState.finalQuizPassed = false;
        if (progressState.finalAssessmentPassed === undefined) progressState.finalAssessmentPassed = false;
        if (!progressState.finalQuizAnswers) progressState.finalQuizAnswers = {};
        if (!progressState.finalAssessmentAnswers) progressState.finalAssessmentAnswers = {};
        if (progressState.owaspUnlockedCount === undefined) progressState.owaspUnlockedCount = 1;
        if (progressState.cryptoUnlockedCount === undefined) progressState.cryptoUnlockedCount = 1;
        if (progressState.passwordUnlockedCount === undefined) progressState.passwordUnlockedCount = 1;
        if (progressState.malwareUnlockedCount === undefined) progressState.malwareUnlockedCount = 1;
        if (progressState.forensicsUnlockedCount === undefined) progressState.forensicsUnlockedCount = 1;
      } catch (e) {
        console.error("Failed to parse academy progress, resetting...", e);
      }
    } else {
      saveLocalProgress();
    }
    updateProgressMetrics();
  }

  function saveLocalProgress() {
    localStorage.setItem(ACADEMY_STORAGE_KEY, JSON.stringify(progressState));
    updateProgressMetrics();
  }

  function updateProgressMetrics() {
    const statPaths = document.getElementById('learning-stat-paths');
    const statLessons = document.getElementById('learning-stat-lessons');
    const statXp = document.getElementById('learning-stat-xp');

    let totalLessonsAcrossBooks = 0;
    BOOKS.forEach(book => {
      if (book.lessons) totalLessonsAcrossBooks += book.lessons.length;
    });
    const completedLessonsCount = Object.keys(progressState.completedLessons || {}).filter(k => progressState.completedLessons[k]).length;
    const remainingLessons = Math.max(0, totalLessonsAcrossBooks - completedLessonsCount);
    const overallPercentage = totalLessonsAcrossBooks > 0 ? Math.round((completedLessonsCount / totalLessonsAcrossBooks) * 100) : 0;

    // Calculate Estimated Time Left: average of 15 minutes per remaining lesson
    const estMins = remainingLessons * 15;
    let timeStr = "0m";
    if (estMins > 0) {
      const hours = Math.floor(estMins / 60);
      const mins = estMins % 60;
      timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    if (statPaths) {
      let pathsCount = 0;
      BOOKS.forEach(book => {
        if (book.lessons && book.lessons.length > 0) {
          const completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
          if (completedCount === book.lessons.length) {
            pathsCount++;
          }
        }
      });
      statPaths.textContent = `${pathsCount} / ${BOOKS.filter(b => b.lessons && b.lessons.length > 0).length}`;
    }

    if (statLessons) {
      statLessons.textContent = `${completedLessonsCount} / ${totalLessonsAcrossBooks}`;
    }

    if (statXp) {
      statXp.textContent = `${progressState.xp} XP`;
    }

    // Dynamic addition of Progress Bar and Estimated Time Left tile if they don't exist
    const metricsBar = document.querySelector('.learning-metrics-bar');
    if (metricsBar) {
      let timeTile = document.getElementById('learning-stat-time-tile');
      if (!timeTile) {
        timeTile = document.createElement('div');
        timeTile.id = 'learning-stat-time-tile';
        timeTile.className = 'learning-metric-tile';
        timeTile.style.cssText = 'background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.75rem 1.25rem; border-radius: 8px; text-align: center; min-width: 100px; display: flex; flex-direction: column; justify-content: center;';
        metricsBar.appendChild(timeTile);
      }
      timeTile.innerHTML = `
        <div style="font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-sans); margin-bottom: 0.25rem; letter-spacing: 0.5px;">EST. TIME LEFT</div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--neon-cyan); font-family: var(--font-mono);">${timeStr}</div>
      `;

      // Main Academy Progress Bar underneath the subheader
      const bannerTitle = document.querySelector('#view-learning .section-banner-title');
      if (bannerTitle) {
        let pbContainer = document.getElementById('academy-global-progress-container');
        if (!pbContainer) {
          pbContainer = document.createElement('div');
          pbContainer.id = 'academy-global-progress-container';
          pbContainer.style.cssText = 'width: 100%; margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 1.25rem;';
          bannerTitle.parentNode.insertBefore(pbContainer, bannerTitle.nextSibling);
        }
        pbContainer.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
            <span style="letter-spacing: 1px;">CYBERSHIELD ACADEMY ROADMAP ENROLLMENT</span>
            <span style="color: var(--neon-cyan); font-weight: bold;">${overallPercentage}% COMPLETED • ${remainingLessons} REMAINING</span>
          </div>
          <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
            <div style="width: ${overallPercentage}%; height: 100%; background: linear-gradient(90deg, var(--neon-cyan) 0%, #0072ff 100%); transition: width 0.5s ease; border-radius: 4px;"></div>
          </div>
        `;
      }
    }
  }

  // --- GET GRADUATE DISPLAY NAME ---
  function getGraduateName() {
    const storedProfile = localStorage.getItem('operatorProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        if (profile.name) return profile.name.toUpperCase();
      } catch (e) {
        console.error("Failed to parse profile name", e);
      }
    }
    return "CYBERSHIELD OPERATOR";
  }

  // --- ROADMAP PATH COMPLETION & UNLOCK STATUS CONTROLLERS ---
  function isBookCompleted(book) {
    if (!book.lessons || book.lessons.length === 0) return true; // Treat empty/in-development as completed to bypass blocking
    
    let completedCount = 0;
    if (book.id === 'owasp-top-10') {
      const maxLessons = 6;
      completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
      return completedCount === maxLessons;
    } else if (book.id === 'cryptography') {
      const maxLessons = 6;
      completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
      return completedCount === maxLessons;
    } else if (book.id === 'password-security') {
      const maxLessons = 7;
      completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
      return completedCount === maxLessons;
    } else if (book.id === 'malware-defense') {
      const maxLessons = 4;
      completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
      return completedCount === maxLessons;
    } else if (book.id === 'digital-forensics') {
      const maxLessons = 5;
      completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
      return completedCount === maxLessons;
    } else if (book.id === 'linux-basics') {
      const totalLessons = book.lessons.length;
      completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
      return completedCount === totalLessons && progressState.finalQuizPassed && progressState.finalAssessmentPassed;
    } else {
      const totalLessons = book.lessons.length;
      completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
      return completedCount === totalLessons;
    }
  }

  function isBookUnlocked(bookId) {
    const idx = BOOKS.findIndex(b => b.id === bookId);
    if (idx <= 0) return true; // Linux Basics (first book) is always unlocked
    const prevBook = BOOKS[idx - 1];
    return isBookCompleted(prevBook);
  }

  // --- RENDER DYNAMIC BOOK HUB & DIGITAL LIBRARY ---
  function renderBookHub() {
    const grid = document.getElementById('learning-content-grid');
    if (!grid) return;

    if (currentView === "library") {
      // Library view: Grid of beautiful book cards
      const filteredBooks = BOOKS.filter(book => {
        const matchesFilter = activeFilterTab === "all" || book.difficulty === activeFilterTab;
        const matchesSearch = book.title.toLowerCase().includes(currentSearchKeyword.toLowerCase()) || 
                              book.category.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                              book.description.toLowerCase().includes(currentSearchKeyword.toLowerCase());
        return matchesFilter && matchesSearch;
      });

      if (filteredBooks.length === 0) {
        grid.style.display = "block";
        grid.innerHTML = `
          <div style="text-align: center; padding: 4rem 2rem; border: 1px dashed rgba(255, 255, 255, 0.08); border-radius: 12px; background: rgba(255,255,255,0.01);">
            <span style="font-size: 2rem;">🔍</span>
            <h4 style="margin: 1rem 0 0.5rem 0; color: #fff; font-size: 1.1rem;">No matching digital books found</h4>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">Try adjusting your keywords or difficulty filters.</p>
          </div>
        `;
        return;
      }

      grid.style.display = "grid";
      grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(290px, 1fr))";
      grid.style.gap = "1.25rem";

      grid.innerHTML = filteredBooks.map(book => {
        let progressPercent = 0;
        let completedCount = 0;
        if (book.lessons && book.lessons.length > 0) {
          const totalLessons = book.lessons.length;
          completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
          progressPercent = Math.round((completedCount / totalLessons) * 100);
        }

        const isBookmarked = progressState.bookmarks && progressState.bookmarks[book.id];
        const isUnlocked = isBookUnlocked(book.id);
        const bookIndex = BOOKS.findIndex(b => b.id === book.id);
        const stepNumber = String(bookIndex + 1).padStart(2, '0');

        return `
          <div class="book-card" data-id="${book.id}" style="background: rgba(10, 15, 25, 0.65); border: 1px solid ${isUnlocked ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 64, 129, 0.1)'}; border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; transition: all 0.3s; position: relative; overflow: hidden; cursor: ${isUnlocked ? 'pointer' : 'not-allowed'}; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); opacity: ${isUnlocked ? '1' : '0.6'};" ${isUnlocked ? `onmouseover="this.style.borderColor='rgba(0, 242, 255, 0.25)'; this.style.transform='translateY(-4px)';" onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.05)'; this.style.transform='translateY(0)';"` : ''} id="book-card-${book.id}">
            <!-- Glow background decor -->
            <div style="position: absolute; top: -50px; right: -50px; width: 120px; height: 120px; background: ${isUnlocked ? book.coverAccent : 'rgba(255, 64, 129, 0.04)'}; border-radius: 50%; filter: blur(35px); pointer-events: none;"></div>
            
            <!-- Completion & Lock Badge -->
            ${progressPercent === 100 ? `
              <div style="position: absolute; top: 12px; left: 12px; background: linear-gradient(135deg, #00ff9d 0%, #00a86b 100%); color: #02050a; font-family: var(--font-mono); font-size: 0.55rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,255,157,0.3); z-index: 5; letter-spacing: 0.5px; display: flex; align-items: center; gap: 0.25rem;">
                <span>✔</span><span>COMPLETED</span>
              </div>
            ` : !isUnlocked ? `
              <div style="position: absolute; top: 12px; left: 12px; background: rgba(255, 64, 129, 0.15); border: 1px solid rgba(255, 64, 129, 0.3); color: #ff4081; font-family: var(--font-mono); font-size: 0.55rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; z-index: 5; letter-spacing: 0.5px; display: flex; align-items: center; gap: 0.25rem;">
                <span>🔒</span><span>LOCKED</span>
              </div>
            ` : `
              <div style="position: absolute; top: 12px; left: 12px; background: rgba(0, 242, 255, 0.15); border: 1px solid rgba(0, 242, 255, 0.3); color: var(--neon-cyan); font-family: var(--font-mono); font-size: 0.55rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; z-index: 5; letter-spacing: 0.5px; display: flex; align-items: center; gap: 0.25rem;">
                <span>⚡</span><span>ACTIVE</span>
              </div>
            `}

            <!-- Step counter top right -->
            <div style="position: absolute; top: 12px; right: 12px; font-family: var(--font-mono); font-size: 0.7rem; font-weight: bold; color: ${isUnlocked ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.2)'}; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; border: 1px solid ${isUnlocked ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255,255,255,0.03)'};">
              STEP ${stepNumber}
            </div>

            <!-- Book Cover -->
            <div style="width: 100%; height: 160px; background: ${isUnlocked ? book.coverGradient : 'linear-gradient(135deg, #090205 0%, #030102 100%)'}; border: 1px solid ${isUnlocked ? 'rgba(255,255,255,0.06)' : 'rgba(255, 64, 129, 0.1)'}; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; position: relative; overflow: hidden; box-shadow: inset 0 0 20px rgba(0,0,0,0.6);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                <span style="font-family: var(--font-mono); font-size: 0.55rem; color: ${isUnlocked ? 'var(--neon-cyan)' : '#ff4081'}; font-weight: bold; letter-spacing: 1px;">${book.edition}</span>
                <span style="font-size: 1.1rem; filter: ${isUnlocked ? 'none' : 'grayscale(100%) opacity(40%)'};">${book.coverEmoji}</span>
              </div>
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.1; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${book.title.split(' ')[0]}<br><span style="color: ${isUnlocked ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.5)'};">${book.title.split(' ').slice(1).join(' ') || ''}</span></h3>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-muted);">${book.author}</span>
                <span style="background: ${isUnlocked ? 'rgba(0,242,255,0.12)' : 'rgba(255,64,129,0.05)'}; border: 1px solid ${isUnlocked ? 'rgba(0,242,255,0.2)' : 'rgba(255,64,129,0.15)'}; color: ${isUnlocked ? 'var(--neon-cyan)' : '#ff4081'}; font-size: 0.45rem; font-family: var(--font-mono); padding: 1px 4px; border-radius: 2px; font-weight: bold;">SECURE RUNBOOK</span>
              </div>
              ${!isUnlocked ? `
                <div style="position: absolute; inset: 0; background: rgba(5, 1, 2, 0.75); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
                  <span style="font-size: 2.5rem;">🔒</span>
                </div>
              ` : ''}
            </div>

            <!-- Specs -->
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                <span style="background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.15); color: var(--neon-cyan); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.6rem; font-family: var(--font-mono); font-weight: bold;">${book.category}</span>
                <span style="background: ${!isUnlocked ? 'rgba(255,255,255,0.03)' : book.difficulty === 'Beginner' ? 'rgba(0, 255, 157, 0.05)' : book.difficulty === 'Intermediate' ? 'rgba(255, 165, 0, 0.05)' : 'rgba(255, 64, 129, 0.05)'}; border: 1px solid ${!isUnlocked ? 'rgba(255,255,255,0.05)' : book.difficulty === 'Beginner' ? 'rgba(0, 255, 157, 0.15)' : book.difficulty === 'Intermediate' ? 'rgba(255, 165, 0, 0.15)' : 'rgba(255, 64, 129, 0.15)'}; color: ${!isUnlocked ? 'rgba(255,255,255,0.3)' : book.difficulty === 'Beginner' ? 'var(--neon-green)' : book.difficulty === 'Intermediate' ? 'orange' : '#ff4081'}; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.6rem; font-family: var(--font-mono); font-weight: bold;">${book.difficulty.toUpperCase()}</span>
                <span style="font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono); margin-left: auto;">⏱ ${book.readingTime}</span>
              </div>
              <p style="font-size: 0.75rem; line-height: 1.4; color: var(--text-muted); margin: 0.2rem 0 0 0; min-height: 2.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
                ${isUnlocked ? book.description : `Unlock by completing the preceding operational course sequence: "${BOOKS[bookIndex - 1]?.title || 'previous segment'}"`}
              </p>
            </div>

            <!-- Reading Progress and Button -->
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; margin-top: auto;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted);">
                <span>ROADMAP PROGRESS</span>
                <span style="color: ${isUnlocked ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.2)'}; font-weight: bold;">${isUnlocked ? progressPercent : 0}% Complete</span>
              </div>
              <div style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.03); border-radius: 3.5px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.01);">
                <div style="width: ${isUnlocked ? progressPercent : 0}%; height: 100%; background: linear-gradient(135deg, #00f2ff 0%, #0072ff 100%); border-radius: 3.5px; transition: width 0.4s;"></div>
              </div>

              <!-- Certificate Status -->
              <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.55rem; margin-top: -0.1rem; margin-bottom: 0.1rem;">
                <span style="color: rgba(255, 255, 255, 0.3);">GRADUATE CREDENTIAL</span>
                <span style="color: ${isUnlocked && isBookCompleted(book) ? 'var(--neon-green)' : 'rgba(255,255,255,0.2)'}; font-weight: bold; display: flex; align-items: center; gap: 0.2rem;">
                  <span style="display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: ${isUnlocked && isBookCompleted(book) ? 'var(--neon-green)' : 'rgba(255,255,255,0.2)'};"></span>
                  ${isUnlocked && isBookCompleted(book) ? 'GRANTED' : 'LOCKED'}
                </span>
              </div>
              
              <div style="display: flex; gap: 0.5rem; width: 100%;">
                <button class="continue-book-btn" data-id="${book.id}" style="flex: 1; padding: 0.55rem; font-size: 0.72rem; font-family: var(--font-mono); font-weight: bold; background: ${!isUnlocked ? 'rgba(255,255,255,0.01)' : progressPercent === 100 ? 'rgba(0, 255, 157, 0.08)' : progressPercent > 0 ? 'rgba(0, 242, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)'}; border: 1px solid ${!isUnlocked ? 'rgba(255, 255, 255, 0.04)' : progressPercent === 100 ? 'var(--neon-green)' : progressPercent > 0 ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.08)'}; color: ${!isUnlocked ? 'rgba(255,255,255,0.2)' : progressPercent === 100 ? 'var(--neon-green)' : progressPercent > 0 ? 'var(--neon-cyan)' : '#ffffff'}; text-align: center; border-radius: 6px; cursor: ${isUnlocked ? 'pointer' : 'not-allowed'}; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s;" id="book-btn-${book.id}" ${!isUnlocked ? 'disabled' : ''}>
                  <span>${!isUnlocked ? 'LOCKED ROADMAP' : progressPercent === 100 ? 'REVIEW RUNBOOK' : progressPercent > 0 ? 'CONTINUE READING' : 'START RUNBOOK'}</span>
                  <span>&rarr;</span>
                </button>
                <button class="bookmark-card-btn" data-id="${book.id}" style="padding: 0.55rem 0.75rem; font-size: 0.8rem; font-family: var(--font-mono); background: rgba(255, 255, 255, 0.02); border: 1px solid ${isBookmarked ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.08)'}; color: ${isBookmarked ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.4)'}; border-radius: 6px; cursor: ${isUnlocked ? 'pointer' : 'not-allowed'}; transition: all 0.2s; display: flex; align-items: center; justify-content: center;" title="${isBookmarked ? 'Unbookmark' : 'Bookmark'}" ${!isUnlocked ? 'disabled' : ''}>
                  <span>${isBookmarked ? '★' : '☆'}</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Bind Click events on book cards
      document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.continue-book-btn') || e.target.closest('.bookmark-card-btn')) return;
          const id = card.getAttribute('data-id');
          if (!isBookUnlocked(id)) {
            const bIdx = BOOKS.findIndex(b => b.id === id);
            const prevBook = bIdx > 0 ? BOOKS[bIdx - 1] : null;
            const prevTitle = prevBook ? prevBook.title : "preceding course";
            window.showToast("ROADMAP ROUTE LOCKED", `This course path is locked. Complete all stages of "${prevTitle}" to unlock.`, true);
            return;
          }
          selectBook(id);
        });
      });

      document.querySelectorAll('.continue-book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (!isBookUnlocked(id)) {
            const bIdx = BOOKS.findIndex(b => b.id === id);
            const prevBook = bIdx > 0 ? BOOKS[bIdx - 1] : null;
            const prevTitle = prevBook ? prevBook.title : "preceding course";
            window.showToast("ROADMAP ROUTE LOCKED", `This course path is locked. Complete all stages of "${prevTitle}" to unlock.`, true);
            return;
          }
          // Resume directly inside reader modal if book is unlocked and has lessons
          const book = BOOKS.find(b => b.id === id);
          if (book && book.lessons && book.lessons.length > 0) {
            let resumeIndex = progressState.lastActiveLessonIndex?.[book.id];
            if (resumeIndex === undefined) {
              resumeIndex = 0;
              for (let i = 0; i < book.lessons.length; i++) {
                if (!progressState.completedLessons[book.lessons[i].id]) {
                  resumeIndex = i;
                  break;
                }
              }
            }
            activeBookId = id;
            activeLessonIndex = resumeIndex;
            openBookReader(book);
          } else {
            selectBook(id);
          }
        });
      });

      document.querySelectorAll('.bookmark-card-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (!isBookUnlocked(id)) return;
          if (!progressState.bookmarks) progressState.bookmarks = {};
          progressState.bookmarks[id] = !progressState.bookmarks[id];
          saveLocalProgress();
          renderBookHub();
        });
      });

    } else if (currentView === "book-details") {
      // Book details view: details, cover, syllabus
      const book = BOOKS.find(b => b.id === activeBookId);
      if (!book) return;

      let progressPercent = 0;
      let completedCount = 0;
      if (book.lessons && book.lessons.length > 0) {
        completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
        progressPercent = Math.round((completedCount / book.lessons.length) * 100);
      }

      const isBookmarked = progressState.bookmarks[book.id];

      grid.style.display = "block";
      grid.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; animation: fade-in 0.3s ease;">
          
          <!-- Back to library -->
          <div style="margin-bottom: -1rem;">
            <button id="back-to-library-btn" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); color: var(--neon-cyan); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.75rem; font-family: var(--font-mono); font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;">
              <span>&larr;</span>
              <span>BACK TO DIGITAL LIBRARY</span>
            </button>
          </div>

          <!-- Book Header Panel -->
          <div style="background: rgba(10, 15, 25, 0.65); border: 1px solid rgba(0, 242, 255, 0.15); border-radius: 16px; padding: 2.5rem; display: grid; grid-template-columns: 280px 1fr; gap: 2.5rem; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);" id="book-details-panel">
            
            <!-- Cover Visual -->
            <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
              <div id="book-cover-detail" style="width: 250px; height: 350px; background: ${book.coverGradient}; border: 2px solid var(--neon-cyan); border-radius: 12px; position: relative; padding: 2rem 1.5rem; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; box-shadow: 0 0 25px rgba(0, 242, 255, 0.25); transition: transform 0.3s; cursor: pointer;">
                <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: ${book.coverAccent}; border-radius: 50%; filter: blur(40px);"></div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 242, 255, 0.2); padding-bottom: 0.75rem;">
                  <span style="font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 2px; color: var(--neon-cyan); font-weight: bold;">SECURITY MANUAL</span>
                  <span style="font-size: 0.8rem;">${book.coverEmoji}</span>
                </div>
                
                <div style="margin: 2rem 0;">
                  <h1 style="font-size: 2rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.1; letter-spacing: -1px;">${book.title.split(' ')[0]}<br><span style="color: var(--neon-cyan);">${book.title.split(' ').slice(1).join(' ') || ''}</span></h1>
                  <p style="font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); margin-top: 0.5rem; letter-spacing: 1px; text-transform: uppercase;">CyberShield Academy</p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.35rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.75rem;">
                  <div style="font-size: 0.55rem; color: var(--text-muted); font-family: var(--font-mono);">EDITION: ${book.edition}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: var(--font-mono); font-size: 0.6rem; color: var(--neon-cyan); font-weight: bold;">CYBERSHIELD</span>
                    <span style="background: rgba(0,242,255,0.1); color: var(--neon-cyan); border: 1px solid rgba(0,242,255,0.2); font-size: 0.5rem; font-family: var(--font-mono); padding: 1px 4px; border-radius: 3px; font-weight: bold;">CERTIFIED</span>
                  </div>
                </div>
              </div>
              
              <button id="bookmark-btn" style="width: 100%; max-width: 250px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.6rem 1rem; border-radius: 8px; color: ${isBookmarked ? 'var(--neon-cyan)' : 'var(--text-muted)'}; font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; transition: all 0.3s;" id="bookmark-btn">
                <span style="font-size: 1rem;">${isBookmarked ? '★' : '☆'}</span>
                <span>${isBookmarked ? 'BOOKMARKED' : 'BOOKMARK BOOK'}</span>
              </button>
            </div>

            <!-- Specifications -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                  <span style="background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.15); color: var(--neon-cyan); padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-family: var(--font-mono); font-weight: bold; letter-spacing: 0.5px;">${book.category}</span>
                  <span style="background: ${book.difficulty === 'Beginner' ? 'rgba(0, 255, 157, 0.05)' : book.difficulty === 'Intermediate' ? 'rgba(255, 165, 0, 0.05)' : 'rgba(255, 64, 129, 0.05)'}; border: 1px solid ${book.difficulty === 'Beginner' ? 'rgba(0, 255, 157, 0.15)' : book.difficulty === 'Intermediate' ? 'rgba(255, 165, 0, 0.15)' : 'rgba(255, 64, 129, 0.15)'}; color: ${book.difficulty === 'Beginner' ? 'var(--neon-green)' : book.difficulty === 'Intermediate' ? 'orange' : '#ff4081'}; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-family: var(--font-mono); font-weight: bold;">${book.difficulty.toUpperCase()}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">⏱ ${book.readingTime} Reading</span>
                </div>
                
                <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0 0 0.75rem 0; font-family: var(--font-sans); tracking: -0.5px;">${book.title}: Interactive Security manual</h2>
                <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-muted); margin: 0 0 1.5rem 0;">
                  ${book.description}
                </p>

                <!-- Learning Objectives -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                  <div>
                    <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); letter-spacing: 0.05em; text-transform: uppercase; margin: 0 0 0.5rem 0;">LEARNING OBJECTIVES</h4>
                    <ul style="padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-muted); font-size: 0.75rem; line-height: 1.4;">
                      ${book.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); letter-spacing: 0.05em; text-transform: uppercase; margin: 0 0 0.5rem 0;">SKILLS LEARNED</h4>
                    <ul style="padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-muted); font-size: 0.75rem; line-height: 1.4;">
                      ${book.skillsLearned.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Reading Progress -->
              <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                    <span>SYLLABUS READING PROGRESS</span>
                    <span style="color: var(--neon-cyan); font-weight: bold;">${progressPercent}% Complete</span>
                  </div>
                  <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.03); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.02);">
                    <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(135deg, #00f2ff 0%, #0072ff 100%); border-radius: 4px; transition: width 0.4s;"></div>
                  </div>
                  <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); margin-top: 0.5rem;">
                    ✔ Resolved ${completedCount} of ${book.lessons ? book.lessons.length : 0} Chapters • ${(book.lessons ? book.lessons.length : 0) - completedCount} Outstanding
                  </div>
                </div>

                <button id="continue-reading-btn" style="background: linear-gradient(135deg, #00f2ff 0%, #0072ff 100%); border: none; color: #02050a; font-weight: 700; font-family: var(--font-mono); font-size: 0.85rem; padding: 0.85rem 2rem; border-radius: 8px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0, 242, 255, 0.2); display: flex; align-items: center; gap: 0.5rem;" id="detail-continue-btn">
                  <span>${progressPercent > 0 ? 'CONTINUE READING' : 'START INTERACTIVE BOOK'}</span>
                  <span>&rarr;</span>
                </button>
              </div>

            </div>

          </div>

          <!-- Syllabus -->
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin: 0 0 1rem 0; font-family: var(--font-sans); display: flex; align-items: center; gap: 0.5rem;">
              <span>📖</span>
              <span>Course Syllabus: ${book.lessons ? book.lessons.length : 0} Chapters</span>
            </h3>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
              ${book.lessons && book.lessons.length > 0 ? book.lessons.map((lesson, idx) => {
                const isComp = progressState.completedLessons[lesson.id];
                const isLessonUnlocked = idx === 0 || progressState.completedLessons[book.lessons[idx - 1].id];
                return `
                  <div class="chapter-row" data-index="${idx}" data-unlocked="${isLessonUnlocked}" style="background: rgba(255,255,255,0.01); border: 1px solid ${isLessonUnlocked ? 'rgba(255,255,255,0.04)' : 'rgba(255,64,129,0.06)'}; border-radius: 8px; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; cursor: ${isLessonUnlocked ? 'pointer' : 'not-allowed'}; opacity: ${isLessonUnlocked ? '1' : '0.5'}; transition: all 0.2s;" ${isLessonUnlocked ? `onmouseover="this.style.background='rgba(0, 242, 255, 0.02)'; this.style.borderColor='rgba(0, 242, 255, 0.15)';" onmouseout="this.style.background='rgba(255,255,255,0.01)'; this.style.borderColor='rgba(255,255,255,0.04)';"` : ''}>
                    <div style="display: flex; align-items: center; gap: 1.25rem; overflow: hidden;">
                      <div style="display: flex; align-items: center; justify-content: center; width: 24px;">
                        ${isComp 
                          ? `<span style="color: var(--neon-green); font-size: 1rem;">✔</span>` 
                          : !isLessonUnlocked
                            ? `<span style="color: #ff4081; font-size: 0.9rem;">🔒</span>`
                            : `<div style="width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.2); border-radius: 50%;"></div>`
                        }
                      </div>
                      <div style="display: flex; flex-direction: column; gap: 0.15rem; overflow: hidden;">
                        <span style="font-family: var(--font-mono); font-size: 0.65rem; color: ${isLessonUnlocked ? 'var(--text-muted)' : '#ff4081'}; text-transform: uppercase;">LESSON ${String(idx + 1).padStart(2, '0')} ${!isLessonUnlocked ? '• LOCKED' : ''}</span>
                        <span style="font-size: 0.88rem; font-weight: 600; color: #ffffff; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${lesson.title.split(': ')[1] || lesson.title}</span>
                      </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 1.5rem; flex-shrink: 0;">
                      <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">${lesson.duration}</span>
                      <button class="read-chapter-btn" style="background: transparent; border: 1px solid rgba(255, 255, 255, 0.08); color: var(--text-muted); padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.72rem; font-family: var(--font-mono); cursor: ${isLessonUnlocked ? 'pointer' : 'not-allowed'};" ${!isLessonUnlocked ? 'disabled' : ''}>
                        ${!isLessonUnlocked ? 'LOCKED' : isComp ? 'RE-READ' : 'READ'}
                      </button>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div style="text-align: center; padding: 3rem; border: 1px dashed rgba(255,255,255,0.08); border-radius: 8px; background: rgba(255,255,255,0.01);">
                  <span style="font-size: 1.5rem;">🏗️</span>
                  <h4 style="margin: 0.5rem 0; color: #fff;">Curriculum Development In Progress</h4>
                  <p style="color: var(--text-muted); font-size: 0.8rem; margin: 0;">This manual is currently being compiled by the CyberShield Security committee. Check back soon.</p>
                </div>
              `}
            </div>
          </div>

        </div>
      `;

      // Event handlers for detail view
      const bBtn = document.getElementById('bookmark-btn');
      if (bBtn) {
        bBtn.addEventListener('click', () => {
          progressState.bookmarks[book.id] = !progressState.bookmarks[book.id];
          saveLocalProgress();
          renderBookHub();
        });
      }

      document.getElementById('back-to-library-btn')?.addEventListener('click', () => {
        currentView = "library";
        renderBookHub();
      });

      const startTrigger = (index) => {
        activeLessonIndex = index;
        openBookReader(book);
      };

      document.getElementById('book-cover-detail')?.addEventListener('click', () => {
        if (!book.lessons || book.lessons.length === 0) return;
        let resumeIndex = progressState.lastActiveLessonIndex?.[book.id];
        if (resumeIndex === undefined) {
          resumeIndex = 0;
          for (let i = 0; i < book.lessons.length; i++) {
            if (!progressState.completedLessons[book.lessons[i].id]) {
              resumeIndex = i;
              break;
            }
          }
        }
        startTrigger(resumeIndex);
      });

      document.getElementById('continue-reading-btn')?.addEventListener('click', () => {
        if (!book.lessons || book.lessons.length === 0) {
          alert("This curriculum manual is currently in development.");
          return;
        }
        let resumeIndex = progressState.lastActiveLessonIndex?.[book.id];
        if (resumeIndex === undefined) {
          resumeIndex = 0;
          for (let i = 0; i < book.lessons.length; i++) {
            if (!progressState.completedLessons[book.lessons[i].id]) {
              resumeIndex = i;
              break;
            }
          }
        }
        startTrigger(resumeIndex);
      });

      document.querySelectorAll('.chapter-row').forEach(row => {
        row.addEventListener('click', () => {
          const isUnlocked = row.getAttribute('data-unlocked') === 'true';
          if (!isUnlocked) {
            window.showToast("LESSON LOCKED", "This lesson chapter is locked. Complete the preceding chapter to unlock.", true);
            return;
          }
          const idx = parseInt(row.getAttribute('data-index'));
          startTrigger(idx);
        });
      });
    }
  }

  function selectBook(bookId) {
    activeBookId = bookId;
    currentView = "book-details";
    renderBookHub();
  }

  // --- OPEN DIGITAL BOOK READER OVERLAY ---
  function openBookReader(book) {
    const modal = document.getElementById('book-reader-modal');
    if (modal) {
      modal.style.display = 'block';
    }

    document.getElementById('reader-path-badge').textContent = book.difficulty.toUpperCase();
    document.getElementById('reader-path-title').textContent = `${book.title}: Interactive Digital Book`;

    renderReaderSidebarTOC(book);
    loadActiveLessonInReader(book);
    updateReaderProgressMeter(book);
  }

  // --- UPDATE READER PROGRESS BAR ---
  function updateReaderProgressMeter(book) {
    if (!book.lessons || book.lessons.length === 0) return;
    const total = book.lessons.length;
    const completed = book.lessons.filter(lesson => progressState.completedLessons[lesson.id]).length;
    const pct = Math.round((completed / total) * 100);

    document.getElementById('reader-progress-text').textContent = `${pct}%`;
    document.getElementById('reader-progress-bar').style.width = `${pct}%`;
  }

  // --- RENDER SIDEBAR TOC ---
  function renderReaderSidebarTOC(book) {
    const list = document.getElementById('reader-toc-list');
    if (!list) return;

    list.innerHTML = "";
    if (!book.lessons || book.lessons.length === 0) return;

    // Standard Lessons
    book.lessons.forEach((lesson, index) => {
      const isCompleted = progressState.completedLessons[lesson.id];
      const isActive = index === activeLessonIndex;
      const isUnlocked = index === 0 || progressState.completedLessons[book.lessons[index - 1].id];

      const li = document.createElement('li');
      li.style.padding = "0.75rem 1.25rem";
      li.style.borderBottom = "1px solid rgba(255, 255, 255, 0.03)";
      li.style.cursor = isUnlocked ? "pointer" : "not-allowed";
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "0.75rem";
      li.style.fontSize = "0.8rem";
      li.style.fontFamily = "var(--font-sans)";
      li.style.transition = "all 0.2s";
      li.style.opacity = isUnlocked ? "1" : "0.45";

      if (isActive) {
        li.style.background = "rgba(0, 242, 255, 0.06)";
        li.style.borderLeft = "3px solid var(--neon-cyan)";
        li.style.color = "#ffffff";
      } else {
        li.style.borderLeft = "3px solid transparent";
        li.style.color = isUnlocked ? "var(--text-muted)" : "rgba(255,255,255,0.2)";
      }

      const statusIcon = isCompleted 
        ? `<span style="color: var(--neon-green); font-weight: bold; font-size: 0.85rem;">✔</span>`
        : !isUnlocked
          ? `<span style="color: #ff4081; font-size: 0.8rem;">🔒</span>`
          : `<div style="width: 10px; height: 10px; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 50%;"></div>`;

      li.innerHTML = `
        <span style="display: flex; align-items: center; justify-content: center; width: 14px;">${statusIcon}</span>
        <span style="font-weight: ${isActive ? '600' : '500'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">Ch ${index + 1}: ${lesson.title.split(': ')[1] || lesson.title}</span>
      `;

      li.addEventListener('click', () => {
        if (!isUnlocked) {
          window.showToast("LESSON LOCKED", "This lesson is locked. Complete the previous chapter to unlock.", true);
          return;
        }
        activeLessonIndex = index;
        renderReaderSidebarTOC(book);
        loadActiveLessonInReader(book);
        scrollToTopReader();
      });

      list.appendChild(li);
    });

    const lessonsCount = book.lessons.length;
    const completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
    
    let canGraduate = completedCount === lessonsCount;
    if (book.id === 'owasp-top-10' && lessonsCount < 6) canGraduate = false;
    if (book.id === 'cryptography' && lessonsCount < 6) canGraduate = false;
    if (book.id === 'password-security' && lessonsCount < 7) canGraduate = false;
    if (book.id === 'malware-defense' && lessonsCount < 4) canGraduate = false;
    if (book.id === 'digital-forensics' && lessonsCount < 5) canGraduate = false;

    const allCompleted = canGraduate;

    if (book.id === 'linux-basics') {
      // Linux extra nodes
      const renderExtraNode = (title, index, isUnlocked, icon) => {
        const isActive = activeLessonIndex === index;
        const li = document.createElement('li');
        li.style.padding = "0.75rem 1.25rem";
        li.style.borderBottom = "1px solid rgba(255, 255, 255, 0.03)";
        li.style.cursor = isUnlocked ? "pointer" : "not-allowed";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.gap = "0.75rem";
        li.style.fontSize = "0.8rem";
        li.style.opacity = isUnlocked ? "1" : "0.4";
        li.style.transition = "all 0.2s";

        if (isActive) {
          li.style.background = "rgba(0, 242, 255, 0.06)";
          li.style.borderLeft = "3px solid var(--neon-cyan)";
          li.style.color = "#ffffff";
        } else {
          li.style.borderLeft = "3px solid transparent";
          li.style.color = isUnlocked ? "var(--text-muted)" : "rgba(255,255,255,0.2)";
        }

        li.innerHTML = `
          <span style="display: flex; align-items: center; justify-content: center; width: 14px;">${icon}</span>
          <span style="font-weight: ${isActive ? '600' : '500'}; flex: 1;">${title}</span>
        `;

        if (isUnlocked) {
          li.addEventListener('click', () => {
            activeLessonIndex = index;
            renderReaderSidebarTOC(book);
            loadActiveLessonInReader(book);
            scrollToTopReader();
          });
        }
        list.appendChild(li);
      };

      renderExtraNode("Final Exam Quiz", 15, allCompleted, progressState.finalQuizPassed ? "✔" : "📝");
      renderExtraNode("Final Security Assessment", 16, progressState.finalQuizPassed, progressState.finalAssessmentPassed ? "✔" : "⚙️");
      renderExtraNode("Graduation Certificate", 17, progressState.finalAssessmentPassed, "🏆");

    } else {
      // General Certificate Node
      const certIdx = lessonsCount;
      const isActive = activeLessonIndex === certIdx;
      const li = document.createElement('li');
      li.style.padding = "0.75rem 1.25rem";
      li.style.borderBottom = "1px solid rgba(255, 255, 255, 0.03)";
      li.style.cursor = allCompleted ? "pointer" : "not-allowed";
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "0.75rem";
      li.style.fontSize = "0.8rem";
      li.style.opacity = allCompleted ? "1" : "0.4";
      li.style.transition = "all 0.2s";

      if (isActive) {
        li.style.background = "rgba(0, 242, 255, 0.06)";
        li.style.borderLeft = "3px solid var(--neon-cyan)";
        li.style.color = "#ffffff";
      } else {
        li.style.borderLeft = "3px solid transparent";
        li.style.color = allCompleted ? "var(--text-muted)" : "rgba(255,255,255,0.2)";
      }

      li.innerHTML = `
        <span style="display: flex; align-items: center; justify-content: center; width: 14px;">🏆</span>
        <span style="font-weight: ${isActive ? '600' : '500'}; flex: 1;">Graduation Certificate</span>
      `;

      if (allCompleted) {
        li.addEventListener('click', () => {
          activeLessonIndex = certIdx;
          renderReaderSidebarTOC(book);
          loadActiveLessonInReader(book);
          scrollToTopReader();
        });
      }
      list.appendChild(li);
    }
  }

  // --- LOAD ACTIVE LESSON CONTENT ---
  function loadActiveLessonInReader(book) {
    // Automatically persist last active lesson index in progress state
    if (!progressState.lastActiveLessonIndex) {
      progressState.lastActiveLessonIndex = {};
    }
    progressState.lastActiveLessonIndex[book.id] = activeLessonIndex;
    saveLocalProgress();

    const readerArea = document.getElementById('reader-content-area');
    if (!readerArea) return;

    const lessonsCount = book.lessons.length;

    if (activeLessonIndex >= 0 && activeLessonIndex < lessonsCount) {
      loadChapterView(readerArea, book);
    } else if (book.id === 'linux-basics' && activeLessonIndex === 15) {
      loadFinalQuizView(readerArea, book);
    } else if (book.id === 'linux-basics' && activeLessonIndex === 16) {
      loadFinalAssessmentView(readerArea, book);
    } else if (book.id === 'linux-basics' && activeLessonIndex === 17) {
      loadCertificateView(readerArea, book);
    } else if (activeLessonIndex === lessonsCount) {
      loadCertificateView(readerArea, book);
    }
  }

  // --- LOAD CHAPTER VIEW (LESSONS 1-15) ---
  function loadChapterView(readerArea, book) {
    const lesson = book.lessons[activeLessonIndex];
    if (!lesson) return;

    const isCompleted = progressState.completedLessons[lesson.id];
    const key = `Chapter ${activeLessonIndex + 1}`;

    // Glossary
    let glossaryHTML = "";
    if (lesson.keyTerms) {
      glossaryHTML = `
        <div style="background: rgba(255, 255, 255, 0.01); border: 1px dashed rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.5rem; margin: 2rem 0;">
          <h4 style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--neon-cyan); letter-spacing: 0.1em; margin: 0 0 1rem 0; text-transform: uppercase;">GLOSSARY GLIMPSE</h4>
          <dl style="display: flex; flex-direction: column; gap: 1rem; margin: 0;">
            ${Object.keys(lesson.keyTerms).map(term => `
              <div style="margin: 0;">
                <dt style="font-size: 0.85rem; font-weight: 700; color: #ffffff; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="width: 4px; height: 4px; background: var(--neon-cyan); border-radius: 50%;"></span>
                  ${term}
                </dt>
                <dd style="font-size: 0.8rem; color: var(--text-muted); margin-left: 0.75rem; line-height: 1.5;">${lesson.keyTerms[term]}</dd>
              </div>
            `).join('')}
          </dl>
        </div>
      `;
    }

    // Playbook Utilities / Commands
    let commandsHTML = "";
    if (lesson.commands && lesson.commands.length > 0) {
      commandsHTML = `
        <div style="margin: 2rem 0;">
          <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 0.85rem 0;">SAFE PLAYBOOK UTILITIES</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${lesson.commands.map(item => `
              <div style="background: #02050a; border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 8px; padding: 1rem; font-family: var(--font-mono);">
                <div style="color: var(--neon-cyan); font-size: 0.85rem; font-weight: bold; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
                  <span>$</span>
                  <span>${item.cmd}</span>
                </div>
                <div style="color: var(--text-muted); font-size: 0.72rem; font-family: var(--font-sans);">${item.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Notes
    let notesHTML = "";
    if (lesson.notes && lesson.notes.length > 0) {
      notesHTML = `
        <div style="background: rgba(0, 242, 255, 0.02); border-left: 3px solid var(--neon-cyan); border-radius: 4px; padding: 1rem 1.25rem; margin: 2rem 0;">
          <h4 style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--neon-cyan); margin: 0 0 0.5rem 0; letter-spacing: 0.05em; text-transform: uppercase;">SECURITY OFFICER NOTES</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            ${lesson.notes.map(note => `
              <li style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5;">• ${note}</li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // Practices
    let listsHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">
        <div style="background: rgba(0, 255, 157, 0.02); border: 1px solid rgba(0, 255, 157, 0.05); padding: 1.25rem; border-radius: 10px;">
          <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-green); margin: 0 0 0.75rem 0; letter-spacing: 0.05em; text-transform: uppercase;">✔️ BEST PRACTICES</h4>
          <ul style="padding-left: 1.1rem; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            ${(lesson.bestPractices || ["Follow Least Privilege.", "Use strong authentication structures."]).map(bp => `<li>${bp}</li>`).join('')}
          </ul>
        </div>
        <div style="background: rgba(255, 64, 129, 0.02); border: 1px solid rgba(255, 64, 129, 0.05); padding: 1.25rem; border-radius: 10px;">
          <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: #ff4081; margin: 0 0 0.75rem 0; letter-spacing: 0.05em; text-transform: uppercase;">❌ COMMON MISTAKES</h4>
          <ul style="padding-left: 1.1rem; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            ${(lesson.commonMistakes || ["Running unverified scripts.", "Disabling default protection buffers."]).map(cm => `<li>${cm}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // FAQ
    let faqHTML = "";
    if (lesson.faq && lesson.faq.length > 0) {
      faqHTML = `
        <div style="margin: 2.5rem 0;">
          <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 1rem 0;">FREQUENTLY ASKED QUESTIONS</h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${lesson.faq.map(f => `
              <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.03); padding: 1.1rem; border-radius: 8px;">
                <div style="font-size: 0.82rem; font-weight: bold; color: #fff; margin-bottom: 0.35rem;">Q: ${f.q}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; padding-left: 0.5rem; border-left: 2px solid rgba(255, 255, 255, 0.1);">${f.a}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Exercises
    const sampleExercises = lesson.practicalExercises || [
      "Open your sandbox interactive prompt.",
      "Execute safe reconnaissance analysis instructions.",
      "Track system and interface mapping variables.",
      "Perform diagnostic port auditing operations.",
      "Close testing buffers securely."
    ];
    let exercisesHTML = `
      <div style="background: rgba(10, 15, 25, 0.3); border: 1px solid rgba(0,242,255,0.08); padding: 1.5rem; border-radius: 12px; margin: 2rem 0;">
        <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 1rem 0;">🛠️ 5 SAFE PRACTICAL EXERCISES</h4>
        <ol style="padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; color: var(--text-muted); font-size: 0.8rem; line-height: 1.4;">
          ${sampleExercises.map(ex => `<li>${ex}</li>`).join('')}
        </ol>
      </div>
    `;

    // Interview Questions
    const sampleInterviews = lesson.interviewQuestions || [
      { q: "What is an authorization credential?", a: "An official proof document giving legal consent for cyber diagnostics." },
      { q: "Define active scanning vs passive reconnaissance.", a: "Active interacts with targets leaving logs; passive processes third-party data silently." },
      { q: "Why is written scope binding essential?", a: "It protects security analysts against legal liabilities." },
      { q: "What constitutes shadow IT?", a: "Unmanaged infrastructure created outside of approved security controls." },
      { q: "How do you handle unapproved targets?", a: "Immediately stop scanning and report the anomaly to operations." }
    ];
    let interviewsHTML = `
      <div style="margin: 2.5rem 0;">
        <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 1.25rem 0;">🎯 5 KEY INTERVIEW Q&A COGNITIONS</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${sampleInterviews.map((item, qIdx) => `
            <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 8px; padding: 1rem 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                <div style="font-size: 0.82rem; font-weight: bold; color: #fff; line-height: 1.4;">Q${qIdx + 1}: ${item.q}</div>
                <button class="toggle-interview-btn" data-qid="${qIdx}" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); color: var(--neon-cyan); font-family: var(--font-mono); font-size: 0.62rem; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; flex-shrink: 0; transition: all 0.2s;">SHOW ANSWER</button>
              </div>
              <div id="answer-box-${qIdx}" style="display: none; font-size: 0.78rem; color: var(--neon-green); line-height: 1.5; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed rgba(0, 255, 157, 0.15);">
                <strong>ANS:</strong> ${item.a}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // MCQ Block
    let quizHTML = `
      <div id="academy-quiz-block" style="background: rgba(10, 15, 25, 0.6); border: 1px solid rgba(0, 242, 255, 0.15); border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; margin-top: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 0.75rem;">
          <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--neon-cyan); letter-spacing: 0.15em; text-transform: uppercase;">CHAPTER INTEL CHECKS</span>
          <span id="lesson-resolved-badge" style="font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700; background: ${isCompleted ? 'rgba(0, 255, 157, 0.05)' : 'rgba(255,255,255,0.02)'}; color: ${isCompleted ? 'var(--neon-green)' : 'var(--text-muted)'}; padding: 0.15rem 0.45rem; border-radius: 3px; border: 1px solid ${isCompleted ? 'rgba(0, 255, 157, 0.15)' : 'rgba(255,255,255,0.05)'};">
            ${isCompleted ? "RESOLVED (100 XP)" : "CHAPTER OPEN"}
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
          <span>MCQ EXAMINATION BUFFER</span>
          <span id="mcq-score-display">0 / 1 PROGRESS</span>
        </div>
        
        <div id="active-mcq-container"></div>
        <div id="mcq-feedback-panel" style="display: none; padding: 1rem; border-radius: 6px; font-size: 0.8rem; line-height: 1.4; flex-direction: column; gap: 0.25rem;"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.25rem;">
          <button id="mcq-submit-btn" style="background: rgba(0, 242, 255, 0.05); border: 1px solid var(--neon-cyan); color: var(--neon-cyan); padding: 0.6rem 1.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold; cursor: pointer; font-family: var(--font-mono);">SUBMIT VERDICT</button>
          
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="prev-mcq-btn" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.72rem; font-family: var(--font-mono); cursor: pointer;">&larr; PREV</button>
            <button id="next-mcq-btn" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.72rem; font-family: var(--font-mono); cursor: pointer;">NEXT &rarr;</button>
          </div>
        </div>
      </div>
    `;

    // Render full chapter container
    readerArea.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; margin-bottom: -1rem;">
        <span>${key}</span>
        <span>/</span>
        <span style="color: var(--neon-cyan);">${lesson.title.split(': ')[0]}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 1.5rem;">
        <h1 style="font-size: 1.7rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.25; font-family: var(--font-sans);">${lesson.title}</h1>
        
        <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 8px; padding: 1rem 1.2rem;">
          <div style="font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.1em; margin-bottom: 0.5rem; text-transform: uppercase;">CHAPTER OBJECTIVES</div>
          <ul style="padding-left: 1.1rem; margin: 0; display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">
            ${(lesson.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
          </ul>
        </div>
        
        <p style="font-size: 0.85rem; line-height: 1.7; color: rgba(255, 255, 255, 0.85); font-style: italic; border-left: 2px solid var(--neon-cyan); padding-left: 1rem; margin: 0;">
          "${lesson.introduction}"
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.25rem; line-height: 1.75; font-size: 0.85rem; color: var(--text-muted);">
        <p>${lesson.explanation}</p>
        
        <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.03);">
          <h4 style="font-size: 0.78rem; font-family: var(--font-mono); color: #fff; margin: 0 0 0.85rem 0; text-transform: uppercase;">📖 STEP-BY-STEP EXPLANATION</h4>
          <ul style="list-style: none; padding-left: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
            ${lesson.stepByStep.map(step => `
              <li style="display: flex; gap: 0.75rem; align-items: flex-start;">
                <span style="color: var(--neon-cyan); font-family: var(--font-mono); font-weight: bold; font-size: 0.75rem; margin-top: 0.15rem;">[>]</span>
                <span style="line-height: 1.5;">${step}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      ${lesson.diagram ? `
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 2rem 0;">
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.15em; text-transform: uppercase;">ARCHITECTURE DIAGRAM</span>
          <pre style="background: #02050a; border: 1px solid rgba(0, 242, 255, 0.12); border-radius: 8px; padding: 1.5rem; overflow-x: auto; font-family: var(--font-mono); font-size: 0.75rem; color: var(--neon-cyan); line-height: 1.4; margin: 0;">${lesson.diagram}</pre>
        </div>
      ` : ""}

      ${lesson.realWorldExample ? `
        <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 8px; padding: 1.25rem; margin: 2rem 0; font-style: italic;">
          <h4 style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-muted); margin: 0 0 0.5rem 0; letter-spacing: 0.05em; text-transform: uppercase;">HISTORICAL STUDY CASE</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin: 0;">"${lesson.realWorldExample}"</p>
        </div>
      ` : ""}

      ${glossaryHTML}
      ${commandsHTML}
      ${notesHTML}
      ${listsHTML}
      ${faqHTML}
      ${exercisesHTML}
      ${interviewsHTML}
      ${quizHTML}
      ${(() => {
        const isSequential = book.id === 'owasp-top-10' || book.id === 'cryptography' || book.id === 'password-security' || book.id === 'malware-defense' || book.id === 'digital-forensics';
        const maxLessons = book.id === 'digital-forensics' ? 5 : (book.id === 'malware-defense' ? 4 : (book.id === 'password-security' ? 7 : 6));
        if (isSequential && activeLessonIndex === book.lessons.length - 1 && book.lessons.length < maxLessons) {
          const inputId = book.id === 'cryptography' ? 'crypto-command-input' : (book.id === 'password-security' ? 'password-command-input' : (book.id === 'malware-defense' ? 'malware-command-input' : (book.id === 'digital-forensics' ? 'forensics-command-input' : 'owasp-command-input')));
          const feedbackId = book.id === 'cryptography' ? 'crypto-command-feedback' : (book.id === 'password-security' ? 'password-command-feedback' : (book.id === 'malware-defense' ? 'malware-command-feedback' : (book.id === 'digital-forensics' ? 'forensics-command-feedback' : 'owasp-command-feedback')));
          return `
            <div style="background: rgba(2, 5, 10, 0.85); border: 1px solid var(--neon-cyan); border-radius: 8px; padding: 1.5rem; margin-top: 3rem; font-family: var(--font-mono); box-shadow: 0 0 15px rgba(0, 242, 255, 0.1);">
              <div style="color: var(--neon-cyan); font-size: 0.75rem; font-weight: bold; margin-bottom: 0.75rem; letter-spacing: 1px; text-transform: uppercase;">🔒 SEQUENTIAL CURRICULUM DISPATCH TERMINAL</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
                This cyber operational segment is locked. You must command the dispatch of the next manual section.
                Type <strong style="color: #ffffff;">NEXT</strong> to compile and generate the next chapter.
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
                <span style="color: var(--neon-cyan); font-weight: bold;">operator@cybershield:~$</span>
                <input type="text" id="${inputId}" placeholder="Type command here..." style="flex: 1; background: transparent; border: none; outline: none; color: #ffffff; font-family: var(--font-mono); font-size: 0.8rem;" />
              </div>
              <div id="${feedbackId}" style="margin-top: 0.75rem; font-size: 0.75rem; display: none; font-family: var(--font-mono); line-height: 1.4;"></div>
            </div>
          `;
        }
        return '';
      })()}

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 3rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
        <button id="bottom-prev-btn" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 0.65rem 1.25rem; border-radius: 8px; font-size: 0.78rem; font-family: var(--font-mono); cursor: pointer;" ${activeLessonIndex === 0 ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''}>
          &larr; PREV CHAPTER
        </button>
        <button id="bottom-next-btn" style="background: var(--neon-cyan); border: none; color: #02050a; padding: 0.65rem 1.5rem; border-radius: 8px; font-size: 0.78rem; font-family: var(--font-mono); font-weight: bold; cursor: pointer;">
          NEXT CHAPTER &rarr;
        </button>
      </div>
    `;

    // 1. Interview Q&A Toggles
    document.querySelectorAll('.toggle-interview-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-qid');
        const box = document.getElementById(`answer-box-${qid}`);
        if (box) {
          const isHidden = box.style.display === "none";
          box.style.display = isHidden ? "block" : "none";
          btn.textContent = isHidden ? "HIDE ANSWER" : "SHOW ANSWER";
        }
      });
    });

    // 2. Interactive MCQ logic
    let activeMcqIdx = 0;
    const lessonQuizzes = lesson.quiz || [];
    let selectedQuizAnswers = {};

    function renderActiveMCQ() {
      const mcq = lessonQuizzes[activeMcqIdx];
      const mcqContainer = document.getElementById('active-mcq-container');
      if (!mcq || !mcqContainer) return;

      const previousSelected = selectedQuizAnswers[activeMcqIdx];

      mcqContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem; animation: fade-in 0.2s ease;">
          <div style="font-size: 0.85rem; color: #fff; font-family: var(--font-sans); line-height: 1.5; font-weight: 600;">
            <span style="color: var(--neon-cyan); font-family: var(--font-mono); font-weight: bold; margin-right: 0.5rem;">Q${activeMcqIdx + 1}.</span>
            ${mcq.question}
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${mcq.options.map((opt, optIdx) => {
              const isSelected = previousSelected === optIdx;
              const borderStyle = isSelected ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.04)';
              const bgStyle = isSelected ? 'rgba(0, 242, 255, 0.05)' : 'rgba(255,255,255,0.01)';
              const textStyle = isSelected ? '#ffffff' : 'var(--text-muted)';
              
              return `
                <button class="mcq-option-btn" data-oidx="${optIdx}" style="display: flex; align-items: center; gap: 1rem; width: 100%; text-align: left; background: ${bgStyle}; border: ${borderStyle}; border-radius: 8px; padding: 0.85rem 1.1rem; color: ${textStyle}; font-size: 0.78rem; cursor: pointer; transition: all 0.2s;">
                  <span style="font-family: var(--font-mono); font-size: 0.65rem; background: ${isSelected ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)'}; color: ${isSelected ? '#02050a' : '#fff'}; width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${String.fromCharCode(65 + optIdx)}</span>
                  <span style="line-height: 1.3;">${opt}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;

      document.getElementById('mcq-score-display').textContent = `${Object.keys(selectedQuizAnswers).length} / ${lessonQuizzes.length} PROGRESS`;

      document.querySelectorAll('.mcq-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const oidx = parseInt(btn.getAttribute('data-oidx'));
          selectedQuizAnswers[activeMcqIdx] = oidx;
          renderActiveMCQ();
        });
      });

      document.getElementById('mcq-feedback-panel').style.display = "none";
    }

    renderActiveMCQ();

    document.getElementById('prev-mcq-btn')?.addEventListener('click', () => {
      if (activeMcqIdx > 0) {
        activeMcqIdx--;
        renderActiveMCQ();
      }
    });

    document.getElementById('next-mcq-btn')?.addEventListener('click', () => {
      if (activeMcqIdx < lessonQuizzes.length - 1) {
        activeMcqIdx++;
        renderActiveMCQ();
      }
    });

    document.getElementById('mcq-submit-btn')?.addEventListener('click', () => {
      const ans = selectedQuizAnswers[activeMcqIdx];
      if (ans === undefined) {
        alert("Select an option before submitting.");
        return;
      }

      const mcq = lessonQuizzes[activeMcqIdx];
      const isCorrect = ans === mcq.answer;
      const feedback = document.getElementById('mcq-feedback-panel');
      feedback.style.display = "flex";

      if (isCorrect) {
        feedback.style.background = "rgba(0, 255, 157, 0.04)";
        feedback.style.border = "1px solid rgba(0, 255, 157, 0.15)";
        feedback.style.color = "var(--neon-green)";
        feedback.innerHTML = `
          <strong>[✔] VERIFIED CORRECT</strong>
          <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7); margin-top: 0.15rem;">${mcq.explanation}</div>
        `;

        const solvedKeys = Object.keys(selectedQuizAnswers);
        let allCorrect = solvedKeys.length === lessonQuizzes.length;
        if (allCorrect) {
          for (let i = 0; i < lessonQuizzes.length; i++) {
            if (selectedQuizAnswers[i] !== lessonQuizzes[i].answer) {
              allCorrect = false;
              break;
            }
          }
        }

        if (allCorrect && !progressState.completedLessons[lesson.id]) {
          progressState.completedLessons[lesson.id] = true;
          progressState.xp += 100;
          saveLocalProgress();

          document.getElementById('lesson-resolved-badge').textContent = "RESOLVED (100 XP)";
          document.getElementById('lesson-resolved-badge').style.color = "var(--neon-green)";
          document.getElementById('lesson-resolved-badge').style.borderColor = "rgba(0, 255, 157, 0.15)";
          document.getElementById('lesson-resolved-badge').style.background = "rgba(0, 255, 157, 0.05)";

          renderReaderSidebarTOC(book);
          updateReaderProgressMeter(book);
        }
      } else {
        feedback.style.background = "rgba(255, 64, 129, 0.04)";
        feedback.style.border = "1px solid rgba(255, 64, 129, 0.15)";
        feedback.style.color = "#ff4081";
        feedback.innerHTML = `
          <strong>[!] INTRUSION VERIFICATION FAILED</strong>
          <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7); margin-top: 0.15rem;">${mcq.explanation}</div>
        `;
      }
    });

    // Bind OWASP custom command prompt logic
    const owaspInput = document.getElementById('owasp-command-input');
    if (owaspInput) {
      owaspInput.focus();
      owaspInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = owaspInput.value.trim().toUpperCase();
          const feedback = document.getElementById('owasp-command-feedback');
          if (!feedback) return;
          
          feedback.style.display = "block";
          if (val === "NEXT") {
            feedback.style.color = "var(--neon-green)";
            feedback.innerHTML = `<strong>[✔] ACCESS GRANTED</strong><br>Compiling security manual assets...<br>Generating Chapter ${book.lessons.length + 1} dynamically...`;
            owaspInput.disabled = true;
            
            setTimeout(() => {
              // Unlock the next lesson
              progressState.owaspUnlockedCount = (progressState.owaspUnlockedCount || 1) + 1;
              book.lessons = fullOwaspLessons.slice(0, progressState.owaspUnlockedCount);
              saveLocalProgress();
              
              // Move to the next chapter automatically
              activeLessonIndex = book.lessons.length - 1;
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
              renderBookHub();
            }, 1500);
          } else {
            feedback.style.color = "#ff4081";
            feedback.innerHTML = `<strong>[!] ERROR: Command "${owaspInput.value.trim()}" unrecognized.</strong><br>Execute 'NEXT' to dispatch the subsequent security manual.`;
            owaspInput.value = "";
          }
        }
      });
    }

    // Bind Cryptography custom command prompt logic
    const cryptoInput = document.getElementById('crypto-command-input');
    if (cryptoInput) {
      cryptoInput.focus();
      cryptoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = cryptoInput.value.trim().toUpperCase();
          const feedback = document.getElementById('crypto-command-feedback');
          if (!feedback) return;
          
          feedback.style.display = "block";
          if (val === "NEXT") {
            feedback.style.color = "var(--neon-green)";
            feedback.innerHTML = `<strong>[✔] ACCESS GRANTED</strong><br>Compiling cryptographic algorithms...<br>Generating Chapter ${book.lessons.length + 1} dynamically...`;
            cryptoInput.disabled = true;
            
            setTimeout(() => {
              // Unlock the next lesson
              progressState.cryptoUnlockedCount = (progressState.cryptoUnlockedCount || 1) + 1;
              book.lessons = fullCryptoLessons.slice(0, progressState.cryptoUnlockedCount);
              saveLocalProgress();
              
              // Move to the next chapter automatically
              activeLessonIndex = book.lessons.length - 1;
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
              renderBookHub();
            }, 1500);
          } else {
            feedback.style.color = "#ff4081";
            feedback.innerHTML = `<strong>[!] ERROR: Command "${cryptoInput.value.trim()}" unrecognized.</strong><br>Execute 'NEXT' to dispatch the subsequent cryptography manual.`;
            cryptoInput.value = "";
          }
        }
      });
    }

    // Bind Password Security custom command prompt logic
    const passwordInput = document.getElementById('password-command-input');
    if (passwordInput) {
      passwordInput.focus();
      passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = passwordInput.value.trim().toUpperCase();
          const feedback = document.getElementById('password-command-feedback');
          if (!feedback) return;
          
          feedback.style.display = "block";
          if (val === "NEXT") {
            feedback.style.color = "var(--neon-green)";
            feedback.innerHTML = `<strong>[✔] ACCESS GRANTED</strong><br>Compiling password security guidelines...<br>Generating Chapter ${book.lessons.length + 1} dynamically...`;
            passwordInput.disabled = true;
            
            setTimeout(() => {
              // Unlock the next lesson
              progressState.passwordUnlockedCount = (progressState.passwordUnlockedCount || 1) + 1;
              book.lessons = fullPasswordLessons.slice(0, progressState.passwordUnlockedCount);
              saveLocalProgress();
              
              // Move to the next chapter automatically
              activeLessonIndex = book.lessons.length - 1;
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
              renderBookHub();
            }, 1500);
          } else {
            feedback.style.color = "#ff4081";
            feedback.innerHTML = `<strong>[!] ERROR: Command "${passwordInput.value.trim()}" unrecognized.</strong><br>Execute 'NEXT' to dispatch the subsequent password security manual.`;
            passwordInput.value = "";
          }
        }
      });
    }

    // Bind Malware custom command prompt logic
    const malwareInput = document.getElementById('malware-command-input');
    if (malwareInput) {
      malwareInput.focus();
      malwareInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = malwareInput.value.trim().toUpperCase();
          const feedback = document.getElementById('malware-command-feedback');
          if (!feedback) return;
          
          feedback.style.display = "block";
          if (val === "NEXT") {
            feedback.style.color = "var(--neon-green)";
            feedback.innerHTML = `<strong>[✔] ACCESS GRANTED</strong><br>Compiling malware guidelines...<br>Generating Chapter ${book.lessons.length + 1} dynamically...`;
            malwareInput.disabled = true;
            
            setTimeout(() => {
              // Unlock the next lesson
              progressState.malwareUnlockedCount = (progressState.malwareUnlockedCount || 1) + 1;
              book.lessons = fullMalwareLessons.slice(0, progressState.malwareUnlockedCount);
              saveLocalProgress();
              
              // Move to the next chapter automatically
              activeLessonIndex = book.lessons.length - 1;
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
              renderBookHub();
            }, 1500);
          } else {
            feedback.style.color = "#ff4081";
            feedback.innerHTML = `<strong>[!] ERROR: Command "${malwareInput.value.trim()}" unrecognized.</strong><br>Execute 'NEXT' to dispatch the subsequent malware manual.`;
            malwareInput.value = "";
          }
        }
      });
    }

    // Bind Digital Forensics custom command prompt logic
    const forensicsInput = document.getElementById('forensics-command-input');
    if (forensicsInput) {
      forensicsInput.focus();
      forensicsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = forensicsInput.value.trim().toUpperCase();
          const feedback = document.getElementById('forensics-command-feedback');
          if (!feedback) return;
          
          feedback.style.display = "block";
          if (val === "NEXT") {
            feedback.style.color = "var(--neon-green)";
            feedback.innerHTML = `<strong>[✔] ACCESS GRANTED</strong><br>Compiling forensics database manuals...<br>Generating Chapter ${book.lessons.length + 1} dynamically...`;
            forensicsInput.disabled = true;
            
            setTimeout(() => {
              // Unlock the next lesson
              progressState.forensicsUnlockedCount = (progressState.forensicsUnlockedCount || 1) + 1;
              book.lessons = fullForensicsLessons.slice(0, progressState.forensicsUnlockedCount);
              saveLocalProgress();
              
              // Move to the next chapter automatically
              activeLessonIndex = book.lessons.length - 1;
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
              renderBookHub();
            }, 1500);
          } else {
            feedback.style.color = "#ff4081";
            feedback.innerHTML = `<strong>[!] ERROR: Command "${forensicsInput.value.trim()}" unrecognized.</strong><br>Execute 'NEXT' to dispatch the subsequent forensics manual.`;
            forensicsInput.value = "";
          }
        }
      });
    }

    document.getElementById('bottom-prev-btn')?.addEventListener('click', () => {
      if (activeLessonIndex > 0) {
        activeLessonIndex--;
        renderReaderSidebarTOC(book);
        loadActiveLessonInReader(book);
        scrollToTopReader();
      }
    });

    document.getElementById('bottom-next-btn')?.addEventListener('click', () => {
      const totalLessons = book.lessons.length;
      const completedCount = book.lessons.filter(l => progressState.completedLessons[l.id]).length;
      if (activeLessonIndex < totalLessons - 1) {
        const currentLesson = book.lessons[activeLessonIndex];
        if (!progressState.completedLessons[currentLesson.id]) {
          window.showToast("CHAPTER UNRESOLVED", "You must successfully submit and resolve the MCQ challenge for this chapter before proceeding.", true);
          return;
        }
        activeLessonIndex++;
        renderReaderSidebarTOC(book);
        loadActiveLessonInReader(book);
        scrollToTopReader();
      } else if (activeLessonIndex === totalLessons - 1) {
        if (book.id === 'owasp-top-10') {
          if (totalLessons < 6) {
            alert(`Course Segment Locked: Use the terminal command line below to compile and generate Chapter ${totalLessons + 1} before proceeding.`);
          } else {
            if (completedCount === totalLessons) {
              activeLessonIndex = totalLessons; // Graduation
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
            } else {
              alert("Course Locked: Resolve all chapters to graduate.");
            }
          }
        } else if (book.id === 'cryptography') {
          if (totalLessons < 6) {
            alert(`Course Segment Locked: Use the terminal command line below to compile and generate Chapter ${totalLessons + 1} before proceeding.`);
          } else {
            if (completedCount === totalLessons) {
              activeLessonIndex = totalLessons; // Graduation
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
            } else {
              alert("Course Locked: Resolve all chapters to graduate.");
            }
          }
        } else if (book.id === 'password-security') {
          if (totalLessons < 7) {
            alert(`Course Segment Locked: Use the terminal command line below to compile and generate Chapter ${totalLessons + 1} before proceeding.`);
          } else {
            if (completedCount === totalLessons) {
              activeLessonIndex = totalLessons; // Graduation
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
            } else {
              alert("Course Locked: Resolve all chapters to graduate.");
            }
          }
        } else if (book.id === 'malware-defense') {
          if (totalLessons < 4) {
            alert(`Course Segment Locked: Use the terminal command line below to compile and generate Chapter ${totalLessons + 1} before proceeding.`);
          } else {
            if (completedCount === totalLessons) {
              activeLessonIndex = totalLessons; // Graduation
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
            } else {
              alert("Course Locked: Resolve all chapters to graduate.");
            }
          }
        } else if (book.id === 'digital-forensics') {
          if (totalLessons < 5) {
            alert(`Course Segment Locked: Use the terminal command line below to compile and generate Chapter ${totalLessons + 1} before proceeding.`);
          } else {
            if (completedCount === totalLessons) {
              activeLessonIndex = totalLessons; // Graduation
              renderReaderSidebarTOC(book);
              loadActiveLessonInReader(book);
              scrollToTopReader();
            } else {
              alert("Course Locked: Resolve all chapters to graduate.");
            }
          }
        } else if (book.id === 'linux-basics') {
          if (completedCount === totalLessons) {
            activeLessonIndex = totalLessons; // Exam Quiz
            renderReaderSidebarTOC(book);
            loadActiveLessonInReader(book);
            scrollToTopReader();
          } else {
            alert("Course Locked: Complete all 15 Chapters before the examination.");
          }
        } else {
          if (completedCount === totalLessons) {
            activeLessonIndex = totalLessons; // Graduation
            renderReaderSidebarTOC(book);
            loadActiveLessonInReader(book);
            scrollToTopReader();
          } else {
            alert("Course Locked: Resolve all chapters to graduate.");
          }
        }
      }
    });
  }

  // --- LOAD FINAL QUIZ (LINUX BASICS ONLY) ---
  function loadFinalQuizView(readerArea, book) {
    let questionsHTML = finalQuizQuestions.map((q, idx) => {
      const savedAns = progressState.finalQuizAnswers[q.id];
      return `
        <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div style="font-size: 0.85rem; font-weight: bold; color: #ffffff;">
            <span style="color: var(--neon-cyan); font-family: var(--font-mono); margin-right: 0.5rem;">Q${idx + 1}.</span>
            ${q.question}
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${q.options.map((opt, oIdx) => {
              const isSel = savedAns === oIdx;
              return `
                <button class="exam-opt-btn" data-qid="${q.id}" data-oidx="${oIdx}" style="text-align: left; background: ${isSel ? 'rgba(0,242,255,0.05)' : 'transparent'}; border: ${isSel ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.04)'}; border-radius: 6px; padding: 0.75rem 1rem; color: #fff; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-family: var(--font-mono); font-size: 0.65rem; background: ${isSel ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)'}; color: ${isSel ? '#02050a' : '#fff'}; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${String.fromCharCode(65 + oIdx)}</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    readerArea.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 1.5rem;">
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--neon-cyan); letter-spacing: 2px; text-transform: uppercase;">VERIFICATION MODULE</span>
          <h1 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0.25rem 0;">Final Graduation Exam Quiz</h1>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
            Complete all 15 multiple-choice questions. Score <strong>80% (12/15)</strong> to proceed to practical incidents.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">${questionsHTML}</div>
        <div id="exam-feedback-card" style="display: none; padding: 1.5rem; border-radius: 10px; flex-direction: column; gap: 0.5rem;"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
          <button id="submit-exam-btn" style="background: var(--neon-cyan); border: none; color: #02050a; font-weight: 700; font-family: var(--font-mono); padding: 0.85rem 2rem; border-radius: 8px; cursor: pointer;">GRADE EXAMINATION</button>
          <button id="exam-to-assessment-btn" style="display: ${progressState.finalQuizPassed ? 'block' : 'none'}; background: var(--neon-green); border: none; color: #02050a; padding: 0.85rem 1.5rem; border-radius: 8px; font-weight: bold; font-family: var(--font-mono); cursor: pointer;">PROCEED TO SCENARIOS &rarr;</button>
        </div>
      </div>
    `;

    document.querySelectorAll('.exam-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-qid');
        const oidx = parseInt(btn.getAttribute('data-oidx'));
        progressState.finalQuizAnswers[qid] = oidx;
        saveLocalProgress();
        loadFinalQuizView(readerArea, book);
      });
    });

    document.getElementById('submit-exam-btn')?.addEventListener('click', () => {
      const answeredKeys = Object.keys(progressState.finalQuizAnswers);
      if (answeredKeys.length < 15) {
        alert(`You answered ${answeredKeys.length}/15 questions. Complete all before grading.`);
        return;
      }

      let correctCount = 0;
      finalQuizQuestions.forEach(q => {
        if (progressState.finalQuizAnswers[q.id] === q.answer) correctCount++;
      });

      const passed = correctCount >= 12;
      const feedback = document.getElementById('exam-feedback-card');
      feedback.style.display = "flex";

      if (passed) {
        progressState.finalQuizPassed = true;
        progressState.xp += 300;
        saveLocalProgress();

        feedback.style.background = "rgba(0, 255, 157, 0.05)";
        feedback.style.border = "1px solid var(--neon-green)";
        feedback.style.color = "var(--neon-green)";
        feedback.innerHTML = `<strong>[✔] VERIFICATION PASSED - ${correctCount}/15 SCORE</strong>`;
        document.getElementById('exam-to-assessment-btn').style.display = 'block';
      } else {
        feedback.style.background = "rgba(255, 64, 129, 0.05)";
        feedback.style.border = "1px solid #ff4081";
        feedback.style.color = "#ff4081";
        feedback.innerHTML = `<strong>[!] SYSTEM CHECK REJECTED - ${correctCount}/15 SCORE</strong>`;
      }
      feedback.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('exam-to-assessment-btn')?.addEventListener('click', () => {
      activeLessonIndex = 16;
      renderReaderSidebarTOC(book);
      loadActiveLessonInReader(book);
      scrollToTopReader();
    });
  }

  // --- LOAD FINAL ASSESSMENT (LINUX BASICS ONLY) ---
  function loadFinalAssessmentView(readerArea, book) {
    let scenariosHTML = finalAssessmentScenarios.map((scen, idx) => {
      const savedAns = progressState.finalAssessmentAnswers[scen.id];
      return `
        <div style="background: rgba(10,15,25,0.4); border: 1px solid rgba(0, 242, 255, 0.12); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <h3 style="font-size: 1rem; font-weight: bold; color: #ffffff; margin: 0;">Scenario ${idx + 1}: ${scen.title}</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">${scen.description}</p>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${scen.options.map((opt, oIdx) => {
              const isSel = savedAns === oIdx;
              return `
                <button class="scen-opt-btn" data-sid="${scen.id}" data-oidx="${oIdx}" style="text-align: left; background: ${isSel ? 'rgba(0,242,255,0.05)' : 'rgba(255,255,255,0.01)'}; border: ${isSel ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.04)'}; border-radius: 8px; padding: 0.75rem 1rem; color: #fff; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 1rem;">
                  <span style="font-family: var(--font-mono); font-size: 0.65rem; background: ${isSel ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.04)'}; color: ${isSel ? '#02050a' : '#fff'}; width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${String.fromCharCode(65 + oIdx)}</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    readerArea.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 1.5rem;">
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--neon-cyan); letter-spacing: 2px; text-transform: uppercase;">INCIDENT SCENARIOS</span>
          <h1 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0.25rem 0;">Final Security Assessment</h1>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Resolve all 3 real-world incidents perfectly to qualify for certification.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">${scenariosHTML}</div>
        <div id="assessment-feedback-card" style="display: none; padding: 1.5rem; border-radius: 10px; flex-direction: column; gap: 0.5rem;"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
          <button id="submit-assessment-btn" style="background: var(--neon-cyan); border: none; color: #02050a; font-weight: 700; font-family: var(--font-mono); padding: 0.85rem 2rem; border-radius: 8px; cursor: pointer;">SUBMIT SOLUTIONS</button>
          <button id="assessment-to-cert-btn" style="display: ${progressState.finalAssessmentPassed ? 'block' : 'none'}; background: var(--neon-green); border: none; color: #02050a; padding: 0.85rem 1.5rem; border-radius: 8px; font-weight: bold; font-family: var(--font-mono); cursor: pointer;">GENERATE CERTIFICATE &rarr;</button>
        </div>
      </div>
    `;

    document.querySelectorAll('.scen-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-sid');
        const oidx = parseInt(btn.getAttribute('data-oidx'));
        progressState.finalAssessmentAnswers[sid] = oidx;
        saveLocalProgress();
        loadFinalAssessmentView(readerArea, book);
      });
    });

    document.getElementById('submit-assessment-btn')?.addEventListener('click', () => {
      const answeredKeys = Object.keys(progressState.finalAssessmentAnswers);
      if (answeredKeys.length < 3) {
        alert(`You resolved ${answeredKeys.length}/3 scenarios. Complete all.`);
        return;
      }

      let correct = true;
      finalAssessmentScenarios.forEach(scen => {
        if (progressState.finalAssessmentAnswers[scen.id] !== scen.answer) correct = false;
      });

      const feedback = document.getElementById('assessment-feedback-card');
      feedback.style.display = "flex";

      if (correct) {
        progressState.finalAssessmentPassed = true;
        progressState.xp += 500;
        saveLocalProgress();

        feedback.style.background = "rgba(0, 255, 157, 0.05)";
        feedback.style.border = "1px solid var(--neon-green)";
        feedback.style.color = "var(--neon-green)";
        feedback.innerHTML = `<strong>[✔] ASSESSMENT PASSED - ALL SCENARIOS RESOLVED SUCCESSFULLY</strong>`;
        document.getElementById('assessment-to-cert-btn').style.display = 'block';
      } else {
        feedback.style.background = "rgba(255, 64, 129, 0.05)";
        feedback.style.border = "1px solid #ff4081";
        feedback.style.color = "#ff4081";
        feedback.innerHTML = `<strong>[!] MITIGATION INCORRECT - EVALUATION FAILED</strong>`;
      }
      feedback.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('assessment-to-cert-btn')?.addEventListener('click', () => {
      activeLessonIndex = 17;
      renderReaderSidebarTOC(book);
      loadActiveLessonInReader(book);
      scrollToTopReader();
    });
  }

  // --- LOAD CERTIFICATE VIEW (DYNAMIZED FOR ANY BOOK) ---
  function loadCertificateView(readerArea, book) {
    const studentName = getGraduateName();
    const hash = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');

    readerArea.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center;">
        
        <div style="text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 1.5rem; width: 100%;">
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--neon-cyan); letter-spacing: 2px; text-transform: uppercase;">GRADUATION PORTAL</span>
          <h1 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0.25rem 0;">Curriculum Graduated</h1>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
            Congratulations, Operator. You have conquered all core chapters. Your official ${book.title} certificate is compiled below.
          </p>
        </div>

        <div id="printable-certificate" style="width: 100%; max-width: 700px; background: radial-gradient(circle at center, #070d19 0%, #02050a 100%); border: 3px solid var(--neon-cyan); border-radius: 16px; padding: 3rem 2rem; position: relative; box-shadow: 0 0 40px rgba(0, 242, 255, 0.25); text-align: center; color: #fff;">
          <div style="position: absolute; inset: 12px; border: 1px solid rgba(0, 242, 255, 0.12); border-radius: 10px; pointer-events: none;"></div>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; position: relative; z-index: 2;">
            <div style="font-size: 2.2rem; filter: drop-shadow(0 0 10px rgba(0, 242, 255, 0.4));">🛡️</div>
            
            <div style="display: flex; flex-direction: column; gap: 0.15rem;">
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--neon-cyan); letter-spacing: 3px; font-weight: bold;">CYBERSHIELD ACADEMY</span>
              <span style="font-size: 0.5rem; font-family: var(--font-mono); color: var(--text-muted);">SECURE MANUAL SIGNATURE CREDENTIAL</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.35rem;">
              <h2 style="font-size: 1.5rem; color: rgba(255,255,255,0.95); font-weight: normal; font-style: italic;">Certificate of Accomplishment</h2>
              <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); letter-spacing: 1px;">PROUDLY CONFERRED UPON</span>
            </div>

            <div style="border-bottom: 2px solid rgba(0, 242, 255, 0.2); width: 80%; padding-bottom: 0.5rem; margin: 0.25rem 0;">
              <h1 style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin: 0; text-shadow: 0 0 10px rgba(0, 242, 255, 0.35);">${studentName}</h1>
            </div>

            <p style="font-size: 0.8rem; line-height: 1.55; color: var(--text-muted); max-width: 500px; margin: 0;">
              For successfully mastering the verified core **${book.title}** curriculum, validating expert capabilities in offensive testing philosophy, system scans, and secure threat mitigations.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 100px 1fr; gap: 1.5rem; width: 100%; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; align-items: center;">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <span style="font-size: 0.9rem; color: var(--neon-cyan); font-style: italic;">Linus Torvalds</span>
                <span style="font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-muted); margin-top: 0.25rem;">OS COMMITTEE</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: center;">
                <div style="width: 60px; height: 60px; border: 2px dashed rgba(0, 242, 255, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 0.5rem; color: var(--neon-cyan); font-weight: bold; transform: rotate(-8deg);">PASS</div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center;">
                <span style="font-size: 0.9rem; color: var(--neon-green); font-style: italic;">CyberShield SOC</span>
                <span style="font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-muted); margin-top: 0.25rem;">AUDITOR BOARD</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; margin-top: 0.5rem;">
              <span style="font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-muted);">SIGNATURE CORRIDOR KEY</span>
              <span style="font-family: var(--font-mono); font-size: 0.55rem; color: var(--neon-cyan); font-weight: bold;">SHA256: ${hash.slice(0, 24)}...</span>
            </div>
          </div>
        </div>

        <button id="print-cert-btn" style="background: var(--neon-cyan); border: none; color: #02050a; font-weight: 700; font-family: var(--font-mono); padding: 0.85rem 2rem; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(0, 242, 255, 0.25);">🖨️ PRINT CERTIFICATE</button>
      </div>
    `;

    document.getElementById('print-cert-btn')?.addEventListener('click', () => {
      const originalTitle = document.title;
      document.title = `${studentName.replace(/\s+/g, '_')}_${book.id}_Certificate`;
      window.print();
      document.title = originalTitle;
    });
  }

  function scrollToTopReader() {
    const rPanel = document.querySelector('#book-reader-modal main');
    if (rPanel) rPanel.scrollTop = 0;
  }

  // --- SETUP EVENT HANDLERS ---
  function setupEventHandlers() {
    const searchInput = document.getElementById('academy-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchKeyword = e.target.value;
        renderBookHub();
      });
    }

    document.querySelectorAll('.academy-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.academy-filter-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = "rgba(255, 255, 255, 0.02)";
          b.style.borderColor = "rgba(255, 255, 255, 0.08)";
          b.style.color = "var(--text-muted)";
        });

        e.target.classList.add('active');
        e.target.style.background = "rgba(0, 242, 255, 0.1)";
        e.target.style.borderColor = "var(--neon-cyan)";
        e.target.style.color = "var(--neon-cyan)";

        activeFilterTab = e.target.getAttribute('data-filter');
        renderBookHub();
      });
    });

    const closeReaderBtn = document.getElementById('close-reader-btn');
    if (closeReaderBtn) {
      closeReaderBtn.addEventListener('click', () => {
        document.getElementById('book-reader-modal').style.display = 'none';
        renderBookHub();
      });
    }

    // Intercept back button clicks for standard custom breadcrumbs flow
    const backBtn = document.getElementById('nav-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        const isLearningActive = document.getElementById('view-learning')?.classList.contains('active-section');
        if (isLearningActive) {
          e.stopImmediatePropagation();
          handleLearningBackNavigation();
        }
      }, { capture: true });
    }
  }

  function handleLearningBackNavigation() {
    const readerModal = document.getElementById('book-reader-modal');
    const isReaderOpen = readerModal && readerModal.style.display === 'block';

    if (isReaderOpen) {
      const book = BOOKS.find(b => b.id === activeBookId);
      if (activeLessonIndex > 0) {
        activeLessonIndex--;
        if (book) {
          renderReaderSidebarTOC(book);
          loadActiveLessonInReader(book);
          scrollToTopReader();
        }
      } else {
        // Exit reader modal and return to book details view
        readerModal.style.display = 'none';
        currentView = "book-details";
        renderBookHub();
      }
    } else {
      if (currentView === "book-details") {
        currentView = "library";
        renderBookHub();
      } else {
        // Return to main Dashboard view
        document.querySelector('.menu-item[data-target="dashboard"]')?.click();
      }
    }
  }

  initAcademy();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLearningCenter);
} else {
  initLearningCenter();
}
