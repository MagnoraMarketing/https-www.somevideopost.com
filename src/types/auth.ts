export interface AuthFormState {
  error?: string;
  /** Success message shown in place of a redirect (e.g. "confirm your email"). */
  notice?: string;
  /**
   * Where the user goes next when the action finished without a session.
   * Signup with email confirmation ends here: the account exists, so the form
   * shows this as a link to the login page instead of leaving the user stuck
   * on a form that has nothing left to submit.
   */
  loginHref?: string;
}
