export interface UserProfile {
    displayName: string;
    email: string;
    emailVerified?: boolean;
    isAnonymous: boolean;
    metadata: {
      lastSignInTime: number;
      creationTime: number;
    };
    multiFactor: {
      enrolledFactors: any[];
    };
    phoneNumber: string;
    phoneVerified: boolean;
    photoURL: string;
    providerData: Array<any>;
    providerId: string;
    tenantId: string | null;
    uid: string;
  }
  