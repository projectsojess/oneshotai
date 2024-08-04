

import CardWrapper from '@/components/auth/card-wrapper'
import { LoginForm } from '@/components/auth/login-form'
import React from 'react'

const LoginPage = () => {
  return (
    <CardWrapper
      headerLabel='Login'
      backButtonHref='/signup'
      backButtonLabel="Don't have an account?"
      showSocial
    >
      <LoginForm/>
    </CardWrapper>
  )
}

export default LoginPage