// Type definitions for stream references
export interface Resource {
  title: string;
  url: string;
  type: "University Department" | "Official Syllabus" | "Study Material" | "Career Path" | "Stream Guide" | "Professional Body";
}

export interface StreamInfo {
  name: string;
  resources: Resource[];
  careers: string[];
}

export type StreamKey = "physical_science" | "biological_science" | "commerce" | "art" | "technology";

export type StreamReferences = Record<StreamKey, StreamInfo>;

// Reference links for each A/L stream
export const streamReferences: StreamReferences = {
  physical_science: {
    name: "Physical Science",
    resources: [
      {
        title: "A/L Physics Syllabus - NIE",
        url: "https://www.nie.lk/",
        type: "Official Syllabus",
      },
      {
        title: "A/L Combined Mathematics Resources",
        url: "https://www.nie.lk/",
        type: "Study Material",
      },
      {
        title: "Engineering Faculty - University of Moratuwa",
        url: "https://uom.lk/",
        type: "Career Path",
      },
      {
        title: "Physical Science Stream Guide",
        url: "https://www.education.gov.lk/",
        type: "Stream Guide",
      },
    ],
    careers: [
      "Engineering (All branches)",
      "Architecture",
      "Quantity Surveying",
      "Physical Sciences",
      "Applied Sciences",
    ],
  },

  biological_science: {
    name: "Biological Science",
    resources: [
      {
        title: "A/L Biology Syllabus - NIE",
        url: "https://www.nie.lk/",
        type: "Official Syllabus",
      },
      {
        title: "Department of Zoology & Environment Sciences",
        url: "https://science.cmb.ac.lk/zoology/",
        type: "Study Material",
      },
      {
        title: "Allied Health Sciences Faculty",
        url: "https://ahs.cmb.ac.lk/",
        type: "Career Path",
      },
      {
        title: "Biological Science Stream Guide",
        url: "https://www.education.gov.lk/",
        type: "Stream Guide",
      },
    ],
    careers: [
      "Medicine",
      "Dental Surgery",
      "Veterinary Science",
      "Pharmacy",
      "Allied Health Sciences",
      "Bio-Medical Sciences",
    ],
  },

  commerce: {
    name: "Commerce",
    resources: [
      {
        title: "A/L Business Studies Syllabus",
        url: "https://www.nie.lk/",
        type: "Official Syllabus",
      },
      {
        title: "CA Sri Lanka",
        url: "https://www.casrilanka.com/",
        type: "Professional Body",
      },
      {
        title: "Institute of Chartered Accountants",
        url: "https://www.casrilanka.com/",
        type: "Career Path",
      },
      {
        title: "Commerce Stream Career Guide",
        url: "https://www.education.gov.lk/",
        type: "Stream Guide",
      },
    ],
    careers: [
      "Chartered Accountancy",
      "Business Management",
      "Banking & Finance",
      "Marketing",
      "Human Resource Management",
      "International Business",
    ],
  },

  art: {
    name: "Art",
    resources: [
      {
        title: "A/L Arts Subjects Syllabus",
        url: "https://www.nie.lk/",
        type: "Official Syllabus",
      },
      {
        title: "Department of Sinhala - UOC",
        url: "https://arts.cmb.ac.lk/sinhala/",
        type: "Study Material",
      },
      {
        title: "Faculty of Law - University of Colombo",
        url: "https://law.cmb.ac.lk/",
        type: "Career Path",
      },
      {
        title: "Arts Stream Career Opportunities",
        url: "https://www.education.gov.lk/",
        type: "Stream Guide",
      },
    ],
    careers: [
      "Law",
      "Mass Communication",
      "Social Sciences",
      "Languages & Literature",
      "Education",
      "Public Administration",
    ],
  },

  technology: {
    name: "Technology",
    resources: [
      {
        title: "A/L Engineering Technology Syllabus",
        url: "https://www.nie.lk/",
        type: "Official Syllabus",
      },
      {
        title: "Department of Information Technology",
        url: "https://www.ucsc.cmb.ac.lk/",
        type: "Study Material",
      },
      {
        title: "UNIVOTEC - University of Vocational Technology",
        url: "https://www.univotec.ac.lk/",
        type: "Career Path",
      },
      {
        title: "Technology Stream Guide",
        url: "https://www.education.gov.lk/",
        type: "Stream Guide",
      },
    ],
    careers: [
      "Information Technology",
      "Software Engineering",
      "Bio Systems Technology",
      "Construction Technology",
      "Food Technology",
      "Agricultural Technology",
    ],
  },
};

// Helper function to get references for a stream
export const getStreamReferences = (streamName: string): StreamInfo | null => {
  const normalizedStream = streamName.toLowerCase().replace(/ /g, "_") as StreamKey;
  return streamReferences[normalizedStream] || null;
};

// Helper function to get all available streams
export const getAvailableStreams = (): StreamKey[] => {
  return Object.keys(streamReferences) as StreamKey[];
};
