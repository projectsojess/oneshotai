'use client'
import CardWrapper from '@/components/auth/card-wrapper'
import { SignupForm } from '@/components/auth/signup-form'
import { useState } from 'react';
const SignupPage = () => {
  const [showSocial, setShowSocial] = useState(true); 

  const hideSocial = () => {

    setShowSocial(false);
  }
  return (
    <CardWrapper
        headerLabel='Signup'
      backButtonHref='/login'
      backButtonLabel="Already have an account?"
      showSocial={showSocial}
    >
        <SignupForm hideSocial={hideSocial}/>
    </CardWrapper>
  )
}

export default SignupPage