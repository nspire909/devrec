import {
  CompanyUser,
  OrganizationUser,
  blankOrganizationUser
} from './organization.model';

export interface CredentialsViewModel {
  emailAddress: string;
  password: string;
}

export interface MicrosoftOptions {
  client_id: string;
  scope: string;
}
export interface MicrosoftAuthViewModel {
  accessToken: string;
  state: string;
  baseHref: string;
}

export interface UserSummary {
  id: string;
  jwtToken: string;
  name: string;
  emailAddress: string;
  roles: string[];
  companies: CompanyUser[];
  profile: OrganizationUser;
  maxProjectRole: string;
}

// Company roles that can create/edit projects and add or remove users from the projects in their company
export function canEditProjectsCompanyRoles(): string[] {
  return ['manager', 'admin']; // finance?
}

export function anonymousUser(): UserSummary {
  return {
    id: '',
    jwtToken: '',
    name: 'Anonymous',
    emailAddress: '',
    roles: [],
    companies: [],
    profile: blankOrganizationUser(),
    maxProjectRole: ''
  };
}
