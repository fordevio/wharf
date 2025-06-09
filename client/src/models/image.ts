export interface Image {
  /**
   * Number of containers using this image. Includes both stopped and running containers.
   * `-1` indicates that the value has not been set / calculated.
   */
  Containers: number;

  /**
   * Date and time at which the image was created as a Unix timestamp (seconds since EPOCH).
   */
  Created: number;

  /**
   * Content-addressable ID of an image.
   */
  Id: string;

  /**
   * User-defined key/value metadata.
   */
  Labels: Record<string, string>;

  /**
   * ID of the parent image.
   */
  ParentId: string;

  /**
   * List of content-addressable digests of locally available image manifests.
   */
  RepoDigests: string[];

  /**
   * List of image names/tags that reference this image.
   */
  RepoTags: string[];

  /**
   * Total size of shared image layers.
   * `-1` indicates that the value has not been set / calculated.
   */
  SharedSize: number;

  /**
   * Total size of the image including all layers.
   */
  Size: number;

  /**
   * Deprecated: use Size instead. May be omitted in some API versions.
   */
  VirtualSize?: number;
}

export interface DeleteResponse {
  /**
   * The image ID of an image that was deleted.
   */
  Deleted?: string;

  /**
   * The image ID of an image that was untagged.
   */
  Untagged?: string;
}

export interface ImagesPruneReport {
  /**
   * List of deleted or untagged images.
   */
  ImagesDeleted: DeleteResponse[];

  /**
   * Total space reclaimed in bytes.
   */
  SpaceReclaimed: number;
}
