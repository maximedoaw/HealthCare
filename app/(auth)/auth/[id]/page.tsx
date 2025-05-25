import { Verification } from '@/components/home/auth-screen/verification'
import React from 'react'

type VerificationPageProps = {
  params: {
    id: string
  }
}
const VerificationPage = async ({params}:VerificationPageProps) => {

  const {id} = params
  
  return <Verification id={id}/>
}

export default VerificationPage