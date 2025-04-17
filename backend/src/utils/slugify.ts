export default function slugify(text: string, options: { lower?: boolean } = {}): string {
    // Convert to lowercase if specified
    let result = options.lower ? text.toLowerCase() : text

    // Replace spaces with hyphens
    result = result.replace(/\s+/g, "-")

    // Remove special characters
    result = result.replace(/[^\w-]+/g, "")

    // Remove duplicate hyphens
    result = result.replace(/--+/g, "-")

    // Remove leading and trailing hyphens
    result = result.replace(/^-+/, "").replace(/-+$/, "")

    return result
}
