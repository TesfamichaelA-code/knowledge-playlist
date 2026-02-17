
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import type { LearningPathWithStats } from "@/types";

export type LearningPath = Tables<"learning_paths">;
export type Resource = Tables<"resources">;

export const fetchLearningPaths = async (): Promise<LearningPath[]> => {
  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching learning paths:", error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch learning paths with resource counts and progress stats.
 * Performs two queries: one for paths, one for resources, then aggregates.
 */
export const fetchLearningPathsWithStats = async (): Promise<LearningPathWithStats[]> => {
  const { data: paths, error: pathsError } = await supabase
    .from("learning_paths")
    .select("*")
    .order("created_at", { ascending: false });

  if (pathsError) {
    console.error("Error fetching learning paths:", pathsError);
    throw pathsError;
  }

  if (!paths || paths.length === 0) return [];

  const { data: resources, error: resourcesError } = await supabase
    .from("resources")
    .select("path_id, completed, duration")
    .in("path_id", paths.map(p => p.id));

  if (resourcesError) {
    console.error("Error fetching resources for stats:", resourcesError);
    throw resourcesError;
  }

  // Aggregate stats per path
  const statsMap = new Map<string, { total: number; completed: number; duration: number }>();
  for (const r of resources || []) {
    const existing = statsMap.get(r.path_id) || { total: 0, completed: 0, duration: 0 };
    existing.total += 1;
    if (r.completed) existing.completed += 1;
    existing.duration += r.duration || 0;
    statsMap.set(r.path_id, existing);
  }

  return paths.map(path => {
    const stats = statsMap.get(path.id) || { total: 0, completed: 0, duration: 0 };
    return {
      id: path.id,
      title: path.title,
      description: path.description || "",
      category: path.category,
      totalResources: stats.total,
      completedResources: stats.completed,
      totalDuration: stats.duration,
    };
  });
};

/**
 * Fetch the most recently accessed incomplete resource for "Continue Learning".
 */
export const fetchContinueLearningResource = async (): Promise<(Resource & { pathTitle: string }) | null> => {
  // Get the most recent incomplete resource (ordered by created_at desc, pick progress > 0 first)
  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .eq("completed", false)
    .gt("progress", 0)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching continue learning resource:", error);
    return null;
  }

  if (!resources || resources.length === 0) {
    // Fallback: get any incomplete resource
    const { data: fallback, error: fallbackError } = await supabase
      .from("resources")
      .select("*")
      .eq("completed", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fallbackError || !fallback || fallback.length === 0) return null;

    const resource = fallback[0];
    // Fetch path title
    const { data: path } = await supabase
      .from("learning_paths")
      .select("title")
      .eq("id", resource.path_id)
      .single();

    return { ...resource, pathTitle: path?.title || "Learning Path" };
  }

  const resource = resources[0];
  const { data: path } = await supabase
    .from("learning_paths")
    .select("title")
    .eq("id", resource.path_id)
    .single();

  return { ...resource, pathTitle: path?.title || "Learning Path" };
};

export const fetchLearningPathById = async (id: string): Promise<LearningPath> => {
  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching learning path:", error);
    throw error;
  }

  return data;
};

export const fetchResourcesByPathId = async (pathId: string): Promise<Resource[]> => {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("path_id", pathId)
    .order("position");

  if (error) {
    console.error("Error fetching resources:", error);
    throw error;
  }

  return data || [];
};

export const fetchResourceById = async (id: string): Promise<Resource> => {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching resource:", error);
    throw error;
  }

  return data;
};

export const createResource = async (resource: Omit<Resource, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("resources")
    .insert(resource)
    .select()
    .single();

  if (error) {
    console.error("Error creating resource:", error);
    throw error;
  }

  return data;
};

export const updateResource = async (id: string, updates: Partial<Resource>) => {
  const { data, error } = await supabase
    .from("resources")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating resource:", error);
    throw error;
  }

  return data?.[0] ?? null;
};

export const deleteResource = async (id: string) => {
  const { error } = await supabase
    .from("resources")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }

  return true;
};

export const deleteLearningPath = async (id: string) => {
  // First, delete all resources associated with this learning path
  const { error: resourcesError } = await supabase
    .from("resources")
    .delete()
    .eq("path_id", id);

  if (resourcesError) {
    console.error("Error deleting resources:", resourcesError);
    throw resourcesError;
  }

  // Then delete the learning path
  const { error } = await supabase
    .from("learning_paths")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting learning path:", error);
    throw error;
  }

  return true;
};
