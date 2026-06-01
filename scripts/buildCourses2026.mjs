import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const courses = [
  {
    body: "Aeromodelling Club",
    course: "Autonomous Aerial Systems: Control, Planning & SLAM",
    type: "TSS",
    track: "ITC",
    school: "Engineering School",
    intro:
      "This course provides a comprehensive and structured introduction to the field of Aerial Robotics, designed for students looking to build a strong technical foundation in autonomous aerial systems. Grounded in both theory and practical application, it covers the full pipeline from flight mechanics to intelligent autonomy.",
    weeks: [
      {
        week: "Week 1",
        content:
          "An introduction to quadrotor flight, MATLAB basics and 1D control systems. Students explore system dynamics through simulations and tackle motor selection and thrust-to-weight ratio analysis.",
      },
      {
        week: "Week 2",
        content:
          "A deep dive into quadrotor kinematics and dynamics — covering Euler angles, rotation matrices, the 12-state state vector, equations of motion and the Newton-Euler formulation.",
      },
      {
        week: "Week 3",
        content:
          "Development of 2D and 3D linear controllers for the quadrotor, including nested feedback loops, trajectory tracking, hover control, and PD/PID controller design.",
      },
      {
        week: "Week 4",
        content:
          "Introduction to autonomous navigation — Pose Graph SLAM, loop closure, path planning algorithms (A* and RRT), and an overview of swarm robotics and multi-agent coordination.",
      },
      {
        week: "By the end of the course",
        content:
          "Students will have built a solid foundation in quadrotor dynamics, control theory and autonomous navigation, qualifying them for the hands-on hardware implementation phase.",
      },
    ],
    prerequisites: "None specified",
    evaluation: "75% attendance in sessions and weekly assignments",
    weeklyTime: "6 hours",
  },
  {
    body: "Analytics Club",
    course: "Data Science Fundamentals with Python",
    type: "TSS",
    track: "non ITC",
    school: "CS and DS School",
    intro:
      'Kickstart your data science journey with our beginner-friendly "Data Science Fundamentals with Python" course! Start from core Python skills, explore data handling and visualization, and transition to ML through supervised and unsupervised learning algorithms.',
    weeks: [
      {
        week: "Week 1",
        content:
          "Python Basics, Jupyter Notebooks, Numpy, Pandas, Matplotlib, Seaborn, and Worksheet 1.",
      },
      {
        week: "Week 2",
        content:
          "Supervised Learning - Regression: Scikit-Learn, Linear Regression, Time Series Analysis, Forecasting, Anomaly detection, and Worksheet 2.",
      },
      {
        week: "Week 3",
        content:
          "Supervised Learning - Classification: Logistic Regression, Decision Trees, Random Forests, Neural Networks, probability distributions, and Worksheet 3.",
      },
      {
        week: "Week 4",
        content:
          "Unsupervised Learning: K-Means, Hierarchical Clustering, Gaussian Mixture Models, Dimensionality Reduction, Matrix Factorization, and Capstone Project.",
      },
    ],
    prerequisites: "Just your Enthusiasm!",
    evaluation:
      "There will be 3 worksheets and 1 final capstone project. 1st Phase worksheet, at least one among the 2nd and 3rd Phase worksheets and Capstone project are necessary for certification.",
    weeklyTime: "7-10 hours",
  },
  {
    body: "Analytics Club",
    course: "Big Data Handling",
    type: "TSS",
    track: "non ITC",
    school: "CS and DS School",
    intro:
      "Dive into the world of data analysis using the most accessible tools out there. This course takes you through Excel and SQL with bite-sized videos and practical assignments.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Excel: Introduction to spreadsheets, formatting, formulas, functions, referencing, data quality, importing, and data cleaning.",
      },
      {
        week: "Week 2",
        content:
          "Excel: Sorting, Filtering, VLOOKUP, HLOOKUP, Pivot Tables. SQL: Installation, queries, functions, and operators.",
      },
      {
        week: "Week 3",
        content: "Excel: Charts and Dashboarding. SQL: Clauses, Joins, and Subqueries.",
      },
      { week: "Week 4", content: "1 project each for Excel and SQL." },
    ],
    prerequisites: "Just your Enthusiasm!",
    evaluation:
      "Excel: 5 assignments, any 3 compulsory; final Excel project compulsory. SQL: 2 assignments, any 1 compulsory; final SQL project compulsory.",
    weeklyTime: "5-7 hours",
  },
  {
    body: "Analytics Club",
    course: "Generative and Agentic AI",
    type: "TSS",
    track: "non ITC",
    school: "CS and DS School",
    intro:
      "In 4 weeks you will go from your first LLM API call to shipping a fully autonomous multi-agent workflow — prompt engineering, RAG, LangChain, LangGraph, and real projects.",
    weeks: [
      {
        week: "Week 1",
        content: "Understanding LLMs: Prompting and APIs — moving from browser chat to controlling models through APIs.",
      },
      {
        week: "Week 2",
        content: "Retrieval Augmented Generation (RAG) and Fine-Tuning — teaching your LLM to answer from your own documents.",
      },
      {
        week: "Week 3",
        content: "Agentic AI (MCPs, LangChain, LangGraph) — build agents that use tools and execute multi-step tasks.",
      },
      {
        week: "Week 4",
        content: "Multi-Agent Workflows and Capstone Project — specialised agents collaborating under an orchestration layer.",
      },
    ],
    prerequisites: "Just your enthusiasm",
    evaluation: "2 out of 3 assignments and 1 capstone project are compulsory for certification",
    weeklyTime: "7-10 hours",
  },
  {
    body: "ChemEca",
    course: "Introduction to Computational Chemistry",
    type: "TSS",
    track: "ITC",
    school: "Sciences School",
    intro:
      "Ever wondered what happens inside a chemical reaction at the level of atoms and electrons? Computational chemistry lets you simulate molecules on a computer and discover new materials without lifting a pipette.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Energy, Geometry, and Your First Simulation — Potential Energy Surface, optimization algorithms, hands-on with WebMO.",
      },
      {
        week: "Week 2",
        content:
          "Molecular Mechanics — force fields (AMBER, CHARMM, OPLS, UFF), parameterization, butane torsional energy exercises.",
      },
      {
        week: "Week 3",
        content:
          "Molecular Dynamics — Verlet integration, ensembles (NVE, NVT, NPT), MD simulation of liquid water in LAMMPS.",
      },
      {
        week: "Week 4",
        content:
          "Quantum Leap and DFT Intuition — Schrödinger equation, Born-Oppenheimer, DFT basics, guided DFT calculation.",
      },
      {
        week: "Project",
        content:
          "Multi-method comparative study on a chosen molecule: force fields, MD, DFT geometry and vibrational frequencies, 4-5 page report and presentation.",
      },
    ],
    prerequisites: "Enthusiasm and curiosity is enough",
    evaluation: "A=20%, B=40%, C=40%; passing criteria 60%",
    weeklyTime: "5-6 hours per week",
  },
  {
    body: "Chemistry Club and ChemETL",
    course: "Techno Commercial Aspects of Chemical Industries",
    type: "TSS",
    track: "ITC",
    school: "Engineering School",
    intro:
      "This course offers a comprehensive introduction to the chemical industry, covering core chemical engineering concepts, industrial processes, and emerging technologies.",
    weeks: [{ week: "Course content", content: "Detailed week-wise content to be announced." }],
    prerequisites: "Just Enthusiasm",
    evaluation: "To be announced",
    weeklyTime: "5 hours",
  },
  {
    body: "Chemistry Club and ChemETL",
    course: "Intro to Astrochemistry",
    type: "TSS",
    track: "ITC",
    school: "Sciences School",
    intro:
      "This course explores the chemistry of space, from interstellar clouds and star-forming regions to protoplanetary disks and biosignatures of extraterrestrial life.",
    weeks: [{ week: "Course content", content: "Detailed week-wise content to be announced." }],
    prerequisites: "Just Enthusiasm",
    evaluation: "To be announced",
    weeklyTime: "5 hours",
  },
  {
    body: "Comedy Cons",
    course: "Standup-101",
    type: "NTSS",
    school: "Sports and Skills School",
    intro:
      "Transform your funny everyday thoughts into stage-ready stand-up comedy. Learn to build a clear stage persona, write high-laugh routines, and control live crowd energy.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Structural overview of comedy, joke writing building blocks, and discovering the comedic sub-genre that suits your voice.",
      },
      {
        week: "Week 2",
        content:
          "From isolated joke mechanics to structural architecture — weaving jokes into extended bits and maximizing stage energy.",
      },
      {
        week: "Week 3",
        content:
          "Advanced comedic theory — sophisticated joke structures, audience boundaries, and manipulating live room energy.",
      },
      {
        week: "Week 4",
        content:
          "Character alignment, performance psychology, self-documentation, and professional career sustainability.",
      },
      {
        week: "By the end of the course",
        content:
          "Transform spontaneous thoughts into structured routines using misdirection, Word Smuggling, and Seesaw Theory with confident stage presence.",
      },
    ],
    prerequisites: "Just Enthusiasm",
    evaluation: "Assignments (100%); passing criteria 75%",
    weeklyTime: "2 hours",
  },
  {
    body: "Consult Club",
    course: "Consulting 101",
    type: "NTSS",
    school: "Management School",
    intro:
      "Consulting 101 is a beginner-friendly course designed to introduce students to the fundamentals of consulting through structured thinking, business frameworks, and case-solving skills.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Introduction to consulting and core problem-solving tools, including MECE, issue trees, and guesstimates.",
      },
      {
        week: "Week 2",
        content:
          "Market and industry analysis using market entry, Porter's Five Forces, PESTEL, SWOT, and market sizing (TAM/SAM/SOM).",
      },
      {
        week: "Week 3",
        content:
          "Profitability analysis, value chains, growth strategies (4Ps, 3Cs, Ansoff), and pricing concepts.",
      },
      {
        week: "By the end of the course",
        content:
          "Participants will break down business problems in a structured manner and approach case questions with clarity and confidence.",
      },
    ],
    prerequisites: "None",
    evaluation:
      "Attendance in Speaker sessions (50%), Weekly Assignments (50%). Passing: 2/3 Speaker Sessions and 2/3 Weekly Assignments.",
    weeklyTime: "Not specified",
  },
  {
    body: "Consult Club",
    course: "Product Management 101",
    type: "NTSS",
    school: "Management School",
    intro:
      "Product Management 101 is a 4-week beginner-to-intermediate course for students who want to explore PM as a career or build foundational product thinking.",
    weeks: [
      {
        week: "Week 1",
        content:
          "PM role, building products 0 to 1, user research, personas, Jobs-to-be-Done, and empathy mapping.",
      },
      {
        week: "Week 2",
        content:
          "User interviews, competitive analysis, PRDs, roadmaps, RICE/KANO/MoSCoW prioritization, and OKRs.",
      },
      {
        week: "Week 3",
        content:
          "Metrics and experimentation — AARRR, HEART, funnels, retention, A/B tests, and product design interview answers.",
      },
      {
        week: "Week 4",
        content:
          "Interview preparation: product improvement cases, app critiques, root cause analysis, GTM, pricing, Fermi estimation, and STAR framework.",
      },
      {
        week: "By the end of the course",
        content:
          "Identify user problems, size opportunities, write a PRD, build a roadmap, define success metrics, and approach PM interviews confidently.",
      },
    ],
    prerequisites: "None",
    evaluation:
      "Attendance in Speaker sessions (33.3%), Weekly Assignments (33.3%), Capstone Project (33.3%)",
    weeklyTime: "Not specified",
  },
  {
    body: "Energy & Sustainability Club",
    course: "Simulation and Optimisation of Smart Energy Systems",
    type: "TSS",
    track: "ITC",
    school: "Sciences School",
    intro:
      "A practical introduction to modern energy systems with emphasis on renewable integration, simulation, optimisation, smart grids, IoT monitoring, and AI-based energy management.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Fundamentals of Modern Energy Systems — renewable integration, demand patterns, load profiles, and grid challenges.",
      },
      {
        week: "Week 2",
        content:
          "Simulation and Computational Modelling — Python/Colab, solar and battery systems, SOC, Pandas and Matplotlib.",
      },
      {
        week: "Week 3",
        content:
          "Optimisation of Energy Systems — objective functions, constraints, scheduling, SciPy Optimise and PuLP.",
      },
      {
        week: "Week 4",
        content:
          "Smart Energy Technologies — smart grids, IoT monitoring, EV infrastructure, AI in energy, digital twins.",
      },
      {
        week: "By the end of the course",
        content:
          "Foundational knowledge of energy systems, Python simulation skills, and exposure to IoT, EV, and AI-driven energy solutions.",
      },
    ],
    prerequisites: "No Pre-requisites",
    evaluation:
      "4 weekly quizzes (25% each). Passing: minimum 50% overall; attempt at least 3 of 4 quizzes.",
    weeklyTime: "3 hrs/week",
  },
  {
    body: "Energy & Sustainability Club",
    course: "Energy Economics",
    type: "TSS",
    track: "ITC",
    school: "Sciences School",
    intro:
      "The course bridges engineering and markets through logical optimization puzzles — from how free solar power crashes electricity prices to why energy efficiency can increase fuel consumption.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Macro Energy Dynamics and Resource Horizons — Hotelling's Rule, Green Paradox, Jevon's Paradox.",
      },
      {
        week: "Week 2",
        content:
          "Power Grid Operations and Market Regulations — merit order, auctions, locational marginal pricing.",
      },
      {
        week: "Week 3",
        content:
          "Clean Energy Economics and the Solar Paradox — duck curve, subsidies, renewable cannibalisation.",
      },
      {
        week: "Week 4",
        content:
          "Grid Flexibility, Storage, and Decarbonisation Policy — battery arbitrage and revenue stacking.",
      },
      {
        week: "By the end of the course",
        content:
          "Understand energy market economics, power grid operations, renewable integration, and storage systems.",
      },
    ],
    prerequisites: "No Pre-requisites",
    evaluation:
      "Weekly quizzes (4×25%). Criteria: attempt at least 3 quizzes and score more than 40%.",
    weeklyTime: "3 hrs/week",
  },
  {
    body: "English Learning Program",
    course: "The Art of Professional Communication",
    type: "NTSS",
    school: "Sports and Skills School",
    intro:
      "This course helps you communicate clearly and confidently in professional and academic settings through practical, hands-on sessions.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Impromptu Thinking in Professional Environments; Temperament and Body Language.",
      },
      {
        week: "Week 2",
        content: "The Power of Professional Debating; Cracking English Proficiency Exams.",
      },
      {
        week: "Week 3",
        content: "Pitching Yourself and Acing Interviews.",
      },
      { week: "Week 4", content: "Assignment and project." },
    ],
    prerequisites: "None",
    evaluation:
      "Attendance (30%) — 4 of 5 sessions mandatory; Capstone project (50%); Assignment (20%).",
    weeklyTime: "2-3 hours",
  },
  {
    body: "English Learning Program and Insight",
    course: "Journalistic Writing",
    type: "NTSS",
    school: "Sports and Skills School",
    intro:
      "This course helps you write with clarity, precision, and impact across diverse media formats through practical storytelling sessions.",
    weeks: [{ week: "Sessions", content: "Four practical sessions on journalistic writing and storytelling (details in speaker sessions)." }],
    prerequisites: "None",
    evaluation:
      "Attendance (30%) — 3 of 4 sessions compulsory; Assignment (70%); passing criteria 70%.",
    weeklyTime: "2-3 hours",
  },
  {
    body: "Entrepreneurship and Business Club (EnB Club)",
    course: "How to Start a Startup",
    type: "NTSS",
    school: "Management School",
    intro:
      "Master the art of launching and scaling a startup in three weeks. Learn idea generation, growth strategies, and building a winning team.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Startup foundation and Product-Market Fit — problem-solving, execution, pivoting, case studies (Airbnb, Tesla, Netflix).",
      },
      {
        week: "Week 2",
        content:
          "Growth Strategies and Marketing — SEO, email, SMS, push notifications, customer support, word-of-mouth.",
      },
      {
        week: "Week 3",
        content:
          "Building Culture and Strategic Management — hiring, transparency, onboarding, contrarian thinking.",
      },
      {
        week: "By the end of the course",
        content:
          "Strong understanding of the startup ecosystem, growth strategies, and team management for building successful ventures.",
      },
    ],
    prerequisites:
      "Passionate about entrepreneurship and very basic understanding of business concepts. No prior experience required.",
    evaluation:
      "Attend all speaker sessions (3 total); minimum 60% overall; submit all weekly assignments and final project.",
    weeklyTime: "10-12 hours a week",
  },
  {
    body: "Entrepreneurship and Business Club (EnB Club)",
    course: "AI in Entrepreneurship - Innovate, Launch, Scale",
    type: "NTSS",
    school: "Management School",
    intro:
      "A 4-week course on the intersection of entrepreneurship and AI — ideate, validate, build, and scale a startup using practical AI tools.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Entrepreneurship foundations and AI — startup lifecycle, AI/ML overview, applications, hands-on with ChatGPT and Notion AI.",
      },
      {
        week: "Week 2",
        content:
          "AI for market research — personas, segmentation, competitive mapping with Browse AI, Perplexity, Similarweb.",
      },
      {
        week: "Week 3",
        content:
          "MVPs with no-code tools (Bubble, Glide, Canva, Figma, Tally) and integrating AI APIs.",
      },
      {
        week: "Week 4",
        content:
          "Scaling, pitching, ethical AI — sales/marketing automation, AI pitch decks, responsible AI practices.",
      },
      {
        week: "By the end of the course",
        content:
          "Complete AI-powered startup concept with hands-on experience in no-code and AI platforms.",
      },
    ],
    prerequisites:
      "No coding experience required; curiosity to explore AI-driven platforms.",
    evaluation:
      "Attend all 4 speaker sessions; minimum 60% overall; submit all assignments and final project.",
    weeklyTime: "3-5 hours/week",
  },
  {
    body: "Finance Club",
    course: "Fundamentals of Finance",
    type: "NTSS",
    school: "Management School",
    intro:
      "An introduction to personal finance, asset classes, fundamental analysis, and technical analysis for informed financial decision-making.",
    weeks: [
      { week: "Week 1", content: "Personal Finance — budgeting, saving, and long-term financial security." },
      {
        week: "Week 2",
        content: "Asset Classes — equity, debt, real estate, commodities, diversification and risk.",
      },
      {
        week: "Week 3",
        content: "Fundamental Analysis — financial statements, ratios, intrinsic value.",
      },
      {
        week: "Week 4",
        content: "Technical Analysis — price trends, chart patterns, and market indicators.",
      },
      {
        week: "Capstone",
        content:
          "Apply learning across four weeks to a real-world financial scenario.",
      },
    ],
    prerequisites: "None",
    evaluation:
      "Minimum 3 of 4 speaker sessions; submit at least 3 of 4 assignments; complete capstone project.",
    weeklyTime: "5-7 hours",
  },
  {
    body: "ITC Web Team",
    course: "Agentic AI Integrated Website",
    type: "TSS",
    track: "ITC",
    school: "CS and DS School",
    intro: "Teaches users to create basic AI-integrated websites.",
    weeks: [
      { week: "Week 1", content: "HTML and CSS." },
      { week: "Week 2", content: "JavaScript." },
      { week: "Week 3", content: "AI Integration using Gemini API." },
      { week: "Week 4", content: "Final project." },
      {
        week: "By the end of the course",
        content: "You will learn how to deploy agentic AI integrated websites.",
      },
    ],
    prerequisites: "None",
    evaluation: "Assignments 0%, 40%, 60%; pass at 40%.",
    weeklyTime: "7 hours",
  },
  {
    body: "Krittika",
    course: "Fundamentals of Astronomy (Computational and Theoretical)",
    type: "TSS",
    track: "ITC",
    school: "Option 1",
    intro:
      "Explore deep space phenomena with a simulation-based approach — simulate astronomical processes, process spacecraft data, and learn fundamentals of data science and numerical methods in astronomy.",
    weeks: [
      {
        week: "Course structure",
        content:
          "Simulation-based learning across astrophysics topics with hands-on data processing and numerical methods (week-wise schedule shared in sessions).",
      },
    ],
    prerequisites: "Not specified",
    evaluation: "Not specified",
    weeklyTime: "Not specified",
  },
  {
    body: "Krittika",
    course: "Fundamentals of Astrophotography",
    type: "TSS",
    track: "ITC",
    school: "Option 1",
    intro:
      "Learn capturing, processing, and creating astrophotographs with hands-on telescope data, image processing software, background extraction, plate-solving, and wavelet transforms.",
    weeks: [
      {
        week: "Course structure",
        content:
          "Hands-on astrophotography pipeline from capture to processed images (week-wise schedule shared in sessions).",
      },
    ],
    prerequisites: "Not specified",
    evaluation: "Not specified",
    weeklyTime: "Not specified",
  },
  {
    body: "Maths and Physics Club",
    course: "Quantum Circuits",
    type: "TSS",
    track: "ITC",
    school: "Sciences School",
    intro:
      "Learn how quantum computers compute, build a decomposition algorithm for quantum logic gates, and simulate algorithms like Grover's.",
    weeks: [
      { week: "Week 1", content: "Intro to quantum computing, qubits, and circuits." },
      {
        week: "Week 2",
        content: "Mathematics of a universal gate set and circuit synthesis.",
      },
      {
        week: "Week 3",
        content: "Implementing a quantum circuit compiler.",
      },
      {
        week: "Week 4",
        content: "Using the compiler to simulate Grover's Algorithm.",
      },
      {
        week: "By the end of the course",
        content:
          "Understand quantum logic gates, write a decomposition algorithm, and learn how libraries like Qiskit work internally.",
      },
    ],
    prerequisites: "Some experience in Python is welcome, but not required.",
    evaluation: "Week 1-3 Assignments (50%); Week 4 Project (50%); passing 40%.",
    weeklyTime: "5-6 hours",
  },
  {
    body: "MnP under ITC",
    course: "Game Theory",
    type: "TSS",
    track: "ITC",
    school: "Sciences School",
    intro:
      "Game Theory gives you mathematical tools to understand and predict strategic behaviour — from Nash Equilibria to mixed strategies and incomplete information.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Why game theory, chess, normal form games (Prisoner's Dilemma), rationality.",
      },
      {
        week: "Week 2",
        content:
          "Domination, WDSE, SDSE, Nash equilibrium, PSNE.",
      },
      {
        week: "Week 3",
        content: "Mixed strategies, MSNE, Bayesian games.",
      },
      {
        week: "Week 4",
        content: "Extensive form games, Kuhn's theorem, stochastic extensive form games.",
      },
    ],
    prerequisites: "None",
    evaluation: "B=100%; Passing Criteria=60%",
    weeklyTime: "6 hours",
  },
  {
    body: "MnP under ITC",
    course: "Stochastic Physics",
    type: "TSS",
    track: "ITC",
    school: "Sciences School",
    intro:
      "Introduce out-of-equilibrium phenomena like Brownian motion and diffusion through the statistical laws that govern them.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Basics of probability and classical statistical mechanics (Kolmogorov axioms, ensembles).",
      },
      {
        week: "Week 2",
        content:
          "Chapman-Kolmogorov equation, Master equation, diffusion and birth-death processes.",
      },
      {
        week: "Week 3",
        content:
          "Langevin dynamics, Gaussian white noise, OU process, fluctuation-dissipation, Fokker-Planck.",
      },
      {
        week: "Week 4",
        content: "Basic simulations (Kinetic Monte Carlo and additive noise for Langevin).",
      },
    ],
    prerequisites: "None",
    evaluation: "B=100%; Passing Criteria=TBD",
    weeklyTime: "3-4 hours",
  },
  {
    body: "Sustainability Cell",
    course: "Sustainable Policies 101",
    type: "NTSS",
    school: "Sustainability School",
    intro:
      "A beginner-friendly introduction to environmental governance — from global climate negotiations to how local municipalities manage waste.",
    weeks: [
      { week: "Week 1", content: "Introduction to Environmental Policy and Governance." },
      { week: "Week 2", content: "Environmental Governance in India." },
      { week: "Week 3", content: "Global Climate Policy and International Agreements." },
      { week: "Week 4", content: "Urban, Local, and Future-Ready Environmental Policy." },
      {
        week: "By the end of the course",
        content:
          "Understand how environmental policies are designed and implemented at local, national, and global levels.",
      },
    ],
    prerequisites: "No prerequisites",
    evaluation: "Weekly Assignment 30%; Capstone Project 70%",
    weeklyTime: "6-7 hours",
  },
  {
    body: "Web and Coding Club",
    course: "Full Stack Web Development",
    type: "TSS",
    track: "ITC",
    school: "CS and DS School",
    intro:
      "A beginner-friendly introduction to full stack web development — frontend, backend, databases, deployment, and engineering practices through hands-on projects.",
    weeks: [
      {
        week: "Week 1",
        content:
          "Programming foundations, Python/JavaScript basics, Git/GitHub, command line.",
      },
      {
        week: "Week 2",
        content: "Frontend — HTML, CSS, responsive design, JavaScript interactivity, UI/UX.",
      },
      {
        week: "Week 3",
        content: "Backend — APIs, routes, authentication, connecting frontend and backend.",
      },
      {
        week: "Week 4",
        content: "Databases, SQL, CRUD, system engineering basics, deployment overview.",
      },
      {
        week: "Capstone",
        content:
          "Develop a complete web application evaluated on creativity, usability, and features.",
      },
    ],
    prerequisites: "No prior web development experience required.",
    evaluation:
      "Weekly Assignments (40%), Capstone Project (60%). Pass: at least 2 weekly assignments and capstone submission.",
    weeklyTime: "6-8 hours per week",
  },
  {
    body: "Web and Coding Club",
    course: "Introduction to Machine Learning and AI",
    type: "TSS",
    track: "ITC",
    school: "CS and DS School",
    intro:
      "A beginner-friendly introduction to Machine Learning, Deep Learning, transformers, and LLMs through theory, hands-on coding, and mini projects.",
    weeks: [
      {
        week: "Week 1",
        content:
          "ML/AI overview, supervised vs unsupervised learning, gradient descent, Python/NumPy/Pandas, preprocessing.",
      },
      {
        week: "Week 2",
        content:
          "Classical NLP, logistic regression, deep learning foundations, embeddings, Word2Vec.",
      },
      {
        week: "Week 3",
        content:
          "Transformers, HuggingFace, prompt engineering, RAG introduction.",
      },
      {
        week: "Week 4",
        content:
          "Building AI applications with Streamlit/Gradio and capstone assistant project.",
      },
    ],
    prerequisites:
      "No prior ML experience required. Basic programming familiarity helpful.",
    evaluation:
      "Weekly Assignments (40%), Capstone Project (60%). Pass: at least 2 assignments and capstone submission.",
    weeklyTime: "6-8 hours per week",
  },
  {
    body: "ITC",
    course: "AI in Chemical Engineering: From Reactor to Refinery",
    type: "TSS",
    track: "ITC",
    school: "Engineering School",
    intro: "AI is reshaping the future of Chemical Engineering. Explore how Artificial Intelligence is transforming industries through smarter reactors, optimized processes, advanced control systems, and data-driven refinery operations. Learn how AI is driving the next era of chemical manufacturing and smart industrial systems.",
    weeks: [
      {
        week: "Week 1",
        content: "Week 1: Introduction to AI in Chemical Engineering — Explore the fundamentals of AI and machine learning, and discover how these technologies are transforming modern chemical engineering and process industries."
      },
      {
        week: "Week 2",
        content: "Week 2: AI for Reactors and Process Modeling — Understand how AI can predict reactor performance, model complex chemical processes, and support data-driven decision-making in process engineering."
      },
      {
        week: "Week 3",
        content: "Week 3: AI for Process Control and Optimization — Learn how AI can enhance process control, optimize operating conditions, and improve efficiency, safety, and performance in chemical plants."
      },
      {
        week: "Week 4",
        content: "Week 4: AI in Refineries and Smart Manufacturing — Discover how AI is transforming refinery operations and smart manufacturing through predictive analytics, automation, and data-driven decision-making."
      }
    ],
    prerequisites: "None",
    evaluation: "To be announced",
    weeklyTime: "5-6 hours"
  },
  {
    body: "ITC (CC and ChemETL)",
    course: "Radioisotope Batteries and Hydrogen Fuel Cells in Space Applications",
    type: "TSS",
    track: "ITC",
    school: "Sciences School",
    intro: "Explore the technologies that power space missions. From radioisotope batteries to hydrogen fuel cells, discover how nuclear chemistry and electrochemistry enable exploration beyond Earth. Learn the science, applications, and future of these critical space power technologies.",
    weeks: [
      {
        week: "Week 1",
        content: "Week 1: The Space Power Problem — Learn why generating and storing energy in space is challenging, and explore the power requirements of modern space missions."
      },
      {
        week: "Week 2",
        content: "Week 2: Radioisotope Batteries – Nuclear Heat at Work — Discover how nuclear energy is used to generate reliable power for spacecraft operating far from the Sun."
      },
      {
        week: "Week 3",
        content: "Week 3: Hydrogen Fuel Cells – Chemistry That Powers Astronauts — Understand how hydrogen fuel cells generate clean and efficient energy, providing power and water for crewed space missions."
      },
      {
        week: "Week 4",
        content: "Week 4: Head-to-Head – Choosing the Right Technology — Compare radioisotope batteries and hydrogen fuel cells, evaluating their advantages, limitations, and suitability for different space missions."
      }
    ],
    prerequisites: "None",
    evaluation: "To be announced",
    weeklyTime: "6-7 hours per week"
  }
];

const outPath = path.join(__dirname, "..", "src", "data", "Courses2026.json");
fs.writeFileSync(outPath, JSON.stringify(courses, null, 2), "utf8");
console.log(`Wrote ${courses.length} courses to ${outPath}`);
