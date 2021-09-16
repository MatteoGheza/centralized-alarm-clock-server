import findPackageJson from "find-package-json";

export const version = findPackageJson(__dirname).next()?.value?.version || "unknown";