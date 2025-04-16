import { saveMdxFiles, getProjectMdx } from '@/lib/docService';

/**
 * Generate a section title from a filename
 * @param filename The MDX filename
 * @returns Formatted section title
 */
function generateSectionTitle(filename: string): string {
  return filename
    .replace(/\.mdx$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate initial content for a new section
 * @param sectionTitle The title of the section
 * @returns MDX content template
 */
function generateSectionTemplate(sectionTitle: string): string {
  return `# ${sectionTitle}

## Overview
Add an overview of this section here...

## Getting Started
Start with the basics...

## Features
List the main features...

## Examples
Show some examples...

## Reference
Add detailed reference documentation...
`;
}

/**
 * Format a filename for MDX
 * @param name Raw filename or section name
 * @returns Formatted filename
 */
export function formatMdxFilename(name: string): string {
  return name.toLowerCase()
    // Replace spaces with dashes
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^a-z0-9-]/g, '')
    // Add .mdx extension if not present
    .replace(/\.mdx$|$/, '.mdx');
}

/**
 * Create a new MDX section file
 * @param projectId The project ID
 * @param name The section name or filename
 * @returns Success flag and the formatted filename
 */
export async function createMdxSection(
  projectId: string,
  name: string
): Promise<{ success: boolean; filename: string }> {
  try {
    const filename = formatMdxFilename(name);
    const sectionTitle = generateSectionTitle(filename);
    const content = generateSectionTemplate(sectionTitle);
    
    // Get existing MDX files
    const existingFiles = await getProjectMdx(projectId);
    if (!existingFiles) {
      console.error('Failed to retrieve existing MDX files');
      return { success: false, filename };
    }
    
    // Check if file already exists
    if (existingFiles.some(file => file.filename === filename)) {
      console.error(`File ${filename} already exists`);
      return { success: false, filename };
    }
    
    // Add new file to the list
    const updatedFiles = [...existingFiles, { filename, content }];
    
    // Save updated files
    const success = await saveMdxFiles(projectId, updatedFiles);
    
    if (success) {
      console.log(`Successfully created new section ${filename}`);
    } else {
      console.error(`Failed to create new section ${filename}`);
    }
    
    return { success, filename };
  } catch (error) {
    console.error('Error creating MDX section:', error);
    return { success: false, filename: formatMdxFilename(name) };
  }
}

/**
 * Delete an MDX file from a project
 * @param projectId The project ID
 * @param filename The filename to delete
 * @returns Success flag and the next available filename (if any)
 */
export async function deleteMdxFile(
  projectId: string,
  filename: string
): Promise<{ success: boolean; nextFile?: string }> {
  try {
    // Get existing MDX files
    const existingFiles = await getProjectMdx(projectId);
    if (!existingFiles) {
      console.error('Failed to retrieve existing MDX files');
      return { success: false };
    }
    
    // Filter out the file to delete
    const updatedFiles = existingFiles.filter(file => file.filename !== filename);
    
    // If no files were removed, return false
    if (updatedFiles.length === existingFiles.length) {
      console.error(`File ${filename} not found`);
      return { success: false };
    }
    
    // Save updated files
    const success = await saveMdxFiles(projectId, updatedFiles);
    
    if (success) {
      console.log(`Successfully deleted ${filename}`);
      // Return the first remaining file as the next file to show
      return { 
        success: true, 
        nextFile: updatedFiles.length > 0 ? updatedFiles[0].filename : undefined 
      };
    } else {
      console.error(`Failed to delete ${filename}`);
      return { success: false };
    }
  } catch (error) {
    console.error('Error deleting MDX file:', error);
    return { success: false };
  }
}

/**
 * Save MDX content for a specific file in a project
 * @param projectId The project ID
 * @param filename The MDX filename to update
 * @param newContent The new content for the file
 * @returns Success flag
 */
export async function saveProjectMdxFile(
  projectId: string,
  filename: string,
  newContent: string
): Promise<boolean> {
  try {
    console.log(`Saving MDX file ${filename} for project ${projectId}`);
    
    // Get existing MDX files for the project
    const existingFiles = await getProjectMdx(projectId);
    
    if (!existingFiles) {
      console.error('Failed to retrieve existing MDX files');
      return false;
    }
    
    // Update the specified file or add it if it doesn't exist
    let updated = false;
    const updatedFiles = existingFiles.map(file => {
      if (file.filename === filename) {
        updated = true;
        return { ...file, content: newContent };
      }
      return file;
    });
    
    // If the file doesn't exist, add it
    if (!updated) {
      updatedFiles.push({ filename, content: newContent });
    }
    
    // Save the updated files back to the project
    const success = await saveMdxFiles(projectId, updatedFiles);
    
    if (success) {
      console.log(`Successfully saved MDX file ${filename}`);
    } else {
      console.error(`Failed to save MDX file ${filename}`);
    }
    
    return success;
  } catch (error) {
    console.error('Error saving MDX file:', error);
    return false;
  }
} 