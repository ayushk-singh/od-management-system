export {}

// Create a type for the roles
export type Roles = 'student' | 'faculty' | 'hod' | 'admin'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}