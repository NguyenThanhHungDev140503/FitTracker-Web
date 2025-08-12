import {
  users,
  workouts,
  exercises,
  type User,
  type UpsertUser,
  type Workout,
  type InsertWorkout,
  type Exercise,
  type InsertExercise,
  type UpdateExercise,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Workout operations
  getWorkouts(userId: string): Promise<Workout[]>;
  getWorkoutsByDate(userId: string, date: string): Promise<Workout[]>;
  getWorkoutById(workoutId: string, userId: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(workoutId: string, userId: string, updates: Partial<InsertWorkout>): Promise<Workout>;
  deleteWorkout(workoutId: string, userId: string): Promise<void>;
  
  // Exercise operations
  getExercisesByWorkout(workoutId: string): Promise<Exercise[]>;
  getExerciseById(exerciseId: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(exerciseId: string, updates: UpdateExercise): Promise<Exercise>;
  deleteExercise(exerciseId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Workout operations
  async getWorkouts(userId: string): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.date));
  }

  async getWorkoutsByDate(userId: string, date: string): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, userId), eq(workouts.date, date)))
      .orderBy(asc(workouts.createdAt));
  }

  async getWorkoutById(workoutId: string, userId: string): Promise<Workout | undefined> {
    const [workout] = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
    return workout;
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }

  async updateWorkout(workoutId: string, userId: string, updates: Partial<InsertWorkout>): Promise<Workout> {
    const [updatedWorkout] = await db
      .update(workouts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
      .returning();
    return updatedWorkout;
  }

  async deleteWorkout(workoutId: string, userId: string): Promise<void> {
    await db
      .delete(workouts)
      .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  }

  // Exercise operations
  async getExercisesByWorkout(workoutId: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.workoutId, workoutId))
      .orderBy(asc(exercises.order));
  }

  async getExerciseById(exerciseId: string): Promise<Exercise | undefined> {
    const [exercise] = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, exerciseId));
    return exercise;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }

  async updateExercise(exerciseId: string, updates: UpdateExercise): Promise<Exercise> {
    const [updatedExercise] = await db
      .update(exercises)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(exercises.id, exerciseId))
      .returning();
    return updatedExercise;
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    await db.delete(exercises).where(eq(exercises.id, exerciseId));
  }
}

export const storage = new DatabaseStorage();
