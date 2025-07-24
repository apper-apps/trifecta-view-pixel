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
  
  const deletedSection = { ...trifectaSectionsData[sectionIndex] };
  trifectaSectionsData.splice(sectionIndex, 1);
  
  return deletedSection;
};