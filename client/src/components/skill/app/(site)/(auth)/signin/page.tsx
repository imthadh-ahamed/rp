import Signin from "@/components/skill/app/components/auth/sign-in";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sign In | Property-pro",
};

const SigninPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default SigninPage;
