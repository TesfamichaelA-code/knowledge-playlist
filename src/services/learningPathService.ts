
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

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
    .select()
    .single();

  if (error) {
    console.error("Error updating resource:", error);
    throw error;
  }

  return data;
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
