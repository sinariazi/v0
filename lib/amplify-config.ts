'use client'

import { Amplify } from 'aws-amplify'

export function configureAmplify() {
  const region = process.env.NEXT_PUBLIC_AWS_REGION
  const userPoolId = process.env.NEXT_PUBLIC_AWS_USER_POOL_ID
  const userPoolClientId = process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID

  console.log('Environment variables:', { region, userPoolId, userPoolClientId })

  if (!region || !userPoolId || !userPoolClientId) {
    console.error('Missing required environment variables for Amplify configuration:', {
      region,
      userPoolId,
      userPoolClientId
    })
    return false
  }

  try {
    Amplify.configure({
      Auth: {
        Cognito: {
          region,
          userPoolId,
          userPoolClientId,
        },
      },
    })

    console.log('Amplify configured successfully with:', { region, userPoolId, userPoolClientId })
    return true
  } catch (error) {
    console.error('Error configuring Amplify:', error)
    return false
  }
}

