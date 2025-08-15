/**
 * Utility functions for safe text rendering
 * Prevents "Objects are not valid as a React child" errors
 */

/**
 * Safely converts any value to a string for rendering in Text components
 * @param {any} value - The value to convert to string
 * @param {string} fallback - Fallback string if value is invalid
 * @returns {string} Safe string for rendering
 */
export const safeText = (value, fallback = '') => {
  if (value === null || value === undefined) {
    return fallback;
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  if (typeof value === 'boolean') {
    return value.toString();
  }
  
  if (typeof value === 'object') {
    // If it's an object with a title property, use that
    if (value.title) {
      return value.title;
    }
    // If it's an object with a name property, use that
    if (value.name) {
      return value.name;
    }
    // If it's an object with an _id property, it might be a database object
    if (value._id) {
      return `Object (${value._id})`;
    }
    // For other objects, return the fallback
    return fallback;
  }
  
  // For any other type, convert to string
  return String(value);
};

/**
 * Safely gets a course title from course data
 * @param {string|object} course - Course ID or course object
 * @param {array} courses - Array of course objects to search in
 * @returns {string} Course title
 */
export const getCourseTitle = (course, courses = []) => {
  if (typeof course === 'string') {
    // If course is just an ID, find the course object
    const courseObj = courses.find(c => c._id === course);
    return courseObj ? courseObj.title : 'Unknown Course';
  }
  
  if (typeof course === 'object' && course !== null) {
    return course.title || 'Unknown Course';
  }
  
  return 'Unknown Course';
};

/**
 * Safely gets a level title from level data
 * @param {string|object} level - Level ID or level object
 * @param {array} levels - Array of level objects to search in
 * @returns {string} Level title
 */
export const getLevelTitle = (level, levels = []) => {
  if (typeof level === 'string') {
    // If level is just an ID, find the level object
    const levelObj = levels.find(l => l._id === level);
    return levelObj ? levelObj.title : 'Unknown Level';
  }
  
  if (typeof level === 'object' && level !== null) {
    return level.title || 'Unknown Level';
  }
  
  return 'Unknown Level';
};

/**
 * Safely formats a date for display
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date string
 */
export const safeFormatDate = (dateString) => {
  try {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};