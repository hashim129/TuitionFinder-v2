import { Tutor, Student } from '../types';

/**
 * Town-first, city-second matching (master prompt §5).
 *
 * Ranking order:
 *   1. Exact town/area match  (weight 3)
 *   2. Same city, different area (weight 1)
 *   3. Different city (weight 0)
 *
 * Tie-break: higher rating first, then more students.
 *
 * The algorithm never changes — it is the stable matching logic.
 */
export function matchTutors(
  tutors: Tutor[],
  student: Student,
  subject: string
): Tutor[] {
  return tutors
    .filter(t => !subject || t.subjects.includes(subject))
    .map(t => {
      let score = 0;
      // Town/area match
      if (t.area.toLowerCase() === student.area.toLowerCase()) {
        score += 3;
      } else if (t.city.toLowerCase() === student.city.toLowerCase()) {
        score += 1;
      }
      // Rating tie-break
      score += t.rating / 10; // 0.0 – 1.0
      // Student count as secondary tie-break (normalized)
      score += Math.min(t.totalStudents / 500, 1) * 0.5;
      return { tutor: t, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(x => x.tutor);
}

/**
 * Count how many subjects a student can currently book.
 * Free tier: 3 subjects. Premium: 9 subjects (3 + 6 extra).
 */
export function getFreeSubjects(student: Student): string[] {
  return student.subjects.slice(0, 3);
}

export function getPremiumSubjects(student: Student, purchased: number): string[] {
  return student.subjects.slice(0, 3 + purchased * 3);
}
