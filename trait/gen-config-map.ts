import { hash, url } from "../mod.ts";

/**
 * A config map generator.
 * To learn more about how config map generator works, please refer to this [link](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/#configmapgenerator).
 */

type DataType = {
  [key: string]: string;
};

/**
 * Get an absolute path string relative to the base url.
 * @param base a file url
 * @param path a path relative to the url
 * @returns
 */
export function relativePath(base: string, path: string) {
  return url.fileURLToPath(`${base}/../${path}`);
}

/**
 * Read text files of a directory as an object.
 * @param path the path to the config directory
 * @returns
 */
export function readConfigData(path: string | URL): DataType {
  const map: DataType = Object.create({});
  for (const dirEntry of Deno.readDirSync(path)) {
    if (dirEntry.isDirectory) {
      // skip nested directory for now.
      continue;
    }
    const fileName = dirEntry.name;
    const content = Deno.readTextFileSync(`${path}/${fileName}`);
    map[fileName] = content;
  }
  return map;
}

/**
 * Generate a unique name using hash of the data.
 * @param prefix the name prefix
 * @param data
 * @param length the length of the auto genrated suffix.
 * @returns
 */
export function generateName(
  prefix: string,
  data: DataType,
  length = 10,
): string {
  const hex = hash(data);
  return `${prefix}-${hex.slice(0, length)}`;
}
