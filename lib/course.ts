import { Course } from './types';
import javaBasics from '../data/courses/java-basics.json';

const courses: Record<string, Course> = {
  'java-basics': javaBasics as Course,
};

export function getCourse(slug: string): Course | null {
  return courses[slug] ?? null;
}

export function getAllCourses(): Course[] {
  return Object.values(courses);
}
