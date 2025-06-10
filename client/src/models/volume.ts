export interface UsageData {
  /**
   * The number of containers referencing this volume.
   * `-1` means reference count is not available.
   */
  RefCount: number;

  /**
   * Disk space used by the volume in bytes.
   * `-1` means not available.
   */
  Size: number;
}

export interface ClusterVolume {
  [key: string]: any; // Placeholder; define structure if known
}

export interface Volume {
  /**
   * Cluster volume info (optional).
   */
  ClusterVolume?: ClusterVolume;

  /**
   * Creation date/time (ISO 8601 format recommended).
   */
  CreatedAt?: string;

  /**
   * Volume driver used.
   */
  Driver: string;

  /**
   * User-defined metadata.
   */
  Labels: Record<string, string>;

  /**
   * Mount path of the volume on the host.
   */
  Mountpoint: string;

  /**
   * Name of the volume.
   */
  Name: string;

  /**
   * Driver-specific options used when creating the volume.
   */
  Options: Record<string, string>;

  /**
   * Volume scope: either "global" or "local".
   */
  Scope: string;

  /**
   * Low-level status info from the driver (optional).
   */
  Status?: Record<string, any>;

  /**
   * Usage data (optional).
   */
  UsageData?: UsageData;
}

export interface VolumesPruneReport {
  /**
   * List of names or IDs of volumes that were deleted.
   */
  VolumesDeleted: string[];

  /**
   * Total amount of disk space reclaimed in bytes.
   */
  SpaceReclaimed: number;
}
