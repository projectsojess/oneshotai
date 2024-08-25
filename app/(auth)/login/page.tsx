
'use client';
import CardWrapper from '@/components/auth/card-wrapper'
import { LoginForm } from '@/components/auth/login-form'
import React, { useState } from 'react'

const LoginPage = () => {

  const [showSocial, setShowSocial] = useState(true); 

  const hideSocial = () => {

    setShowSocial(false);
  }
  
  return (
    <CardWrapper
      headerLabel='Login'
      backButtonHref='/signup'
      backButtonLabel="Don't have an account?"
      showSocial= {showSocial}
    >
      <LoginForm hideSocial={hideSocial}/>
    </CardWrapper>
  )
}

export default LoginPage