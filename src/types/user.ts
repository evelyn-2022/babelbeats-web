export interface User {
  id: string;
  cognitoSub: string;
  name: string;
  email: string;
  profilePic: string | null;
}
