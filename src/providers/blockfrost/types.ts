import { Network } from '../../types';

/**
 * Configuration for the Blockfrost provider
 */
export interface BlockfrostConfig {
  /** The Blockfrost project ID */
  projectId: string;
  /** The network to connect to */
  network: Network;
}

/**
 * Blockfrost API error response
 */
export interface BlockfrostError {
  /** The error status code */
  status_code: number;
  /** The error message */
  message: string;
  /** The error name */
  name: string;
} 