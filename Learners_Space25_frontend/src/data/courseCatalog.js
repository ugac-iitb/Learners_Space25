import rawCourses from "./Courses2026.json";

const SCHOOL_MAP = {
  "cs and ds school": "CS and DS School",
  "sports and skills school": "Sports and Skills School",
  "sports and skills": "Sports and Skills School",
  sciences: "Sciences School",
  "sciences school": "Sciences School",
  "engineering school": "Engineering School",
  "management school": "Management School",
  "sustainability school": "Sustainability School",
  "option 1": "Option 1",
};

const normalizeSpaces = (value = "") => value.replace(/\s+/g, " ").trim();
const normalizeCompareKey = (value = "") =>
  normalizeSpaces(value)
    .toLowerCase()
    .replace(/[^\w\s]/g, "");

const COURSE_TITLE_ALIASES = {
  "big data handeling": "Big Data Handling",
  "introduction to computational chemistry": "Introduction to Computational Chemistry",
  "techno commercial aspects of chemical industries":
    "Techno Commercial Aspects of Chemical Industries",
  "agentic ai integrated website": "Agentic AI Integrated Website",
};

export const normalizeCourseTitle = (title = "") => {
  const trimmed = normalizeSpaces(title);
  const alias = COURSE_TITLE_ALIASES[normalizeCompareKey(trimmed)];
  return alias || trimmed;
};

export const normalizeSchool = (school) => {
  const normalized = normalizeSpaces(school || "");
  if (!normalized) return "Unspecified";

  const mapped = SCHOOL_MAP[normalized.toLowerCase()];
  return mapped || normalized;
};

export const buildCourseId = (course) =>
  `${normalizeCompareKey(course.body)}__${normalizeCompareKey(normalizeCourseTitle(course.course))}`;

const normalizeCourse = (course) => ({
  ...course,
  course: normalizeCourseTitle(course.course),
  school: normalizeSchool(course.school),
  intro: course.intro || "",
  prerequisites: course.prerequisites || "",
  evaluation: course.evaluation || "",
  weeklyTime: course.weeklyTime || "",
  weeks: Array.isArray(course.weeks) ? course.weeks : [],
});

// Deduplicate by organizing body + course name after normalization.
export const getCanonicalCourses = () => {
  const byId = new Map();

  rawCourses.forEach((course) => {
    const normalizedCourse = normalizeCourse(course);
    const id = buildCourseId(normalizedCourse);

    if (!byId.has(id)) {
      byId.set(id, { ...normalizedCourse, id });
      return;
    }

    const existing = byId.get(id);
    // Merge details if future yearly updates add richer content in one duplicate entry.
    byId.set(id, {
      ...existing,
      ...normalizedCourse,
      id,
      intro: existing.intro || normalizedCourse.intro,
      prerequisites: existing.prerequisites || normalizedCourse.prerequisites,
      evaluation: existing.evaluation || normalizedCourse.evaluation,
      weeklyTime: existing.weeklyTime || normalizedCourse.weeklyTime,
      weeks: existing.weeks?.length ? existing.weeks : normalizedCourse.weeks,
    });
  });

  return Array.from(byId.values());
};

export const getCourseById = (id) => getCanonicalCourses().find((course) => course.id === id);
