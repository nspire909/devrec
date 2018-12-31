export interface Company {
  companyId: number;
  name: string;
  emailDomain: string;
  // read-only audit fields
  createdDate?: string;
  createdUserId?: string;
  createdUserName?: string;
}

export interface CompanySaveResult {
  success: boolean;
  messages: string[];
  item: Company;
  itemRole?: CompanyUser; // include new admin role on newly created company
}

export interface DeleteTestResult {
  canDelete: boolean;
}

export interface OrganizationUser {
  organizationUserId: number;
  organizationId: number;
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  employmentStatus: 'none' | 'fulltime' | 'retired';
  emailAddress: string;
  handle: string;
  avatarFileId: string;
  phoneNumber: string;
  phoneNumberDigits: string;
  approverUserId: string;
  approverName: string;
  supervisorUserId: string;
  supervisorName: string;
  lastLoginDate: string; // ISO date
  // read-only audit fields
  createdDate?: string;
  createdUserId?: string;
  createdUserName?: string;
  updatedDate?: string;
  updatedUserId?: string;
  updatedUserName?: string;
}

export function blankOrganizationUser(): OrganizationUser {
  return {
    organizationUserId: 0,
    organizationId: 0,
    userId: '',
    firstName: '',
    lastName: '',
    title: '',
    employmentStatus: 'none',
    emailAddress: '',
    handle: '',
    avatarFileId: '00000000-0000-0000-0000-000000000000', // empty guid
    phoneNumber: '',
    phoneNumberDigits: '',
    approverUserId: '',
    approverName: '',
    supervisorUserId: '',
    supervisorName: '',
    lastLoginDate: ''
  };
}

export interface CompanyUser {
  organizationUserId: number;
  companyUserId: number;
  userId: string;
  companyId: number;
  companyName: string;
  role: string;
  // read-only audit fields
  createdDate?: string;
  createdUserId?: string;
  createdUserName?: string;
  updatedDate?: string;
  updatedUserId?: string;
  updatedUserName?: string;
}

export function blankCompanyUser(): CompanyUser {
  return {
    organizationUserId: 0,
    companyUserId: 0,
    userId: '',
    companyId: 0,
    companyName: '',
    role: ''
  };
}
