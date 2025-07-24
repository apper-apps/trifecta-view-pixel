import trifectaSectionsData from "@/services/mockData/trifectaSections.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTrifectaSections = async () => {
  await delay(300);
  return [...trifectaSectionsData];
};

export const getTrifectaSectionById = async (id) => {
  await delay(200);
  const section = trifectaSectionsData.find(section => section.Id === parseInt(id));
  if (!section) {
    throw new Error("Section not found");
  }
  return { ...section };
};

export const updateTrifectaSection = async (id, updates) => {
  await delay(300);
  const sectionIndex = trifectaSectionsData.findIndex(section => section.Id === parseInt(id));
  if (sectionIndex === -1) {
    throw new Error("Section not found");
  }
  
  const updatedSection = { ...trifectaSectionsData[sectionIndex], ...updates };
  trifectaSectionsData[sectionIndex] = updatedSection;
  
  return { ...updatedSection };
};

export const createTrifectaSection = async (sectionData) => {
  await delay(300);
  
  const maxId = Math.max(...trifectaSectionsData.map(section => section.Id), 0);
  const newSection = {
    Id: maxId + 1,
    ...sectionData
  };
  
  trifectaSectionsData.push(newSection);
  return { ...newSection };
};

export const deleteTrifectaSection = async (id) => {
  await delay(300);
  const sectionIndex = trifectaSectionsData.findIndex(section => section.Id === parseInt(id));
  if (sectionIndex === -1) {
    throw new Error("Section not found");
  }
}
  
  const deletedSection = { ...trifectaSectionsData[sectionIndex] };
  trifectaSectionsData.splice(sectionIndex, 1);
  
  return deletedSection;

export const getOverallStatus = async () => {
  await delay(300);
  
  // Mock overall business setup completion status
  return [
    { label: "Trust Funded", completed: true, description: "Primary trust vehicle established and funded" },
    { label: "Estate Plan Complete", completed: true, description: "Will, trust documents, and beneficiary designations updated" },
    { label: "Asset Protection Active", completed: true, description: "Key assets properly titled and protected" },
{ label: "Business Structure Optimized", completed: false, description: "Corporate structure review and optimization pending" },
    { label: "Tax Planning Current", completed: true, description: "Current year tax strategies implemented" },
    { label: "Succession Plan Documented", completed: false, description: "Business succession planning documentation needed" }
  ];
};